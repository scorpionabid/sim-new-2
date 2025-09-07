// RSS News Service for Education News
class EducationNewsService {
    constructor() {
        this.apiKey = null; // RSS2JSON free tier
        this.baseUrl = 'https://api.rss2json.com/v1/api.json';
        this.cacheKey = 'sim_education_news';
        this.cacheTimeKey = 'sim_education_news_timestamp';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // Azerbaijan RSS feeds (will try these, fallback to mock data)
        this.rssSources = [
            'https://apa.az/rss.xml',
            'https://azertag.az/rss',
            'https://news.az/rss',
            'https://sia.az/feed.php'
        ];
        
        // Education keywords for filtering
        this.educationKeywords = [
            'təhsil', 'education', 'məktəb', 'school', 'universitet', 'university',
            'müəllim', 'teacher', 'şagird', 'student', 'tələbə', 'learning',
            'dərs', 'lesson', 'imtahan', 'exam', 'təlim', 'training',
            'elm', 'science', 'texnologiya', 'technology', 'innovasiya', 'innovation'
        ];
    }

    // Check if cache is still valid
    isCacheValid() {
        const timestamp = localStorage.getItem(this.cacheTimeKey);
        if (!timestamp) return false;
        
        const now = Date.now();
        const cacheTime = parseInt(timestamp);
        return (now - cacheTime) < this.cacheExpiry;
    }

    // Get cached news
    getCachedNews() {
        if (this.isCacheValid()) {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (e) {
                    console.warn('Failed to parse cached news:', e);
                    this.clearCache();
                }
            }
        }
        return null;
    }

    // Cache news data
    cacheNews(newsData) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(newsData));
            localStorage.setItem(this.cacheTimeKey, Date.now().toString());
        } catch (e) {
            console.warn('Failed to cache news:', e);
        }
    }

    // Clear cache
    clearCache() {
        localStorage.removeItem(this.cacheKey);
        localStorage.removeItem(this.cacheTimeKey);
    }

    // Check if content contains education keywords
    isEducationRelated(title, description) {
        const content = (title + ' ' + (description || '')).toLowerCase();
        return this.educationKeywords.some(keyword => 
            content.includes(keyword.toLowerCase())
        );
    }

    // Fetch RSS feed and convert to JSON
    async fetchRSSFeed(rssUrl) {
        const url = `${this.baseUrl}?rss_url=${encodeURIComponent(rssUrl)}&count=20`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.status !== 'ok') {
                throw new Error(`API error: ${data.message || 'Unknown error'}`);
            }
            
            return data;
        } catch (error) {
            console.warn(`Failed to fetch RSS from ${rssUrl}:`, error);
            return null;
        }
    }

    // Process and filter news items
    processNewsItems(items, sourceName) {
        return items
            .filter(item => this.isEducationRelated(item.title, item.description))
            .map(item => ({
                title: item.title,
                description: this.truncateText(item.description || item.content || '', 150),
                link: this.validateLink(item.link, sourceName),
                pubDate: new Date(item.pubDate),
                source: sourceName,
                id: this.generateId(item.title, item.link)
            }))
            .slice(0, 2); // Max 2 items per source
    }

    // Validate and fix news item links
    validateLink(link, source) {
        // If link is empty, invalid, or just "#", generate fallback
        if (!link || link === '#' || link === '') {
            return this.generateFallbackLink(source);
        }

        // If link doesn't start with http, try to fix it
        if (!link.startsWith('http')) {
            // If it starts with "/", it's a relative URL
            if (link.startsWith('/')) {
                const baseUrls = {
                    'apa.az': 'https://apa.az',
                    'azertag.az': 'https://azertag.az',
                    'news.az': 'https://news.az',
                    'sia.az': 'https://sia.az'
                };
                
                const baseUrl = Object.keys(baseUrls).find(key => 
                    source && source.toLowerCase().includes(key)
                );
                
                return baseUrl ? baseUrls[baseUrl] + link : link;
            }
            
            // Otherwise assume it needs https://
            return 'https://' + link;
        }

        return link;
    }

    // Generate fallback link if RSS item link is invalid
    generateFallbackLink(source) {
        const sourceLinks = {
            'apa.az': 'https://apa.az/en',
            'azertag.az': 'https://azertag.az/en',
            'news.az': 'https://news.az/',
            'sia.az': 'https://sia.az/',
            'Təhsil Nazirliyi': 'https://edu.gov.az/en/news-and-updates',
            'BSU': 'https://bsu.edu.az/',
            'Təhsil İnformasiya Agentliyi': 'https://portal.edu.az/',
            'Bakı Dövlət Universiteti': 'https://bsu.edu.az/',
            'APA': 'https://apa.az/en',
            'APA Xəbər Agentliyi': 'https://apa.az/en',
            'AZERTAC': 'https://azertag.az/en'
        };

        // Find matching source
        if (!source) {
            console.warn('No source provided, using default link');
            return 'https://edu.gov.az/en';
        }
        
        const sourceKey = Object.keys(sourceLinks).find(key => 
            source.toLowerCase().includes(key.toLowerCase())
        );

        const finalLink = sourceKey ? sourceLinks[sourceKey] : 'https://edu.gov.az/en';
        console.log(`🔗 Generated link for "${source}": ${finalLink}`);
        
        return finalLink;
    }

    // Generate unique ID for news item
    generateId(title, link) {
        return btoa(encodeURIComponent(title + link)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    // Truncate text to specified length
    truncateText(text, maxLength) {
        if (!text) return '';
        
        // Remove HTML tags
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        
        if (cleanText.length <= maxLength) return cleanText;
        
        const truncated = cleanText.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        return (lastSpace > maxLength * 0.8) 
            ? truncated.substring(0, lastSpace) + '...'
            : truncated + '...';
    }

    // Main function to get education news
    async getEducationNews() {
        // Try to get cached news first
        const cached = this.getCachedNews();
        if (cached && cached.length > 0) {
            console.log('Using cached news data');
            return cached;
        }

        console.log('Fetching fresh news data...');
        
        // Mock data with different external website links
        const mockNewsData = [
            {
                title: "Müəllimlərin İxtisasartırma Kursu",
                description: "Növbəti ay ərzində müəllimlər üçün yeni ixtisasartırma kursları keçiriləcək. Qeydiyyat açıqdır.",
                link: "https://edu.gov.az/en",
                pubDate: new Date(),
                source: "Təhsil Nazirliyi",
                id: "mock_news_1"
            },
            {
                title: "Azərbaycanda Yeni Təhsil Reformları",
                description: "Təhsil Nazirliyi tərəfindən yeni təhsil reformları həyata keçirilir. Bu reformlar müasir təhsil standartlarına uyğundur.",
                link: "https://edu.gov.az/en/news-and-updates",
                pubDate: new Date(Date.now() - 3600000), // 1 hour ago
                source: "Təhsil Nazirliyi",
                id: "mock_news_2"
            },
            {
                title: "Bakı Dövlət Universitetində Yeni Texnologiya Mərkəzi",
                description: "BSU-da yeni texnologiya və innovasiya mərkəzi açıldı. Mərkəz tələbələrə müasir texnoloji biliklər öyrədəcək.",
                link: "https://apa.az/en",
                pubDate: new Date(Date.now() - 7200000), // 2 hours ago
                source: "APA Xəbər Agentliyi",
                id: "mock_news_3"
            }
        ];

        // Try to fetch real RSS feeds as fallback
        const allNews = [];
        
        for (let i = 0; i < this.rssSources.length && allNews.length < 3; i++) {
            const rssUrl = this.rssSources[i];
            const feedData = await this.fetchRSSFeed(rssUrl);
            
            if (feedData && feedData.items) {
                const sourceName = feedData.feed?.title || `Source ${i + 1}`;
                const processedItems = this.processNewsItems(feedData.items, sourceName);
                allNews.push(...processedItems);
            }
            
            // Add delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Use mock data if no real news found or combine them
        const finalNews = allNews.length > 0 ? allNews.slice(0, 3) : mockNewsData;
        
        // Cache the results
        this.cacheNews(finalNews);
        
        return finalNews;
    }

    // Force refresh news (bypass cache)
    async refreshNews() {
        this.clearCache();
        return await this.getEducationNews();
    }

    // Get cache info for debugging
    getCacheInfo() {
        const timestamp = localStorage.getItem(this.cacheTimeKey);
        if (timestamp) {
            const cacheTime = new Date(parseInt(timestamp));
            const expiryTime = new Date(parseInt(timestamp) + this.cacheExpiry);
            return {
                cached: true,
                cacheTime: cacheTime.toLocaleString(),
                expiryTime: expiryTime.toLocaleString(),
                isValid: this.isCacheValid()
            };
        }
        return { cached: false };
    }
}

// Export for use in main script
window.EducationNewsService = EducationNewsService;
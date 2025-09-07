// News Module - News Display and Management
class NewsModule {
    constructor() {
        this.newsService = null;
    }

    // Initialize news service
    initNewsService() {
        if (typeof EducationNewsService !== 'undefined') {
            this.newsService = new EducationNewsService();
        }
    }

    // Load news and announcements with RSS integration
    async loadNewsAndAnnouncements() {
        const newsContainer = document.querySelector('#xeberler-elanlar .row');
        if (!newsContainer) return;

        // Initialize news service if not already done
        if (!this.newsService) {
            this.initNewsService();
        }

        // Add loading state
        this.showNewsLoading(newsContainer);

        try {
            // Fetch education news
            const educationNews = this.newsService 
                ? await this.newsService.getEducationNews() 
                : this.getFallbackNews();

            // Clear loading state and existing dynamic content
            const existingCards = newsContainer.querySelectorAll('.dynamic-news-card, .news-loading');
            existingCards.forEach(card => card.remove());

            // Add RSS news cards with AOS animation  
            educationNews.forEach((newsItem, index) => {
                const newsCard = this.createNewsCard(newsItem, index + 1); // +1 because first card is static
                newsContainer.appendChild(newsCard);
                console.log(`Added news card: ${newsItem.title} -> ${newsItem.link}`);
            });

            // Refresh AOS for new elements
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }

            console.log(`✅ Loaded ${educationNews.length} education news items successfully`);
            console.log('🔍 Link destinations:');
            
            // Debug: Show link destinations in console
            educationNews.forEach((item, index) => {
                console.log(`${index + 1}. 📰 "${item.title.substring(0, 40)}..." 
                   🔗 Link: ${item.link}
                   📡 Source: ${item.source}`);
            });

            // Test button functionality
            setTimeout(() => {
                const buttons = document.querySelectorAll('.dynamic-news-card .btn-modern');
                console.log(`🎯 Found ${buttons.length} external link buttons`);
                buttons.forEach((btn, i) => {
                    console.log(`Button ${i + 1}: ${btn.href}`);
                });
            }, 1000);

        } catch (error) {
            console.error('Failed to load news:', error);
            this.showNewsError(newsContainer);
        }
    }

    // Show loading state for news
    showNewsLoading(container) {
        // Remove any existing loading elements
        const existingLoading = container.querySelectorAll('.news-loading');
        existingLoading.forEach(el => el.remove());

        // Create loading cards
        for (let i = 0; i < 3; i++) {
            const loadingCard = document.createElement('div');
            loadingCard.className = 'col-md-6 mb-4 news-loading';
            loadingCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <div class="loading-shimmer">
                            <div class="shimmer-line shimmer-title"></div>
                            <div class="shimmer-line shimmer-text"></div>
                            <div class="shimmer-line shimmer-text short"></div>
                            <div class="shimmer-button"></div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(loadingCard);
        }
    }

    // Show error state for news
    showNewsError(container) {
        const existingLoading = container.querySelectorAll('.news-loading');
        existingLoading.forEach(el => el.remove());

        const errorCard = document.createElement('div');
        errorCard.className = 'col-12 mb-4 news-error';
        errorCard.innerHTML = `
            <div class="card text-center p-4">
                <div class="card-body">
                    <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 2rem;"></i>
                    <h5>Xəbərləri yükləmək mümkün olmadı</h5>
                    <p class="text-muted">Zəhmət olmasa daha sonra yenidən cəhd edin.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-redo me-2"></i>Yenidən Yüklə
                    </button>
                </div>
            </div>
        `;
        container.appendChild(errorCard);
    }

    // Create news card element
    createNewsCard(newsItem, index) {
        const newsCard = document.createElement('div');
        newsCard.className = 'col-md-6 mb-4 dynamic-news-card';
        newsCard.setAttribute('data-aos', 'fade-up');
        newsCard.setAttribute('data-aos-delay', (index * 100).toString());

        const formattedDate = this.formatNewsDate(newsItem.pubDate);
        const isRecent = this.isRecentNews(newsItem.pubDate);

        // Debug: Log the link being created
        console.log(`🔧 Creating card for: "${newsItem.title}"`);
        console.log(`🔗 Link URL: "${newsItem.link}"`);
        console.log(`📡 Source: "${newsItem.source}"`);
        
        // Validate the link before using it
        const validatedLink = this.validateNewsLink(newsItem.link);
        console.log(`✅ Validated link: "${validatedLink}"`);

        newsCard.innerHTML = `
            <div class="card h-100 news-card">
                ${isRecent ? '<div class="news-badge info"><i class="fas fa-clock"></i><span>Yeni</span></div>' : ''}
                <div class="card-body">
                    <h5 class="card-title font-heading">${newsItem.title}</h5>
                    <p class="card-text">${newsItem.description}</p>
                    <div class="news-meta mb-3">
                        <small class="text-muted">
                            <i class="fas fa-calendar-alt me-1"></i>${formattedDate}
                        </small>
                        ${newsItem.source ? `<small class="text-muted ms-3"><i class="fas fa-rss me-1"></i>${newsItem.source}</small>` : ''}
                    </div>
                    <a href="${validatedLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-modern news-external-link" 
                       title="Bu link sizi ${newsItem.source} saytına aparacaq"
                       data-original-link="${newsItem.link}"
                       data-source="${newsItem.source}">
                        <span>Ətraflı</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;

        // Add click event listener to ensure proper external navigation
        const linkElement = newsCard.querySelector('.news-external-link');
        if (linkElement) {
            linkElement.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default behavior
                const url = linkElement.getAttribute('href');
                console.log(`🚀 Opening external link: ${url}`);
                
                // Force open in new tab
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        }

        return newsCard;
    }

    // Validate news link to ensure it's external
    validateNewsLink(link) {
        if (!link || link === '#' || link === '') {
            console.warn('⚠️ Empty or invalid link, using fallback');
            return 'https://edu.gov.az/en';
        }

        // Check if link is relative (starts with just "/" or no protocol)
        if (link.startsWith('/') || (!link.startsWith('http') && !link.startsWith('https'))) {
            console.warn(`⚠️ Relative link detected: ${link}, converting to absolute`);
            return 'https://edu.gov.az/en';
        }

        // Ensure it's not pointing to current domain
        const currentDomain = window.location.hostname;
        try {
            const linkUrl = new URL(link);
            if (linkUrl.hostname === currentDomain || linkUrl.hostname === 'localhost') {
                console.warn(`⚠️ Internal link detected: ${link}, using external fallback`);
                return 'https://edu.gov.az/en';
            }
        } catch (e) {
            console.error(`⚠️ Invalid URL format: ${link}`, e);
            return 'https://edu.gov.az/en';
        }

        console.log(`✅ Valid external link: ${link}`);
        return link;
    }

    // Format news date
    formatNewsDate(date) {
        if (!date) return 'Tarix məlum deyil';
        
        const newsDate = new Date(date);
        const now = new Date();
        const diffInHours = Math.floor((now - newsDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Az əvvəl';
        if (diffInHours < 24) return `${diffInHours} saat əvvəl`;
        if (diffInHours < 48) return 'Dünən';
        
        return newsDate.toLocaleDateString('az-AZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Check if news is recent (within 24 hours)
    isRecentNews(date) {
        if (!date) return false;
        const newsDate = new Date(date);
        const now = new Date();
        const diffInHours = (now - newsDate) / (1000 * 60 * 60);
        return diffInHours <= 24;
    }

    // Fallback news data if service fails  
    getFallbackNews() {
        return [
            {
                title: 'Müəllimlərin İxtisasartırma Kursu',
                description: 'Növbəti ay ərzində müəllimlər üçün yeni ixtisasartırma kursları keçiriləcək. Qeydiyyat açıqdır.',
                link: 'https://edu.gov.az/en',
                pubDate: new Date(),
                source: 'Təhsil Nazirliyi',
                id: 'fallback_1'
            },
            {
                title: 'Azərbaycanda Yeni Təhsil Reformları',
                description: 'Təhsil Nazirliyi tərəfindən yeni təhsil reformları həyata keçirilir. Bu reformlar müasir təhsil standartlarına uyğundur.',
                link: 'https://edu.gov.az/en/news-and-updates',
                pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
                source: 'Təhsil Nazirliyi',
                id: 'fallback_2'
            },
            {
                title: 'Rəqəmsal Təhsil Platforması Genişlənir',
                description: 'Ölkədə rəqəmsal təhsil platforması yeni funksiyalarla genişləndirilir və daha çox istifadəçiyə xidmət göstərir.',
                link: 'https://apa.az/en',
                pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
                source: 'APA Xəbər Agentliyi',
                id: 'fallback_3'
            }
        ];
    }

    // Initialize news module
    init() {
        this.loadNewsAndAnnouncements();
    }
}

// Export for use in main script
window.NewsModule = NewsModule;
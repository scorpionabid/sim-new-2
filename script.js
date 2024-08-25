// Global variables
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const contactForm = document.getElementById('contact-form');
const navbar = document.querySelector('.navbar');

// Smooth scrolling
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({behavior: 'smooth'});
    });
});

// Load news and announcements
loadNewsAndAnnouncements();

// Form validation
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            // Send form data
            console.log('Form sent');
            contactForm.reset();
        }
    });
}

// Navbar color change on scroll
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        navbar.classList.add('bg-white');
        navbar.classList.remove('bg-light');
    } else {
        navbar.classList.add('bg-light');
        navbar.classList.remove('bg-white');
    }
});

// Load news and announcements
function loadNewsAndAnnouncements() {
    const newsContainer = document.querySelector('#xeberler-elanlar .row');
    const news = [
        {title: 'Yeni Təhsil Proqramı', content: 'Azərbaycanda yeni təhsil proqramı tətbiq olunur.'},
        {title: 'Müəllimlərin İxtisasartırma Kursu', content: 'Növbəti ay ərzində müəllimlər üçün yeni ixtisasartırma kursları keçiriləcək.'},
    ];

    news.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'col-md-6 mb-4 d-flex';
        newsCard.innerHTML = `
            <div class="card w-100">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.content}</p>
                    <a href="#" class="btn btn-primary">Ətraflı</a>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });
}

// Form validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    if (name.value.trim() === '') {
        setErrorFor(name, 'Ad boş ola bilməz');
        isValid = false;
    } else {
        setSuccessFor(name);
    }

    if (email.value.trim() === '') {
        setErrorFor(email, 'E-poçt ünvanı boş ola bilməz');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        setErrorFor(email, 'Düzgün e-poçt ünvanı daxil edin');
        isValid = false;
    } else {
        setSuccessFor(email);
    }

    if (message.value.trim() === '') {
        setErrorFor(message, 'Mesaj boş ola bilməz');
        isValid = false;
    } else {
        setSuccessFor(message);
    }

    return isValid;
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add event listener to form submit
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
        // Send form data
        console.log('Form sent');
        this.reset();
    }
});


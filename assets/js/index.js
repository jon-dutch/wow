// Grid Items Data
const gridItems = [
    { 
        title: 'War and Conflict', 
        description: 'Armed conflict causes injury...', 
        image: 'images/site/ph_1.jpg', 
        color: '#d3a85b', 
        fullDescription: `
            <p>Armed conflict causes injury, displacement, sexual violence, and death, and it continues to impact people’s lives and health long after the front lines have shifted. War also devastates health systems, hampers access to medical supplies, and disrupts vaccination and other disease-prevention efforts, heightening the risk of outbreaks.  MSF provides medical care based on needs alone and works to reach the people most in need of help.  </p>
        `, 
        imagePosition: 'left' 
    },
    { 
        title: 'Outbreaks and Epidemics', 
        description: 'Millions of people around the world...', 
        image: 'images/site/ph_2.jpg', 
        color: '#294667', 
        fullDescription: `
            <p>Millions of people around the world still die each year from infectious diseases that are preventable or treatable such as cholera, measles, yellow fever, or Ebola. From setting up temporary facilities to treat patients to running mass vaccination campaigns to improving water and sanitation services MSF teams react swiftly to help prevent the spread of disease.</p>
        `, 
        imagePosition: 'right' 
    },
    { 
        title: 'Refugees and internally displaced people', 
        description: 'More than 100 million people worldwide...', 
        image: 'images/site/ph_3.jpg', 
        color: '#70a031', 
        fullDescription: `
            <p>More than 100 million people worldwide have been forced from home, uprooted by conflict, persecution, and other extreme hardships. MSF teams work closely with affected communities to provide services including vaccination; primary care and mental health counseling; nutrition support; and clean water and sanitation. </p>
        `, 
        imagePosition: 'left' 
    },
    { 
        title: 'Natural Disasters', 
        description: 'Earthquakes, floods, tsunamis...', 
        image: 'images/site/ph_4.jpg', 
        color: '#31a19a', 
        fullDescription: `
            <p>Earthquakes, floods, tsunamis, and major storms can force people to flee their homes and cut off access to safe water, health care services, and transportation, affecting the lives of tens of thousands in a matter of minutes. When minutes matter, MSF’s network of aid workers around the world are often the first to deploy rapid, lifesaving medical care.  </p>
        `, 
        imagePosition: 'right' 
    },
    // ... other items ...
];

// DOM Elements
const gridContainer = document.getElementById('grid-container');
const modal = document.getElementById('itemModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const closeButton = document.querySelector('.close-button');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarMenu = document.querySelector('.navbar-menu');

// Create Grid Items
gridItems.forEach(item => {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.style.backgroundImage = `url('${item.image}')`;
    gridItem.innerHTML = `
        <div class="grid-item-overlay">
            <div class="grid-item-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
        <div class="grid-item-footer" style="background-color: ${item.color}">
            <div class="grid-item-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `;
    gridItem.addEventListener('click', () => openModal(item));
    gridContainer.appendChild(gridItem);
});

// Open Modal
function openModal(item) {
    modalTitle.textContent = item.title;
    modalImage.src = item.image;
    modalImage.alt = item.title;
    modalDescription.innerHTML = item.fullDescription; // Change this line from textContent to innerHTML
    modal.style.display = 'block';
    document.querySelector('.modal-header').style.backgroundColor = item.color;
    document.querySelector('.modal-image').style.order = item.imagePosition === 'right' ? '2' : '1';
    document.querySelector('.modal-text').style.order = item.imagePosition === 'right' ? '1' : '2';
}

// Close Modal
function closeModal() {
    modal.style.display = 'none';
}

// Event Listeners
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Navbar Toggler
navbarToggler.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.navbar-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
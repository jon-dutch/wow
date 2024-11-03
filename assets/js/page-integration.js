// File: js/page-integration.js

class PageManager {
    constructor() {
        this.mainContent = document.querySelector('[role="main"]');
        this.overlayContainer = null;
        this.setupOverlayContainer();
        this.setupEventListeners();
        this.checkInitialHash();
    }

    setupOverlayContainer() {
        // Create overlay container
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.id = 'page-overlay';
        this.overlayContainer.style.display = 'none';
        
        // Add styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            #page-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 1000;
                overflow-y: auto;
                transition: transform 0.3s ease-in-out;
            }

            #page-overlay.sliding-in {
                transform: translateX(0);
            }

            #page-overlay.sliding-out {
                transform: translateX(100%);
            }

            .back-button {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1001;
                background: #333;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background-color 0.2s;
            }

            .back-button:hover {
                background: #555;
            }

            .back-button svg {
                width: 20px;
                height: 20px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.overlayContainer);
    }

    setupEventListeners() {
        // Listen for button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.contact-button')) {
                e.preventDefault();
                const pageId = e.target.textContent.toLowerCase();
                this.loadPage(pageId);
            }
        });

        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.pageId) {
                this.loadPage(e.state.pageId, true);
            } else {
                this.hidePage(true);
            }
        });
    }

    checkInitialHash() {
        const hash = window.location.hash.slice(1);
        if (hash === 'cc' || hash === 'jh') {
            this.loadPage(hash);
        }
    }

    async loadPage(pageId, isPopState = false) {
        try {
            const response = await fetch(`${pageId}.html`);
            if (!response.ok) throw new Error('Page not found');
            
            let html = await response.text();
            
            // Extract the main content from the loaded page
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#main') || doc.querySelector('#wrapper');
            
            if (!content) throw new Error('Content section not found');

            // Add back button
            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            `;
            backButton.onclick = () => this.hidePage();

            // Show the overlay with content
            this.overlayContainer.innerHTML = '';
            this.overlayContainer.appendChild(backButton);
            this.overlayContainer.appendChild(content);
            
            this.overlayContainer.style.display = 'block';
            this.overlayContainer.style.transform = 'translateX(100%)';
            
            // Trigger reflow
            this.overlayContainer.offsetHeight;
            
            this.overlayContainer.classList.add('sliding-in');
            
            // Update URL if this isn't from a popstate event
            if (!isPopState) {
                window.history.pushState({ pageId }, '', `#${pageId}`);
            }
        } catch (error) {
            console.error('Error loading page:', error);
        }
    }

    hidePage(isPopState = false) {
        this.overlayContainer.classList.remove('sliding-in');
        this.overlayContainer.classList.add('sliding-out');
        
        setTimeout(() => {
            this.overlayContainer.style.display = 'none';
            this.overlayContainer.classList.remove('sliding-out');
            
            // Update URL if this isn't from a popstate event
            if (!isPopState) {
                window.history.pushState(null, '', window.location.pathname);
            }
        }, 300);
    }
}

// Initialize the page manager when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pageManager = new PageManager();
});
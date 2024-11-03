// assets/js/page-integration.js

class PageManager {
    constructor() {
        // Debug log to verify initialization
        console.log('PageManager initializing...');
        
        this.overlayContainer = null;
        this.setupOverlayContainer();
        this.setupEventListeners();
        this.checkInitialHash();
    }

    setupOverlayContainer() {
        // Create overlay container if it doesn't exist
        if (!this.overlayContainer) {
            this.overlayContainer = document.createElement('div');
            this.overlayContainer.id = 'page-overlay';
            this.overlayContainer.style.display = 'none';
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #page-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #1b1f22;
                    z-index: 9999;
                    overflow-y: auto;
                    transition: opacity 0.3s ease-in-out;
                    opacity: 0;
                }

                #page-overlay.active {
                    opacity: 1;
                }

                .back-button {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 10000;
                    background: #ffffff;
                    color: #1b1f22;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: "Source Sans Pro", sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.2rem;
                    text-transform: uppercase;
                    transition: background-color 0.2s;
                }

                .back-button:hover {
                    background-color: rgba(255, 255, 255, 0.8);
                }

                #overlay-loader {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-family: "Source Sans Pro", sans-serif;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(this.overlayContainer);
        }
    }

    setupEventListeners() {
        // Debug log
        console.log('Setting up event listeners...');

        // Listen for contact button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.contact-button')) {
                console.log('Contact button clicked:', e.target);
                e.preventDefault();
                const pageId = e.target.textContent.toLowerCase();
                this.loadPage(pageId);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            console.log('Popstate event:', e.state);
            if (e.state && e.state.pageId) {
                this.loadPage(e.state.pageId, true);
            } else {
                this.hidePage(true);
            }
        });
    }

    checkInitialHash() {
        const hash = window.location.hash.slice(1);
        console.log('Checking initial hash:', hash);
        if (hash === 'cc' || hash === 'jh') {
            this.loadPage(hash);
        }
    }

    async loadPage(pageId, isPopState = false) {
        console.log('Loading page:', pageId);
        try {
            // Show loader
            this.overlayContainer.innerHTML = '<div id="overlay-loader">Loading...</div>';
            this.overlayContainer.style.display = 'block';
            setTimeout(() => this.overlayContainer.classList.add('active'), 10);

            // Load page content
            const response = await fetch(`${pageId}.html`);
            if (!response.ok) throw new Error(`Failed to load ${pageId}.html`);
            
            const html = await response.text();
            
            // Parse content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#wrapper') || doc.querySelector('#main');
            
            if (!content) throw new Error('Content section not found');

            // Create back button
            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.textContent = 'Back to Main Site';
            backButton.onclick = () => this.hidePage();

            // Update overlay content
            this.overlayContainer.innerHTML = '';
            this.overlayContainer.appendChild(backButton);
            this.overlayContainer.appendChild(content);

            // Update URL if not from popstate
            if (!isPopState) {
                window.history.pushState({ pageId }, '', `#${pageId}`);
            }

            // Load and initialize required scripts
            await this.loadPageScripts(pageId);

        } catch (error) {
            console.error('Error loading page:', error);
            this.overlayContainer.innerHTML = `
                <div id="overlay-loader">
                    Error loading page. Please try again.
                    <button class="back-button" onclick="window.pageManager.hidePage()">Back to Main Site</button>
                </div>
            `;
        }
    }

    async loadPageScripts(pageId) {
        // Load required scripts for profile pages
        const scripts = [
            'assets/js/jquery.min.js',
            'assets/js/browser.min.js',
            'assets/js/breakpoint.min.js',
            'assets/js/util.js',
            'assets/js/main.js'
        ];

        for (const src of scripts) {
            await new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        }

        // Initialize the loaded page
        if (window.main && typeof window.main.init === 'function') {
            window.main.init();
        }
    }

    hidePage(isPopState = false) {
        console.log('Hiding page');
        this.overlayContainer.classList.remove('active');
        
        setTimeout(() => {
            this.overlayContainer.style.display = 'none';
            if (!isPopState) {
                window.history.pushState(null, '', window.location.pathname);
            }
        }, 300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing PageManager');
    window.pageManager = new PageManager();
});
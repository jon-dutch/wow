document.addEventListener('DOMContentLoaded', function() {
    const banner = document.querySelector('.info-banner');
    const modalOverlay = createModalOverlay();
    let isExpanded = false;

    // Create modal overlay for mobile
    function createModalOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay modal-overlay-banner';
        overlay.style.display = 'none'; // Initially hidden
        overlay.innerHTML = `
            <div class="modal-content-banner">
                <img class="dl-img" src="img/dl24.png" alt="DevLearn">
                <p>Hello fellow DevLearn attendees! Pleasure to make your acquaintance today. This page is a brief information page on MSF's work around the world, as well as our L&D specific efforts. To learn more about MSF/Doctors Without Borders, please use the button in the navigation bar to visit our official website.</p>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function toggleBanner() {
        if (window.innerWidth <= 768) {
            modalOverlay.style.display = 'flex';
            modalOverlay.classList.add('active');
        } else {
            isExpanded = !isExpanded;
            banner.classList.toggle('expanded');
            banner.classList.toggle('collapsed');
        }
    }

    function closeBanner() {
        isExpanded = false;
        banner.classList.remove('expanded');
        banner.classList.add('collapsed');
        modalOverlay.classList.remove('active');
        modalOverlay.style.display = 'none';
    }

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            modalOverlay.style.display = 'none';
            modalOverlay.classList.remove('active');
        }
    }

    // Initial state
    banner.classList.add('collapsed');
    window.addEventListener('resize', handleResize);

    // Click handler
    banner.addEventListener('click', toggleBanner);

    // Close on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (isExpanded || modalOverlay.classList.contains('active')) {
                closeBanner();
            }
        }, 150);
    });

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeBanner();
        }
    });
});
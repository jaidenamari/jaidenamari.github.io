document.addEventListener('DOMContentLoaded', function() {
    const tocLinks = document.querySelectorAll('#toc-auto .toc-content a');
    const rainbowColors = [
        '#52eea3', '#51e1e9', '#54b6f8', '#437cf3', '#9446f8', '#c952ed', '#e54f9b', '#e3365e'
    ];
    let currentColorIndex = 0;

    function updateTOCColors() {
        const activeLink = document.querySelector('#toc-auto .toc-content a.active');
        if (activeLink) {
            activeLink.style.color = rainbowColors[currentColorIndex];
            currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;
        }
    }

    // Update colors when scrolling
    window.addEventListener('scroll', updateTOCColors);

    // Initial color update
    updateTOCColors();
});


document.addEventListener('DOMContentLoaded', () => {
    
    const contentContainer = document.getElementById('content');
    const scaleFactor = 100;
    // real width of A4 210 mm
    const A4Width = 210 * scaleFactor;
    // real height of A4 297 mm
    const A4Height = 297 * scaleFactor;

    // get the sizes of text elements in px
    let h1Height = 0;
    try {
        h1Height = parseInt(getComputedStyle(document.querySelector('h1')).height);
    } catch (e) {
        console.warn('No h1 found:', e);
    }


    if (contentContainer) {
        const elementsArray = Array.from(contentContainer.children);

        elementsArray.forEach((element, index) => {
            // console.log(`Text ${index}:`, element.textContent.trim());
            console.log(`Element ${index}:`, element.innerHTML);
            console.log(`Element ${index}:`, element.outerHTML);

        });
    } else {
        console.error('Element with ID "content" not found.');
    }
});
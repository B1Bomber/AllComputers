// Wait for DOM
window.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const pagesContainer = document.querySelector('.pages-container');

    // Show pages container and hide original content
    pagesContainer.style.display = 'block';
    contentDiv.classList.add('hidden');

    // Create a temporary element to measure content
    const tempPage = document.createElement('div');
    tempPage.style.width = '100%';
    tempPage.style.height = '100%';
    tempPage.style.position = 'absolute';
    tempPage.style.visibility = 'hidden';
    tempPage.style.padding = '2rem';
    tempPage.style.boxSizing = 'border-box';
    document.body.appendChild(tempPage);

    const originalNodes = Array.from(contentDiv.childNodes);
    let currentPage = document.createElement('div');
    currentPage.classList.add('page');
    pagesContainer.appendChild(currentPage);

    let pages = [currentPage];

    originalNodes.forEach(node => {
        currentPage.appendChild(node.cloneNode(true));
        
        // Check if content overflows
        if (currentPage.scrollHeight > currentPage.clientHeight) {
            currentPage.removeChild(currentPage.lastChild); // Remove last node
            // Start a new page
            currentPage = document.createElement('div');
            currentPage.classList.add('page');
            currentPage.appendChild(node.cloneNode(true));
            pagesContainer.appendChild(currentPage);
            pages.push(currentPage);
        }
    });

    document.body.removeChild(tempPage);

    // Pagination logic
    let pageIndex = 0;
    pages.forEach((page, idx) => {
        if (idx !== pageIndex) page.classList.add('hidden');
    });

    const showPage = (index) => {
        pages.forEach((page, idx) => page.classList.toggle('hidden', idx !== index));
    };

    document.getElementById('prev').addEventListener('click', () => {
        if (pageIndex > 0) pageIndex--;
        showPage(pageIndex);
    });

    document.getElementById('next').addEventListener('click', () => {
        if (pageIndex < pages.length - 1) pageIndex++;
        showPage(pageIndex);
    });
});
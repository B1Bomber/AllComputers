document.addEventListener('DOMContentLoaded', () => {
    
    const contentContainer = document.getElementById('content');

    // get the current size of the working canvas size
    const observer = new ResizeObserver(entries => {
        let contentContainerWidth = entries[0].contentRect.width;
        // console.log(contentContainerWidth);
        let contentContainerHeight = entries[0].contentRect.height;
        // console.log(contentContainerHeight);

        main(contentContainer, contentContainerWidth, contentContainerHeight);
    });

    // console.log(contentContainer.parentElement.getBoundingClientRect());
    observer.observe(contentContainer);
});

// only works for generic ones
function getElementHeights(elementType) {
    // make sure element exists
    const element = document.querySelector(elementType);
    if (!element) {
        console.warn(`No <${elementType}> found on this page.`);
        return 0; 
    }

    let elementHeight = 0;
    try {
        elementHeight = parseInt(getComputedStyle(document.querySelector(elementType)).height);
    } catch (e) {
        console.warn('Error getting height', e);
        return 0;
    }
    return elementHeight;
}

function main(contentContainer, contentContainerWidth, contentContainerHeight) {
    const A4Width = 210;
    const A4Height = 297;

    let scaleFactor = Math.min(contentContainerWidth / A4Width, contentContainerHeight / A4Height);

    let A4PageWidth = A4Width * scaleFactor;
    let A4PageHeight = A4Height * scaleFactor;
    // mm to px = 3.7795
    // in to mm = 25.4

    let margin = 25.4 * scaleFactor;

    // make the page
    const A4Page = document.createElement('white-box');

    A4Page.style.width = A4PageWidth + "px";
    A4Page.style.height = A4PageHeight + "px";
    A4Page.style.boxSizing = "border-box";
    A4Page.style.backgroundColor = "white";
    A4Page.style.display = "block";
    A4Page.style.border = "1px solid black";
    // A4Page.style.padding = "100px 100px 100px 100px";
    A4Page.style.padding = `${margin}px`;

    contentContainer.appendChild(A4Page);

    // get the heights before processing
    // get the sizes of text elements in px
    let heightsArray = [];
    heightsArray.push(getElementHeights('h1'), getElementHeights('h2'), getElementHeights('h3'), getElementHeights('p'));

    let storageArray = [];

    if (contentContainer) {
        let elementArray = Array.from(contentContainer.children);
        // the last element is the page itself
        for (let i = 0; i < elementArray.length - 1; i++) {
            storageArray[i] = elementArray[i];
            // console.log(`Element ${i}:`, elementArray[i].innerHTML);
            // console.log(elementArray[i].textContent.trim().length);
            // console.log(JSON.stringify(elementArray[i].textContent.trim()));
            contentContainer.removeChild(elementArray[i]);
        }
    } 
    else {
        console.error('Element with ID "content" not found.');
    }

    const renderArray = cutText(A4Page, heightsArray, storageArray);
    let currentPageNumber = 0;
    for (let i = 0; i < renderArray.length; i++) {
        A4Page.appendChild(storageArray[currentPageNumber][i]);
    }

}

function cutText(page, elementHeightsArray, inputArray) {
    // elementHeightsArray = [h1, h2, h3, p]
    const pageWidth = page.style.width;
    const pageHeight = page.style.height;
    const pageMargin = page.style.padding;
    const usableWidth = pageWidth - (2* pageMargin);
    let heightTracker = pageHeight - (2 * pageMargin);

    // 2D array of outputArray[page number][all the elements on that page]
    let outputArray = [];
    let currentPageContentArray = [];
    let currentElementLineHeight = 0;
    let currentCharacterCount = 0;
    for (let i = 0; i < inputArray.length; i++) {
        switch (inputArray[i].tagName) {
            case 'H1':
                currentElementLineHeight = elementHeightsArray[0];
                break;
            case 'H2':
                currentElementLineHeight = elementHeightsArray[1];
                break;
            case 'H3':
                currentElementLineHeight = elementHeightsArray[2];
                break;
            case 'P':
                currentElementLineHeight = elementHeightsArray[3];
                break;
            default:
                console.warn('Error: unknown element height');
        }

        currentCharacterCount = inputArray[i].textContent.trim().length;

        
        if (heightTracker > 0) {
            // try adding something to the page array
            // element height and width are the same approximately
            let numCharsPerLine = usableWidth / currentElementLineHeight;
            let currentElementNumLines = currentCharacterCount / numCharsPerLine;
            let currentElementTotalHeight = currentElementNumLines * currentElementLineHeight;

            if (heightTracker >= currentElementTotalHeight) {
                currentPageContentArray.push(inputArray[i]);
                heightTracker -= currentElementTotalHeight;
            }
            else {
                // time to cut up text
                // pull the lines that will fit
                // push the current page
                // add the rest to a new page
                // move on
                let numLinesRemaining = heightTracker / currentElementLineHeight;
                let currentText = inputArray[i].textContent.trim();
                // let wordsArray = currentText.split(' ');
                let wordsArray = currentText.split(/\s+/);

            }
        }
        else {
            // when you can't add anything anymore, so send as complete page
            outputArray.push(currentPageContentArray);
        }
        
    }
    
    return outputArray;
}

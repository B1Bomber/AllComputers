(function () {
    // 1. Math Globals (Strict Grid)
    const A4_W = 816, A4_H = 1056, MARGIN = 96;
    const PRINT_W = A4_W - (MARGIN * 2), PRINT_H = A4_H - (MARGIN * 2);
    const CHAR_WIDTH = 7.2, CHAR_HEIGHT = 18;

    // 2. Data Structures
    let textBlockQueue = []; // The "text array"
    let head = null;         // First node of Doubly Linked List
    let currentPage = null;  // Pointer to current node

    class PageNode {
        constructor(domElement) {
            this.element = domElement;
            this.next = null;
            this.prev = null;
        }
    }

    window.addEventListener("load", () => {
        const content = document.getElementById("content");
        if (!content) return;

        // "put all text blocks in an array"
        textBlockQueue = Array.from(content.children).map(el => {
            const clone = el.cloneNode(true);
            clone.style.fontSize = "12px";
            clone.style.lineHeight = `${CHAR_HEIGHT}px`;
            clone.style.margin = "0 0 12px 0";
            return clone;
        });
        
        content.style.display = "none";
        setupUI();
        
        // Initialize Linked List with Page 1
        head = new PageNode(generatePageNode());
        currentPage = head;
        render();
    });

    /**
     * YOUR PSEUDOCODE FUNCTION: split-text
     * Outputs [text_to_keep, text_to_overflow]
     */
    function splitText(block, availableHeight) {
        const text = block.innerText;
        const numCharsPerLine = Math.floor(PRINT_W / CHAR_WIDTH);
        const numLinesToKeep = Math.floor(availableHeight / CHAR_HEIGHT);
        const numCharsToKeep = numCharsPerLine * numLinesToKeep;

        if (numCharsToKeep <= 0) return ["", text];
        
        return [
            text.substring(0, numCharsToKeep),
            text.substring(numCharsToKeep)
        ];
    }

    /**
     * PAGE GENERATOR: Uses the while loop and split-text logic
     */
    function generatePageNode() {
        const page = document.createElement("div");
        page.className = "page-sheet";
        let current_remaining_height = PRINT_H;

        while (textBlockQueue.length > 0 && current_remaining_height >= CHAR_HEIGHT) {
            let block = textBlockQueue.shift(); // pop from array
            
            const charsPerLine = Math.floor(PRINT_W / CHAR_WIDTH);
            const blockHeight = Math.ceil(block.innerText.length / charsPerLine) * CHAR_HEIGHT;

            // if block-height < height: render it
            if (blockHeight <= current_remaining_height) {
                page.appendChild(block);
                current_remaining_height -= blockHeight; // decrement
            } else {
                // Perform the split
                const [fit, overflow] = splitText(block, current_remaining_height);
                
                if (fit.length > 0) {
                    const node = block.cloneNode(false);
                    node.innerText = fit;
                    page.appendChild(node);
                }
                if (overflow.length > 0) {
                    const overNode = block.cloneNode(false);
                    overNode.innerText = overflow;
                    textBlockQueue.unshift(overNode); // "put the overflow back into the text array"
                }
                current_remaining_height = 0; // page is full
            }
        }
        return page;
    }

    // Navigation logic (Doubly Linked List)
    function navigateNext() {
        if (currentPage.next) {
            currentPage = currentPage.next;
        } else if (textBlockQueue.length > 0) {
            // "once right arrow clicked, new page is generated"
            const newNode = new PageNode(generatePageNode());
            newNode.prev = currentPage;
            currentPage.next = newNode;
            currentPage = newNode;
        }
        render();
    }

    function navigatePrev() {
        if (currentPage.prev) {
            currentPage = currentPage.prev;
            render();
        }
    }

    function render() {
        const stage = document.getElementById("stage");
        stage.innerHTML = "";
        stage.appendChild(currentPage.element);

        // Fixed Scale Math
        const scale = Math.min((window.innerWidth - 180) / A4_W, (window.innerHeight - 80) / A4_H);
        currentPage.element.style.transform = `scale(${scale})`;

        // Button States
        document.getElementById("prev").disabled = !currentPage.prev;
        document.getElementById("next").disabled = (!currentPage.next && textBlockQueue.length === 0);
    }

    function setupUI() {
        const style = document.createElement("style");
        style.innerHTML = `
            body { margin: 0; background: #1a1a1a; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
            #stage { display: flex; justify-content: center; align-items: center; }
            .page-sheet {
                background: white; width: ${A4_W}px; height: ${A4_H}px;
                padding: ${MARGIN}px; box-sizing: border-box;
                box-shadow: 0 0 30px black; transform-origin: center center;
            }
            .nav-btn {
                position: fixed; top: 50%; transform: translateY(-50%);
                padding: 20px; background: #333; color: white; border: 1px solid #555;
                cursor: pointer; z-index: 100; font-weight: bold;
            }
            .nav-btn:disabled { opacity: 0.2; cursor: default; }
            #prev { left: 40px; }
            #next { right: 40px; }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', `
            <button id="prev" class="nav-btn">BACK</button>
            <div id="stage"></div>
            <button id="next" class="nav-btn">NEXT</button>
        `);

        document.getElementById("next").onclick = navigateNext;
        document.getElementById("prev").onclick = navigatePrev;
    }
})();
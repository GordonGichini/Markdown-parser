"use strict";
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
// State variables
let currentState = 'normal';
let buffer = '';
let codeBlockCount = 0;
function createSpan(text, className = '') {
    const span = document.createElement('span');
    span.textContent = text;
    if (className) {
        span.className = className;
    }
    return span;
}
function flushBuffer(className = '') {
    if (buffer && currentContainer) {
        currentContainer.appendChild(createSpan(buffer, className));
        buffer = '';
    }
}
function handleBacktick() {
    switch (currentState) {
        case 'normal':
            flushBuffer();
            currentState = 'inlineCode';
            break;
        case 'inlineCode':
            flushBuffer('inline-code');
            currentState = 'normal';
            break;
        case 'codeBlock':
            buffer += '`';
            codeBlockCount++;
            if (codeBlockCount === 3) {
                flushBuffer('code-block');
                currentState = 'normal';
                codeBlockCount = 0;
            }
            break;
    }
}
function handleTripleBackTicks() {
    switch (currentState) {
        case 'normal':
            flushBuffer();
            currentState = 'codeBlock';
            codeBlockCount = 0;
            break;
        case 'inlineCode':
            buffer += '``';
            flushBuffer('inline-code');
            currentState = 'normal';
            break;
        case 'codeBlock':
            flushBuffer('code-block');
            currentState = 'normal';
            codeBlockCount = 0;
            break;
    }
}
function addToken(token) {
    if (!currentContainer)
        return;
    for (let i = 0; i < token.length; i++) {
        const char = token[i];
        if (char === '`') {
            if (i + 2 < token.length && token.slice(i, i + 3) === '```') {
                handleTripleBackTicks();
                i += 2;
            }
            else {
                handleBacktick();
            }
        }
        else {
            buffer += char;
        }
    }
    flushBuffer(currentState === 'inlineCode' ? 'inline-code' : currentState === 'codeBlock' ? 'code-block' : '');
    // const span = document.createElement('span');
    // span.innerText = token;
    // currentContainer.appendChild(span);
}
//# sourceMappingURL=MarkdownParser.js.map
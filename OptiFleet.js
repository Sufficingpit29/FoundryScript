// ==UserScript==
// @name         OptiFleet Copy Details (Release)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds copy buttons for grabbing details in the OptiFleet Control Panel
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/Content/Miners/IndividualMiner?id*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet
// @grant        none
// ==/UserScript==

const styleSheet = `
.copyBtn {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 3px 6px;
    font-size: 10px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    vertical-align: middle;
}
.copyBtn:hover {
    background-color: #45a049;
}
.copySuccess {
    background-color: #28a745;
    color: white;
    font-size: 12px;
    padding: 5px;
    border-radius: 3px;
    margin-top: 5px;
    display: inline-block;
    opacity: 0;
    transition: opacity 0.5s ease;
}
.copySuccess.show {
    opacity: 1;
}
.sharepointBtn {
    background-color: #0078d4; /* Blue color for SharePoint button */
}
.sharepointBtn:hover {
    background-color: #005a9e; /* Darker blue on hover */
}
`;

const styleElement = document.createElement('style');
styleElement.type = "text/css";
styleElement.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(styleElement);

function copyTextToClipboard(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    console.log("Copied content:", text);
}

function copyAllDetails() {
    const container = document.querySelector('.miner-details-section.m-stack');
    if (!container) return;

    const clone = container.cloneNode(true);
    const buttons = clone.querySelectorAll('.copyBtn');
    buttons.forEach(btn => btn.remove());

    let textToCopy = clone.innerText
        .replace(/Copy\s*$/gm, '') // Remove 'Copy' button text
        .replace(/All details copied!/, '') // Remove 'All details copied!' message
        .replace(/Text copied!/, '') // Remove 'Text copied!' message
        .replace(/                /g, '') // Remove whitespacing
        .replace(/\n            \n            AutoPool Enabled\n/, '') // Remove the autopool text
        .replace(/\n+$/, '') // Remove trailing newlines
        .trim();

    copyTextToClipboard(textToCopy);
}

function copyAllDetailsForSharepoint() {
    const container = document.querySelector('.miner-details-section.m-stack');
    if (!container) return;

    const clone = container.cloneNode(true);
    const buttons = clone.querySelectorAll('.copyBtn');
    buttons.forEach(btn => btn.remove());

    let cleanedText = clone.innerText
        .replace(/Copy\s*$/gm, '') // Remove 'Copy' button text
        .replace(/All details copied!/, '') // Remove 'All details copied!' message
        .replace(/Text copied!/, '') // Remove 'Text copied!' message
        .replace(/                /g, '') // Remove whitespacing
        .replace(/\n            \n            AutoPool Enabled\n/, '') // Remove the autopool text
        .replace(/\n+$/, '') // Remove trailing newlines
        .trim();

    function parseMinerDetails(text) {
        console.log(text);
        const details = {};

        const minerDetailsText = text.trim().split('\n');
        console.log(minerDetailsText);

        var lastKey = "";
        for (let i = 0; i < minerDetailsText.length; i++) {
            console.log(minerDetailsText[i]);

            const key = minerDetailsText[i].trim();
            if (i + 1 < minerDetailsText.length && key.length > 2 && key != lastKey) {

                let value = minerDetailsText[i + 1];
                if (key === 'Rack / Row / Position') {
                    value = value.replace(/ \/ /g, '-');
                }
                details[key] = value;
            }
        }

        return details;
    }

    const minerDetails = parseMinerDetails(cleanedText);
    console.log(minerDetails);

    const {
        'Serial Number': serialNumber,
        Facility,
        IpAddress: ipAddress,
        'Rack / Row / Position': locationID,
        'Active Pool': activePool,
    } = minerDetails;

    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    const textToCopy = `${serialNumber}\t${Facility}\t${ipAddress}\t${Facility}-${locationID}\t${activePool}\t\t${currentDate}`;

    copyTextToClipboard(textToCopy);
    window.open("https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3", 'Paste Data').focus();
}

function addCopyButton(element, textToCopy) {
    if (element.querySelector('.copyBtn')) return;

    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.className = 'copyBtn';
    copyButton.onclick = function (event) {
        event.preventDefault();
        copyTextToClipboard(textToCopy);
        copyButton.innerText = 'Copied';
        setTimeout(() => {
            copyButton.innerText = 'Copy';
        }, 2000);
    };
    element.appendChild(copyButton);
}

function addCopyButtonsToElements() {
    const detailSections = document.querySelectorAll('.miner-details-section .info-row-value');

    detailSections.forEach(section => {
        const textToCopy = section.textContent.trim();
        addCopyButton(section, textToCopy);
    });

    const container = document.querySelector('.miner-details-section.m-stack');
    if (container) {
        if (!container.querySelector('.copyAllBtn')) {
            const copyAllButton = document.createElement('button');
            copyAllButton.innerText = 'Copy All';
            copyAllButton.className = 'copyBtn copyAllBtn';
            copyAllButton.onclick = function (event) {
                event.preventDefault();
                copyAllDetails();
                showSuccessMessage(container, "All details copied!");
            };
            container.insertBefore(copyAllButton, container.firstChild);
        }

        if (!container.querySelector('.sharepointPasteBtn')) {
            const sharepointPasteButton = document.createElement('button');
            sharepointPasteButton.innerText = 'Sharepoint Paste';
            sharepointPasteButton.className = 'copyBtn sharepointPasteBtn';
            sharepointPasteButton.onclick = function (event) {
                event.preventDefault();
                copyAllDetailsForSharepoint();
                showSuccessMessage(container, "Details for Sharepoint copied!");
            };
            container.insertBefore(sharepointPasteButton, container.firstChild);
        }
    }
}

function showSuccessMessage(element, message) {
    let successMsg = document.createElement('div');
    successMsg.className = 'copySuccess';
    successMsg.innerHTML = message;
    element.appendChild(successMsg);
    setTimeout(() => {
        successMsg.classList.add('show');
        setTimeout(() => {
            successMsg.classList.remove('show');
            element.removeChild(successMsg);
        }, 2000);
    }, 10);
}

function addMutationObserver() {
    const observer = new MutationObserver(() => {
        addCopyButtonsToElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('load', function () {
    addCopyButtonsToElements();
    addMutationObserver();
});
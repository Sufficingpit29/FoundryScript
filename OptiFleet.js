// ==UserScript==
// @name         OptiFleet Copy Details (Dev)
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  Adds copy buttons for grabbing details in the OptiFleet Control Panel
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/*
// @match        *://tasks.office.com/foundrydigital.com/*
// @match        *://foundrydigitalllc.sharepoint.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// ==/UserScript==

var urlLookupExcel = {
    /*
    "Bitmain": "https://foundrydigitalllc.sharepoint.com/:x:/r/sites/SiteOps/_layouts/15/Doc.aspx?sourcedoc=%7B8D61FC1B-172C-44B2-9D05-72998A4F6275%7D&file=Bitmain%200002%20Minden%20GV.xlsx&action=default&mobileredirect=true",
    "Fortitude": "https://foundrydigitalllc.sharepoint.com/:x:/r/sites/SiteOps/_layouts/15/Doc.aspx?sourcedoc=%7BD26A9087-8D1A-45B6-B005-45F4FB25E42D%7D&file=Fortitude%20Hashboard%20Repair.xlsx&action=default&mobileredirect=true",
    "RAMM": "https://foundrydigitalllc.sharepoint.com/:x:/r/sites/SiteOps/_layouts/15/Doc.aspx?sourcedoc=%7BC5DD3CF5-19C8-4F8F-A192-52E1F9CA4A41%7D&file=RAMM%200001%20GV%20Minden.xlsx&action=default&mobileredirect=true"
    */
};
const defaultExcelLink = "https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3";

urlLookupExcel["Bitmain"] = GM_SuperValue.get("bitmainLink", defaultExcelLink);
urlLookupExcel["Fortitude"] = GM_SuperValue.get("fortitudeLink", defaultExcelLink);;
urlLookupExcel["RAMM"] = GM_SuperValue.get("rammLink", defaultExcelLink);


const urlLookupPlanner = {
    "Bitmain": "https://tasks.office.com/foundrydigital.com/Home/Planner/#/plantaskboard?groupId=efbb33a0-825d-4dff-8384-a8b34b58b606&planId=wkeUw2vf1kqEkw6-XXaSR2UABn4T",
    "Fortitude": "https://tasks.office.com/foundrydigital.com/Home/Planner/#/plantaskboard?groupId=efbb33a0-825d-4dff-8384-a8b34b58b606&planId=TbJIxx_byEKhuMp-C4tXLGUAD3Tb",
    "RAMM": "https://tasks.office.com/foundrydigital.com/Home/Planner/#/plantaskboard?groupId=efbb33a0-825d-4dff-8384-a8b34b58b606&planId=FHYUYbYUfkqd2-oSKLk7xGUAHvRz"
};

const currentUrl = window.location.href;

if(currentUrl.includes("https://foundryoptifleet.com/")) {

    // Check is the user ever inputs something
    var serialInputted = "";
    var lastInputTime = 0;
    var timeoutId;
    document.addEventListener('keydown', function(event) {
        if(Date.now() - lastInputTime > 1000) {
            serialInputted = "";
        } else {
            serialInputted += event.key;

            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function() {
                // Checks to see if there is Shift and Enter in the string, if not, stop
                if (serialInputted.indexOf('Enter') === -1) {
                    console.log("No Enter", serialInputted);
                    serialInputted = "";
                    return;
                }

                // Clean Shift and Enter
                serialInputted = serialInputted.replace(/Shift/g, '');
                serialInputted = serialInputted.replace(/Enter/g, '');

                // Save the serial number to the storage
                GM_SuperValue.set('serialNumberInputted', serialInputted);

                // Redirect to https://foundryoptifleet.com/Content/Dashboard/Miners/List
                window.location.href = "https://foundryoptifleet.com/Content/Dashboard/Miners/List";
            }, 500);
        }
        lastInputTime = Date.now();
    });

    const savedSerialNumber = GM_SuperValue.get('serialNumberInputted', 'YNAHANCBCABJA024D');
    if (savedSerialNumber !== '') {
        // Find ddlZones_listbox and select All Sites
        const ddlZones = document.querySelector('#ddlZones');
        console.log("Going to click on ddlZones");
        if (ddlZones) {
            ddlZones.click();
            const animationContainer = document.querySelector('.k-animation-container');
            const list = animationContainer.querySelector('.k-list');
            const items = list.querySelectorAll('.k-item');
            const selectedOption = list.querySelector('.k-state-selected');
            if (selectedOption.textContent !== 'All Zones') {
                items[0].click();
            }
            ddlZones.click();
        }

        // Select .op-select-filters clickable
        const moreFilters = document.querySelector('.op-select-filters.clickable');
        if (moreFilters) {
            moreFilters.click();
        }

        // Now select and enable Serial Number and click apply
        const serialNumberOption = document.querySelector('.option.m-menu-item input[c-id="serialNumberOption"]');

        // If it exists and is not checked, click on it
        if (serialNumberOption && !serialNumberOption.checked) {
            serialNumberOption.click();

            // Now click on Apply
            const moreFiltersApplyBtn = document.querySelector('[c-id="moreFiltersApplyBtn"]');
            if (moreFiltersApplyBtn) {
                moreFiltersApplyBtn.click();
            }
        } else {
            moreFilters.click();
        }

        // Now click on the serial number filter
        const serialNumberFilter = document.querySelector('[c-id="serialNumberFilter"]');
        if (serialNumberFilter) {
            serialNumberFilter.click();
        }

        // Now enter number in serialNumberInput
        const serialNumberInput = document.querySelector('[c-id="serialNumberInput"]');
        if (serialNumberInput) {
            serialNumberInput.value = savedSerialNumber;
        }

        // Now apply serialNumberApplyBtn
        const serialNumberApplyBtn = document.querySelector('[c-id="serialNumberApplyBtn"]');
        if (serialNumberApplyBtn) {
            serialNumberApplyBtn.click();
        }

        // Repeativly check for menu-wrapper for 6 seconds
        var counter = 0;
        var intervalId = setInterval(function() {
            const minerGrid = document.querySelector('#minerGrid');
            if (minerGrid) {
                const rows = minerGrid.querySelectorAll('tr.k-master-row');
                rows.forEach(row => {
                    const serialNumber = row.querySelector('td[role="gridcell"]:nth-child(2)');
                    const uid = row.getAttribute('data-uid');

                    if (serialNumber && uid) {
                        console.log(serialNumber.textContent);
                        console.log(uid);
                        //menu-wrapper
                        let minerLinkElement = minerGrid.querySelector(`[data-uid="${uid}"] .menu-wrapper`);
                        if (minerLinkElement) {
                            let minerID = minerLinkElement.getAttribute('data-miner-id');
                            clearInterval(intervalId);

                            // Open link in new tab
                            GM_SuperValue.set("serialNumberInputted", "");
                            window.open(`https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`, '_blank');
                            return;
                        }
                    }
                });
            }
            counter++;
            if (counter === 12) {
                clearInterval(intervalId);
            }
        }, 1000);

        serialInputted = "";
    }
}

// Check if on the source website
if (currentUrl.includes("foundryoptifleet.com/Content/Miners/IndividualMiner")) {

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

    // Clean Text fuction
    function cleanText(text) {
        return text
        .replace(/Copy\s*$/gm, '') // Remove 'Copy' button text
        .replace(/All details copied!/, '') // Remove 'All details copied!' message
        .replace(/Text copied!/, '') // Remove 'Text copied!' message
        .replace(/                /g, '') // Remove whitespacing
        .replace(/\n            \n            AutoPool Enabled\n/, '') // Remove the autopool text
        .replace(/\n+$/, '') // Remove trailing newlines
        .replace(/\n            \n            /g, '\n') // Removes extra new lines  )
        .trim();
    }

    function copyAllDetails() {
        const container = document.querySelector('.miner-details-section.m-stack');
        if (!container) return;

        const clone = container.cloneNode(true);
        const buttons = clone.querySelectorAll('.copyBtn');
        buttons.forEach(btn => btn.remove());

        let textToCopy = cleanText(clone.innerText);

        copyTextToClipboard(textToCopy);
    }

    function copyAllDetailsForSharepoint(issue, log, type) {
        const container = document.querySelector('.miner-details-section.m-stack');
        if (!container) return;

        const clone = container.cloneNode(true);
        const buttons = clone.querySelectorAll('.copyBtn');
        buttons.forEach(btn => btn.remove());

        let cleanedText = cleanText(clone.innerText);

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

        minerDetails['type'] = type;
        minerDetails['issue'] = issue;
        minerDetails['log'] = log;

        const {
            'Model': model,
            'Serial Number': serialNumber,
            Facility,
            IpAddress: ipAddress,
            'Rack / Row / Position': locationID,
            'Active Pool': activePool,
        } = minerDetails;


        GM_SuperValue.set("taskName", `${model} - ${serialNumber} - ${issue}`);
        GM_SuperValue.set("taskNotes", cleanedText);
        GM_SuperValue.set("taskComment", log);
        GM_SuperValue.set("detailsData", minerDetails);

        const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
        const textToCopy = `${serialNumber}\t${Facility}\t${ipAddress}\t${Facility}-${locationID}\t${activePool}\t${issue}\t${currentDate}`;

        copyTextToClipboard(textToCopy);
        //window.open("https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3", 'Paste Data').focus();
        window.open(urlLookupExcel[type], 'Paste Data').focus();
    }

    function createDataInputPopup() {
        // Create a popup element for entering Issue and Log
        const popupElement = document.createElement('div');
        popupElement.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #333; color: white; padding: 20px;">
                <h1>Enter Issue and Log</h1>
                <form id="issueLogForm">
                    <div style="margin-bottom: 10px;">
                        <label for="issue" style="display: block; font-weight: bold;">Issue:</label>
                        <input type="text" id="issue" name="issue" required style="width: 100%; padding: 5px; color: white;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label for="log" style="display: block; font-weight: bold;">Log:</label>
                        <textarea id="log" name="log" required style="width: 100%; height: 100px; padding: 5px; color: white;"></textarea>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label for="type" style="display: block; font-weight: bold;">Type:</label>
                        <select id="type" name="type" required style="width: 100%; padding: 5px; color: white; background-color: #222;">
                            <option value="Bitmain">Bitmain</option>
                            <option value="Fortitude">Fortitude</option>
                            <option value="RAMM">RAMM</option>
                        </select>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <button type="button" id="submitBtn" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Next</button>
                            <button type="button" id="cancelBtn" style="background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; margin-left: 10px;">Cancel</button>
                        </div>
                        <button type="button" id="linksBtn" style="background-color: #4287f5; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Edit Links</button>
                    </div>
                </form>
            </div>
        `;
        // Function to submit Issue and Log
        function submitIssueLog() {
            const issue = document.getElementById("issue").value;
            const log = document.getElementById("log").value;
            const type = document.getElementById("type").value;

            // Remove the popup element
            popupElement.remove();

            // Copy the details for Quick Sharepoint & Planner and set the taskName and taskNotes
            copyAllDetailsForSharepoint(issue, log, type);
        }

        // Function to cancel Issue and Log
        function cancelIssueLog() {
            // Remove the popup element
            popupElement.remove();
        }

        // Function to edit links
        function editLinks() {
            popupElement.remove();

            // Creates a side panel element with links to Excel that can be edited and saved
            const sidePanel = document.createElement('div');
            const bitmainLink = urlLookupExcel["Bitmain"];
            const fortitudeLink = urlLookupExcel["Fortitude"];
            const rammLink = urlLookupExcel["RAMM"];
            sidePanel.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #333; color: white; padding: 20px;">
                    <h1>Edit Links</h1>
                    <form id="linksForm">
                        <div style="margin-bottom: 10px;">
                            <label for="bitmain" style="display: block; font-weight: bold;">Bitmain:</label>
                            <input type="text" id="bitmain" name="bitmain" required style="width: 100%; padding: 5px; color: white;" value="${bitmainLink}">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label for="fortitude" style="display: block; font-weight: bold;">Fortitude:</label>
                            <input type="text" id="fortitude" name="fortitude" required style="width: 100%; padding: 5px; color: white;" value="${fortitudeLink}">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label for="ramm" style="display: block; font-weight: bold;">RAMM:</label>
                            <input type="text" id="ramm" name="ramm" required style="width: 100%; padding: 5px; color: white;" value="${rammLink}">
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button type="button" id="saveBtn" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Save</button>
                            <button type="button" id="cancelBtn" style="background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Cancel</button>
                            <a href="${defaultExcelLink}" target="_blank" style="background-color: #0078d4; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">Site Ops</a>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(sidePanel);

            // Add event listeners to select text on focus
            document.getElementById('bitmain').addEventListener('focus', function() {
                this.select();
            });
            document.getElementById('fortitude').addEventListener('focus', function() {
                this.select();
            });
            document.getElementById('ramm').addEventListener('focus', function() {
                this.select();
            });

            function saveLinks() {
                const bitmainLink = document.getElementById("bitmain").value;
                const fortitudeLink = document.getElementById("fortitude").value;
                const rammLink = document.getElementById("ramm").value;

                GM_SuperValue.set("bitmainLink", bitmainLink !== "" ? bitmainLink : defaultExcelLink);
                GM_SuperValue.set("fortitudeLink", fortitudeLink !== "" ? fortitudeLink : defaultExcelLink);
                GM_SuperValue.set("rammLink", rammLink !== "" ? rammLink : defaultExcelLink);

                urlLookupExcel["Bitmain"] = bitmainLink !== "" ? bitmainLink : defaultExcelLink;
                urlLookupExcel["Fortitude"] = fortitudeLink !== "" ? fortitudeLink : defaultExcelLink;
                urlLookupExcel["RAMM"] = rammLink !== "" ? rammLink : defaultExcelLink;
                sidePanel.remove();
            }

            document.getElementById('saveBtn').addEventListener('click', saveLinks);
            document.getElementById('cancelBtn').addEventListener('click', () => {
                sidePanel.remove();
            });
        }

        // Append the popup element to the document body
        document.body.appendChild(popupElement);

        // Attach event listeners to the buttons
        document.getElementById('submitBtn').addEventListener('click', submitIssueLog);
        document.getElementById('cancelBtn').addEventListener('click', cancelIssueLog);
        document.getElementById('linksBtn').addEventListener('click', editLinks);
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
                sharepointPasteButton.innerText = 'Quick Sharepoint & Planner';
                sharepointPasteButton.className = 'copyBtn sharepointPasteBtn';
                sharepointPasteButton.onclick = function (event) {
                    event.preventDefault();
                    createDataInputPopup();
                    //copyAllDetailsForSharepoint();
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
} else if (currentUrl.includes("foundrydigitalllc.sharepoint.com/") ) {

    console.log("Running on SharePoint");

    // If there is a taskName/Notes in storage, then create a overlay on the right side of the page that says Go to Planner
    const taskName = GM_SuperValue.get("taskName", "");
    const detailsData = GM_SuperValue.get("detailsData", {});


    if (taskName !== "") {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '20px';
        overlay.style.right = '20px';
        overlay.style.backgroundColor = '#f2f2f2';
        overlay.style.padding = '10px';
        overlay.style.borderRadius = '5px';
        overlay.style.color = '#333';
        overlay.style.fontSize = '14px';
        overlay.style.fontWeight = 'bold';
        overlay.style.outline = '2px solid #333'; // Add outline
        let plannerUrl = urlLookupPlanner[detailsData['type']];
        overlay.innerHTML = `
            <p>Model: ${detailsData['Model']}</p>
            <p>Serial Number: ${detailsData['Serial Number']}</p>
            <p>Slot ID: ${detailsData['Facility']}-${detailsData['Rack / Row / Position']}</p>
            <button style="background-color: green; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            <a href="${plannerUrl}" style="color: #fff; text-decoration: none;">Go to Planner</a>
            </button>
            <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
            Cancel
            </button>
        `;
        document.body.appendChild(overlay);

        const cancelButton = document.getElementById('cancelButton');
        cancelButton.addEventListener('click', () => {
            GM_SuperValue.set('taskName', '');
            GM_SuperValue.set('taskNotes', '');
            GM_SuperValue.set('taskComment', '');
            GM_SuperValue.set('detailsData', {});
            document.body.removeChild(overlay);
        });
    }

} else if (currentUrl.includes("tasks.office.com/foundrydigital.com/")) {
    console.log("Script Started");

    const taskName = GM_SuperValue.get("taskName", "");
    if (taskName === "") {
        console.error('Task name not found in storage.');
        return;
    }

    const taskNotes = GM_SuperValue.get("taskNotes", "");
    if (taskNotes === "") {
        console.error('Task notes not found in storage.');
        return;
    }

    const detailsData = GM_SuperValue.get("detailsData", {});
    if (Object.keys(detailsData).length === 0) {
        console.error('Details data not found in storage.');
        return;
    }

    // Function to simulate real typing using execCommand
    function setupTask(inputElement) {

        inputElement.focus();

        let i = 0;
        function typeCharacter() {
            if (i < taskName.length) {
                const char = taskName.charAt(i);

                // Create and dispatch the keydown event
                const keydownEvent = new KeyboardEvent('keydown', { key: char });
                inputElement.dispatchEvent(keydownEvent);

                // Insert the character
                document.execCommand('insertText', false, char);

                // Create and dispatch the keyup event
                const keyupEvent = new KeyboardEvent('keyup', { key: char });
                inputElement.dispatchEvent(keyupEvent);

                i++;
                setTimeout(typeCharacter, 10);
            } else {

                // Locate the add task button and click it
                const addTaskButton = document.querySelector('.addTaskButton');
                if (addTaskButton) {
                    addTaskButton.click();
                    console.log('Clicked add task button.');

                    // Locate the new element with the inputted text
                    setTimeout(() => {
                        const newElement = document.querySelector(`[aria-label="${taskName}"]`);
                        if (newElement) {
                            console.log('New element found:', newElement);
                            // Click the element
                            newElement.click();

                            // Now add the text to the notes
                            setTimeout(() => {
                                const notesEditor = document.querySelector('.notes-editor');
                                if (notesEditor) {
                                    // Click the notes editor to focus it and enter editing mode
                                    notesEditor.click();
                                    notesEditor.focus();

                                    // Change the notes editor's background color to red for testing
                                    //notesEditor.style.backgroundColor = 'red';

                                    // Insert the text into the notes editor
                                    document.execCommand('insertText', false, taskNotes);
                                    console.log('Inserted text into notes editor.');

                                    // Now lets add the comment to the task for the log
                                    const commentField = document.querySelector('textarea[aria-label="New comment"]');
                                    if (commentField) {
                                        commentField.click();
                                        commentField.focus();
                                        document.execCommand('insertText', false, GM_SuperValue.get("taskComment", ""));
                                        console.log('Inserted text into comment field.');
                                    }

                                    // Now find the send button and click it
                                    const sendButton = document.querySelector('.sendCommentButton');
                                    if (sendButton) {
                                        sendButton.click();
                                        console.log('Clicked send button.');

                                        // We'll now reset the taskName and taskNotes values
                                        GM_SuperValue.set("taskName", "");
                                        GM_SuperValue.set("taskNotes", "");
                                        GM_SuperValue.set("taskComment", "");
                                        GM_SuperValue.set("detailsData", {});

                                    } else {
                                        console.error('Notes editor not found.');
                                    }

                                } else {
                                    console.error('Notes editor not found.');
                                }
                            }, 500);
                        } else {
                            console.error('New element not found.');
                        }
                    }, 500); // Add a 500ms delay before locating the new element
                } else {
                    console.error('Add task button not found.');
                }
            }
        }
        typeCharacter();
    }

    var hasClicked = false;
    function clickAddTaskButton() {
        if(hasClicked) { return; }
        console.log("Attempting to click.");
        const headers = document.querySelectorAll('.columnTitle');
        console.log('Headers found:', headers.length);

        const header = Array.from(headers).find(el => el.textContent.trim() === 'Diagnosed');

        if (header) {
            hasClicked = true;
            const container = header.closest('.columnContent');

            if (container) {
                const addButton = container.querySelector('.addButton');
                var textField = container.querySelector('input[placeholder="Enter a task name * (required)"]');

                if (addButton) {
                    //addButton.style.backgroundColor = 'red';
                    //addButton.style.color = 'white';

                    // Click to start making new task if the menu isn't already there.
                    if(!textField) {
                        addButton.click();
                    }

                    // Set the value of the text field to "TEST" after clicking the button
                    textField = container.querySelector('input[placeholder="Enter a task name * (required)"]');
                    if (textField) {
                        setupTask(textField);
                    } else {
                        console.error('Text field not found.');
                    }

                    return true; // Stop further mutation observations
                } else {
                    console.error('Add task button not found.');
                }
            } else {
                console.error('Container not found.');
            }
        } else {
            console.log('Header with title "TestName" not found.');
        }

        console.log("Click Attempted...");
        return false; // Keep observing for further mutations
    }

    function createAutoCreateCardButton() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.right = '20px';
        popup.style.backgroundColor = '#f2f2f2';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.color = '#333';
        popup.style.fontSize = '14px';
        popup.style.fontWeight = 'bold';
        popup.style.outline = '2px solid #333'; // Add outline
        popup.innerHTML = `
            <p>Model: ${detailsData['Model']}</p>
            <p>Serial Number: ${detailsData['Serial Number']}</p>
            <p>Slot ID: ${detailsData['Facility']}-${detailsData['Rack / Row / Position']}</p>
            <button id="autoCreateCardButton" style="background-color: green; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            Auto-Create Card
            </button>
            <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
            Cancel
            </button>
        `;
        document.body.appendChild(popup);

        const autoCreateCardButton = document.getElementById('autoCreateCardButton');
        autoCreateCardButton.addEventListener('click', () => {
            clickAddTaskButton();
            document.body.removeChild(popup);
        });

        const cancelButton = document.getElementById('cancelButton');
        cancelButton.addEventListener('click', () => {
            GM_SuperValue.set('taskName', '');
            GM_SuperValue.set('taskNotes', '');
            GM_SuperValue.set('taskComment', '');
            GM_SuperValue.set('detailsData', {});
            window.close();
        });

    }

    window.addEventListener('load', function () {
        setTimeout(createAutoCreateCardButton, 1000);
    });
}

// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  Adds various features to the OptiFleet website to add additional functionality.
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/*
// @match        *://tasks.office.com/foundrydigital.com/*
// @match        *://foundrydigitalllc.sharepoint.com/*
// @match        *https://planner.cloud.microsoft/foundrydigital.com/Home/Planner/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet.js
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://foundryoptifleet.com/scripts/axios.min.js
// @require      https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/HackyWorkAround.js
// ==/UserScript==

const currentUrl = window.location.href;


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

//-----------------

function OptiFleetSpecificLogic() {
    var allMinersData = {};
    var allMinersLookup = {};
    
    var serviceInstance = new OptiFleetService();
    var pageInstance = new OptiFleetPage();
    var viewServiceInstance = new MinerViewService();
    var siteId = pageInstance.getSelectedSiteId();
    var companyId = pageInstance.getSelectedCompanyId();
    var lastSiteId = siteId;
    var lastCompanyId = companyId;
    var lastMinerDataUpdate = 0;
    var reloadCards = false;
    var hasRefreshed = false;

    var issueMiners;
    __awaiter(serviceInstance, void 0, void 0, function* () {
        serviceInstance.get(`/Issues?siteId=${siteId}&zoneId=-1`).then(res => {
            res.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");
            issueMiners = res.miners;
        });
    });

    var minerUpTimes = {};
    function retrieveMinerUpTime(minerID, timeFrame, callback) {
        // Reset the miner uptime data
        minerUpTimes[minerID] = null;

        var params = {
            start: Math.floor(((new Date()).getTime() / 1000) - timeFrame),
            end: Math.floor((new Date()).getTime() / 1000),
            step: 300
        };

        serviceInstance.post("/MinerOnline", Object.assign({ id: minerID }, params)).then((res) => {
            // Sanitize the data to only include the uptime values
            var uptimeData = res['data']['result'][0]['values']
            
            // Store the uptime data
            minerUpTimes[minerID] = uptimeData;

            // Call the callback function for the uptime data
            if (callback) {
                callback(minerID, uptimeData);
            }
        });
    }

    function updateAllMinersData(keepTrying = false) {
        console.log("Updating all miners data");
        // Reset allMinersLookup
        const lastMinersLookup = allMinersLookup;
        allMinersLookup = {};

        // Get the current site and company ID
        lastSiteId = siteId;
        lastCompanyId = companyId;
        siteId = pageInstance.getSelectedSiteId();
        companyId = pageInstance.getSelectedCompanyId();

        // Call the getMiners method
        viewServiceInstance.getMiners(companyId, siteId).then(function(miners) {
            // Get first miner in the list and if it existed before/changed any
            const firstMiner = miners.miners[0];
            if (miners.miners.length > 0) {
                //console.log("First Miner:", !lastMinersLookup[firstMiner.id]);
                //console.log("Last Site ID:", lastSiteId, "Current Site ID:", siteId);
                //console.log(lastSiteId === '-1' || siteId === '-1', Object.keys(lastMinersLookup).length, miners.miners.length);
                // Either the a miner no longer exists or we've swaped from/to an all sites and the length changed, if either of those are true we can assume the data has changed
                // Or hasRefreshed so let's reload the data regardless, just in case anything changed
                if (!lastMinersLookup[firstMiner.id] || (lastSiteId === '-1' || siteId === '-1') && Object.keys(lastMinersLookup).length !== miners.miners.length || hasRefreshed) {
                    lastMinerDataUpdate = Date.now();
                    reloadCards = true;
                    hasRefreshed = false;
                    console.log("Miner data updated");
                }
            }

            if(keepTrying && Date.now() - lastMinerDataUpdate > 1000) {
                console.log("Retrying to get miner data");
                setTimeout(function() {
                    updateAllMinersData(true);
                }, 500);
            }

            // Sets up a lookup table
            miners.miners.forEach(miner => {
                allMinersLookup[miner.id] = miner;
            });

            // Get the miners data
            allMinersData = miners.miners;
        }).catch(function(error) {
            console.error("Error fetching miners data:", error);
        });
    }
    updateAllMinersData();

    function getMinerData(minerId) {
        return allMinersLookup[minerId];
    }

    // ------------------------------
    
    function parseMinerDetails(text) {
        const details = {};
        const minerDetailsText = text.trim().split('\n');

        var lastKey = "";
        for (let i = 0; i < minerDetailsText.length; i++) {
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

    function getMinerDetails() {
        const container = document.querySelector('.miner-details-section.m-stack');
        if (!container) return;

        const clone = container.cloneNode(true);
        const buttons = clone.querySelectorAll('.copyBtn');
        buttons.forEach(btn => btn.remove());

        let cleanedText = cleanText(clone.innerText);
        var minerDetailsCrude = parseMinerDetails(cleanedText);

        const minerDetails = {
            model: minerDetailsCrude['Model'],
            serialNumber: minerDetailsCrude['Serial Number'],
            facility: minerDetailsCrude['Facility'],
            ipAddress: minerDetailsCrude['IpAddress'],
            locationID: minerDetailsCrude['Rack / Row / Position'],
            activePool: minerDetailsCrude['Active Pool'],
        };

        return [cleanedText, minerDetails];
    }

    // Non-Bitcoin Hash Rate Logic
    if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview")) {

        // Hash Rate Types
        const hashRateTypes = {
            'H': 1,
            'KH': 1e3,
            'MH': 1e6,
            'GH': 1e9,
            'TH': 1e12,
            'PH': 1e15,
            'EH': 1e18,
            'ZH': 1e21,
        };

        // Function to convert hash rates between types
        function convertRates(hashRate, fromType, toType) {
            const hashRateFrom = hashRateTypes[fromType];
            const hashRateTo = hashRateTypes[toType];

            return (hashRate * hashRateFrom) / hashRateTo;
        }

        // Function to add another hash rate info element to the page
        function addHashRateInfoElement(title, totalHashRate, totalHashRatePotential, totalMiners) {

            // Run through the hash rate types until we find the best one to display
            var hashType = 'H';
            for (const [key, value] of Object.entries(hashRateTypes)) {
                if (totalHashRate > value) {
                    hashType = key;
                }
            }

            // Convert the hash rates to PHs
            totalHashRate = convertRates(totalHashRate, 'H', hashType).toFixed(2);
            totalHashRatePotential = convertRates(totalHashRatePotential, 'H', hashType).toFixed(2);

            // Get average hash rate per miner
            var averageHashRate = totalHashRate / totalMiners;

            // Calculate the efficiency
            var efficiency = (totalHashRate / totalHashRatePotential) * 100;
            efficiency = efficiency.toFixed(1);
            
            // Calculate the percentage of the total hash rate
            var totalHashRatePercentage = (totalHashRate / totalHashRatePotential) * 100;
            totalHashRatePercentage = totalHashRatePercentage.toFixed(1);

            const hashRateCard = document.createElement('div');
            hashRateCard.className = 'bar-chart-card custom';
            hashRateCard.innerHTML = `
                <m-box class="bar-chart-card" data-dashlane-shadowhost="true" data-dashlane-observed="true">
                    <m-stack space="m" data-dashlane-shadowhost="true" data-dashlane-observed="true">
                        <div class="bar-chart-card-title">
                            <h3 class="m-heading is-size-l">${title}</h3>
                            <div>
                                <div class="green-dot"></div>
                                &nbsp;
                                <span class="m-text">Realtime</span>
                            </div>
                        </div>
                        <div class="bar-chart-section">
                            <h4 class="bar-chart-title m-heading is-size-xs">Total Hash Rate / Hash Rate Potential</h4>
                            <div class="bar-chart-row">
                                <div class="bar-chart-container">
                                    <div class="bar-chart" id="hashRateBar_${title}" style="width: ${totalHashRatePercentage}%;">
                                        <div class="bar-chart-text">
                                            <span class="m-heading is-size-xs" id="hashRateBarVal_${title}">${totalHashRate}</span>
                                            <span class="m-heading is-size-xs" id="hashRateBarValUnits_${title}">${hashType}s</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="bar-chart-total">
                                    <span class="m-heading is-size-xs" id="hashRatePotential_${title}">${totalHashRatePotential}</span>
                                    <span class="m-heading is-size-xs is-muted" id="hashRatePotentialUnits_${title}">${hashType}s</span>
                                </div>
                            </div>
                        </div>
                        <div class="metric-row">
                            <m-icon name="activity-square" size="xl" style="width: var(--size-icon-xl); height: var(--size-icon-xl);" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                            &nbsp;&nbsp;
                            <span class="m-heading is-size-l is-muted">Efficiency:</span>&nbsp;&nbsp;
                            <span class="m-code is-size-l" id="hashRateEfficiency_${title}">${efficiency}%</span>
                        </div>
                    </m-stack>
                </m-box>
            `;

            // Add a bit of margin to the top
            hashRateCard.style.marginTop = '10px';
            hashRateCard.style.marginBottom = '10px';
            
            // Find all 'bar-chart-card m-box' elements and add after the last one
            const lastCard = document.querySelectorAll('.bar-chart-card')[document.querySelectorAll('.bar-chart-card').length - 1];
            if (lastCard) {
                lastCard.after(hashRateCard);
            } else {
                console.error("Could not find last card to add after");
            }
            console.log("Added Hash Rate Info Element");
        }

        const unsupportedModels = {
            ["EquiHash"]:   ["Antminer Z15", "Antminer Z15j", "Antminer Z15e"],
            ["Scrypt"] :    ["Antminer L7"]
        };

        function removeAllHashRateElements() {
            const hashRateCards = document.querySelectorAll('.bar-chart-card.custom');
            hashRateCards.forEach(card => {
                console.log("Deleted card:", card);
                card.remove();
            });
        }

        // Function to loop through all miners, find the non-supported miners, calculate the hash rate and add the hash rate info element
        function createHashRateElements() {

            // Update the miner data
            updateAllMinersData();

            // Keep checking until the miner data is updated
            if (!reloadCards) {
                return;
            }
            reloadCards = false;

            var totalHashRates = {};
            /* Basic sudo structure
            {
                "EquiHash": {
                    "totalHashRate": 0,
                    "totalHashRatePotential": 0,
                    "totalMiners": 0
                },
                "Scrypt": {
                    "totalHashRate": 0,
                    "totalHashRatePotential": 0,
                    "totalMiners": 0
                }
            }
            */

            // Loop through all miners
            for (const [index, minerData] of Object.entries(allMinersData)) {
                // Check if the miner is in the hash rate types
                for (const [hashRateType, minerModels] of Object.entries(unsupportedModels)) {
                    if (minerModels.includes(minerData.model)) {
                        // Check if the miner is in the hash rate types
                        if (!totalHashRates[hashRateType]) {
                            totalHashRates[hashRateType] = {
                                "totalHashRate": 0,
                                "totalHashRatePotential": 0,
                                "totalMiners": 0
                            };
                        }

                        // Add the hash rate to the total hash rate
                        totalHashRates[hashRateType].totalHashRate += minerData.currentHashRate;
                        totalHashRates[hashRateType].totalHashRatePotential += minerData.expectedHashRate;
                        totalHashRates[hashRateType].totalMiners++;
                    }
                }
            }

            if (Object.keys(totalHashRates).length === 0) {
                console.log("No miners found for hash rate types");
                return;
            }

            // Find and delete all bar-chart-card m-box custom
            removeAllHashRateElements();

            // Loop through the total hash rates and add the hash rate info elements
            for (const [hashRateType, hashRateData] of Object.entries(totalHashRates)) {
                addHashRateInfoElement("Hash Rate [" + hashRateType +"]", hashRateData.totalHashRate, hashRateData.totalHashRatePotential, hashRateData.totalMiners);
            }
        }

        // Call the function to create the hash rate elements
        createHashRateElements();
        
        // Looks for refreshing and then updates the hash rate elements
        var startedRefresh = false;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var curText = mutation.target.innerText.toLowerCase();
                if(startedRefresh && curText !== "refreshing...") {
                    startedRefresh = false;
                    hasRefreshed = true;
                    updateAllMinersData();
                }
                if(curText === "refreshing...") {
                    startedRefresh = true;
                }
            });
        });

        var config = { attributes: true, childList: true, characterData: true };   


 
        const observerInterval = setInterval(() => {
            const autoRefreshChip = document.querySelector('m-chip[c-id="siteOverview_autoRefreshChip"]');
            if (autoRefreshChip) {
                observer.observe(autoRefreshChip, config);
                clearInterval(observerInterval);
            }
        }, 100);
        
        setInterval(function() {
            // Check if reloadCards is true and if so, run the createHashRateElements function
            if (reloadCards) {
                createHashRateElements();
            }

            // Constantly checks if there siteId or companyId changes and updates the hash rate elements
            if(pageInstance.getSelectedSiteId() !== siteId || pageInstance.getSelectedCompanyId() !== companyId) {
                removeAllHashRateElements();
                updateAllMinersData(true);
                console.log("Site ID or Company ID has changed.");
            }
        }, 500);
    }

    // Scan Miner SN Logic
    if(currentUrl.includes("https://foundryoptifleet.com/")) {

        // Check is the user ever inputs something
        var serialInputted = "";
        var lastInputTime = 0;
        var timeoutId;
        document.addEventListener('keydown', function(event) {

            // Get the focused element
            var activeElement = document.activeElement;
            
            // If the element contains editable or input in the class or has contenteditable, stop
            console.log(activeElement.tagName);
            if (activeElement && (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.isContentEditable) ||
            activeElement.contenteditable) {
                console.log("stop");
                return;
            }

            if(Date.now() - lastInputTime > 1000) {
                serialInputted = "";
            } else {
                serialInputted += event.key;

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }


                timeoutId = setTimeout(function() {
                    // Clean Shift and Enter
                    const originalSerialInputted = serialInputted;
                    serialInputted = serialInputted.replace(/Shift/g, '');
                    serialInputted = serialInputted.replace(/Enter/g, '');

                    // Count up how many times Shift is in the string and check if that many characters are in the cleaned string
                    const shiftCount = originalSerialInputted.split('Shift').length;
                    const serialInputtedNoNumbers = serialInputted.replace(/\d/g, '');
                    const shiftMatchCount = shiftCount === serialInputtedNoNumbers.length && shiftCount > 6;

                    //console.log("No Numbers:", serialInputtedNoNumbers);
                    //console.log("Original Serial Inputted:", originalSerialInputted);
                    //console.log("Shift Count:", shiftCount);
                    //console.log("Shift Match Count:", shiftMatchCount);


                    // Checks to see if there is Shift and Enter in the string, if not, stop
                    if ( !shiftMatchCount ) {
                        //console.log("No Enter/Shift or Low Length", serialInputted);
                        serialInputted = "";
                        return;
                    }

                    // Update to make sure we have the latest miner data
                    updateAllMinersData();
                    
                    // Find the miner with the serial number
                    var minerID = false;
                    for (const [index, minerData] of Object.entries(allMinersData)) {
                        if(minerData.serialNumber === serialInputted) {
                            minerID = minerData.id;
                            break;
                        }
                    }

                    // If we found the miner, open the miner page
                    if(minerID) {
                        window.location.href = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                    }
                }, 500);
            }
            lastInputTime = Date.now();
        });
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
            var [cleanedText, minerDetails] = getMinerDetails();
            const { model, serialNumber, facility, ipAddress, locationID, activePool } = minerDetails;

            minerDetails['type'] = type;
            minerDetails['issue'] = issue;
            minerDetails['log'] = log;

            console.log(`${model} - ${serialNumber} - ${issue}`);
            console.log(cleanedText);

            GM_SuperValue.set("taskName", `${model} - ${serialNumber} - ${issue}`);
            GM_SuperValue.set("taskNotes", cleanedText);
            GM_SuperValue.set("taskComment", log);
            GM_SuperValue.set("detailsData", JSON.stringify(minerDetails));

            const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
            const textToCopy = `${serialNumber}\t${facility}\t${ipAddress}\t${facility}-${locationID}\t${activePool}\t${issue}\t${currentDate}`;

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

    }

    //--------------------------------------------
    // Scan Logic/Down Time Counter
    if(currentUrl.includes("https://foundryoptifleet.com/Content/Issues/Issues")) {

        // -- Add Breaker Number to Slot ID --

        var minersListTableLookup = {};

        function getCurrentMinerList(baseDocument) {
            if(!baseDocument) {
                baseDocument = document;
            }

            idLookup = {}; // < To do, remove this and rework to only use the minersDataLookup
            minersDataLookup = {};

            var minerGrid = baseDocument.querySelector('#minerList');
            if (!minerGrid) {
                minerGrid = baseDocument.querySelector('#minerGrid');
            }

            if (minerGrid) {
                // Loop through all the columns and store the index for each column & name
                var columnIndexes = {};
                const columns = minerGrid.querySelectorAll('.k-header');
                columns.forEach((column, index) => {
                    const title = column.getAttribute('data-title');
                    columnIndexes[title] = index;
                });

                const rows = minerGrid.querySelectorAll('tr.k-master-row');
                rows.forEach(row => {
                    const uid = row.getAttribute('data-uid');

                    // Loop through columnIndexes and get the data for each column
                    for (const [key, colIndex] of Object.entries(columnIndexes)) {
                        let minerLinkElement = minerGrid.querySelector(`[data-uid="${uid}"] .menu-wrapper`);
                        let colRowElement = row.querySelector('td[role="gridcell"]:nth-child(' + (parseInt(colIndex+1)) + ')');
                        if (minerLinkElement && colRowElement) {
                            // Store the data in the minersListTableLookup
                            let minerID = minerLinkElement.getAttribute('data-miner-id');
                            minersListTableLookup[minerID] = minersListTableLookup[minerID] || {};
                            minersListTableLookup[minerID][key] = colRowElement;
                        }
                    }
                });
            }
        }
        
        // Wait until HTML element with #minerList is loaded
        const minerListCheck = setInterval(() => {
            const minerList = document.querySelector('#minerList');
            if (minerList) {
                clearInterval(minerListCheck);

                // Add mutation observer to the minerList
                const observer = new MutationObserver(() => {
                    getCurrentMinerList();

                    // Loop through all the Slot ID elements and add the Breaker Number
                    for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                        const slotID = minerData['Slot ID'].textContent;
                        var splitSlotID = slotID.split('-');
                        var row = Number(splitSlotID[2]);
                        var col = Number(splitSlotID[3]);
                        var rowWidth = 4;
                        var breakerNum = (row-1)*rowWidth + col;

                        // if breakerNum isn't NAN
                        if (!isNaN(breakerNum)) {
                            var newElement = document.createElement('div');
                            newElement.textContent = 'Breaker Number: ' + breakerNum;
                            minerData['Slot ID'].appendChild(newElement);
                        }
                    }
                });
                observer.observe(minerList, { childList: true, subtree: true });
            }
        }, 500);

        // -- Scan Logic --
        var scanningElement;
        var progressFill;
        var scanningText;
        var scanningInterval;
        var scanTimeFrameText;
        var percentageText;
        var progressLog;

        // Find the issuesActionsDropdown and add a new action
        const interval = setInterval(() => {

            // Make a second Actions button for different scan times
            const actionsDropdown = document.querySelector('.op-dropdown')
            if (actionsDropdown) {
                clearInterval(interval);

                // Create a new dropdown element
                const newActionsDropdown = document.createElement('div');
                newActionsDropdown.classList.add('op-dropdown');
                newActionsDropdown.style.display = 'inline-block';
                newActionsDropdown.innerHTML = `
                    <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('newActionsDropdown'); return false;">
                        Down Scans (WIP)
                        <m-icon name="chevron-down" class="button-caret-down" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                    </button>
                    <div id="newActionsDropdown" class="m-dropdown-menu is-position-right" aria-hidden="true">
                        <div class="m-menu">
                            <div class="m-menu-item" onclick="lastHourScan()">
                                Scan Last Hour
                            </div>
                            <div class="m-menu-item" onclick="last4HourScan()">
                                Scan Last 4 Hours
                            </div>
                            <div class="m-menu-item" onclick="last24HourScan()">
                                Scan Last 24 Hours
                            </div>
                            <div class="m-menu-item" onclick="last7DayScan()">
                                Scan Last 7 Days
                            </div>
                            <div class="m-menu-item" onclick="last30DayScan()">
                                Scan Last 30 Days
                            </div>
                        </div>
                    </div>
                `;

                // Put the new dropdown before the original dropdown
                actionsDropdown.before(newActionsDropdown);

                function startScan(timeFrame) {
                    var minersDownCount = {};

                    // Close the dropdown
                    issues.toggleDropdownMenu('newActionsDropdown');

                    // Create an element to completely cover the page
                    scanningElement = document.createElement('div');
                    scanningElement.style.position = 'fixed';
                    scanningElement.style.top = '0';
                    scanningElement.style.left = '0';
                    scanningElement.style.width = '100%';
                    scanningElement.style.height = '100%';
                    scanningElement.style.backgroundColor = 'rgba(10, 10, 10, 1)';
                    scanningElement.style.color = 'white';
                    scanningElement.style.display = 'flex';
                    scanningElement.style.flexDirection = 'column'; // Added line
                    scanningElement.style.justifyContent = 'center';
                    scanningElement.style.alignItems = 'center';
                    scanningElement.style.fontSize = '2em';
                    scanningElement.style.zIndex = '9999'; // Set the zIndex to be above everything
                    document.body.appendChild(scanningElement);

                    const progressBar = document.createElement('div');
                    progressBar.style.width = '50%';
                    progressBar.style.height = '20px';
                    progressBar.style.backgroundColor = 'gray';
                    progressBar.style.marginTop = '10px';
                    progressBar.style.border = '4px solid black';
                    scanningElement.appendChild(progressBar);

                    progressFill = document.createElement('div');
                    progressFill.style.width = '0%';
                    progressFill.style.height = '100%';
                    progressFill.style.backgroundColor = 'green';
                    progressFill.style.borderRight = '1px solid black'; // Modify border style
                    progressBar.appendChild(progressFill);
                    
                    // Add Scanning text below the progress bar
                    scanningText = document.createElement('div');
                    scanningText.textContent = 'Scanning';
                    scanningText.style.marginTop = '10px';
                    scanningText.style.textAlign = 'left';
                    scanningElement.appendChild(scanningText);

                    // Animate the dots cycling
                    let dots = 0;
                    scanningInterval = setInterval(() => {
                        dots = (dots + 1) % 4;
                        scanningText.textContent = 'Scanning' + '.'.repeat(dots);
                    }, 500);

                    // Add percentage text above the progress bar starting from left side
                    percentageText = document.createElement('div');
                    percentageText.textContent = '';
                    percentageText.style.position = 'absolute';
                    percentageText.style.left = '10px';
                    percentageText.style.top = '10px';
                    percentageText.style.color = 'white';
                    percentageText.style.fontSize = '1em';
                    progressBar.appendChild(percentageText);

                    setInterval(() => {
                        // Calculate the progress percentage
                        var totalMiners = issueMiners.length;
                        var minersScanned = Object.keys(minersDownCount).length;
                        const progressPercentage = (minersScanned / totalMiners) * 100;

                        // Update the progress bar fill and percentage text
                        progressFill.style.width = progressPercentage + '%';
                        percentageText.textContent = Math.floor(progressPercentage) + '%' + ' (' + minersScanned + '/' + totalMiners + ')';
                    }, 50);

                    // Add the progress log on the right side of the screen
                    progressLog = document.createElement('div');
                    progressLog.style.position = 'fixed';
                    progressLog.style.top = '0';
                    progressLog.style.right = '0';
                    progressLog.style.width = '300px';
                    progressLog.style.height = '100%';
                    progressLog.style.backgroundColor = 'rgba(10, 10, 10, 1)';
                    progressLog.style.color = 'white';
                    progressLog.style.fontSize = '1em';
                    progressLog.style.zIndex = '9999'; // Set the zIndex to be above everything
                    progressLog.style.overflow = 'auto';
                    document.body.appendChild(progressLog);

                    // Spin rotation to be used in the loading icon
                    let rotation = 0;

                    // Add a message to the progress log
                    const logMessage = document.createElement('div');
                    logMessage.textContent = 'Progress Log';
                    logMessage.style.padding = '10px';
                    logMessage.style.borderBottom = '1px solid white';
                    progressLog.appendChild(logMessage);
                    var logEntries = {};

                    // Loop through allMinersData and get the uptime
                    var currentMiner = issueMiners[0];
                    var currentMinerIndex = 0;
                    function parseMinerUpTimeData(minerID, timeFrame) {

                        // Add to progress log
                        const logEntry = document.createElement('div');
                        logEntry.textContent = `Miner ${minerID}`;
                        logEntry.style.padding = '10px';
                        logEntry.style.borderBottom = '1px solid white';
                        progressLog.appendChild(logEntry);
                        logEntries[minerID] = logEntry;

                        // Add spinning 'loading' icon into the log entry, such as that it shows up as far right as possible
                        const loadingIcon = document.createElement('span');
                        loadingIcon.textContent = '↻';
                        loadingIcon.style.display = 'none';
                        loadingIcon.style.position = 'absolute';
                        loadingIcon.style.right = '10px';
                        logEntry.appendChild(loadingIcon);

                        // Make it spin
                        loadingIcon.loadingIconInterval = setInterval(() => {
                            rotation = (rotation + 0.5) % 360;
                            loadingIcon.style.transform = `rotate(${rotation}deg)`;
                        }, 1);
                        loadingIcon.style.display = 'inline-block';  // Show the icon

                        // Scroll to the bottom of the progress log
                        progressLog.scrollTop = progressLog.scrollHeight;

                        retrieveMinerUpTime(minerID, timeFrame, function(minerID, minerUptime) {
                            // Remove the spinning 'loading' icon from the log entry
                            let logEntry = logEntries[minerID];
                            if (logEntry) {
                                const loadingIcon = logEntry.querySelector('span');
                                if (loadingIcon) {
                                    clearInterval(loadingIcon.loadingIconInterval);
                                    loadingIcon.remove();
                                }
                            }

                            // Make it a checkmark
                            const checkmark = document.createElement('span');
                            checkmark.textContent = '✓';
                            checkmark.style.display = 'inline-block';
                            checkmark.style.position = 'absolute';
                            checkmark.style.right = '10px';
                            logEntry.appendChild(checkmark);

                            // Loop through the uptime and check for any downtime
                            var minerDownTimes = 0;
                            var previousState = '1';
                            for (const [timestamp, data] of Object.entries(minerUptime)) {
                                var state = data[1];
                                if (state === '0' && previousState === '1') {
                                    minerDownTimes++;
                                }
                                previousState = state;
                            }

                            // Add the miner to the minersDownCount object
                            minersDownCount[minerID] = minerDownTimes;

                            // Run the next miner
                            console.log("currentMinerIndex: " + currentMinerIndex);
                            currentMinerIndex++;
                            if (currentMinerIndex < Object.keys(issueMiners).length) {
                                currentMiner = issueMiners[currentMinerIndex];
                                parseMinerUpTimeData(currentMiner.id, timeFrame);
                            }
                        });
                    }
                    parseMinerUpTimeData(currentMiner.id, timeFrame);

                    const waitTillDone = setInterval(() => {
                        if (Object.keys(minersDownCount).length === Object.keys(issueMiners).length) {
                            clearInterval(waitTillDone);

                            // Remove the scanning element
                            scanningElement.remove();
                            progressLog.remove();
                            clearInterval(scanningInterval);

                            // Create a popup element for showing the results
                            popupResultElement = document.createElement('div');
                            popupResultElement.innerHTML = `
                                <div style="
                                    position: fixed;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    background-color: #333;
                                    color: white;
                                    padding: 20px;
                                    font-family: Arial, sans-serif;
                                    border-radius: 5px;
                                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                                ">
                                    <h1 style="text-align: center; margin-bottom: 20px;">Offline Count List (${scanTimeFrameText})</h1>
                                    <div style="max-height: 400px; overflow-y: auto;">
                                        <table style="width: 100%;">
                                            <thead>
                                                <tr>
                                                    <th style="padding: 10px;">Offline Count</th>
                                                    <th style="padding: 10px;">Miner Link</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>

                                    <button id="closePopup" style="
                                        padding: 10px 20px;
                                        background-color: #555;
                                        color: white;
                                        border: none;
                                        cursor: pointer;
                                        margin-top: 10px;
                                        border-radius: 3px;
                                    ">Close</button>
                                </div>
                            `;

                            const closePopupButton = popupResultElement.querySelector('#closePopup');
                            closePopupButton.onclick = function() {
                                popupResultElement.remove();
                                popupResultElement = null;
                            };

                            document.body.appendChild(popupResultElement);

                            // Order the reboot counts by the count
                            const orderedRebootCounts = Object.entries(minersDownCount).sort((a, b) => b[1] - a[1]);

                            // Loop through the ordered reboot counts and add them to the popup
                            const popupTableBody = popupResultElement.querySelector('tbody');
                            orderedRebootCounts.forEach(([minerID, rebootCount]) => {
                                const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td style="padding: 10px; color: white;">${rebootCount}</td>
                                    <td style="padding: 10px;"><a href="${minerLink}" target="_blank" style="color: white;">Miner: ${minerID}</a></td>
                                `;
                                popupTableBody.appendChild(row);
                            });
                        }
                    }, 500);
                }

                updateAllMinersData();

                // Add the new scan functions
                lastHourScan = function() {
                    startScan(60*60);
                    scanTimeFrameText = 'Last Hour';
                }

                last4HourScan = function() {
                    startScan(60*60*4);
                    scanTimeFrameText = 'Last 4 Hours';
                }

                last24HourScan = function() {
                    startScan(60*60*24);
                    scanTimeFrameText = 'Last 24 Hours';
                }

                last7DayScan = function() {
                    startScan(60*60*24*7);
                    scanTimeFrameText = 'Last 7 Days';
                }

                last30DayScan = function() {
                    startScan(60*60*24*30);
                    scanTimeFrameText = 'Last 30 Days';
                }

                /*
                // Create a auto reboot button to the right of the dropdown
                const autoRebootButton = document.createElement('button');
                autoRebootButton.classList.add('m-button');
                autoRebootButton.style.marginLeft = '10px';
                autoRebootButton.textContent = 'Auto Reboot';
                autoRebootButton.onclick = function(event) {
                    event.preventDefault(); // Prevent the default behavior of the button
                };

                // Add the auto reboot button to the right of the dropdown
                actionsDropdown.before(autoRebootButton);
                */
                
            }
            
        }, 1000);
    } else if(currentUrl.includes("https://foundryoptifleet.com/Content/Miners/IndividualMiner")) {
        
        function addDataBox(title, data, updateFunc, updateInterval) {
            // Add new m-box to m-grid-list
            const mGridList = document.querySelector('.m-grid-list');
            const mBox = document.createElement('div');
            mBox.classList.add('m-box');
            mGridList.appendChild(mBox);

            // Add new m-stack to m-box
            const mStack = document.createElement('div');
            mStack.classList.add('m-stack');
            mStack.classList.add('has-space-s');
            mBox.appendChild(mStack);

            // Add new h3 to m-stack
            const h3 = document.createElement('h3');
            h3.classList.add('m-heading');
            h3.classList.add('is-muted');
            h3.textContent = title;
            mStack.appendChild(h3);

            // Add new p to m-stack
            const p = document.createElement('p');
            p.classList.add('m-code');
            p.classList.add('is-size-xl');
            p.textContent = data;
            mStack.appendChild(p);

            // Run the update function if it exists
            if (updateFunc) {
                updateFunc(mBox, h3, p);
                if (updateInterval) {
                    setInterval(() => {
                        updateFunc(mBox, h3, p);
                    }, updateInterval);
                }
            }

            // Return the m-box element
            return mBox;
        }
        
        const minerID = currentUrl.match(/id=(\d+)/)[1];
        function parsePathData(d) {
            const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g);
            let currentY = 0;
            let topY = Number.POSITIVE_INFINITY;
            let bottomY = Number.NEGATIVE_INFINITY;
            let downCounts = 0;
            let upCounts = 0;
            let lastY;
        
            commands.forEach(command => {
                const type = command[0];
                const values = command.slice(1).trim().split(/[\s,]+/).map(Number);
                switch (type) {
                    case 'M':
                    case 'L':
                        currentY = values[1];
                        break;
                    case 'C':
                        currentY = values[5];
                        break;
                }

                if(currentY !== lastY) {
                    if(currentY > 0) { // Height changes, anything above 0 should always been it is down, since it is a binary on/off and I know 0 has to be on.
                        downCounts++;
                    }
                    if(currentY === 0) {
                        upCounts++;
                    }
                }
                lastY = currentY;
            });
        
            return { downCounts, upCounts };
        }

        function getGraphData(chart) {
            const path = chart.querySelector('[id^="SvgjsPath"]');
            const d = path.getAttribute('d');
            return parsePathData(d);
        }
        
        function createChartDataBox(chartID, title, callback) {
            const chart = document.querySelector(chartID);
            if (!chart) {
                setTimeout(() => {
                    createChartDataBox(chartID, title, callback);
                }, 500);
                return;
            }
            var lastChartd = '';
            var downCountBox;
            const observer = new MutationObserver(() => {
                const path = chart.querySelector('[id^="SvgjsPath"]');
                if (path) {
                    const d = path.getAttribute('d');

                    // Check if the d attribute has changed
                    if (d === lastChartd) {
                        return;
                    }
                    lastChartd = d;
                    const result = getGraphData(chart);

                    // Check if reportRange.textContent changes
                    const reportRange = document.getElementById('reportrange');
                    const timeSpan = reportRange.textContent.trim();

                    // Find the existing data box
                    if (downCountBox) {
                        // Update the range in the box
                        const h3 = downCountBox.querySelector('h3');
                        if (h3) {
                            h3.textContent = `${title} (${timeSpan})`;
                        }

                        // Update the down times count
                        const p = downCountBox.querySelector('p');
                        if (p) {
                            p.textContent = result.downCounts;
                        }
                    } else {
                        // Add the new data box to the page
                        downCountBox = addDataBox(`${title} (${timeSpan})`, result.downCounts);
                    }

                    if(callback && typeof callback === 'function') {
                        callback(result, timeSpan);
                    }

                    
                }
            });
            
            observer.observe(chart, {
                childList: true,
                subtree: true
            });
        }

        createChartDataBox('#uptimeChart', 'Times Down', (result, timeSpan) => {
        });
        
        
        // Wait for the miner activity list to exist and be fully loaded
        const waitForMinerActivityList = setInterval(() => {
            const minerActivityList = document.getElementById('miner-activity-list-IndividualMiner');
            const activityRows = minerActivityList.querySelectorAll('.m-table-row');
            const noActivityElement = document.querySelector('.no-activity-section.active');
            const errorCount = GM_SuperValue.get("errorCount", 0);
            const pastMaxErrors = errorCount > 3;
            if (minerActivityList && (activityRows && activityRows.length > 0) || noActivityElement || pastMaxErrors) {

                clearInterval(waitForMinerActivityList);

                var lastRebootTime;
                const reboots = [];
                if(!pastMaxErrors) {
                    // Loop through the activity list and find the reboots
                    activityRows.forEach(row => {
                        const cell = row.querySelector('.m-table-cell');
                        if (cell.textContent.includes('reboot initiated')) {
                            reboots.push(cell.textContent);

                            if(!lastRebootTime) {
                                const time = cell.textContent.match(/(\d{1,2}:\d{1,2}:\d{1,2} [AP]M)/);
                                const date = cell.textContent.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
                                lastRebootTime = new Date(date[0] + ' ' + time[0]);
                            }
                        }
                    });
                } else {
                    //'Error';
                }
        
                // Add the reboot count to the page
                addDataBox('Reboot Count (Activity Log)', reboots.length);

                // Time since last reboot
                if(lastRebootTime) {
                    const timeSinceReboot = Date.now() - lastRebootTime;
                    const timeSinceRebootElement = addDataBox('Time Since Last Reboot (Activity Log)', timeSinceReboot, (mBox, h3, p) => {
                        let timeSinceReboot = Date.now() - lastRebootTime;
                        const days = Math.floor(timeSinceReboot / (1000 * 60 * 60 * 24));
                        timeSinceReboot = new Date(timeSinceReboot).toISOString().substr(11, 8);
                        if (days > 0) {
                            timeSinceReboot = days + 'd ' + timeSinceReboot;
                        }
                        p.textContent = timeSinceReboot;
                    }, 1000);
                }
                    

            }
        }, 500);

        function createBreakerNumBox() {
            
            // Check if the details were loaded
            var detailsLoadedInterval = setInterval(() => {
                var [cleanedText, minerDetails] = getMinerDetails();
                var locationID = minerDetails['locationID']; // Rack-Row-Col
                var splitLocationID = locationID.split('-');
                console.log(splitLocationID);
                var row = Number(splitLocationID[1]);
                var col = Number(splitLocationID[2]);
                var rowWidth = 4;
                var breakerNum = (row-1)*rowWidth + col;
                if (row > 0 && col > 0) {
                    clearInterval(detailsLoadedInterval);
                    addDataBox("Breaker Number", breakerNum);
                }
            }, 500);
        }
        createBreakerNumBox();
    }

}

// Only run on the OptiFleet website
if(currentUrl.includes("https://foundryoptifleet.com")) {

    OptiFleetSpecificLogic();

    /*
    // Find navMinerMap, and inject a button below it called Test Bench
    const navMinerMap = document.getElementById('navMinerMap');

    const createTestBenchButton = (name, icon, onClick) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.marginTop = '8px';
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.innerHTML = `
            <img src="${icon}" style="width: 24px; height: 24px; margin-right: 8px;">
            <span style="color: white;">${name}</span>
        `;
        button.addEventListener('click', onClick);
        return button;
    };

    // Add <div class="m-divider has-space-m"></div> to separate the buttons
    const divider = document.createElement('div');
    divider.className = 'm-divider has-space-m';
    navMinerMap.after(divider);

    const testBench1 = createTestBenchButton('Test Bench 1', 'https://cdn.discordapp.com/attachments/940214867778998283/1282276373389508608/pngtree-project-management-line-icon-vector-png-image_6738629.png?ex=66dec46e&is=66dd72ee&hm=c3724d9388e5102ad183a0a16b5ce43ce9e9247fb6f5d6d53d4eede483592d4e&', () => {
        // Code for Test Bench 1
    });
    divider.after(testBench1);

    const testBench2 = createTestBenchButton('Test Bench 2', 'https://cdn.discordapp.com/attachments/940214867778998283/1282276373389508608/pngtree-project-management-line-icon-vector-png-image_6738629.png?ex=66dec46e&is=66dd72ee&hm=c3724d9388e5102ad183a0a16b5ce43ce9e9247fb6f5d6d53d4eede483592d4e&', () => {
        // Code for Test Bench 2
    });
    testBench1.after(testBench2);
    */

    // Hacky workaround for OptiFleet stuff
    
    
}

console.log("Is loading script...");
console.log(currentUrl);

if (currentUrl.includes("foundrydigitalllc.sharepoint.com/") ) {
    // If there is a taskName/Notes in storage, then create a overlay on the right side of the page that says Go to Planner
    const taskName = GM_SuperValue.get("taskName", "");
    const detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));

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
            <p>Model: ${detailsData['model']}</p>
            <p>Serial Number: ${detailsData['serialNumber']}</p>
            <p>Slot ID: ${detailsData['facility']}-${detailsData['locationID']}</p>
            <button style="background-color: green; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            <a href="${plannerUrl}" style="color: #fff; text-decoration: none;">Go to Planner</a>
            </button>
            <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
            Cancel
            </button>
        `;
        // Make sure it is always layered on top
        overlay.style.zIndex = '9999';
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

} else if (currentUrl.includes("planner.cloud.microsoft/foundrydigital.com/Home/Planner/")) {

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

    const detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));
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

                    // Locate the new element with the inputted text
                    setTimeout(() => {
                        const newElement = document.querySelector(`[aria-label="${taskName}"]`);
                        if (newElement) {
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

                                    // Now lets add the comment to the task for the log
                                    const commentField = document.querySelector('textarea[aria-label="New comment"]');
                                    if (commentField) {
                                        commentField.click();
                                        commentField.focus();
                                        document.execCommand('insertText', false, GM_SuperValue.get("taskComment", ""));
                                    }

                                    // Now find the send button and click it
                                    const sendButton = document.querySelector('.sendCommentButton');
                                    if (sendButton) {
                                        sendButton.click();

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
        const headers = document.querySelectorAll('.columnTitle');

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
            <p>Model: ${detailsData['model']}</p>
            <p>Serial Number: ${detailsData['serialNumber']}</p>
            <p>Slot ID: ${detailsData['facility']}-${detailsData['locationID']}</p>
            <button id="autoCreateCardButton" style="background-color: green; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            Auto-Create Card
            </button>
            <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
            Cancel
            </button>
        `;

        // Make sure it is always layered on top
        popup.style.zIndex = '9999';
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
            GM_SuperValue.set('detailsData', '{}');
            window.close();
        });

    }

    window.addEventListener('load', function () {
        console.log("Window loaded");
        setTimeout(createAutoCreateCardButton, 1000);

        // Find the toast container and remove it
        function removeToastContainer() {
            const toastContainer = document.querySelector('.toast-container');
            if (toastContainer) {
                toastContainer.remove();
            } else {
                setTimeout(removeToastContainer, 100); // Check again after 1 second
            }
        }

        removeToastContainer();
    });
}

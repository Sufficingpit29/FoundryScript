// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @description  Adds various features to the OptiFleet website to add additional functionality.
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/*
// @match        *://tasks.office.com/foundrydigital.com/*
// @match        *://foundrydigitalllc.sharepoint.com/*
// @match        *https://planner.cloud.microsoft/foundrydigital.com/Home/Planner/*
// @match        *://*/*
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
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js
// @require      https://cdn.datatables.net/colreorder/1.6.2/js/dataTables.colReorder.min.js
// @require      https://cdn.datatables.net/responsive/2.4.0/js/dataTables.responsive.min.js
// @require      https://cdn.jsdelivr.net/npm/datatables.net-colresize/js/dataTables.colResize.min.js
// @resource     https://cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css
// @resource     https://cdn.datatables.net/colreorder/1.6.2/css/colReorder.dataTables.min.css
// @resource     https://cdn.datatables.net/responsive/2.4.0/css/responsive.dataTables.min.css
// @resource     https://cdn.jsdelivr.net/npm/datatables.net-colresize@1.1.0/css/dataTables.colResize.min.css
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
    var siteName = pageInstance.getSelectedSiteName();
    var companyId = pageInstance.getSelectedCompanyId();
    var lastSiteId = siteId;
    var lastCompanyId = companyId;
    var lastMinerDataUpdate = 0;
    var reloadCards = false;
    var hasRefreshed = false;

    function retrieveIssueMiners(callback) {
        // In case we swap company/site (Not actually sure if it matters for site, but might as well)
        serviceInstance = new OptiFleetService();
        pageInstance = new OptiFleetPage();

        __awaiter(serviceInstance, void 0, void 0, function* () {
            siteId = pageInstance.getSelectedSiteId();
            siteName = pageInstance.getSelectedSiteName();
            serviceInstance.get(`/Issues?siteId=${siteId}&zoneId=-1`).then(res => {
                res.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");
                if (callback) {
                    callback(res.miners);
                }
            });
        });
    }
    retrieveIssueMiners();

    function retrieveMinerData(type, minerID, timeFrame, callback) {
        var params = {
            start: Math.floor(((new Date()).getTime() / 1000) - timeFrame),
            end: Math.floor((new Date()).getTime() / 1000),
            step: 300
        };

        serviceInstance.post("/"+type, Object.assign({ id: minerID }, params)).then((res) => {
            // Sanitize the data to only include the uptime values
            var retrievedData = res['data']['result'][0]['values']

            // Call the callback function for the uptime data
            if (callback) {
                callback(minerID, retrievedData);
            }
        });
    }

    function updateAllMinersData(keepTrying = false, callback) {
        
        console.log("Updating all miners data");
        // Reset allMinersLookup
        const lastMinersLookup = allMinersLookup;
        allMinersLookup = {};

        // Get the current site and company ID
        lastSiteId = siteId;
        lastCompanyId = companyId;

        serviceInstance = new OptiFleetService();
        pageInstance = new OptiFleetPage();
        viewServiceInstance = new MinerViewService();
        siteId = pageInstance.getSelectedSiteId();
        siteName = pageInstance.getSelectedSiteName();
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

            // Call the callback function if it exists
            if (callback) {
                callback(miners.miners);
            }
        }).catch(function(error) {
            console.error("Error fetching miners data:", error);
        });
    }
    updateAllMinersData();

    function retrieveContainerTempData(callback) {
        pageInstance.get(`/sensors?siteId=${siteId}`)
            .then((resp) => __awaiter(this, void 0, void 0, function* () {
            const sensors = resp.sensors;

            // Loop through all the sensors and get the average for each container
            /*
            {
                "sensorId": 666,
                "sensorName": "Container 1 Rack 12-13",
                "facility": "Minden_C01",
                "lastSample": "2024-09-20T03:03:22Z",
                "temp": 69.23,
                "humidity": 50.85,
                "voltage": 3.01,
                "isOnline": false
            }*/
            var containerTempData = {};
            for (const [index, sensor] of Object.entries(sensors)) {
                var containerName = sensor.sensorName.split(' ')[1];
                containerTempData[containerName] = containerTempData[containerName] || {
                    "temp": 0,
                    "count": 0
                };

                containerTempData[containerName].temp += sensor.temp;
                containerTempData[containerName].count++;
            }

            // Loop through the containerTempData and get the average for each container
            for (const [containerName, data] of Object.entries(containerTempData)) {
                containerTempData[containerName].temp = data.temp / data.count;
            }

            // Call the callback function for the container data
            if (callback) {
                callback(containerTempData);
            }
        }));
    }

    setInterval(function() {
        // Constantly checks if there siteId or companyId changes
        pageInstance = new OptiFleetPage();
        if(pageInstance.getSelectedSiteId() !== siteId || pageInstance.getSelectedCompanyId() !== companyId) {
            //updateAllMinersData(true);
            console.log("Site ID or Company ID has changed.");

            // Reload the page (Just far easier than trying to update the data and handle all the edge cases)
            window.location.reload();
        }
    }, 500);

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

                if (!container.querySelector('.sharepointPasteBtn') && siteName.includes("Minden")) {
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

            var minerGrid = baseDocument.querySelector('#minerList');
            if (!minerGrid) {
                minerGrid = baseDocument.querySelector('#minerGrid');
            }

            if (minerGrid) {
                // Loop through all the columns and store the index for each column & name
                var columnIndexes = {};
                const columns = minerGrid.querySelectorAll('.k-header');
                columns.forEach((column, index) => {
                    // Get the title of the column, and store the index
                    const title = column.getAttribute('data-title');
                    columnIndexes[title] = index;
                });

                const rows = minerGrid.querySelectorAll('tr.k-master-row');
                rows.forEach(row => {

                    const uid = row.getAttribute('data-uid');
                    let minerLinkElement = minerGrid.querySelector(`[data-uid="${uid}"] .menu-wrapper`);
                    
                    // for first index add a link icon element that opens the miner page
                    if(minerLinkElement && !minerLinkElement.addedLinkIcon) {
                        minerLinkElement.addedLinkIcon = true;
                        const linkIcon = document.createElement('a');
                        linkIcon.href = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerLinkElement.getAttribute('data-miner-id')}`;
                        linkIcon.target = '_blank';
                        linkIcon.style.cursor = 'pointer';
                        linkIcon.style.marginRight = '5px';
                        linkIcon.style.width = '24px';
                        linkIcon.style.height = '24px';
                        linkIcon.style.verticalAlign = 'middle';
                        linkIcon.oncontextmenu = function(event) {
                            event.stopPropagation(); // Prevent the custom context menu from opening
                        };
                        linkIcon.onclick = function(event) {
                            event.stopPropagation(); // Prevent the custom context menu from opening
                        };

                        const img = document.createElement('img');
                        img.src = 'https://img.icons8.com/?size=100&id=82787&format=png&color=FFFFFF';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        linkIcon.appendChild(img);

                        minerLinkElement.prepend(linkIcon);

                        // Delete the default 3 dots icon
                        const defaultIcon = minerLinkElement.querySelector('m-icon[name="more-vertical"]');
                        if (defaultIcon) {
                            defaultIcon.style.display = 'none';
                        }

                        row.addEventListener('contextmenu', (event) => {
                            event.preventDefault();
                            defaultIcon.click();

                            // Find the context menu (id issueMenu) and move it to the mouse position
                            const contextMenu = document.getElementById('issueMenu');
                            if (contextMenu) {
                                contextMenu.style.position = 'fixed';
                                contextMenu.style.top = event.clientY + 'px';
                                contextMenu.style.left = event.clientX + 'px';
                            }
                        });
                    }

                    // Loop through columnIndexes and get the data for each column
                    for (const [key, colIndex] of Object.entries(columnIndexes)) {
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
        function addBreakerNumberToSlotID() {
            const minerListCheck = setInterval(() => {
                const minerList = document.querySelector('#minerList');
                if (minerList) {
                    clearInterval(minerListCheck);

                    // Add mutation observer to the minerList
                    const observer = new MutationObserver(() => {
                        getCurrentMinerList();

                        // Loop through all the Slot ID elements and add the Breaker Number and Container Temp
                        for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                            const slotID = minerData['Slot ID'].textContent;

                            // Check if slotID has minden in it
                            if (!slotID.includes('Minden')) {
                                continue;
                            }

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

                        // Container Temp
                        retrieveContainerTempData((containerTempData) => {
                            for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                                const slotID = minerData['Slot ID'].textContent;
                                var containerText = slotID.split("_")[1].split("-")[0].replace(/\D/g, '');
                                var containerNum = containerText.replace(/^0+/, '');
    
                                // Check if slotID has minden in it
                                if (!slotID.includes('Minden')) {
                                    continue;
                                }
    
                                const containerTemp = containerTempData[containerNum].temp.toFixed(2);
                                const curTextContent = minerData['Temp.'].textContent; 
                                if (containerTemp && !curTextContent.includes('C')) { // doesn't contain added text already
                                    minerData['Temp.'].textContent = "Boards: " + minerData['Temp.'].textContent;

                                    var newElement = document.createElement('div');
                                    newElement.innerHTML = `C${containerText}: <span>${containerTemp}</span>`;
                                    minerData['Temp.'].appendChild(newElement);

                                    // Set the text color of the temp based on the container temp
                                    const tempSpan = newElement.querySelector('span');
                                    if (containerTemp > 80) {
                                        tempSpan.style.color = 'red';
                                    } else if (containerTemp > 70) {
                                        tempSpan.style.color = 'yellow';
                                    } else {
                                        tempSpan.style.color = 'white';
                                    }
                                }
                            }
                        });  
                    });
                    observer.observe(minerList, { childList: true, subtree: true });
                }
            }, 500);
        }
        addBreakerNumberToSlotID();

        // -- Scan Logic --
        var scanTimeFrameText;

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
                        Down Scans
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

                function createPopUpTable(title, cols, parent, callback) {
                    let popupResultElement = document.createElement('div');
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
                            width: 80%;
                            height: 80%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            z-index: 9999;
                        ">
                            <h1 style="text-align: center; margin-bottom: 20px;">${title}</h1>
                            <div id="minerTableDiv"; style="flex: 1; width: 100%; max-height: 80%; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #555 #333;">
                                <table id="minerTable"; style="width: 100%; color: white;" class="display responsive nowrap">
                                    <thead>
                                        <tr>
                                            ${cols.map(col => `<th style="border: 2px solid gray; padding: 10px;">${col}</th>`).join('')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;

                    // Ensure this popup is on top of everything
                    popupResultElement.style.zIndex = '9999';

                    // Append popup to the body first, then assign the event listeners
                    if (parent) {
                        parent.appendChild(popupResultElement);
                    } else {
                        document.body.appendChild(popupResultElement);
                    }

                    // Add additional styling for the table using CSS
                    const tableStyle = document.createElement('style');
                    tableStyle.textContent = `
                        #minerTable {
                            border-collapse: collapse;
                            margin-top: 20px;
                        }

                        #minerTable th,
                        #minerTable td {
                            border: 1px solid gray;
                            padding: 10px;
                        }

                        #minerTable th {
                            background-color: #444;
                            color: white;
                        }

                        #minerTable td {
                            text-align: center;
                            transition: background-color 0.2s ease;
                        }

                        #minerTable tr:hover td {
                            background-color: #555;
                        }

                        #minerTable th:hover {
                            cursor: pointer; /* indicates that the column can be reordered */
                        }

                        // When hovering between columns, show the resize cursor
                        #minerTable th.ui-resizable-column:hover {
                            cursor: col-resize;
                        }
                    `;
                    document.head.appendChild(tableStyle);

                    if (callback) {
                        callback(popupResultElement);
                    }
                }

                var orginalTitle = document.title;
                function startScan(timeFrame, autoreboot, stage) {
                    var rebootData = {};

                    // Get saved last reboot times
                    var lastRebootTimes = GM_SuperValue.get('lastRebootTimes', {});
                    var reachedScanEnd = false;

                    function getTotalRebootCount() {
                        var rebootCount = 0;
                        for (const [minerID, rebootData] of Object.entries(lastRebootTimes)) {
                            var softRebootTimes = rebootData.softRebootsTimes || [];
                            var lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                            var timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                            if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 15*60*1000) {
                                rebootCount++;
                            }
                        }
                        return rebootCount;
                    }

                    // Close the dropdown
                    issues.toggleDropdownMenu('newActionsDropdown');

                    // Create an element to completely cover the page
                    var scanningElement = document.createElement('div');
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
                    scanningElement.style.zIndex = '9998'; // Set the zIndex to be above everything
                    document.body.appendChild(scanningElement);

                    const progressBar = document.createElement('div');
                    progressBar.style.width = '50%';
                    progressBar.style.height = '20px';
                    progressBar.style.backgroundColor = 'gray';
                    progressBar.style.marginTop = '10px';
                    progressBar.style.border = '4px solid black';
                    scanningElement.appendChild(progressBar);

                    var progressFill = document.createElement('div');
                    progressFill.style.width = '0%';
                    progressFill.style.height = '100%';
                    progressFill.style.backgroundColor = 'green';
                    progressFill.style.borderRight = '1px solid black'; // Modify border style
                    progressBar.appendChild(progressFill);

                    // Add Scanning text below the progress bar
                    var scanningText = document.createElement('div');
                    scanningText.textContent = 'Getting Miner Data...';
                    scanningText.style.marginTop = '10px';
                    scanningText.style.textAlign = 'left';
                    scanningElement.appendChild(scanningText);

                    // Set the webpage title
                    document.title = orginalTitle + ' | Retrieving Miner Data...';
                    retrieveContainerTempData((containerTempData) => {
                        retrieveIssueMiners((issueMiners) => {
                            var issueMinersLookup = {};
                            for (const miner of issueMiners) {
                                issueMinersLookup[miner.id] = miner;
                            }

                            // If we are in auto reboot mode, remove any miner that isn't completely non-hashing
                            if (autoreboot) {
                                issueMiners = issueMiners.filter(miner => miner.currentHashRate === 0 || miner.issueType === 'Non Hashing');
                            }

                            var minersScanData = {};
                            var maxRebootAllowed = 100;

                            // Animate the dots cycling
                            let dots = 0;
                            var scanningInterval = setInterval(() => {
                                dots = (dots + 1) % 4;
                                scanningText.textContent = 'Scanning' + '.'.repeat(dots);
                            }, 500);

                            // Add percentage text to top left of the screen
                            var percentageText = document.createElement('div');
                            percentageText.textContent = '';
                            percentageText.style.position = 'absolute';
                            percentageText.style.left = '10px';
                            percentageText.style.top = '10px';
                            percentageText.style.color = 'white';
                            percentageText.style.fontSize = '1em';
                            scanningElement.appendChild(percentageText);

                            var currentMiner = issueMiners[0];
                            var currentMinerIndex = 0;
                            var updatePercentageTextInteval = setInterval(() => {
                                // Calculate the progress percentage
                                var totalMiners = issueMiners.length;
                                var minersScanned = currentMinerIndex;
                                const progressPercentage = (minersScanned / totalMiners) * 100;

                                // Update the progress bar fill and percentage text
                                progressFill.style.width = progressPercentage + '%';
                                percentageText.textContent = Math.floor(progressPercentage) + '%' + ' (' + minersScanned + '/' + totalMiners + ')';

                                // Update the title
                                document.title = orginalTitle + ' | ' + percentageText.textContent;

                                if (reachedScanEnd) {
                                    clearInterval(updatePercentageTextInteval);
                                }
                            }, 50);

                            // Add the progress log on the right side of the screen
                            var progressLog = document.createElement('div');
                            progressLog.style.position = 'fixed';
                            progressLog.style.top = '0';
                            progressLog.style.right = '0';
                            progressLog.style.width = '300px';
                            progressLog.style.height = '100%';
                            progressLog.style.backgroundColor = 'rgba(10, 10, 10, 1)';
                            progressLog.style.color = 'white';
                            progressLog.style.fontSize = '1em';
                            progressLog.style.zIndex = '9998'; // Set the zIndex to be above everything
                            progressLog.style.overflow = 'auto';
                            document.body.appendChild(progressLog);

                            // Spin rotation to be used in the loading icon
                            let rotation = 0;

                            // Add a message to the progress log
                            const logMessage = document.createElement('div');
                            logMessage.textContent = 'Progress Log';
                            logMessage.style.padding = '10px';
                            logMessage.style.borderTop = '1px solid white';
                            progressLog.appendChild(logMessage);
                            var logEntries = {};

                            // Loop through allMinersData and get the uptime
                            var firstScan = true;
                            function parseMinerUpTimeData(minerID, timeFrame) {

                                // Add to progress log
                                const logEntry = document.createElement('div');
                                const logLink = document.createElement('a');
                                const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                const minerModel = currentMiner.modelName;
                                logLink.textContent = `Miner ${minerModel}`;
                                logLink.href = minerLink; // Make it clickable
                                logLink.target = '_blank'; // Open in a new tab
                                logLink.style.color = 'inherit'; // To keep the link color same as text color
                                //logLink.style.textDecoration = 'none'; // To remove underline from the link

                                logEntry.style.borderTop = '1px solid white';
                                logEntry.style.padding = '10px';
                                logEntry.appendChild(logLink);

                                logEntries[minerID] = logEntry;
                                progressLog.appendChild(logEntry);

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

                                // Add location to the log entry
                                const minerSlotID = currentMiner.locationName;
                                const locationLog = document.createElement('div');
                                locationLog.textContent = `${minerSlotID}`;
                                locationLog.style.padding = '10px';
                                locationLog.style.paddingTop = '0';
                                locationLog.style.paddingLeft = '0px';
                                logEntry.appendChild(locationLog);

                                // Scroll to the bottom of the progress log
                                progressLog.scrollTop = progressLog.scrollHeight;

                                function checkMiner(minerID) {
                                    var location = currentMiner.locationName;
                                    if(!location || location === "Unassigned") {
                                        console.error("No location for miner: " + minerID);
                                        rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                        rebootData[currentMiner.id].details = {};
                                        rebootData[currentMiner.id].details.main = "Missing Location";
                                        rebootData[currentMiner.id].details.sub = [];
                                        rebootData[currentMiner.id].details.sub.push("Miner is unassigned.");
                                        rebootData[currentMiner.id].details.color = 'red';
                                        return;
                                    }

                                    var min15 = 15*60;
                                    var minSoftRebootUpTime = 60*60; // 1 hour
                                    var upTime = currentMiner.uptimeValue;
                                    var container = location.split("_")[1].split("-")[0].replace(/\D/g, '').replace(/^0+/, '');
                                    var maxTemp = 78;
                                    var containerTemp = containerTempData[container].temp;

                                    var isOnline = currentMiner.connectivity === 'Online';
                                    var moreThanOneHour = upTime > minSoftRebootUpTime;
                                    var belowMaxTemp = containerTemp <= maxTemp;

                                    var minerRebootTimesData = lastRebootTimes[minerID] || {};
                                    var softRebootTimes = minerRebootTimesData.softRebootsTimes || [];
                                    var lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                                    var timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                                    
                                    if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 60*60*1000) { // Mainly if the page was reloaded or something and another scan was started before the miner uptime data could change so it still thinks it hasn't been rebooted IE the uptime hasn't changed
                                        moreThanOneHour = false;
                                    }

                                    rebootData[minerID] = rebootData[minerID] || {};
                                    rebootData[minerID].belowMaxTemp = belowMaxTemp;
                                    rebootData[minerID].moreThanOneHour = moreThanOneHour;
                                    rebootData[minerID].isOnline = isOnline;
                                    rebootData[minerID].details = [];

                                    function formatUptime(uptime) {
                                        var minutes = Math.floor(uptime % (60*60) / 60);
                                        var seconds = Math.floor(uptime % 60);

                                        return `${minutes}m ${seconds}s`;
                                    }

                                    if(isOnline) {
                                        if(moreThanOneHour && belowMaxTemp) { // If the miner passed the conditions, then we can reboot it

                                            // Loop through lastRebootTimes, and get the last reboot time for each miner, if it has been less than 15 minutes, we will count that as activly rebooting
                                            var rebootCount = getTotalRebootCount();

                                            if(rebootCount < maxRebootAllowed) {
                                                // Reboot the miner
                                                var minerIdList = [minerID];
                                                
                                                rebootData[minerID].details.main = "Sent Soft Reboot";
                                                rebootData[minerID].details.sub = [
                                                    "Miner has been online for more than 1 hour.",
                                                    "Miner is below 78°F."
                                                ];

                                                // Update the lastRebootTimes
                                                lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                                lastRebootTimes[minerID].upTimeAtReboot = upTime;
                                                lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                                lastRebootTimes[minerID].softRebootsTimes.push(new Date().toISOString());

                                                // Actually send the reboot request
                                                pageInstance.post(`/RebootMiners`, { miners: minerIdList, bypassed: false })
                                                    .then(() => {
                                                        console.log("Rebooted Miner: " + minerID);
                                                });
                                            } else {
                                                rebootData[minerID].details.main = "Max Reboot Limit Reached";
                                                rebootData[minerID].details.sub = [
                                                    "Miner has been online for more than 1 hour.",
                                                    "Miner is below 78°F.",
                                                    "Max Reboot Limit of " + maxRebootAllowed + " reached.",
                                                    "15 minutes needs to pass before another reboot can be sent."
                                                ];
                                            }
                                        } else {
                                            if(timeSinceLastSoftReboot && timeSinceLastSoftReboot <= min15*1000) {
                                                rebootData[minerID].details.main = "Waiting on Soft Reboot Result";
                                                rebootData[minerID].details.sub = [];
                                                rebootData[minerID].details.color = 'yellow';
                                                const formattedTime = new Date(lastSoftRebootTime).toLocaleTimeString();
                                                rebootData[minerID].details.sub.push("Soft Reboot sent at: " + formattedTime);
                                                var timeLeft = (min15*1000 - timeSinceLastSoftReboot)/1000;
                                                rebootData[minerID].details.sub.push("Time Left: " + formatUptime(timeLeft));
                                            } else {
                                                rebootData[minerID].details.main = "Soft Reboot Skipped";
                                                rebootData[minerID].details.sub = [];
                                                if(!moreThanOneHour) {
                                                    rebootData[minerID].details.sub.push("Miner has not been online for more than 1 hour.");
                                                    rebootData[minerID].details.sub.push("Current Uptime: " + formatUptime(upTime));
                                                }
                                            }
                                        }
                                    }
                                
                                    // If the miner has a lastRebootTime and it is at or more than 15 minutes and still has a 0 hash rate, then we can flag it to be hard rebooted, or if the miner last uptime is the same as the current uptime
                                    var minTime = 15*60*1000; // 15 minutes
                                    var forgetTime = 2*60*60*1000; // 2 hours

                                    var isPastMinTime = timeSinceLastSoftReboot >= minTime;
                                    var notPastForgetTime = timeSinceLastSoftReboot < forgetTime;

                                    // Loops through the softRebootsTimes and remove any that are more than 6 hours old
                                    lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                    lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                    lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes.filter((time) => {
                                        return (new Date() - new Date(time)) < 6*60*60*1000;
                                    });

                                    var numOfSoftReboots = lastRebootTimes[minerID].softRebootsTimes.length;
                                    var moreThan3SoftReboots = numOfSoftReboots >= 3;

                                    // Check if the miner is at 0 uptime and is online, if so that might indicate it is stuck, but we only do it if the normal soft reboot conditions have gone through and is now skipping
                                    var stuckAtZero = upTime === 0 && isOnline && rebootData[minerID].details.main === "Soft Reboot Skipped";

                                    var hardRebootAttemptedTime = lastRebootTimes[minerID].hardRebootAttempted || false;
                                    var timeSinceHardRebootAttempted = hardRebootAttemptedTime ? (new Date() - new Date(hardRebootAttemptedTime)) : false;
                                    var hardRebootAttempted = (timeSinceHardRebootAttempted && timeSinceHardRebootAttempted < 6*60*60*1000) || hardRebootAttemptedTime === true;

                                    var hardRebootRecommended = lastRebootTimes[minerID].hardRebootRecommended || false;
                                    var timeSinceHardRebootRecommended = hardRebootRecommended ? (new Date() - new Date(hardRebootRecommended)) : false;
                                    var hardRebootRecommended = timeSinceHardRebootRecommended && timeSinceHardRebootRecommended < 6*60*60*1000; // 6 hours
                                    
                                    if( !hardRebootAttempted && ((isPastMinTime && notPastForgetTime) || moreThan3SoftReboots || !isOnline || stuckAtZero || hardRebootRecommended)) {
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};

                                        rebootData[minerID].details.main = "Hard Reboot Recommended";
                                        rebootData[minerID].details.sub = [];
                                        rebootData[minerID].details.color = 'orange';
                                        if(isPastMinTime && notPastForgetTime) {
                                            rebootData[minerID].details.sub.push("15 Minutes has passed since last soft reboot and miner is still not hashing.");
                                        }

                                        if(moreThan3SoftReboots) {
                                            rebootData[minerID].details.sub.push(`${numOfSoftReboots} Soft Reboots sent from this computer in the last 6 hours`);
                                        }

                                        if(!isOnline) {
                                            rebootData[minerID].details.sub.push("Miner is offline.");
                                        } else if(stuckAtZero) {
                                            rebootData[minerID].details.sub.push("Miner might be stuck at 0 uptime? This is not a perfect rigorous check.");
                                        }

                                        // Save that a hard reboot was recommended
                                        lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                    } else if(hardRebootAttempted) {

                                        if(timeSinceHardRebootAttempted >= min15*1000 || hardRebootAttemptedTime === true) {
                                            rebootData[minerID].details.main = "Pull Recommended";
                                            rebootData[minerID].details.sub = [];
                                            if(hardRebootAttemptedTime === true) {
                                                rebootData[minerID].details.sub.push("Manually set should pull.");
                                            } else {
                                                rebootData[minerID].details.sub.push("15 Minutes has passed since hard reboot attempt.");
                                            }
                                            rebootData[minerID].details.color = 'red';
                                        } else {
                                            rebootData[minerID].details.main = "Waiting on Hard Reboot Result";
                                            rebootData[minerID].details.sub = [];
                                            rebootData[minerID].details.color = 'yellow';
                                            const formattedTime = new Date(hardRebootAttemptedTime).toLocaleTimeString();
                                            rebootData[minerID].details.sub.push("15 Minutes has not passed since hard reboot mark time.");
                                            rebootData[minerID].details.sub.push("Hard Reboot Marked at: " + formattedTime);
                                            var timeSinceSent = new Date() - new Date(hardRebootAttemptedTime);
                                            var timeLeft = (min15*1000 - timeSinceSent)/1000;
                                            rebootData[minerID].details.sub.push("Time Left: " + formatUptime(timeLeft));
                                        }

                                        if(!isOnline) {
                                            rebootData[minerID].details.sub.push("Miner is offline.");
                                        } else if(stuckAtZero) {
                                            rebootData[minerID].details.sub.push("Miner is stuck at 0 uptime.");
                                        }
                                    }

                                    if(!belowMaxTemp) {
                                        rebootData[minerID].details.sub.push("Miner is above 78°F.");
                                    }

                                    lastRebootTimes[minerID].previousUpTime = upTime;
                                }

                                function runNextMiner() {
                                    // Stop if we have reached the end of the scan

                                    // Make it a checkmark
                                    const checkmark = document.createElement('span');
                                    checkmark.textContent = '✓';
                                    checkmark.style.display = 'inline-block';
                                    checkmark.style.position = 'absolute';
                                    checkmark.style.right = '10px';

                                    // Remove the spinning 'loading' icon from the log entry
                                    let logEntry = logEntries[currentMiner.id];
                                    if (logEntry) {
                                        const loadingIcon = logEntry.querySelector('span');
                                        if (loadingIcon) {
                                            // Add the checkmark right before the loading icon
                                            logEntry.insertBefore(checkmark, loadingIcon);

                                            // Stop the spinning
                                            clearInterval(loadingIcon.loadingIconInterval);
                                            loadingIcon.remove();
                                        }
                                    }

                                    // Add if it sent reboot or skipped
                                    if(autoreboot) {
                                        var curRebootData = rebootData[currentMiner.id] || {};
                                        function addExtraDetailToLog() {
                                            let details = curRebootData.details || {};
                                            const logEntry = document.createElement('div');
                                            logEntry.textContent = `[${details.main}]`;
                                            logEntry.style.padding = '10px';
                                            logEntry.style.paddingTop = '0';
                                            logEntry.style.paddingLeft = '20px';
                                            progressLog.appendChild(logEntry);

                                            // Add sub details
                                            var subDetails = details.sub || [];
                                            subDetails.forEach(subDetail => {
                                                const subLogEntry = document.createElement('div');
                                                subLogEntry.textContent = "• " + subDetail;
                                                subLogEntry.style.padding = '10px';
                                                subLogEntry.style.paddingTop = '0';
                                                subLogEntry.style.paddingLeft = '40px';
                                                progressLog.appendChild(subLogEntry);
                                            });
                                        }

                                        addExtraDetailToLog();
                                    }

                                    // Run the next miner
                                    if(firstScan) {
                                        currentMinerIndex++;
                                        if (currentMinerIndex < Object.keys(issueMiners).length) {
                                            currentMiner = issueMiners[currentMinerIndex];
                                            parseMinerUpTimeData(currentMiner.id, timeFrame);
                                        }
                                    }

                                    // If we are done with all the miners, then add a log entry
                                    if(reachedScanEnd) {
                                        console.log("Reached the end of the scan");
                                        return;
                                    }

                                    if (currentMinerIndex === Object.keys(issueMiners).length) {
                                        reachedScanEnd = true;
                                        
                                        // Save the rebootData
                                        GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                        // Stop the scanning interval
                                        clearInterval(scanningInterval);

                                        if(autoreboot && firstScan) {
                                            firstScan = false;

                                            // Create table for the miners that should be hard rebooted
                                            const cols = ['Miner', 'Slot ID & Breaker', 'Serial Number', "Scan Result"];
                                            createPopUpTable(`Auto Reboot System`, cols, false, (popupResultElement) => {

                                                const firstDiv = popupResultElement.querySelector('div');
                                                // Create a container for the refresh text and button
                                                const refreshContainer = document.createElement('div');
                                                refreshContainer.style.position = 'absolute';
                                                refreshContainer.style.right = '30px';
                                                refreshContainer.style.top = '30px';
                                                refreshContainer.style.display = 'flex';
                                                refreshContainer.style.alignItems = 'center';
                                                firstDiv.appendChild(refreshContainer);

                                                // Add a "Refreshing in (35s)" text
                                                let countdown = 60;
                                                const refreshText = document.createElement('div');
                                                refreshText.textContent = `Refreshing in (${countdown}s)`;
                                                refreshText.style.color = 'white';
                                                refreshText.style.fontSize = '1em';
                                                refreshText.style.backgroundColor = '#444947';
                                                refreshText.style.borderRadius = '10px'; // Rounded corners
                                                refreshText.style.padding = '5px 10px';
                                                refreshContainer.appendChild(refreshText);

                                                // Add a "pause" button
                                                const pauseButton = document.createElement('button');
                                                pauseButton.className = 'm-button is-ghost is-icon-only';
                                                pauseButton.type = 'button';
                                                pauseButton.id = 'pauseAutoReboot';
                                                pauseButton.style.cssText = `
                                                    margin-left: 10px; /* Add some space between the text and the button */
                                                    background-color: #0078d4;
                                                    color: white;
                                                    display: inline-block; /* Ensure the button is displayed inline with the text */
                                                    display: flex; /* Use flexbox to center the icon */
                                                    align-items: center; /* Vertically center the icon */
                                                    justify-content: center; /* Horizontally center the icon */
                                                `;

                                                const pauseIcon = document.createElement('img');
                                                const pauseIconURL = 'https://img.icons8.com/?size=100&id=61012&format=png&color=FFFFFF';
                                                const playIconURL = 'https://img.icons8.com/?size=100&id=59862&format=png&color=FFFFFF';
                                                pauseIcon.src = pauseIconURL;
                                                pauseIcon.alt = 'Pause Icon';
                                                pauseIcon.style.cssText = `
                                                    width: var(--size-icon-xl);
                                                    height: var(--size-icon-xl);
                                                `;

                                                refreshContainer.appendChild(pauseButton);
                                                pauseButton.appendChild(pauseIcon);

                                                // Toggle pause icon on click
                                                var pauseTime = false;
                                                var targetTime = Date.now() + countdown * 1000;
                                                pauseButton.addEventListener('click', () => {
                                                    if (pauseIcon.src === pauseIconURL) {
                                                        pauseIcon.src = playIconURL;
                                                        pauseTime = targetTime - Date.now()
                                                    } else {
                                                        pauseIcon.src = pauseIconURL;
                                                        targetTime = Date.now() + pauseTime;
                                                        pauseTime = false;
                                                    }
                                                });

                                                // Add a "Refresh" button
                                                const refreshButton = document.createElement('button');
                                                refreshButton.className = 'm-button is-ghost is-icon-only';
                                                refreshButton.type = 'button';
                                                refreshButton.id = 'refreshAutoReboot';
                                                refreshButton.style.cssText = `
                                                    margin-left: 10px; /* Add some space between the text and the button */
                                                    background-color: #0078d4;
                                                    color: white;
                                                    display: inline-block; /* Ensure the button is displayed inline with the text */
                                                `;

                                                const refreshIcon = document.createElement('m-icon');
                                                refreshIcon.size = 'xl';
                                                refreshIcon.name = 'refresh-cw';
                                                refreshIcon.className = 'refresh-icon';
                                                refreshIcon.style.cssText = `
                                                    width: var(--size-icon-xl);
                                                    height: var(--size-icon-xl);
                                                `;

                                                refreshContainer.appendChild(refreshButton);
                                                refreshButton.appendChild(refreshIcon);

                                                // Now the button is created, we can grab the actual button element
                                                const refreshAutoRebootButton = popupResultElement.querySelector('#refreshAutoReboot');

                                                
                                                // Update the countdown
                                                const countdownInterval = setInterval(() => {
                                                    if (pauseTime) {
                                                        return;
                                                    }
                                                    if (!targetTime) return;
                                                    const remainingTime = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
                                                    refreshText.textContent = `Refreshing in (${remainingTime}s)`;
                                                    if (remainingTime <= 0) {
                                                        refreshAutoRebootButton.click();
                                                    }
                                                }, 500);

                                                // Add button hover effect
                                                refreshAutoRebootButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#106ebe';
                                                });

                                                refreshAutoRebootButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#0078d4';
                                                });

                                                function setUpRowData(row, minerID) {
                                                    const minerRebootData = rebootData[minerID];
                                                    const currentMiner = issueMinersLookup[minerID];
                                                    const model = currentMiner.modelName;
                                                    const slotID = currentMiner.locationName;

                                                    var splitSlotID = slotID.split('-');
                                                    var containerID = splitSlotID[0].split('_')[1];
                                                    var rackNum = Number(splitSlotID[1]);
                                                    var rowNum = Number(splitSlotID[2]);
                                                    var colNum = Number(splitSlotID[3]);
                                                    var rowWidth = 4;
                                                    var breakerNum = (rowNum-1)*rowWidth + colNum;
            
                                                    // Remakes the slot ID, but with added 0 padding
                                                    const reconstructedSlotID = `${containerID}-${rackNum.toString().padStart(2, '0')}-${rowNum.toString().padStart(2, '0')}-${colNum.toString().padStart(2, '0')}`;

                                                    // Adds together the slot ID and breaker number, where the breaker number is padded with spaces
                                                    const paddedSlotIDBreaker = `${reconstructedSlotID}  [${breakerNum.toString().padStart(2, '0')}]`;

                                                    const minerSerialNumber = currentMiner.serialNumber;
                                                    minerRebootData.details.main = minerRebootData.details.main || "ERROR";
                                                    minerRebootData.details.sub = minerRebootData.details.sub || ["Failed to get details!"];
                                                    row.innerHTML = `
                                                        <td style="text-align: left; position: relative;">
                                                            <a href="${minerLink}" target="_blank" style="color: white;">Miner: ${minerID} [${model}]</a>
                                                        </td>
                                                        <td style="text-align: left;">${paddedSlotIDBreaker}</td>
                                                        <td style="text-align: left;">${minerSerialNumber}</td>
                                                        <td style="text-align: left; position: relative;">
                                                            ${minerRebootData.details.main}
                                                            <div style="display: inline-block; margin-left: 5px; cursor: pointer; position: relative; float: right;">
                                                                <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0078d4; color: white; text-align: center; line-height: 20px; font-size: 12px; border: 1px solid black; font-weight: bold; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">?</div>
                                                                <div style="display: none; position: absolute; top: 20px; right: 0; background-color: #444947; color: white; padding: 5px; border-radius: 5px; z-index: 9999; white-space: nowrap; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
                                                                    [${minerRebootData.details.main}]
                                                                    ${minerRebootData.details.sub.map(subDetail => `<div style="padding-left: 10px; padding-top: 6px;">• ${subDetail}</div>`).join('')}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    `;

                                                    var questionColor = minerRebootData.details.color || false;
                                                    if(questionColor) {
                                                        row.querySelector('td:last-child div[style*="position: relative;"] div').style.backgroundColor = questionColor;   
                                                    }

                                                    row.minerID = minerID;

                                                    // Add a button before the question mark that says Did Hard Reboot if details.main === "Hard Reboot Recommended"
                                                    if(minerRebootData.details.main === "Hard Reboot Recommended") {
                                                        const hardRebootButton = document.createElement('button');
                                                        hardRebootButton.textContent = 'Mark Hard Rebooted';
                                                        hardRebootButton.style.cssText = `
                                                            background-color: #0078d4;
                                                            color: white;
                                                            border: none;
                                                            cursor: pointer;
                                                            border-radius: 5px;
                                                            transition: background-color 0.3s;
                                                            margin-left: 5px;
                                                        `;
                                                        row.querySelector('td:last-child').appendChild(hardRebootButton);

                                                        // Add button hover effect
                                                        hardRebootButton.addEventListener('mouseenter', function() {
                                                            this.style.backgroundColor = '#005a9e';
                                                        });

                                                        hardRebootButton.addEventListener('mouseleave', function() {
                                                            this.style.backgroundColor = '#0078d4';
                                                        });

                                                        // Add click event to the button
                                                        hardRebootButton.onclick = function() {
                                                            lastRebootTimes[minerID].hardRebootAttempted = new Date().toISOString();
                                                            lastRebootTimes[minerID].hardRebootRecommended = false;

                                                            // make a copy of the details data
                                                            lastRebootTimes[minerID].previousDetails = structuredClone(rebootData[minerID].details);

                                                            // Save lastRebootTimes
                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                            // Set the details to show that it is hard rebooting
                                                            rebootData[minerID].details.main = "Waiting on Hard Reboot Result";
                                                            rebootData[minerID].details.sub = ["15 Minutes has not passed since hard reboot mark time."];

                                                            setUpRowData(row, minerID);
                                                        }
                                                    }
                                                    
                                                    // Add a button to cancel the hard reboot mark if details.main === "Waiting on Hard Reboot Result"
                                                    if(minerRebootData.details.main === "Waiting on Hard Reboot Result") {
                                                        const cancelButton = document.createElement('button');
                                                        cancelButton.textContent = 'Unmark Hard Reboot';
                                                        cancelButton.style.cssText = `
                                                            background-color: #dc3545; /* Red background */
                                                            color: white;
                                                            border: none;
                                                            cursor: pointer;
                                                            border-radius: 5px;
                                                            transition: background-color 0.3s;
                                                            margin-left: 5px;
                                                        `;
                                                        row.querySelector('td:last-child').appendChild(cancelButton);
                                                        
                                                        // Add button hover effect
                                                        cancelButton.addEventListener('mouseenter', function() {
                                                            this.style.backgroundColor = '#c82333'; /* Darker red on hover */
                                                        });

                                                        cancelButton.addEventListener('mouseleave', function() {
                                                            this.style.backgroundColor = '#dc3545'; /* Original red */
                                                        });

                                                        // Add click event to the button
                                                        cancelButton.onclick = function() {
                                                            lastRebootTimes[minerID].hardRebootAttempted = false;
                                                            lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();

                                                            // Save lastRebootTimes
                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                            // Set the details to show what it was before the hard reboot mark
                                                            rebootData[minerID].details = structuredClone(lastRebootTimes[minerID].previousDetails);

                                                            setUpRowData(row, minerID);
                                                        }
                                                    }


                                                    // Add a button before the question mark that says Mark Fixed
                                                    if(minerRebootData.details.main === "Hard Reboot Recommended" || minerRebootData.details.main === "Pull Recommended") {
                                                        const pullButton = document.createElement('button');
                                                        pullButton.textContent = 'Mark Fixed';
                                                        pullButton.style.cssText = `
                                                            background-color: #28a745; /* Green background */
                                                            color: white;
                                                            border: none;
                                                            cursor: pointer;
                                                            border-radius: 5px;
                                                            transition: background-color 0.3s;
                                                            margin-left: 5px;
                                                        `;
                                                        row.querySelector('td:last-child').appendChild(pullButton);

                                                        // Add button hover effect
                                                        pullButton.addEventListener('mouseenter', function() {
                                                            this.style.backgroundColor = '#218838'; /* Darker green on hover */
                                                        });

                                                        pullButton.addEventListener('mouseleave', function() {
                                                            this.style.backgroundColor = '#28a745'; /* Original green */
                                                        });

                                                        // Add click event to the button
                                                        pullButton.onclick = function() {
                                                            lastRebootTimes[minerID] = {};

                                                            // Save lastRebootTimes
                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                            // Set the details to show that it is hard rebooting
                                                            rebootData[minerID].details.main = "Marked Fixed";
                                                            rebootData[minerID].details.sub = ["Miner has been marked as fixed.", "Erased hard reboot mark time."];

                                                            setUpRowData(row, minerID);
                                                            rebootData[minerID] = {};
                                                        }
                                                    }
                                                    
                                                    // Custom right click context menu when right clicking on the row
                                                    row.addEventListener('contextmenu', (e) => {
                                                        e.preventDefault();
                                                        const contextMenu = document.createElement('div');
                                                        contextMenu.style.cssText = `
                                                            position: absolute;
                                                            top: ${e.clientY}px;
                                                            left: ${e.clientX}px;
                                                            background-color: #333;
                                                            color: white;
                                                            padding: 10px;
                                                            border-radius: 5px;
                                                            z-index: 9999;
                                                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                                                        `;
                                                        document.body.appendChild(contextMenu);

                                                        // If a context menu was already open, this should close it
                                                        document.body.click();

                                                        // Remove the context menu when clicking outside of it
                                                        document.addEventListener('click', () => contextMenu.remove());

                                                        const buttons = [
                                                            { text: 'Set Should Hard Reboot', onClick: setShouldHardReboot },
                                                            { text: 'Set Should Pull', onClick: setShouldPull },
                                                            { text: 'Mark Fixed', onClick: markFixed }
                                                        ];

                                                        buttons.forEach(({ text, onClick }) => {
                                                            const button = document.createElement('button');
                                                            button.textContent = text;
                                                            button.style.cssText = `
                                                                display: block;
                                                                width: 100%;
                                                                background: none;
                                                                color: white;
                                                                border: none;
                                                                cursor: pointer;
                                                                padding: 10px;
                                                                text-align: left;
                                                                transition: background-color 0.3s;
                                                            `;
                                                            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#555');
                                                            button.addEventListener('mouseleave', () => button.style.backgroundColor = 'transparent');
                                                            button.onclick = () => {
                                                                onClick();
                                                                contextMenu.remove();
                                                            };
                                                            contextMenu.appendChild(button);
                                                        });
                                                        
                                                        function setShouldHardReboot() {
                                                            lastRebootTimes[minerID].hardRebootAttempted = false;
                                                            lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                            rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                            rebootData[minerID].details.sub = ["Manually set should hard reboot."];
                                                            setUpRowData(row, minerID);
                                                        }

                                                        function setShouldPull() {
                                                            lastRebootTimes[minerID].hardRebootAttempted = true;
                                                            lastRebootTimes[minerID].hardRebootRecommended = false;

                                                            rebootData[minerID].details.main = "Pull Recommended";
                                                            rebootData[minerID].details.sub = ["Manually set should pull."];

                                                            // make a copy of the details data
                                                            lastRebootTimes[minerID].previousDetails = structuredClone(rebootData[minerID].details);
                                                            
                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                            
                                                            setUpRowData(row, minerID);
                                                        }

                                                        function markFixed() {
                                                            lastRebootTimes[minerID] = {};
                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                            rebootData[minerID].details.main = "Marked Fixed";
                                                            rebootData[minerID].details.sub = ["Manually marked fixed.", "Erased stored reboot data."];
                                                            setUpRowData(row, minerID);
                                                            rebootData[minerID] = {};
                                                        }
                                                    });
                                                    
                                                    // Add hover event listeners to show/hide the full details
                                                    const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                    const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                                    document.body.appendChild(tooltip);
                                                    questionMark.addEventListener('mouseenter', () => {
                                                        const rect = questionMark.getBoundingClientRect();
                                                        tooltip.style.left = `${rect.left + window.scrollX}px`;
                                                        tooltip.style.top = `${rect.top + window.scrollY + 20}px`;
                                                        tooltip.style.display = 'block';
                                                    });

                                                    
                                                    // Start a timer to hide the tooltip after a delay if not hovered over
                                                    let hideTooltipTimer;
                                                    const hideTooltipWithDelay = () => {
                                                        hideTooltipTimer = setTimeout(() => {
                                                            tooltip.style.display = 'none';
                                                        }, 100);
                                                    };

                                                    tooltip.style.display = 'none';

                                                    // Clear the timer if the tooltip or question mark is hovered over again
                                                    questionMark.addEventListener('mouseenter', () => {
                                                        clearTimeout(hideTooltipTimer);
                                                    });

                                                    tooltip.addEventListener('mouseenter', () => {
                                                        clearTimeout(hideTooltipTimer);
                                                    });

                                                    // Start the timer when the mouse leaves the tooltip or question mark
                                                    questionMark.addEventListener('mouseleave', hideTooltipWithDelay);
                                                    tooltip.addEventListener('mouseleave', hideTooltipWithDelay);
                                                }

                                                var showSkipped = true;
                                                var showSuccess = true;
                                                function toggleSkippedMiners() {
                                                    // Get the current sort order before refreshing
                                                    var reversed = $('#minerTable').DataTable().order()[0][1] === 'desc';

                                                    const tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                    tableRows.forEach(row => {
                                                        var curResultText = row.querySelector('td:last-child').textContent;
                                                        if(curResultText.includes("Soft Reboot Skipped") || curResultText.includes("Waiting on Soft Reboot Result") || curResultText.includes("Sent Soft Reboot")) {
                                                            row.style.display = showSkipped ? '' : 'none';
                                                        }
                                                        if(curResultText.includes("Successfully Hashing")) {
                                                            row.style.display = showSuccess ? '' : 'none';
                                                        }
                                                    });

                                                    // If the table is grouped, resort by Slot ID & Breaker
                                                    var grouped = $('#minerTable').attr('data-grouped');
                                                    if (grouped) {
                                                        const table = $('#minerTable').DataTable();
                                                        orderType = reversed ? 'desc' : 'asc';
                                                        table.order([1, orderType]).draw();
                                                    }
                                                }

                                                // Refresh button functionality
                                                refreshAutoRebootButton.onclick = function() {
                                                    var currentTableScroll = popupResultElement.querySelector('#minerTableDiv').scrollTop;

                                                    refreshText.textContent = `Refreshing...`;
                                                    targetTime = false; // Stop the countdown

                                                    // Just completly cover the table element with a invisible div to hackily prevent the user from clicking the table
                                                    const invisibleDiv = document.createElement('div');
                                                    invisibleDiv.style.position = 'absolute';
                                                    invisibleDiv.style.top = '0';
                                                    invisibleDiv.style.left = '0';
                                                    invisibleDiv.style.width = '100%';
                                                    invisibleDiv.style.height = '100%';
                                                    invisibleDiv.style.zIndex = '9999';
                                                    var actualTable = popupResultElement.querySelector('#minerTable');
                                                    actualTable.appendChild(invisibleDiv);

                                                    // Reset the scan
                                                    reachedScanEnd = false;
                                                    currentMinerIndex = 0;
                                                    
                                                    rebootData = {};

                                                    retrieveIssueMiners((issueMiners) => {
                                                        var issueMinersLookup = {};
                                                        for (const miner of issueMiners) {
                                                            //if(miner.serialNumber === "YNAHANCBCABJA023E") { continue; } //Used for testing
                                                            issueMinersLookup[miner.id] = miner;
                                                        }

                                                        // Loop through the table and heighlight the miner we're currently on for 0.5 seconds
                                                        var currentRow = 0;
                                                        const tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                        tableRows.forEach((row, index) => {
                                                            let minerID = row.minerID;
                                                            currentMiner = issueMinersLookup[minerID];
                                                            
                                                            // Check the miner
                                                            if(minerID && !currentMiner) {
                                                                rebootData[minerID] = rebootData[minerID] || {};
                                                                rebootData[minerID].details = {};
                                                                rebootData[minerID].details.main = "Successfully Hashing";
                                                                rebootData[minerID].details.sub = ["Miner is now hashing again."];
                                                                rebootData[minerID].details.color = '#218838';
                                                                setUpRowData(row, minerID);
                                                            } else if(currentMiner) {
                                                                parseMinerUpTimeData(minerID, timeFrame);
                                                                setUpRowData(row, minerID);
                                                            }
                                                        });

                                                        toggleSkippedMiners();

                                                        // Reset the target time
                                                        targetTime = Date.now() + countdown * 1000;

                                                        // Delete the invisible div to allow the user to click the table again
                                                        invisibleDiv.remove();
                                                    });
                                                };

                                                // Add text saying the current soft rebooting miners from getTotalRebootCount() that updates
                                                const softRebootingMinersText = document.createElement('div');
                                                softRebootingMinersText.style.cssText = `
                                                    padding: 10px;
                                                    background-color: #444947;
                                                    border-radius: 10px;
                                                    margin-top: 10px;
                                                `;
                                                // Position the text in the top left corner
                                                softRebootingMinersText.style.top = '20px';
                                                softRebootingMinersText.style.left = '30px';
                                                softRebootingMinersText.style.position = 'absolute';
                                                firstDiv.appendChild(softRebootingMinersText);
                                                softRebootingMinersText.textContent = `Sent Soft Reboots: ${getTotalRebootCount()}/${maxRebootAllowed}`;

                                                const softRebootingMinersTextInterval = setInterval(() => {
                                                    const rebootCount = getTotalRebootCount();
                                                    softRebootingMinersText.textContent = `Sent Soft Reboots: ${rebootCount}/${maxRebootAllowed}`;
                                                }, 1000);

                                                // Set the progress bar to show up above the table
                                                progressBar.style.marginTop = '10px';
                                                progressBar.style.width = '100%';
                                                progressBar.style.height = '20px';
                                                progressBar.style.backgroundColor = 'gray';
                                                progressBar.style.border = '2px solid black';
                                                var tableDiv = popupResultElement.querySelector('#minerTableDiv');
                                                // Append after
                                                tableDiv.parentNode.insertBefore(progressBar, tableDiv.nextSibling);

                                                // Show/Hide Skipped Miners (Aligned to the right side)
                                                const showSkippedButton = document.createElement('button');
                                                showSkippedButton.id = 'showSkippedButton';
                                                showSkippedButton.style.cssText = `
                                                    padding: 10px 20px;
                                                    background-color: #0078d4;
                                                    color: white;
                                                    border: none;
                                                    cursor: pointer;
                                                    margin-top: 10px;
                                                    border-radius: 5px;
                                                    transition: background-color 0.3s;
                                                    align-self: flex-end; /* Align to the right side */
                                                    display: block; /* Ensure the button is displayed as a block element */
                                                `;
                                                showSkippedButton.textContent = 'Toggle Soft Reboot Miners';
                                                firstDiv.appendChild(showSkippedButton);

                                                // Add button hover effect
                                                showSkippedButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#005a9e';
                                                });

                                                showSkippedButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#0078d4';
                                                });

                                                // Show/Hide Skipped Miners functionality
                                                showSkippedButton.onclick = function() {
                                                    showSkipped = !showSkipped;
                                                    toggleSkippedMiners();
                                                };

                                                // Add a toggle button to hide/show successful miners
                                                const showSuccessfulButton = document.createElement('button');
                                                showSuccessfulButton.id = 'showSuccessfulButton';
                                                showSuccessfulButton.style.cssText = `
                                                    padding: 10px 20px;
                                                    background-color: #0078d4;
                                                    color: white;
                                                    border: none;
                                                    cursor: pointer;
                                                    margin-top: 10px;
                                                    border-radius: 5px;
                                                    transition: background-color 0.3s;
                                                    align-self: flex-end; /* Align to the right side */
                                                    display: block; /* Ensure the button is displayed as a block element */
                                                `;

                                                showSuccessfulButton.textContent = 'Toggle Successful Miners';
                                                firstDiv.appendChild(showSuccessfulButton);

                                                // Add button hover effect
                                                showSuccessfulButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#005a9e';
                                                });

                                                showSuccessfulButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#0078d4';
                                                });

                                                // Show/Hide Successful Miners functionality
                                                showSuccessfulButton.onclick = function() {
                                                    showSuccess = !showSuccess;
                                                    toggleSkippedMiners();
                                                };



                                                // Add the "Finished Hard Reboots" button
                                                const finishedButton = document.createElement('button');
                                                finishedButton.id = 'finishedHardReboots';
                                                finishedButton.style.cssText = `
                                                    padding: 10px 20px;
                                                    background-color: #4CAF50;
                                                    color: white;
                                                    border: none;
                                                    cursor: pointer;
                                                    margin-top: 10px;
                                                    border-radius: 5px;
                                                    transition: background-color 0.3s;
                                                    align-self: flex-start; /* Align to the left side */
                                                    display: block; /* Ensure the button is displayed as a block element */
                                                `;
                                                finishedButton.textContent = 'Close Auto Reboot Scan';
                                                firstDiv.appendChild(finishedButton);

                                                // Set the popupResultElement to be aligned to the left side
                                                firstDiv.style.left = '41%'

                                                // Now that the button is created, we can attach event listeners
                                                const finishedHardRebootsButton = popupResultElement.querySelector('#finishedHardReboots');

                                                // Add button hover effect
                                                finishedHardRebootsButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#45a049';
                                                });

                                                finishedHardRebootsButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#4CAF50';
                                                });

                                                // Close button functionality
                                                finishedHardRebootsButton.onclick = function() {
                                                    popupResultElement.remove();
                                                    popupResultElement = null;

                                                    // Remove the scanning element
                                                    scanningElement.remove();
                                                    progressLog.remove();
                                                    clearInterval(scanningInterval);
                                                };

                                                // Add the miner data to the table body
                                                const popupTableBody = popupResultElement.querySelector('tbody');
                                                Object.keys(rebootData).forEach(minerID => {
                                                    if (true) {
                                                        const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                        const row = document.createElement('tr');

                                                        setUpRowData(row, minerID);
                                                        popupTableBody.appendChild(row);
                                                    }
                                                });

                                                document.title = orginalTitle;

                                                // Ensure jQuery, DataTables, and ColResize are loaded before initializing the table
                                                $(document).ready(function() {
                                                    // Custom sorting function for slot IDs
                                                    $.fn.dataTable.ext.type.order['slot-id'] = function(d) {
                                                        // Split something like "C05-10-03-04 [37]" into an array of numbers
                                                        let numbers = d.match(/\d+/g).map(Number);

                                                        // Convert the array of numbers into a single comparable value
                                                        // For example, [5, 10, 3, 4, 30] becomes 5001003004030
                                                        let comparableValue = numbers.reduce((acc, num) => acc * 1000 + num, 0);

                                                        return comparableValue;
                                                    };
                                                    
                                                    $('#minerTable').DataTable({
                                                        paging: false,       // Disable pagination
                                                        searching: false,    // Disable searching
                                                        info: false,         // Disable table info
                                                        columnReorder: true, // Enable column reordering
                                                        responsive: true,    // Enable responsive behavior
                                                        colResize: true,      // Enable column resizing

                                                        // Use custom sorting for the "Slot ID" column
                                                        columnDefs: [
                                                            {
                                                                targets: $('#minerTable th').filter(function() {
                                                                    return $(this).text().trim() === 'Slot ID & Breaker';
                                                                }).index(),
                                                                type: 'slot-id'  // Apply the custom sorting function
                                                            }
                                                        ]
                                                    });

                                                    // Sort Scan Result column
                                                    $('#minerTable').DataTable().order([3, 'asc']).draw();

                                                    // Attach event listener for column sorting
                                                    $('#minerTable').DataTable().on('order.dt', function() {
                                                        // If the table is sorted by the "Slot ID & Breaker" column, group the rows by container
                                                        if ($('#minerTable').DataTable().order()[0][0] === 1) {
                                                            // Group rows by container
                                                            let currentContainer = null;
                                                            let containerGroup = null;
                                                            $('#minerTable tbody tr').each(function() {
                                                                // If the row isn't hidden via display: none, group it
                                                                if ($(this).css('display') !== 'none') {
                                                                    let container = `Container ` + $(this).find('td:eq(1)').text().split('-')[0].substring(1);
                                                                    if (!/\d/.test(container)) {
                                                                        container = "Unknown";
                                                                    }
                                                                    if (container !== currentContainer) {
                                                                        currentContainer = container;
                                                                        containerGroup = $('<tr class="container-group"><td colspan="4" style="text-align: left; padding-left: 10px; background-color: #444947; color: white; height: 20px !important; padding: 5px; margin: 0px;">' + container + '</td></tr>');
                                                                        $(this).before(containerGroup);
                                                                    }
                                                                }
                                                            });

                                                            // Set that the table is grouped
                                                            $('#minerTable').attr('data-grouped', 'true');
                                                        } else {
                                                            // Remove the container groups
                                                            $('.container-group').remove();

                                                            // Set that the table is not grouped
                                                            $('#minerTable').attr('data-grouped', 'false');
                                                        }
                                                    });

                                                });
                                            });
                                        }

                                        // Add a log entry
                                        const logEntry = document.createElement('div');
                                        logEntry.textContent = `Scan Complete`;
                                        logEntry.style.padding = '10px';
                                        logEntry.style.borderTop = '1px solid white';
                                        progressLog.appendChild(logEntry);
                                    }

                                    // Scroll to the bottom of the progress log
                                    progressLog.scrollTop = progressLog.scrollHeight;
                                }

                                if(!autoreboot) {
                                    var expectedHashRate = currentMiner.expectedHashRate;
                                    retrieveMinerData("MinerHashrate", minerID, timeFrame, function(minerID, minerHashData) {

                                        // Loop through the hash data and check for any times it is below 80% of the expected hash rate
                                        var belowCount = 0;
                                        var totalExpectedHash = 0;
                                        var totalActualHash = 0;
                                        var hashRateDataTimeLookup = {};
                                        for (const [index, data] of Object.entries(minerHashData)) {
                                            var timestamp = data[0];
                                            var curHash = Number(data[1]);
                                            totalExpectedHash += expectedHashRate;
                                            totalActualHash += curHash;
                                            hashRateDataTimeLookup[timestamp] = curHash;
                                            if (data[1] < expectedHashRate * 0.8) {
                                                belowCount++;
                                            }
                                        }

                                        var overallHashRate = Math.round((totalActualHash / totalExpectedHash) * 100);

                                        var totalOnlineActualHashRate = 0;
                                        var totalOnlineExpectedHashRate = 0;
                                        var onlineHashRate;

                                        // Now that we have the minerHashData, we can retrieve the uptime data
                                        retrieveMinerData("MinerOnline", minerID, timeFrame, function(minerID, minerUptime) {
                                            
                                            // Loop through the uptime and check for any downtime
                                            var minerDownTimes = 0;
                                            var previousState = '1';
                                            for (const [index, data] of Object.entries(minerUptime)) {
                                                var timestamp = data[0];
                                                var state = data[1];
                                                if (state === '0' && previousState === '1') {
                                                    minerDownTimes++;
                                                }
                                                previousState = state;

                                                // Get the hashrate for when we are online
                                                if (state === '1') {
                                                    totalOnlineActualHashRate += hashRateDataTimeLookup[timestamp];
                                                    totalOnlineExpectedHashRate += expectedHashRate;
                                                }
                                            }

                                            // Calculate the online hashrate
                                            onlineHashRate = Math.round((totalOnlineActualHashRate / totalOnlineExpectedHashRate) * 100);

                                            // Add the miner to the minersScanData object
                                            minersScanData[minerID] = minersScanData[minerID] || {};
                                            minersScanData[minerID].downTimes = minerDownTimes;
                                            minersScanData[minerID].overallHashRate = overallHashRate;
                                            minersScanData[minerID].onlineHashRate = onlineHashRate;
                
                                            // Run next miner
                                            runNextMiner();
                                        });
                                    });
                                } else {
                                    checkMiner(minerID);
                                    runNextMiner();
                                }
                            }
                            parseMinerUpTimeData(currentMiner.id, timeFrame);

                            const waitTillDone = setInterval(() => {
                                if (Object.keys(minersScanData).length === Object.keys(issueMiners).length) {
                                    clearInterval(waitTillDone);

                                    // Remove the scanning element
                                    scanningElement.remove();
                                    progressLog.remove();
                                    clearInterval(scanningInterval);

                                    // Create a popup element for showing the results
                                    const cols = ['Miner', 'Offline Count', 'Overall Hash Efficiency', 'Online Hash Efficiency', 'Slot ID', 'Serial Number'];
                                    createPopUpTable(`Offline Count List (${scanTimeFrameText})`, cols, false, (popupResultElement) => {

                                        // Add the close button
                                        const closeButton = document.createElement('button');
                                        closeButton.id = 'closePopup';
                                        closeButton.style.cssText = `
                                            padding: 10px 20px;
                                            background-color: #ff5e57;
                                            color: white;
                                            border: none;
                                            cursor: pointer;
                                            margin-top: 10px;
                                            border-radius: 5px;
                                            transition: background-color 0.3s;
                                            align-self: flex-start; /* Align to the left side */
                                            display: block; /* Ensure the button is displayed as a block element */
                                        `;
                                        closeButton.textContent = 'Close';
                                        const firstDiv = popupResultElement.querySelector('div');
                                        firstDiv.appendChild(closeButton);

                                        // Now the popup is appended, we can attach event listeners
                                        const closePopupButton = popupResultElement.querySelector('#closePopup');

                                        // Add button hover effect
                                        closePopupButton.addEventListener('mouseenter', function() {
                                            this.style.backgroundColor = '#ff3832';
                                        });

                                        closePopupButton.addEventListener('mouseleave', function() {
                                            this.style.backgroundColor = '#ff5e57';
                                        });

                                        // Close button functionality
                                        closePopupButton.onclick = function() {
                                            popupResultElement.remove();
                                            popupResultElement = null;
                                        };

                                        // Add the miner data to the table body
                                        const popupTableBody = popupResultElement.querySelector('tbody');
                                        Object.keys(minersScanData).forEach(minerID => {
                                            const currentMiner = issueMinersLookup[minerID];
                                            const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                            const row = document.createElement('tr');
                                            const model = currentMiner.modelName;
                                            const rebootCount = minersScanData[minerID].downTimes;
                                            const overallHashRate = minersScanData[minerID].overallHashRate;
                                            const onlineHashRate = minersScanData[minerID].onlineHashRate;
                                            const minerSlotID = currentMiner.locationName;
                                            const minerSerialNumber = currentMiner.serialNumber;
                                            row.innerHTML = `
                                                <td style="text-align: left;"><a href="${minerLink}" target="_blank" style="color: white;">Miner: ${minerID} [${model}]</a></td>
                                                <td style="text-align: left;">${rebootCount}</td>
                                                <td style="text-align: left;">${overallHashRate}%</td>
                                                <td style="text-align: left;">${onlineHashRate}%</td>
                                                <td style="text-align: left;">${minerSlotID}</a></td>
                                                <td style="text-align: left;">${minerSerialNumber}</td>
                                            `;
                                            popupTableBody.appendChild(row);
                                        });

                                        document.title = orginalTitle;

                                        // Ensure jQuery, DataTables, and ColResize are loaded before initializing the table
                                        $(document).ready(function() {
                                            // Custom sorting function for slot IDs
                                            $.fn.dataTable.ext.type.order['miner-id'] = function(d) {
                                                // Split something "C05-10-3-4" into an array of just the numbers that aren't seperated by anything at all
                                                let numbers = d.match(/\d+/g).map(Number);
                                                //numbers.shift(); // Remove the first number since it is the miner ID
                                                // Convert the array of numbers into a single comparable value
                                                // For example, [10, 3, 4] becomes 100304
                                                let comparableValue = numbers.reduce((acc, num) => acc * 1000 + num, 0);
                                                return comparableValue;
                                            };
                                            

                                            $('#minerTable').DataTable({
                                                paging: false,       // Disable pagination
                                                searching: false,    // Disable searching
                                                info: false,         // Disable table info
                                                columnReorder: true, // Enable column reordering
                                                responsive: true,    // Enable responsive behavior
                                                colResize: true,      // Enable column resizing

                                                // Use custom sorting for the "Slot ID" column
                                                columnDefs: [
                                                    {
                                                        targets: $('#minerTable th').filter(function() {
                                                            return $(this).text().trim() === 'Slot ID';
                                                        }).index(),
                                                        type: 'miner-id'  // Apply the custom sorting function
                                                    }
                                                ]
                                            });

                                            // Sort offline count to start with the highest
                                            const offlineCountIndex = $('#minerTable th').filter(function() {
                                                return $(this).text().trim() === 'Offline Count';
                                            }).index();

                                            $('#minerTable').DataTable().order([offlineCountIndex, 'desc']).draw();
                                        });
                                    });
                                }
                            }, 500);
                        });
                    });
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

                if(siteName.includes("Minden")) {
                    // Create a auto reboot button to the right of the dropdown
                    const autoRebootButton = document.createElement('button');
                    autoRebootButton.classList.add('m-button');
                    autoRebootButton.style.marginLeft = '10px';
                    autoRebootButton.textContent = 'Auto Reboot';
                    autoRebootButton.onclick = function(event) {
                        event.preventDefault(); // Prevent the default behavior of the button

                        startScan(60*60*24*7, true, 1);
                    };

                    // Add the auto reboot button to the right of the dropdown
                    actionsDropdown.before(autoRebootButton);
                }
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

                // Make sure this is a minden miner
                var facility = minerDetails['facility'];
                if (!facility.includes('Minden')) {
                    return;
                }

                var locationID = minerDetails['locationID']; // Rack-Row-Col
                var splitLocationID = locationID.split('-');
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
    } else if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/Miners/Map")) {
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

        addDataBox("Temperature", "Loading...", (mBox, h3, p) => {
            console.log('Updating temperature');
            console.log(mBox);
            if (mBox) {
                retrieveContainerTempData((containerTempData) => {
                    const containerElement = document.querySelector('div.dropdown.clickable[onclick="$(`#zoneList`).data(\'kendoDropDownList\').toggle()"]');
                    console.log(containerElement);
                    if (containerElement) {
                        const containerText = containerElement.textContent.trim();
                        // Make sure we in the minden site
                        if(containerText !== "zones" && !containerText.includes('Minden')) {
                            mBox.remove();
                            return;
                        }
                        try {
                            const containerNum = parseInt(containerText.split('_')[1].substring(1), 10); // Extract the number after 'C' and remove leading zeros
                            if (isNaN(containerNum) || !containerTempData[containerNum]) {
                                throw new Error('Invalid container number or missing temperature data');
                            }
                            const tempValue = containerTempData[containerNum].temp.toFixed(2);
                            p.textContent = tempValue;
                        } catch (error) {
                            console.error('Error retrieving temperature data:', error);
                            p.textContent = '';
                        }
                    } else {
                        p.textContent = '';
                    }
                } );
            }
        }, 1000);
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


}

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
            console.log('Header with title "Diagnosed" not found.');
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

// See if the URL likly contains a IP address
const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
const ipURLMatch = currentUrl.match(ipRegex);

// Return if the URL doesn't match the IP regex
if (ipURLMatch) {
    function adjustLayout() {
        const homePage = document.getElementById('homePage');
        if (homePage) {
            // At certain zoom levels the homePage seemingly disappears, going down beneath the whole page
            // This is a workaround to fix that
            homePage.style.display = 'block';
            homePage.style.position = 'absolute';
            homePage.style.top = '0';
            homePage.style.right = '0';

            // Get the width left for the homePage based on how much layout-l fl takes up
            const layoutL = document.querySelector('.layout-l');
            if (layoutL) {
                const layoutLWidth = layoutL.offsetWidth;
                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                homePage.style.width = `calc(100% - ${layoutLWidth+scrollBarWidth}px)`;
                
                // find head clearfix and set the width to the same as homePage
                const headClearfix = document.querySelector('.head.clearfix');
                if (headClearfix) {
                    headClearfix.style.width = homePage.style.width;
                } else {
                    console.error('Head clearfix not found');
                }
            }
        }
    }  

    // Function to check the current URL
    var lastRunTime = 0;
    function handleFooter() {
        // Check if the last run was less than 1 second ago
        if (Date.now() - lastRunTime < 1000) {
            return;
        }
        lastRunTime = Date.now();

        // Locate the footer element
        const footer = document.querySelector('.footer.clearfix');

        // Locate the log content element
        const logContent = document.querySelector('.log-content');

        // Locate main-content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.paddingBottom = '0';
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style') {
                        const currentPadding = mainContent.style.paddingBottom;
                        if (currentPadding !== '0px') {
                            mainContent.style.paddingBottom = '0';
                        }
                    }
                    // Run the footer handling logic on any change
                    handleFooter();
                });
            });

            observer.observe(mainContent, { attributes: true });
        } else {
            console.error('Main content element not found');
        }

        function removeOldErrorTab() {
            // If it found the error tab, remove it
            const oldErrorTab = document.querySelector('[data-id="errors"]');
            if (oldErrorTab) {
                // Remove any inner elements
                const errorSubMenu = document.querySelector('#errorSubMenu');
                if (errorSubMenu) {
                    errorSubMenu.remove();
                }

                oldErrorTab.remove();
            }

            // If found old error tab separator, remove it
            const oldSeparator = document.querySelector('.separator');
            if (oldSeparator) {
                oldSeparator.remove();
            }
        }

        // Check if both elements are found
        if (footer && logContent) {

            // On tab change
            const tabs = document.querySelectorAll('.tab span');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    removeOldErrorTab();
                    setTimeout(handleFooter, 500);
                });
            });

            // Make sure the log content is not overlayed over anything
            logContent.style.position = 'relative';

            // Remove the old footer clone if it exists
            const oldFooterClone = document.querySelector('.footer-clone');
            if (oldFooterClone) {
                oldFooterClone.remove();
            }

            // Clone the footer element
            const footerClone = footer.cloneNode(true);
            footerClone.classList.add('footer-clone');

            // Hide the original footer element
            footer.style.display = 'none';

            // Locate the target element to append the footer clone after
            const targetElement = document.querySelector('#blogPage .tab');
            if (targetElement) {
                // Append the cloned footer element at the end of the target element's parent
                targetElement.parentNode.appendChild(footerClone);
            } else {
                console.error('Target element not found');
            }

            // Make sure the footer clone is not overlayed over anything
            footerClone.style.position = 'relative';

            // Make the footer size to the log content size
            footerClone.style.width = '100%';

            // If we didn't already add the error tab, add it
            const oldErrorTab = document.querySelector('[data-id="errors"]');
            if (!oldErrorTab) {

                const errorsToSearch = {
                    'Voltage Abnormity': {
                        icon: "https://img.icons8.com/?size=100&id=61096&format=png&color=FFFFFF",
                        start: ["chain avg vol drop from", "ERROR_POWER_LOST"],
                        end: ["power voltage err", "stop_mining_and_restart", "stop_mining: soc init failed"],
                    },
                    'Temperature Overheat': {
                        icon: "https://img.icons8.com/?size=100&id=er279jFX2Yuq&format=png&color=FFFFFF",
                        start: "asic temp too high",
                        end: "stop_mining: asic temp too high",
                    },
                    'Bad Chain ID': {
                        icon: "https://img.icons8.com/?size=100&id=W7rVpJuanYI8&format=png&color=FFFFFF",
                        start: "bad chain id",
                        end: "stop_mining: basic init failed!",
                    },
                    'Fan Speed Error': {
                        icon: "https://media.discordapp.net/attachments/940214867778998283/1291656835048149014/download.png?ex=6700e4ab&is=66ff932b&hm=48bb47248a9a6843719256ffa07ff5c63f12a7ffe5612c769f11d85fd93baa71&=&format=webp&quality=lossless&width=150&height=150",
                        start: "Error, fan lost,",
                        end: "stop_mining: fan lost",
                    },
                    'Network Lost': {
                        icon: "https://img.icons8.com/?size=100&id=Kjoxcp7iiC5M&format=png&color=FFFFFF",
                        start: ["WARN_NET_LOST", "ERROR_NET_LOST"],
                        end: ["ERROR_UNKOWN_STATUS: power off by NET_LOST", "stop_mining_and_restart: network connection", "stop_mining: power off by NET_LOST", "network connection resume", "network connection lost for"],
                    },
                    
                    'Bad Hashboard Chain': {
                        icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
                        start: ["get pll config err", "Chain[0]:"],
                        end: ["stop_mining: soc init failed"],
                        conditions: (text) => {
                            return text.includes('only find');
                        }
                    },
                    'SOC INIT Fail': {
                        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
                        start: "ERROR_SOC_INIT",
                        end: "ERROR_SOC_INIT",
                        onlySeparate: true
                    },
                    'Firmware Error': {
                        icon: "https://img.icons8.com/?size=100&id=hbCljOlfk4WP&format=png&color=FFFFFF",
                        start: "Firmware registration failed",
                        end: "Firmware registration failed",
                    },
                    'ASIC Error': {
                        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
                        start: "test_loop_securely_find_asic_num",
                        end: "test_loop_securely_find_asic_num"
                    }
                }

                // Search through the log and locate errors
                const logText = logContent.innerText;
                var errorFound = [];

                for (const error in errorsToSearch) {
                    const errorData = errorsToSearch[error];
                    var lastEndIndex = 0;
                    var maxIterations = 100;
                    while(maxIterations > -1) {
                        maxIterations--;
                        if (maxIterations <= 0) {
                            console.error('Max iterations reached');
                            break;
                        }
                        var startIndex = -1;
                        if (!Array.isArray(errorData.start)) {
                            errorData.start = [errorData.start];
                        }

                        for (const start of errorData.start) {
                            const curIndex = logText.indexOf(start, lastEndIndex);
                            if (curIndex !== -1 && (startIndex === -1 || curIndex < startIndex)) {
                                startIndex = curIndex;
                            }
                        }

                        if (startIndex !== -1) {
                            var endIndex = -1;
                            if (!Array.isArray(errorData.end)) {
                                errorData.end = [errorData.end];
                            }

                            const separatorTexts = ["start the http log", "****power off hashboard****"];
                            for (const end of errorData.end) {
                                const curIndex = logText.indexOf(end, startIndex);
                                if (curIndex !== -1 && (endIndex === -1 || curIndex > endIndex)) {
                                    // Make sure another start doesn't appear before the end & make sure a separator doesn't appear between the start and end
                                    const lineAfterStart = logText.indexOf('\n', startIndex);
                                    if (!errorData.start.some(start => logText.indexOf(start, lineAfterStart) < curIndex && logText.indexOf(start, lineAfterStart) !== -1) && !separatorTexts.some(separator => logText.indexOf(separator, startIndex) < curIndex && logText.indexOf(separator, startIndex) !== -1)) {
                                        endIndex = curIndex;
                                    }
                                }
                            }
                            // Set the start index to be back at the start of the line
                            const lastLineBreak = logText.lastIndexOf('\n', startIndex);
                            if (lastLineBreak !== -1) {
                                startIndex = lastLineBreak + 1;
                            }

                            // Set the end index to be at the end of the line
                            const nextLineBreak = logText.indexOf('\n', endIndex);
                            if (nextLineBreak !== -1) {
                                endIndex = nextLineBreak + 1;
                            }

                            // If the start index is after the end index, just do the one start line
                            if(startIndex > endIndex) {
                                endIndex = logText.indexOf('\n', startIndex) + 1;
                            }

                            var setEndIndexAfter;
                            if (endIndex !== -1) {
                                const errorText = logText.substring(startIndex, endIndex);

                                // if onlySeparate is true, only add the error if it doesn't appear in another start/end as another error
                                var errorTextAlreadyFound = false;
                                if(errorData.onlySeparate) {
                                    if(errorFound.some(err => err.text.includes(errorText))) {
                                        console.log('Error text already found');
                                        errorTextAlreadyFound = true;
                                    }
                                }

                                // Check if the error text meets the conditions
                                if (typeof errorData.conditions === 'function' ? errorData.conditions(errorText) : true && !errorTextAlreadyFound) {
                                    errorFound.push({
                                        name: error,
                                        icon: errorData.icon,
                                        text: errorText.trimEnd(),
                                        start: startIndex,
                                        end: endIndex
                                    });
                                    setEndIndexAfter = endIndex;
                                } else {
                                    console.log('Error text did not meet conditions');
                                    setEndIndexAfter = logText.indexOf('\n', startIndex) + 1;
                                }
                            } else {
                                setEndIndexAfter = logText.indexOf('\n', startIndex) + 1;
                            }
                        }

                        if (startIndex === -1 || endIndex === -1 || lastEndIndex === endIndex) {
                            console.log('No more errors found');
                            break;
                        }

                        lastEndIndex = setEndIndexAfter;
                    }
                }

                // Find all the times 'error' is mentioned in the log, if it isn't already found, mark is as an Unknown Error
                const errorRegex = /error/gi;
                const failRegex = /fail/gi;
                const errorMatches = [...logText.toLowerCase().matchAll(errorRegex), ...logText.toLowerCase().matchAll(failRegex)];
                for (const match of errorMatches) {
                    const matchIndex = match.index;
                    if (!errorFound.some(error => matchIndex >= error.start && matchIndex <= error.end)) {
                        const start = logText.lastIndexOf('\n', matchIndex) + 1;
                        const end = logText.indexOf('\n', matchIndex) + 1;
                        const errorText = logText.substring(start, end);
                        errorFound.push({
                            name: 'Unknown Error',
                            text: errorText.trimEnd(),
                            start: start,
                            end: end
                        });
                    }
                }

                // Create a new element to display the errors
                if (errorFound.length > 0) {
                    // Locate the menu element
                    const menu = document.querySelector('.menu-t.menu');
                    if (menu) {
                        // Add line separator
                        const separator = document.createElement('li');
                        separator.style.borderBottom = '1px solid #ccc';
                        separator.style.margin = '10px 0';
                        separator.classList.add('separator');
                        menu.appendChild(separator);

                        // Create a new list item for errors
                        const errorTab = document.createElement('li');
                        errorTab.classList.add('item');
                        errorTab.setAttribute('data-id', 'errors');
                        errorTab.innerHTML = '<i class="error-ico icon"></i> <span class="itm-name" data-locale="errors">Errors</span> <i class="drop-icon"></i>';

                        // Check if errorTab is pressed
                        errorTab.addEventListener('click', () => {
                            setTimeout(adjustLayout, 0);
                        });

                        // Create a sub-menu for the errors
                        const errorSubMenu = document.createElement('ul');
                        errorSubMenu.classList.add('sub-menu', 'menu');
                        errorSubMenu.id = 'errorSubMenu';
                        
                        // Find and replace the drop icon so it doesn't flip when the other sub-menu is opened
                        const dropIcon = errorTab.querySelector('.drop-icon');
                        if (dropIcon) {
                            dropIcon.remove();

                            const errorIcon = document.createElement('i');
                            errorIcon.classList.add('icon');
                            errorIcon.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=2760&format=png&color=FFFFFF)';
                            errorIcon.style.width = '16px';
                            errorIcon.style.height = '16px';
                            errorIcon.style.display = 'inline-block';
                            errorIcon.style.backgroundSize = 'contain';
                            errorIcon.style.marginRight = '5px';
                            errorTab.appendChild(errorIcon);
                        }

                        // Swap the left empty icon source with the error icon
                        const errorIcon = errorTab.querySelector('.error-ico');
                        if (errorIcon) {
                            errorIcon.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=24552&format=png&color=FFFFFF)';
                            
                            errorIcon.style.display = 'inline-block';
                            errorIcon.style.backgroundSize = 'contain';
                            errorIcon.style.marginRight = '5px';
                        }


                        // Populate the sub-menu with error details
                        errorFound.forEach((error, index) => {
                            const errorItem = document.createElement('li');
                            errorItem.classList.add('item');
                            errorItem.setAttribute('data-id', `error-${index}`);
                            errorItem.innerHTML = `<i class="error-detail-ico icon"></i> <span class="itm-name">${error.name}</span>`;
                            errorItem.addEventListener('click', () => {
                                // Check if the error element already exists
                                const existingErrorElement = document.getElementById(`errorLogElement`);
                                if (existingErrorElement) {
                                    existingErrorElement.remove();
                                    
                                    // Remove any children of the log content
                                    while (logContent.firstChild) {
                                        logContent.removeChild(logContent.firstChild);
                                    }

                                    // Re-add the original log content
                                    logContent.textContent = logText;
                                }

                                // Create a new element to highlight the error
                                const errorElement = document.createElement('span');
                                errorElement.style.backgroundColor = '#ffcccc';
                                errorElement.style.color = 'black';
                                errorElement.style.width = '100%';
                                errorElement.style.display = 'block';

                                errorElement.setAttribute('data-original-text', error.text);
                                errorElement.textContent = error.text;
                                errorElement.setAttribute('data-original-text', error.text);

                                errorElement.id = `errorLogElement`;

                                // In bottom right corner add a copy button
                                const copyButton = document.createElement('button');
                                copyButton.textContent = 'Copy';
                                copyButton.style.position = 'absolute';
                                copyButton.style.bottom = '0';
                                copyButton.style.right = '0';
                                copyButton.style.backgroundColor = 'transparent';
                                copyButton.style.border = 'none';
                                copyButton.style.color = 'black';
                                copyButton.style.cursor = 'pointer';
                                copyButton.style.padding = '5px';
                                copyButton.style.fontSize = '12px';
                                copyButton.style.fontWeight = 'bold';
                                copyButton.style.zIndex = '1';
                                copyButton.addEventListener('click', () => {
                                    // Copy the error text to the clipboard
                                    if (navigator.clipboard) {
                                        navigator.clipboard.writeText(error.text).then(() => {
                                            console.log('Text copied to clipboard');
                                        }).catch(err => {
                                            console.error('Failed to copy text: ', err);
                                        });
                                    } else {
                                        // Fallback method for older browsers
                                        const textArea = document.createElement('textarea');
                                        textArea.value = error.text;
                                        document.body.appendChild(textArea);
                                        textArea.select();
                                        try {
                                            document.execCommand('copy');
                                            console.log('Text copied to clipboard');
                                        } catch (err) {
                                            console.error('Failed to copy text: ', err);
                                        }
                                        document.body.removeChild(textArea);
                                    }

                                    // Change the button text to copied
                                    copyButton.textContent = 'Copied!';
                                    setTimeout(() => {
                                        copyButton.textContent = 'Copy';
                                    }, 1000);
                                });
                                
                                // Add as child of error element
                                errorElement.style.position = 'relative'; // Ensure the errorElement is positioned relative
                                errorElement.appendChild(copyButton);

                                // While hovering over the error element, show the copy button
                                errorElement.addEventListener('mouseover', () => {
                                    copyButton.style.display = 'block';
                                });

                                errorElement.addEventListener('mouseout', () => {
                                    copyButton.style.display = 'none';
                                });

                                // When hover, change the copy button color
                                copyButton.addEventListener('mouseover', () => {
                                    copyButton.style.color = 'green';
                                });

                                copyButton.addEventListener('mouseout', () => {
                                    copyButton.style.color = 'black';
                                });

                                // Replace the error text in the log with the highlighted version
                                const logTextNode = logContent.childNodes[0];
                                const beforeErrorText = logTextNode.textContent.substring(0, error.start);
                                const afterErrorText = logTextNode.textContent.substring(error.end);

                                logTextNode.textContent = beforeErrorText;
                                logContent.insertBefore(errorElement, logTextNode.nextSibling);
                                logContent.insertBefore(document.createTextNode(afterErrorText), errorElement.nextSibling);

                                // Scroll to the highlighted error
                                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            });
                            errorSubMenu.appendChild(errorItem);

                            // Set the icon for the error <i class="error-detail-ico icon"></i>
                            const errorDetailIcon = errorItem.querySelector('.error-detail-ico');
                            if (errorDetailIcon) {
                                errorDetailIcon.style.backgroundImage = error.icon !== undefined ? `url(${error.icon})` : 'url(https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF)';
                                errorDetailIcon.style.display = 'inline-block';
                                errorDetailIcon.style.backgroundSize = 'contain';
                                errorDetailIcon.style.marginRight = '5px';
                            }
                            // Create an info icon to the right that will show the error text
                            const infoIcon = document.createElement('div');
                            infoIcon.style.width = '14px';
                            infoIcon.style.height = '14px';
                            infoIcon.style.borderRadius = '50%';
                            infoIcon.style.backgroundColor = '#0078d4';
                            infoIcon.style.color = 'white';
                            infoIcon.style.textAlign = 'center';
                            infoIcon.style.lineHeight = '14px';
                            infoIcon.style.fontSize = '8px';
                            infoIcon.style.border = '1px solid black';
                            infoIcon.style.fontWeight = 'bold';
                            infoIcon.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
                            infoIcon.style.cursor = 'pointer';
                            infoIcon.style.position = 'relative';
                            infoIcon.style.float = 'right';
                            infoIcon.textContent = 'i';
                                                        
                            // Create the tooltip
                            const tooltip = document.createElement('div');
                            tooltip.style.display = 'none';
                            tooltip.style.position = 'absolute';
                            tooltip.style.backgroundColor = '#444947';
                            tooltip.style.color = 'white';
                            tooltip.style.padding = '5px';
                            tooltip.style.borderRadius = '5px';
                            tooltip.style.zIndex = '9999';
                            tooltip.style.whiteSpace = 'pre-wrap'; // Use pre-wrap to preserve newlines
                            tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
                            tooltip.textContent = error.text;
                            document.body.appendChild(tooltip);

                            // Position the tooltip relative to the infoIcon
                            infoIcon.addEventListener('mouseenter', () => {
                                const rect = infoIcon.getBoundingClientRect();
                                tooltip.style.left = `${rect.left + window.scrollX}px`;
                                tooltip.style.top = `${rect.top + window.scrollY + 20}px`;
                                tooltip.style.display = 'block';
                            });

                            infoIcon.addEventListener('mouseleave', () => {
                                tooltip.style.display = 'none';
                            });

                            // Position the tooltip relative to the infoIcon
                            infoIcon.addEventListener('mouseenter', () => {
                                const rect = infoIcon.getBoundingClientRect();
                                tooltip.style.left = `${rect.left + window.scrollX}px`;
                                tooltip.style.top = `${rect.top + window.scrollY + 20}px`;
                                tooltip.style.display = 'block';
                            });
                            
                            infoIcon.addEventListener('mouseleave', () => {
                                tooltip.style.display = 'none';
                            });

                            // Append the info icon to the error item
                            errorItem.appendChild(infoIcon);

                        });

                        // Append the error tab and sub-menu to the menu
                        menu.appendChild(errorTab);
                        menu.appendChild(errorSubMenu);

                        // Add event listener to toggle the sub-menu
                        errorTab.addEventListener('click', () => {
                            const isVisible = errorSubMenu.style.display === 'block';
                            errorSubMenu.style.display = isVisible ? 'none' : 'block';
                        });

                        console.log('Error tab and sub-menu added successfully');
                    } else {
                        console.error('Menu element not found');
                    }
                }
            }

            setTimeout(adjustLayout, 100);
        } else {
            if (!footer) {
                //console.error('Footer element not found');
            } else {
                footer.style.display = 'block';
                //console.log('Footer element shown');
            }
            if (!logContent) {
                //console.error('Log content element not found');
            }

            removeOldErrorTab();
        }
    }

    // Run the check on mutation
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                setTimeout(handleFooter, 500);
            }
            adjustLayout();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      1.8.4
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
                                console.log('Breaker Number: ' + breakerNum);
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
                                    console.log(`Checking Miner: ${minerID} - ${location}`);
                                    if(!location) {
                                        console.error("No location for miner: " + minerID);
                                        return;

                                    }

                                    var min15 = 15*60;
                                    var minSoftRebootUpTime = 60*60; // 1 hour
                                    var upTime = currentMiner.uptimeValue;
                                    var container = location.split("_")[1].split("-")[0].replace(/\D/g, '').replace(/^0+/, '');
                                    var maxTemp = 78;
                                    var containerTemp = containerTempData[container].temp;
                                    var issueType = currentMiner.issueType;

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
                                                rebootData[minerID].details.main = "Waiting on Soft Reboot Attempt";
                                                rebootData[minerID].details.sub = [];
                                                const formattedTime = new Date(lastSoftRebootTime).toLocaleTimeString();
                                                rebootData[minerID].details.sub.push("Soft Reboot sent at: " + formattedTime);
                                                console.log("timeSinceLastSoftReboot: " + timeSinceLastSoftReboot);
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

                                    var stuckAtZero = upTime === 0 && isOnline;

                                    var hardRebootAttemptedTime = lastRebootTimes[minerID].hardRebootAttempted || false;
                                    var timeSinceHardRebootAttempted = hardRebootAttemptedTime ? (new Date() - new Date(hardRebootAttemptedTime)) : false;
                                    var hardRebootAttempted = timeSinceHardRebootAttempted && timeSinceHardRebootAttempted < 6*60*60*1000; // 6 hours
                                    
                                    if( !hardRebootAttempted && ((isPastMinTime && notPastForgetTime) || moreThan3SoftReboots || !isOnline || stuckAtZero)) {
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};

                                        rebootData[minerID].details.main = "Hard Reboot Recommended";
                                        rebootData[minerID].details.sub = [];
                                        if(isPastMinTime && notPastForgetTime) {
                                            rebootData[minerID].details.sub.push("15 Minutes has passed since last soft reboot and miner is still not hashing.");
                                        }

                                        if(moreThan3SoftReboots) {
                                            rebootData[minerID].details.sub.push(`${numOfSoftReboots} Soft Reboots sent from this computer in the last 6 hours`);
                                        }

                                        if(!isOnline) {
                                            rebootData[minerID].details.sub.push("Miner is offline.");
                                        } else if(stuckAtZero) {
                                            rebootData[minerID].details.sub.push("Miner is stuck at 0 uptime.");
                                        }
                                    } else if(hardRebootAttempted) {

                                        if(timeSinceHardRebootAttempted >= min15*1000) {
                                            rebootData[minerID].details.main = "Pull Recommened";
                                            rebootData[minerID].details.sub = [];
                                            rebootData[minerID].details.sub.push("15 Minutes has passed since hard reboot attempt.");
                                        } else {
                                            rebootData[minerID].details.main = "Waiting on Hard Reboot Attempt";
                                            rebootData[minerID].details.sub = [];
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
                                    console.log("Running Next Miner");

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
                                        var curRebootData = rebootData[currentMiner.id];
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

                                                var targetTime = Date.now() + countdown * 1000;
                                                // Update the countdown
                                                const countdownInterval = setInterval(() => {
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
                                                                <div style="width: 16px; height: 16px; border-radius: 50%; background-color: #0078d4; color: white; text-align: center; line-height: 16px; font-size: 12px;">?</div>
                                                                <div style="display: none; position: absolute; top: 20px; right: 0; background-color: #444947; color: white; padding: 5px; border-radius: 5px; z-index: 9999; white-space: nowrap; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
                                                                    [${minerRebootData.details.main}]
                                                                    ${minerRebootData.details.sub.map(subDetail => `<div style="padding-left: 10px; padding-top: 6px;">• ${subDetail}</div>`).join('')}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    `;

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

                                                            // Set the details to show that it is hard rebooting
                                                            rebootData[minerID].details.main = "Waiting on Hard Reboot Attempt";
                                                            rebootData[minerID].details.sub = ["15 Minutes has not passed since hard reboot mark time."];

                                                            setUpRowData(row, minerID);
                                                        }
                                                    }
                                                            
                                                    
                                                    // Add hover event listeners to show/hide the full details
                                                    const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                    const tooltip = questionMark.querySelector('div[style*="display: none;"]');

                                                    questionMark.addEventListener('mouseenter', () => {
                                                        tooltip.style.display = 'block';
                                                    });

                                                    questionMark.addEventListener('mouseleave', () => {
                                                        tooltip.style.display = 'none';
                                                    });
                                                }

                                                var showSkipped = true;
                                                function toggleSkippedMiners() {
                                                    const tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                    tableRows.forEach(row => {
                                                        var curResultText = row.querySelector('td:last-child').textContent;
                                                        if(curResultText.includes("Soft Reboot Skipped")) {
                                                            row.style.display = showSkipped ? '' : 'none';
                                                        }
                                                    });
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
                                                            issueMinersLookup[miner.id] = miner;
                                                        }

                                                        // Loop through the table and heighlight the miner we're currently on for 0.5 seconds
                                                        var currentRow = 0;
                                                        const tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                        const highlightInterval = setInterval(() => {
                                                            
                                                            tableRows.forEach((row, index) => {
                                                                row.style.backgroundColor = index === currentRow ? 'rgba(255, 255, 255, 0.1)' : '';

                                                                if (index === currentRow) {
                                                                    // Scroll to the highlighted row
                                                                    row.scrollIntoView({ behavior: 'auto', block: 'center' });

                                                                    // Set the current miner
                                                                    let minerID = row.minerID;
                                                                    currentMiner = issueMinersLookup[minerID];
                                                                    
                                                                    // Check the miner
                                                                    if(!currentMiner) {
                                                                        row.remove();
                                                                    } else {
                                                                        parseMinerUpTimeData(minerID, timeFrame);
                                                                        setUpRowData(row, minerID);
                                                                    }
                                                                }
                                                            });
                                                            toggleSkippedMiners();
                                                            currentRow = (currentRow + 1) % tableRows.length;

                                                            // If we've gone through all the rows, stop the interval
                                                            if (currentRow === 0) {
                                                                // Stop the interval
                                                                clearInterval(highlightInterval);

                                                                // remove the highlight
                                                                tableRows.forEach(row => {
                                                                    row.style.backgroundColor = '';
                                                                });

                                                                // Scroll back to where we were
                                                                popupResultElement.querySelector('#minerTableDiv').scrollTop = currentTableScroll;
                                                                

                                                                // Reset the target time
                                                                targetTime = Date.now() + countdown * 1000;

                                                                // Delete the invisible div to allow the user to click the table again
                                                                invisibleDiv.remove();
                                                            }
                                                        }, 20);
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
                                                showSkippedButton.textContent = 'Toggle Skipped Miners';
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
                                                console.log(d);
                                                let numbers = d.match(/\d+/g).map(Number);
                                                //numbers.shift(); // Remove the first number since it is the miner ID
                                                console.log(numbers);
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

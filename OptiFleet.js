// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      3.3.6
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
// @run-at       document-start
// ==/UserScript==


const currentUrl = window.location.href;

window.addEventListener('load', function () {
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

        function editalertThreshold() {
            // Check to see if the popup already exists and if so, don't create another
            const existingPopup = document.querySelector('.alert-amount-popup');
            if (existingPopup) {
                return;
            }

            const alertThreshold = GM_SuperValue.get("alertThreshold", 10);
            const majoralertThreshold = GM_SuperValue.get("majoralertThreshold", 500);
            const onlyNonHashing = GM_SuperValue.get("onlyNonHashing", "true") === "true";
            const alertEnabled = GM_SuperValue.get("alertEnabled", "true") === "true";
            const majorAlertEnabled = GM_SuperValue.get("majorAlertEnabled", "true") === "true";

            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#333'; // Changed to match notification background
            popup.style.color = '#fff'; // Set text color to white for better contrast
            popup.style.padding = '20px';
            popup.style.borderRadius = '5px';
            popup.style.zIndex = '1001';

            const alertLabel = document.createElement('label');
            alertLabel.innerText = 'Enter new alert amount:';
            alertLabel.style.display = 'block';
            alertLabel.style.marginBottom = '10px';

            const alertInput = document.createElement('input');
            alertInput.type = 'number';
            alertInput.value = alertThreshold;
            alertInput.style.marginBottom = '10px';
            alertInput.style.width = '100%';
            alertInput.style.height = '30px'; // Set the height a bit bigger
            alertInput.style.backgroundColor = '#222'; // Changed to match notification background
            alertInput.style.color = '#fff'; // Set text color to white for better contrast

            const majorAlertLabel = document.createElement('label');
            majorAlertLabel.innerText = 'Enter new major alert amount:';
            majorAlertLabel.style.display = 'block';
            majorAlertLabel.style.marginBottom = '10px';

            const majorAlertInput = document.createElement('input');
            majorAlertInput.type = 'number';
            majorAlertInput.value = majoralertThreshold;
            majorAlertInput.style.marginBottom = '10px';
            majorAlertInput.style.width = '100%';
            majorAlertInput.style.height = '30px'; // Set the height a bit bigger
            majorAlertInput.style.backgroundColor = '#222'; // Changed to match notification background
            majorAlertInput.style.color = '#fff'; // Set text color to white for better contrast

            const onlyNonHashingContainer = document.createElement('div');
            onlyNonHashingContainer.style.display = 'flex';
            onlyNonHashingContainer.style.alignItems = 'center';
            
            const onlyNonHashingInput = document.createElement('input');
            onlyNonHashingInput.type = 'checkbox';
            onlyNonHashingInput.checked = onlyNonHashing;
            onlyNonHashingInput.style.marginBottom = '10px';
            onlyNonHashingInput.style.width = '20px'; // Set the width smaller
            onlyNonHashingInput.style.height = '20px'; // Set the height smaller
            onlyNonHashingInput.style.marginRight = '10px'; // Add some space to the right

            const onlyNonHashingLabelText = document.createElement('span');
            onlyNonHashingLabelText.innerText = 'Set non hashing miners only.';
            onlyNonHashingLabelText.style.color = '#fff'; // Set text color to white for better contrast
            onlyNonHashingLabelText.style.marginBottom = '10px';

            onlyNonHashingContainer.appendChild(onlyNonHashingInput);
            onlyNonHashingContainer.appendChild(onlyNonHashingLabelText);

            const alertEnabledContainer = document.createElement('div');
            alertEnabledContainer.style.display = 'flex';
            alertEnabledContainer.style.alignItems = 'center';
            
            const alertEnabledInput = document.createElement('input');
            alertEnabledInput.type = 'checkbox';
            alertEnabledInput.checked = alertEnabled;
            alertEnabledInput.style.marginBottom = '10px';
            alertEnabledInput.style.width = '20px'; // Set the width smaller
            alertEnabledInput.style.height = '20px'; // Set the height smaller
            alertEnabledInput.style.marginRight = '10px'; // Add some space to the right

            const alertEnabledLabelText = document.createElement('span');
            alertEnabledLabelText.innerText = 'Enable/Disable notifications.';
            alertEnabledLabelText.style.color = '#fff'; // Set text color to white for better contrast
            alertEnabledLabelText.style.marginBottom = '10px';

            alertEnabledContainer.appendChild(alertEnabledInput);
            alertEnabledContainer.appendChild(alertEnabledLabelText);
            
            const majorAlertEnabledContainer = document.createElement('div');
            majorAlertEnabledContainer.style.display = 'flex';
            majorAlertEnabledContainer.style.alignItems = 'center';

            const majorAlertEnabledInput = document.createElement('input');
            majorAlertEnabledInput.type = 'checkbox';
            majorAlertEnabledInput.checked = majorAlertEnabled;
            majorAlertEnabledInput.style.marginBottom = '10px';
            majorAlertEnabledInput.style.width = '20px'; // Set the width smaller
            majorAlertEnabledInput.style.height = '20px'; // Set the height smaller
            majorAlertEnabledInput.style.marginRight = '10px'; // Add some space to the right

            const majorAlertEnabledLabelText = document.createElement('span');
            majorAlertEnabledLabelText.innerText = 'Enable/Disable major notifications.';
            majorAlertEnabledLabelText.style.color = '#fff'; // Set text color to white for better contrast
            majorAlertEnabledLabelText.style.marginBottom = '10px';

            majorAlertEnabledContainer.appendChild(majorAlertEnabledInput);
            majorAlertEnabledContainer.appendChild(majorAlertEnabledLabelText);

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.style.marginRight = '10px';
            saveButton.style.backgroundColor = '#4CAF50'; // Green background
            saveButton.style.color = 'white'; // White text
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '5px';
            saveButton.style.padding = '10px 20px';
            saveButton.style.textAlign = 'center'; // Center the text
            saveButton.style.cursor = 'pointer';
            saveButton.style.transition = 'background-color 0.3s ease';

            saveButton.addEventListener('mouseover', () => {
                saveButton.style.backgroundColor = '#45a049'; // Darker green on hover
            });

            saveButton.addEventListener('mouseout', () => {
                saveButton.style.backgroundColor = '#4CAF50'; // Original green when not hovering
            });

            saveButton.addEventListener('click', () => {
                const newalertThreshold = parseInt(alertInput.value);
                const newMajoralertThreshold = parseInt(majorAlertInput.value);
                if (!isNaN(newalertThreshold) && !isNaN(newMajoralertThreshold)) {
                    GM_SuperValue.set("alertThreshold", newalertThreshold);
                    GM_SuperValue.set("majoralertThreshold", newMajoralertThreshold);
                }

                GM_SuperValue.set("onlyNonHashing", onlyNonHashingInput.checked.toString());
                GM_SuperValue.set("alertEnabled", alertEnabledInput.checked.toString());
                GM_SuperValue.set("majorAlertEnabled", majorAlertEnabledInput.checked.toString());
                
                popup.remove();

                minerIssueNotification();
            });


            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.style.backgroundColor = 'red'; // Red background
            cancelButton.style.color = 'white'; // White text
            cancelButton.style.border = 'none';
            cancelButton.style.borderRadius = '5px';
            cancelButton.style.padding = '10px 20px';
            cancelButton.style.textAlign = 'center'; // Center the text
            cancelButton.style.cursor = 'pointer';
            cancelButton.style.transition = 'background-color 0.3s ease';

            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.backgroundColor = '#dc3545'; // Darker red on hover
            });

            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.backgroundColor = 'red'; // Original red when not hovering
            });

            cancelButton.addEventListener('click', () => {
                popup.remove();
            });

            popup.appendChild(alertLabel);
            popup.appendChild(alertInput);
            popup.appendChild(majorAlertLabel);
            popup.appendChild(majorAlertInput);
            popup.appendChild(onlyNonHashingContainer);
            popup.appendChild(alertEnabledContainer);
            popup.appendChild(majorAlertEnabledContainer);
            popup.appendChild(saveButton);
            popup.appendChild(cancelButton);

            document.body.appendChild(popup);
        }
        
        
        // Add a small 'edit notification amount' button to bottom right
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Issues/Issues") && siteName.includes("Minden")) {
            const editAmountButton = document.createElement('button');
            editAmountButton.innerText = 'Edit Alert';
            editAmountButton.style.position = 'fixed';
            editAmountButton.style.bottom = '10px';
            editAmountButton.style.right = '8px';
            editAmountButton.style.backgroundColor = '#333';
            editAmountButton.style.color = '#fff';
            editAmountButton.style.padding = '8px';
            editAmountButton.style.borderRadius = '3px';
            editAmountButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
            editAmountButton.style.cursor = 'pointer';
            editAmountButton.style.fontSize = '10px';
            editAmountButton.style.transition = 'background-color 0.3s ease';
            editAmountButton.id = 'editAmountButton';

            editAmountButton.addEventListener('mouseover', () => {
                editAmountButton.style.backgroundColor = '#444'; // Darker background on hover
            });

            editAmountButton.addEventListener('mouseout', () => {
                editAmountButton.style.backgroundColor = '#333'; // Original background when not hovering
            });

            editAmountButton.addEventListener('click', () => {
                editalertThreshold();
            });

            document.body.appendChild(editAmountButton);
        }

        // Get issue miners every minute, and if the count is over 100 show a notification
        function minerIssueNotification() {
            retrieveIssueMiners((issueMiners) => {
                let minerCount = issueMiners.length;
                const alertThreshold = GM_SuperValue.get("alertThreshold", 10);
                const majoralertThreshold = GM_SuperValue.get("majoralertThreshold", 500);
                const onlyNonHashing = GM_SuperValue.get("onlyNonHashing", "true") === "true";
                const alertEnabled = GM_SuperValue.get("alertEnabled", "true") === "true";
                const majorAlertEnabled = GM_SuperValue.get("majorAlertEnabled", "true") === "true";

                if (!alertEnabled) { return; }

                // Remove the current notification if it exists
                const existingNotification = document.querySelector('.miner-issue-notification');
                if (existingNotification) {
                    const editAmountButton = document.getElementById('editAmountButton');
                    if (editAmountButton) {
                        editAmountButton.style.display = 'block';
                        editAmountButton.style.opacity = '1';
                    }
                    existingNotification.remove();
                }

                // Only get the actual non hashing miners
                issueMiners = issueMiners.filter(miner => miner.currentHashRate === 0 || miner.issueType === 'Non Hashing');

                const allMiners = minerCount;
                const nonHashingMinerCount = issueMiners.length;
                const lowHashingMinerCount = allMiners - nonHashingMinerCount;

                if(onlyNonHashing) {
                    minerCount = nonHashingMinerCount;
                }
                if(minerCount >= alertThreshold) {
                    // Find if editAmountButton exists and if so, hide it
                    const editAmountButton = document.getElementById('editAmountButton');
                    if (editAmountButton) {
                        editAmountButton.style.display = 'none';
                    }

                    // Create a notification element
                    const notification = document.createElement('div');
                    notification.className = 'miner-issue-notification';
                    notification.style.position = 'fixed';
                    notification.style.bottom = '20px';
                    notification.style.right = '20px';
                    notification.style.backgroundColor = '#333';
                    notification.style.color = '#fff';
                    notification.style.padding = '15px';
                    notification.style.borderRadius = '5px';
                    notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                    notification.style.zIndex = '1000';
                    notification.style.transition = 'opacity 0.5s ease';

                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'x';
                    closeButton.style.background = 'none';
                    closeButton.style.border = 'none';
                    closeButton.style.color = '#fff';
                    closeButton.style.fontSize = '16px';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.float = 'right';
                    closeButton.style.marginLeft = '10px';

                    closeButton.addEventListener('click', () => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 500);

                        const editAmountButton = document.getElementById('editAmountButton');
                        if (editAmountButton) {
                            editAmountButton.style.display = 'block';
                            editAmountButton.style.opacity = '0';
                            editAmountButton.style.transition = 'opacity 0.5s ease';
                            setTimeout(() => editAmountButton.style.opacity = '1', 10);
                        }
                    });

                    notification.innerText = 'There are ' + allMiners + ' miners with issues.\n' + nonHashingMinerCount + ' are non hashing.\n' + lowHashingMinerCount + ' are low hashing.';
                    notification.appendChild(closeButton);
                    document.body.appendChild(notification);

                    // If at major alert amount, make the notification red & play a sound
                    if(minerCount >= majoralertThreshold && majorAlertEnabled) {
                        notification.style.backgroundColor = 'red';
                        notification.style.color = 'white';
                        notification.style.fontWeight = 'bold';

                        document.body.click();
                        const audio = new Audio('https://cdn.freesound.org/previews/521/521973_311243-lq.mp3');
                        audio.play();

                        
                        var msg = new SpeechSynthesisUtterance();
                        msg.text = "There are " + allMiners + " miners with issues. " + nonHashingMinerCount + " are non hashing. " + lowHashingMinerCount + " are low hashing.";
                        window.speechSynthesis.speak(msg);

                        // if over 500, repeat the sound every 5 seconds for 60 seconds
                        if(minerCount >= 2000) {
                            const interval = setInterval(() => {
                                const audio1 = new Audio('https://cdn.freesound.org/previews/521/521973_311243-lq.mp3');
                                audio1.play();
                            }, 800);
                            setTimeout(() => clearInterval(interval), 60000);
                        }
                    }

                    // Edit button to be able to input custom notification amount
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.style.background = 'none';
                    editButton.style.border = 'none';
                    editButton.style.color = '#fff';
                    editButton.style.fontSize = '16px';
                    editButton.style.cursor = 'pointer';
                    editButton.style.float = 'right';
                    editButton.style.marginLeft = '10px';

                    editButton.addEventListener('click', () => {
                        editalertThreshold();
                    });

                    notification.appendChild(editButton);

                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 500);
                        const editAmountButton = document.getElementById('editAmountButton');
                        if (editAmountButton) {
                            editAmountButton.style.display = 'block';
                            editAmountButton.style.opacity = '0';
                            editAmountButton.style.transition = 'opacity 0.5s ease';
                            setTimeout(() => editAmountButton.style.opacity = '1', 10);
                        }
                    }, 55000);
                }
            });
        }

        // Check if minden
        if( siteName.includes("Minden") ) {
            setInterval(function() {
                minerIssueNotification()
            }, 60000);
            minerIssueNotification();
        }

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

            // In case we swap company/site (Not actually sure if it matters for site, but might as well)
            serviceInstance = new OptiFleetService();
            pageInstance = new OptiFleetPage();

            __awaiter(this, void 0, void 0, function* () {
                serviceInstance.get(`/MinerInfo?siteId=${siteId}&zoneId=${-1}&zoneName=All%20Zones`)
                    .then((resp) => {
                    resp.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");
                    let miners = resp.miners;
                    console.log("Miners Data:", miners);

                    // Get first miner in the list and if it existed before/changed any
                    const firstMiner = miners[0];
                    if (miners.length > 0) {
                        //console.log("First Miner:", !lastMinersLookup[firstMiner.id]);
                        //console.log("Last Site ID:", lastSiteId, "Current Site ID:", siteId);
                        //console.log(lastSiteId === '-1' || siteId === '-1', Object.keys(lastMinersLookup).length, miners.length);
                        // Either the a miner no longer exists or we've swaped from/to an all sites and the length changed, if either of those are true we can assume the data has changed
                        // Or hasRefreshed so let's reload the data regardless, just in case anything changed
                        if (!lastMinersLookup[firstMiner.id] || (lastSiteId === '-1' || siteId === '-1') && Object.keys(lastMinersLookup).length !== miners.length || hasRefreshed) {
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
                    miners.forEach(miner => {
                        allMinersLookup[miner.id] = miner;
                    });
    
                    // Get the miners data
                    allMinersData = miners;
    
                    // Call the callback function if it exists
                    if (callback) {
                        callback(miners);
                    }
                }).catch((error) => {
                    console.error("Error fetching miners data:", error);

                    if(keepTrying) {
                        console.log("Retrying to get miner data");
                        setTimeout(function() {
                            updateAllMinersData(true, callback);
                        }, 500);
                    }
                });
                
            });

            /*
            // Call the getMiners method
            viewServiceInstance.getMiners(companyId, siteId).then(function(miners) {
               
            }).catch(function(error) {
                
            });
            */
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
                status: minerDetailsCrude['Status'],
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

        // SN Scanner Logic
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
                            window.open(`https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`).focus();
                        }
                    }, 500);
                }
                lastInputTime = Date.now();
            });
        }

        // Copy Miner Details Logic
        if (currentUrl.includes("foundryoptifleet.com/Content/Miners/IndividualMiner")) {
            console.log("Individual Miner Page");

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

            function copyAllDetailsForSharepoint(issue, log, type, hbSerialNumber, hbModel, hbVersion, chainIssue, binNumber) {
                var [cleanedText, minerDetails] = getMinerDetails();
                const { model, serialNumber, facility, ipAddress, locationID, activePool, status } = minerDetails;
                let modelLite = model.replace('Antminer ', '');
                let modelLiteSplit = modelLite.split(' (');
                modelLite = modelLiteSplit[0];
                const hashRate = modelLiteSplit[1].replace(')', '');
                let modelWithoutParens = model.replace('(', '').replace(')', '');

                minerDetails['type'] = type;
                minerDetails['issue'] = issue;
                minerDetails['log'] = log;
                minerDetails['hashRate'] = hashRate;

                console.log(`${model} - ${serialNumber} - ${issue}`);
                console.log(cleanedText);

                GM_SuperValue.set("taskName", `${model} - ${serialNumber} - ${issue}`);
                GM_SuperValue.set("taskNotes", cleanedText);
                GM_SuperValue.set("taskComment", log);
                GM_SuperValue.set("detailsData", JSON.stringify(minerDetails));

                const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
                let textToCopy = `${serialNumber}\t${modelLite}\t${hashRate}\t${issue}\t${status}\t${currentDate}`;

                if(type === "Fortitude") {
                    textToCopy = `${serialNumber}\t${modelWithoutParens}\t${hbSerialNumber}\t${hbModel}\t${hbVersion}\t${chainIssue}\t${binNumber}`;
                }

                copyTextToClipboard(textToCopy);
                /*
                //window.open("https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3", 'Paste Data').focus();
                if(type === "Bitmain") {
                    window.open("https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3", 'Looking').focus();
                } else {
                    window.open(urlLookupExcel[type], 'Paste Data').focus();
                }*/

                const sharePointLinks = {
                    "Bitmain": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/EoZ4RPEfVj9EjKlBzWmVHVcBcqZQzo2BiBC8_eM0WoABiw?e=wOZWEz",
                    "Fortitude": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/En56U6QoEzVCsNkYkXQOqxIBFLcql6OxnNJYBTX_r6ZIsw?e=oEb1JA",
                    "RAMM": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/EsrLwwsTo8JCr2aO7FT924sBrQ-oP4Nehl8sFROGcirBwg?e=jKhBzT"
                }

                window.open(sharePointLinks[type], 'Paste Data').focus();
                
            }

            function createDataInputPopup() {
                // Create a popup element for entering Issue and Log
                const popupElement = document.createElement('div');
                popupElement.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #333; color: white; padding: 20px;">
                        <h1>Enter Issue and Log</h1>
                        <form id="issueLogForm">
                            <div id="normalIssueContainer" style="margin-bottom: 10px;">
                                <label for="issue" style="display: block; font-weight: bold;">Issue:</label>
                                <input type="text" id="issue" name="issue" required style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label for="log" style="display: block; font-weight: bold;">Log:</label>
                                <textarea id="log" name="log" required style="width: 100%; height: 100px; padding: 5px; color: white;"></textarea>
                            </div>
                            <div id="hbSerialNumberContainer" style="margin-bottom: 10px; display: none;">
                                <label for="hbSerialNumber" style="display: block; font-weight: bold;">HB Serial Number:</label>
                                <input type="text" id="hbSerialNumber" name="hbSerialNumber" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="hbModelContainer" style="margin-bottom: 10px; display: none;">
                                <label for="hbModel" style="display: block; font-weight: bold;">HB Model:</label>
                                <input type="text" id="hbModel" name="hbModel" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="hbVersionContainer" style="margin-bottom: 10px; display: none;">
                                <label for="hbVersion" style="display: block; font-weight: bold;">HB Version:</label>
                                <input type="text" id="hbVersion" name="hbVersion" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="chainIssueContainer" style="margin-bottom: 10px; display: none;">
                                <label for="chainIssue" style="display: block; font-weight: bold;">Chain Issue:</label>
                                <input type="text" id="chainIssue" name="chainIssue" style="width: 100%; padding: 5px; color: white;">
                            </div>
                            <div id="binNumberContainer" style="margin-bottom: 10px; display: none;">
                                <label for="binNumber" style="display: block; font-weight: bold;">BIN#:</label>
                                <input type="text" id="binNumber" name="binNumber" style="width: 100%; padding: 5px; color: white;">
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

                // Whenever type is changed, update the inputs to hide/show based on the type
                popupElement.querySelector('#type').addEventListener('change', function() {
                    const type = this.value;
                    const hbSerialNumberContainer = popupElement.querySelector('#hbSerialNumberContainer');
                    const hbModelContainer = popupElement.querySelector('#hbModelContainer');
                    const hbVersionContainer = popupElement.querySelector('#hbVersionContainer');
                    const chainIssueContainer = popupElement.querySelector('#chainIssueContainer');
                    const binNumberContainer = popupElement.querySelector('#binNumberContainer');

                    const normalIssueContainer = popupElement.querySelector('#normalIssueContainer');

                    if (type !== "Fortitude") {
                        hbSerialNumberContainer.style.display = 'none';
                        hbModelContainer.style.display = 'none';
                        hbVersionContainer.style.display = 'none';
                        chainIssueContainer.style.display = 'none';
                        binNumberContainer.style.display = 'none';
                    } else {
                        hbSerialNumberContainer.style.display = 'block';
                        hbModelContainer.style.display = 'block';
                        hbVersionContainer.style.display = 'block';
                        chainIssueContainer.style.display = 'block';
                        binNumberContainer.style.display = 'block';
                    }
                });

                // Hide the Edit Links button for the meantime
                popupElement.querySelector('#linksBtn').style.display = 'none';

                // Function to submit Issue and Log
                function submitIssueLog() {
                    const issue = document.getElementById("issue").value;
                    const log = document.getElementById("log").value;
                    const type = document.getElementById("type").value;

                    const hbSerialNumber = document.getElementById("hbSerialNumber").value;
                    const hbModel = document.getElementById("hbModel").value;
                    const hbVersion = document.getElementById("hbVersion").value;
                    const chainIssue = document.getElementById("chainIssue").value;
                    const binNumber = document.getElementById("binNumber").value;

                    // Remove the popup element
                    popupElement.remove();

                    // Copy the details for Quick Sharepoint & Planner and set the taskName and taskNotes
                    copyAllDetailsForSharepoint(issue, log, type, hbSerialNumber, hbModel, hbVersion, chainIssue, binNumber);
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

            addCopyButtonsToElements();
            addMutationObserver();
        }

        //--------------------------------------------
        // Scan Logic/Auto Reboot Logic
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
                                    var curTextContent = minerData['Temp.'].textContent; 
                                    if (containerTemp && !curTextContent.includes('C')) { // doesn't contain added text already
                                        if(curTextContent === "999-999-999" || curTextContent === "255-255-255" || curTextContent === "---") {
                                            curTextContent = "Error";
                                        }
                                        
                                        minerData['Temp.'].textContent = "Boards: " + curTextContent;

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

                    function formatUptime(uptime) {
                        var minutes = Math.floor(uptime % (60*60) / 60);
                        var seconds = Math.floor(uptime % 60);

                        return `${minutes}m ${seconds}s`;
                    }

                    function createScanOverlayUI() {
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

                        // Add percentage text to top left of the screen
                        var percentageText = document.createElement('div');
                        percentageText.textContent = '';
                        percentageText.style.position = 'absolute';
                        percentageText.style.left = '10px';
                        percentageText.style.top = '10px';
                        percentageText.style.color = 'white';
                        percentageText.style.fontSize = '1em';
                        scanningElement.appendChild(percentageText);

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

                        function setPreviousLogDone(currentMinerId, symbol, additionalText) {
                            let logEntry = logEntries[currentMinerId];
                            if (!logEntry) { return; }

                            const wasScrollAtBottom = progressLog.scrollTop + progressLog.clientHeight >= progressLog.scrollHeight-10;

                            symbol = symbol || '✓';

                            // Make it a checkmark
                            const checkmark = document.createElement('span');
                            checkmark.textContent = symbol;
                            checkmark.style.display = 'inline-block';
                            checkmark.style.position = 'absolute';
                            checkmark.style.right = '10px';

                            // Remove the spinning 'loading' icon from the log entry
                            const loadingIcon = logEntry.querySelector('span');
                            if (loadingIcon) {
                                // Add the checkmark right before the loading icon
                                logEntry.insertBefore(checkmark, loadingIcon);

                                // Stop the spinning
                                clearInterval(loadingIcon.loadingIconInterval);
                                loadingIcon.remove();
                            }

                            if (additionalText) {
                                logEntry.appendChild(document.createElement('br'));
                                const additionalTextNode = document.createTextNode(additionalText);
                                const additionalTextLines = additionalText.split('\n');
                                additionalTextLines.forEach((line, index) => {
                                    logEntry.appendChild(document.createTextNode(line));
                                    if (index < additionalTextLines.length - 1) {
                                        logEntry.appendChild(document.createElement('br'));
                                    }
                                });
                            }

                            // Scroll to the bottom of the progress log
                            if (wasScrollAtBottom) {
                                progressLog.scrollTop = progressLog.scrollHeight;
                            }
                        }

                        function addToProgressLog(currentMiner) {
                            const wasScrollAtBottom = progressLog.scrollTop + progressLog.clientHeight >= progressLog.scrollHeight-10;
                            
                            // Add to progress log
                            const logEntry = document.createElement('div');
                            const logLink = document.createElement('a');
                            const minerID = currentMiner.id;
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
                            if (wasScrollAtBottom) {
                                progressLog.scrollTop = progressLog.scrollHeight;
                            }
                        }

                        return [scanningElement, progressBar, progressFill, scanningText, percentageText, progressLog, logEntries, addToProgressLog, setPreviousLogDone];
                    }

                    var orginalTitle = document.title;
                    function startScan(timeFrame, autoreboot, rebootAllMiners) {
                        var rebootData = {};

                        // Get saved last reboot times
                        var lastRebootTimes = GM_SuperValue.get('lastRebootTimes', {});
                        var reachedScanEnd = false;

                        function getTotalRebootCount() {
                            var rebootCount = 0;
                            var earliestTime = new Date();
                            var timeLeft = '';
                            for (const [minerID, rebootData] of Object.entries(lastRebootTimes)) {
                                var softRebootTimes = rebootData.softRebootsTimes || [];
                                var lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                                var timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                                if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 15*60*1000) {
                                    rebootCount++;
                                    if(new Date(lastSoftRebootTime) <= earliestTime) {
                                        earliestTime = new Date(lastSoftRebootTime);
                                        const timeToReset = new Date(earliestTime.getTime() + 15*60*1000);
                                        timeLeft = Math.floor((timeToReset - new Date()) / 1000);
                                        const minutes = Math.floor(timeLeft / 60);
                                        const seconds = timeLeft % 60;
                                        timeLeft = ` | ${minutes}m ${seconds}s`;
                                    }
                                }
                            }
                            return [rebootCount, timeLeft];
                        }

                        // Close the dropdown
                        issues.toggleDropdownMenu('newActionsDropdown');

                        let [scanningElement, progressBar, progressFill, scanningText, percentageText, progressLog, logEntries, addToProgressLog, setPreviousLogDone] = createScanOverlayUI();

                        // Set the webpage title
                        document.title = orginalTitle + ' | Retrieving Miner Data...';
                        retrieveContainerTempData((containerTempData) => {
                            function rebootLogic(rebootMiners) {
                                var minersScanData = {};
                                var maxRebootAllowed = 100;

                                // Animate the dots cycling
                                let dots = 0;
                                var scanningInterval = setInterval(() => {
                                    dots = (dots + 1) % 4;
                                    scanningText.textContent = 'Scanning' + '.'.repeat(dots);
                                }, 500);

                                //var currentMiner = rebootMiners[0];
                                var currentMinerIndex = 0;
                                var updatePercentageTextInteval = setInterval(() => {
                                    // Calculate the progress percentage
                                    var totalMiners = rebootMiners.length;
                                    var minersScanned = currentMinerIndex;
                                    const progressPercentage = (minersScanned / totalMiners) * 100;

                                    // Update the progress bar fill and percentage text
                                    progressFill.style.width = progressPercentage + '%';
                                    percentageText.textContent = Math.floor(progressPercentage) + '% (' + minersScanned + '/' + totalMiners + ')';

                                    // Update the title
                                    document.title = orginalTitle + ' | ' + percentageText.textContent;

                                    if (reachedScanEnd) {
                                        clearInterval(updatePercentageTextInteval);
                                    }
                                }, 50);

                                // Loop through allMinersData and get the uptime
                                var firstScan = true;
                                let stackDepth = 0;
                                const maxStackDepth = 65;
                                function parseMinerUpTimeData(currentMiner, timeFrame, callback) {
                                    stackDepth++;

                                    if(stackDepth >= maxStackDepth) {
                                        stackDepth = 0;
                                        setTimeout(() => { // Time out to try and fix max call stack error
                                            parseMinerUpTimeData(currentMiner, timeFrame, callback);
                                        }, 0);
                                        return
                                    }

                                    let minerID = currentMiner.id;

                                    addToProgressLog(currentMiner);

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

                                        const min15 = 15*60;
                                        const minSoftRebootUpTime = 60*60; // 1 hour
                                        const upTime = currentMiner.uptimeValue;
                                        const container = location.split("_")[1].split("-")[0].replace(/\D/g, '').replace(/^0+/, '');
                                        const maxTemp = 78;
                                        const containerTemp = containerTempData[container].temp;
                                        const powerMode = currentMiner.powerModeName;
                                        let hashRateEfficiency = currentMiner.hashRatePercent;
                                        if(!rebootAllMiners) {
                                            hashRateEfficiency = false;
                                        }

                                        const isOnline = currentMiner.statusName === 'Online';
                                        let moreThanOneHour = upTime > minSoftRebootUpTime;
                                        const belowMaxTemp = containerTemp <= maxTemp;

                                        const minerRebootTimesData = lastRebootTimes[minerID] || {};
                                        const softRebootTimes = minerRebootTimesData.softRebootsTimes || [];
                                        const lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                                        const timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                                        
                                        if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 60*60*1000) { // Mainly if the page was reloaded or something and another scan was started before the miner uptime data could change so it still thinks it hasn't been rebooted IE the uptime hasn't changed
                                            moreThanOneHour = false;
                                        }

                                        rebootData[minerID] = rebootData[minerID] || {};
                                        rebootData[minerID].belowMaxTemp = belowMaxTemp;
                                        rebootData[minerID].moreThanOneHour = moreThanOneHour;
                                        rebootData[minerID].isOnline = isOnline;
                                        rebootData[minerID].details = [];
                                        rebootData[minerID].miner = currentMiner;

                                        if(isOnline) {
                                            if(moreThanOneHour && belowMaxTemp && (!hashRateEfficiency || hashRateEfficiency > 0)) { // If the miner passed the conditions, then we can reboot it

                                                // Loop through lastRebootTimes, and get the last reboot time for each miner, if it has been less than 15 minutes, we will count that as activly rebooting
                                                var rebootCount = getTotalRebootCount()[0];

                                                if(rebootCount < maxRebootAllowed) {
                                                    // Reboot the miner
                                                    const minerIdList = [minerID];
                                                    
                                                    rebootData[minerID].details.main = "Sent Soft Reboot";
                                                    rebootData[minerID].details.sub = [
                                                        "Miner has been online for more than 1 hour.",
                                                        "Miner is below 78°F."
                                                    ];
                                                    
                                                    const formattedTime = new Date(new Date().toISOString()).toLocaleTimeString();
                                                    rebootData[minerID].details.sub.push("Soft Reboot sent at: " + formattedTime);
                                                    rebootData[minerID].details.sub.push("Soft Reboot ends at: " + new Date(new Date(new Date().toISOString()).getTime() + min15*1000).toLocaleTimeString());

                                                    // Update the lastRebootTimes
                                                    lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                                    lastRebootTimes[minerID].upTimeAtReboot = upTime;
                                                    lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                                    lastRebootTimes[minerID].softRebootsTimes.push(new Date().toISOString());

                                                    // Actually send the reboot request
                                                    pageInstance.post(`/RebootMiners`, { miners: minerIdList, bypassed: false })
                                                        .then(() => {
                                                            console.log("Rebooted Miner: " + minerID);
                                                        })
                                                        .catch((error) => {
                                                            console.error("Failed to reboot Miner: " + minerID, error);
                                                            
                                                            // Remove the last reboot time if the reboot failed
                                                            //lastRebootTimes[minerID].softRebootsTimes.pop();

                                                            // Save the last reboot times
                                                            //GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
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
                                                    rebootData[minerID].details.sub.push("Soft Reboot ends at: " + new Date(new Date(lastSoftRebootTime).getTime() + min15*1000).toLocaleTimeString());
                                                    const timeLeft = (min15*1000 - timeSinceLastSoftReboot)/1000;
                                                    rebootData[minerID].details.sub.push("Time Left: " + formatUptime(timeLeft));
                                                } else {
                                                    rebootData[minerID].details.main = "Soft Reboot Skipped";
                                                    rebootData[minerID].details.sub = [];
                                                    if(!moreThanOneHour) {
                                                        rebootData[minerID].details.sub.push("Miner has an uptime less than 1 hour.");
                                                        rebootData[minerID].details.sub.push("Current Uptime: " + formatUptime(upTime));
                                                    }
                                                }
                                            }

                                            if(powerMode === "Low Power") {
                                                rebootData[minerID].details.sub.push("Miner is in Low Power Mode.");
                                            }
                                        }
                                    
                                        // If the miner has a lastRebootTime and it is at or more than 15 minutes and still has a 0 hash rate, then we can flag it to be hard rebooted, or if the miner last uptime is the same as the current uptime
                                        const minTime = 15*60*1000; // 15 minutes
                                        const forgetTime = 60*60*1000; // 1 hours

                                        const isPastMinTime = timeSinceLastSoftReboot >= minTime;
                                        const notPastForgetTime = timeSinceLastSoftReboot < forgetTime;

                                        // Loops through the softRebootsTimes and remove any that are more than 6 hours old
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                        lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                        lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes.filter((time) => {
                                            return (new Date() - new Date(time)) < 6*60*60*1000;
                                        });

                                        const numOfSoftReboots = lastRebootTimes[minerID].softRebootsTimes.length;
                                        const moreThan3SoftReboots = numOfSoftReboots >= 3;

                                        // Check if the miner is at 0 uptime and is online, if so that might indicate it is stuck, but we only do it if the normal soft reboot conditions have gone through and is now skipping
                                        const stuckAtZero = upTime === 0 && isOnline && rebootData[minerID].details.main === "Soft Reboot Skipped";
                                        if(stuckAtZero) {
                                            rebootData[minerID].details.sub.push("Miner might be stuck at 0 uptime? Please wait for confirmation check...");
                                        }

                                        const hardRebootAttemptedTime = lastRebootTimes[minerID].hardRebootAttempted || false;
                                        const timeSinceHardRebootAttempted = hardRebootAttemptedTime ? (new Date() - new Date(hardRebootAttemptedTime)) : false;
                                        const hardRebootAttempted = (timeSinceHardRebootAttempted && timeSinceHardRebootAttempted < 6*60*60*1000) || hardRebootAttemptedTime === true;

                                        let hardRebootRecommended = lastRebootTimes[minerID].hardRebootRecommended || false;
                                        const timeSinceHardRebootRecommended = hardRebootRecommended ? (new Date() - new Date(hardRebootRecommended)) : false;
                                        hardRebootRecommended = timeSinceHardRebootRecommended && timeSinceHardRebootRecommended < 6*60*60*1000; // 6 hours

                                        const manualHardReboot = lastRebootTimes[minerID].manualHardReboot || false;
                                        
                                        if( !hardRebootAttempted && ((isPastMinTime && notPastForgetTime) || moreThan3SoftReboots || !isOnline || manualHardReboot)) {
                                            lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};

                                            rebootData[minerID].details.main = "Hard Reboot Recommended";
                                            rebootData[minerID].details.sub = [];
                                            rebootData[minerID].details.color = 'orange';

                                            if(manualHardReboot) {
                                                rebootData[minerID].details.sub.push("Manually set should hard reboot.");
                                            }

                                            if(isPastMinTime && notPastForgetTime) {
                                                rebootData[minerID].details.sub.push("15 Minutes has passed since last soft reboot and miner is still not hashing.");
                                            }

                                            if(moreThan3SoftReboots) {
                                                rebootData[minerID].details.sub.push(`${numOfSoftReboots} Soft Reboots sent from this computer in the last 6 hours`);
                                            }

                                            if(!isOnline) {
                                                rebootData[minerID].details.sub.push("Miner is offline.");
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
                                                const timeSinceSent = new Date() - new Date(hardRebootAttemptedTime);
                                                const timeLeft = (min15*1000 - timeSinceSent)/1000;
                                                rebootData[minerID].details.sub.push("Time Left: " + formatUptime(timeLeft));
                                            }

                                            if(!isOnline) {
                                                rebootData[minerID].details.sub.push("Miner is offline.");
                                            } else if(stuckAtZero) {
                                                rebootData[minerID].details.sub.push("Miner is stuck at 0 uptime.");
                                            }
                                        }

                                        if(powerMode === "Sleep") {
                                            rebootData[minerID].details.main = "Sleep Mode";
                                            rebootData[minerID].details.sub.push("Miner is in Sleep Mode.");
                                        }

                                        if(!belowMaxTemp) {
                                            rebootData[minerID].details.main = "Container Over Temp";
                                            rebootData[minerID].details.sub.push("Container is above 78°F.");
                                        }

                                        if(hashRateEfficiency) {
                                            rebootData[minerID].details.sub.push("Hash Rate Efficiency: " + (hashRateEfficiency*100).toFixed(1));
                                        }

                                        lastRebootTimes[minerID].previousUpTime = upTime;
                                    }

                                    function runNextMiner() {
                                        setPreviousLogDone(currentMiner.id);

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
                                            if (currentMinerIndex < Object.keys(rebootMiners).length) {
                                                currentMiner = rebootMiners[currentMinerIndex];
                                                parseMinerUpTimeData(currentMiner, timeFrame);
                                            }
                                        }

                                        // If we are done with all the miners, then add a log entry
                                        if(reachedScanEnd) {
                                            console.log("Reached the end of the scan");
                                            return;
                                        }

                                        if (currentMinerIndex === Object.keys(rebootMiners).length) {
                                            reachedScanEnd = true;
                                            
                                            // Save the rebootData
                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                            // Stop the scanning interval
                                            clearInterval(scanningInterval);

                                            if(autoreboot && firstScan) {
                                                firstScan = false;

                                                // Create table for the miners that should be hard rebooted
                                                const cols = ['IP', 'Miner', 'Slot ID & Breaker', 'Serial Number', "Scan Result"];
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

                                                    // Add a "Refreshing in (60s)" text
                                                    let countdown = 60;
                                                    if(rebootAllMiners) {
                                                        countdown = 60*15;
                                                    }
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

                                                    function setUpRowData(row, currentMiner) {
                                                        let minerID = currentMiner.id;
                                                        let minerRebootData = rebootData[minerID];
                                                        let model = currentMiner.modelName;
                                                        let slotID = currentMiner.locationName;

                                                        var splitSlotID = slotID.split('-');
                                                        var containerID = splitSlotID[0].split('_')[1];
                                                        var rackNum = Number(splitSlotID[1]);
                                                        var rowNum = Number(splitSlotID[2]);
                                                        var colNum = Number(splitSlotID[3]);
                                                        var rowWidth = 4;
                                                        var breakerNum = (rowNum-1)*rowWidth + colNum;
                
                                                        // Remakes the slot ID, but with added 0 padding
                                                        let reconstructedSlotID = `${containerID}-${rackNum.toString().padStart(2, '0')}-${rowNum.toString().padStart(2, '0')}-${colNum.toString().padStart(2, '0')}`;

                                                        // Adds together the slot ID and breaker number, where the breaker number is padded with spaces
                                                        let paddedSlotIDBreaker = `${reconstructedSlotID}  [${breakerNum.toString().padStart(2, '0')}]`;

                                                        let minerSerialNumber = currentMiner.serialNumber;
                                                        minerRebootData.details.main = minerRebootData.details.main || "ERROR";
                                                        minerRebootData.details.sub = minerRebootData.details.sub || ["Failed to get details!"];
                                                        
                                                        let minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                        row.innerHTML = `
                                                            <td style="text-align: left; position: relative;">
                                                                <a href="http://${currentMiner.username}:${currentMiner.passwd}@${currentMiner.ipAddress}/" target="_blank" style="color: white;">${currentMiner.ipAddress}</a>
                                                            </td>
                                                            <td style="text-align: left; position: relative;">
                                                                <a href="${minerLink}" target="_blank" style="color: white;">${model}</a>
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
                                                        row.minerDataCopy = structuredClone(currentMiner);

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
                                                                lastRebootTimes[minerID].manualHardReboot = false;

                                                                // make a copy of the details data
                                                                lastRebootTimes[minerID].previousDetails = structuredClone(rebootData[minerID].details);

                                                                // Save lastRebootTimes
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                                // Set the details to show that it is hard rebooting
                                                                rebootData[minerID].details.main = "Waiting on Hard Reboot Result";
                                                                rebootData[minerID].details.sub = ["15 Minutes has not passed since hard reboot mark time."];

                                                                setUpRowData(row, currentMiner);
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

                                                                setUpRowData(row, currentMiner);
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

                                                                setUpRowData(row, currentMiner);
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
                                                                lastRebootTimes[minerID].manualHardReboot = true;
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                rebootData[minerID].details.sub = ["Manually set should hard reboot."];
                                                                setUpRowData(row, currentMiner);
                                                            }

                                                            function setShouldPull() {
                                                                lastRebootTimes[minerID].hardRebootAttempted = true;
                                                                lastRebootTimes[minerID].hardRebootRecommended = false;
                                                                lastRebootTimes[minerID].manualHardReboot = false;

                                                                rebootData[minerID].details.main = "Pull Recommended";
                                                                rebootData[minerID].details.sub = ["Manually set should pull."];

                                                                // make a copy of the details data
                                                                lastRebootTimes[minerID].previousDetails = structuredClone(rebootData[minerID].details);
                                                                
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                
                                                                setUpRowData(row, currentMiner);
                                                            }

                                                            function markFixed() {
                                                                lastRebootTimes[minerID] = {};
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                rebootData[minerID].details.main = "Marked Fixed";
                                                                rebootData[minerID].details.sub = ["Manually marked fixed.", "Erased stored reboot data."];
                                                                setUpRowData(row, currentMiner);
                                                                rebootData[minerID] = {};
                                                            }
                                                        });
                                                        
                                                        // Add hover event listeners to show/hide the full details
                                                        const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                        const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                                        document.body.appendChild(tooltip);
                                                        questionMark.addEventListener('mouseenter', () => {
                                                            tooltip.style.display = 'block';

                                                            // Position the tooltip to the left of the question mark with the added width
                                                            const questionMarkRect = questionMark.getBoundingClientRect();
                                                            const tooltipRect = tooltip.getBoundingClientRect();
                                                            tooltip.style.left = `${questionMarkRect.left - tooltipRect.width}px`;
                                                            tooltip.style.right = 'auto';

                                                            // Set top position to be the same as the question mark
                                                            tooltip.style.top = `${questionMarkRect.top}px`;
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

                                                        // Observe for changes to the table and delete the tooltip if so
                                                        const observer = new MutationObserver(() => {
                                                            tooltip.remove();
                                                            observer.disconnect();
                                                        });

                                                        observer.observe(row, { childList: true });

                                                        // Proper stuck at 0 uptime check
                                                        const mightBeStuck = "Miner might be stuck at 0 uptime? Please wait for confirmation check...";
                                                        if(minerRebootData.details.sub.includes(mightBeStuck)) {
                                                            // Check if the miner has had no uptimes within 30 minutes
                                                            
                                                            retrieveMinerData("MinerHashrate", minerID, 60*30, function(minerID, minerMinerHashrates) {
                                                                // Loop through the hashrates and check for any 0 hashrates
                                                                let hasHashrate = false;
                                                                let previouHashrate = 0;
                                                                let zeroCount = 0;
                                                                let lastHashrateTime = -1;
                                                                for (const [index, data] of Object.entries(minerMinerHashrates)) {
                                                                    let timestamp = data[0];
                                                                    let hashrate = data[1];

                                                                    if (hashrate === 0 && previouHashrate > 0) {
                                                                        zeroCount++;
                                                                    }

                                                                    console.log("Hashrate: " + hashrate);
                                                                    if (hashrate > 0) {
                                                                        hasHashrate = true;
                                                                        lastHashrateTime = timestamp
                                                                        console.log("Has Hashrate: " + hasHashrate);
                                                                    }
                                                                    previouHashrate = hashrate;
                                                                }
                                                                
                                                                if(!hasHashrate) {
                                                                    rebootData[minerID].details.sub.push("Miner has not hashed in the last 30 minutes.");
                                                                    
                                                                    if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                        rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                        rebootData[minerID].details.color = 'orange';
                                                                        lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                        GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                    }
                                                                } else if(zeroCount > 3) {
                                                                    rebootData[minerID].details.sub.push("Miner has had numerous non hashing times in the last 30 minutes.");
                                                                    rebootData[minerID].details.sub.push("Non Hashing Count: " + zeroCount);
                                                                    
                                                                    if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                        rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                        rebootData[minerID].details.color = 'orange';
                                                                        lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                        GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                    }
                                                                }

                                                                if(hasHashrate) {
                                                                    let lastHashrateTimeDate = new Date(lastHashrateTime);
                                                                    let formattedTime = lastHashrateTimeDate.toLocaleTimeString();
                                                                    rebootData[minerID].details.sub.push("Last Hashrate Time: " + formattedTime);

                                                                    let nonHashingTime = new Date() - lastHashrateTimeDate;
                                                                    let nonHashingTimeFormatted = formatUptime(nonHashingTime/1000);
                                                                    rebootData[minerID].details.sub.push("Non Hashing for: " + nonHashingTimeFormatted);    
                                                                }

                                                                retrieveMinerData("MinerOnline", minerID, 60*30, function(minerID, minerUptime) {
                                                                    // Loop through the uptime and check for any uptimes
                                                                    var hasUptime = false;
                                                                    var previouState = '1';
                                                                    var downCount = 0;
                                                                    var lastOnlineTime = 0;
                                                                    for (const [index, data] of Object.entries(minerUptime)) {
                                                                        var timestamp = data[0];
                                                                        var state = data[1];

                                                                        if (state === '0' && previouState === '1') {
                                                                            downCount++;
                                                                        }

                                                                        if (state === '1') {
                                                                            hasUptime = true;
                                                                            lastOnlineTime = timestamp;
                                                                        }
                                                                        previouState = state;
                                                                    }

                                                                    // Remove the might be stuck at 0 uptime message if the miner has had uptimes
                                                                    rebootData[minerID].details.sub = rebootData[minerID].details.sub.filter(sub => sub !== mightBeStuck);

                                                                    if(!hasUptime) {
                                                                        rebootData[minerID].details.sub.push("Miner is stuck at 0 uptime, there has been no uptimes in the last 30 minutes.");
                                                                        
                                                                        if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                            rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                            rebootData[minerID].details.color = 'orange';
                                                                            lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                            GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                        }
                                                                    } else {
                                                                        if(downCount > 2) {
                                                                            rebootData[minerID].details.sub.push("Miner has had numerous downtimes in the last 30 minutes.");
                                                                            rebootData[minerID].details.sub.push("Offline Count: " + downCount);
                                                                            
                                                                            if(rebootData[minerID].details.main === "Soft Reboot Skipped") {
                                                                                rebootData[minerID].details.main = "Hard Reboot Recommended";
                                                                                rebootData[minerID].details.color = 'orange';
                                                                                lastRebootTimes[minerID].hardRebootRecommended = new Date().toISOString();
                                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);
                                                                            }
                                                                        }
                                                                        let lastOnlineTimeDate = new Date(lastOnlineTime);
                                                                        let formattedTime = lastOnlineTimeDate.toLocaleTimeString();
                                                                        rebootData[minerID].details.sub.push("Last Online Time: " + formattedTime);

                                                                        let offlineTime = new Date() - lastOnlineTimeDate;
                                                                        let offlineTimeFormatted = formatUptime(offlineTime/1000);
                                                                        rebootData[minerID].details.sub.push("Offline for: " + offlineTimeFormatted);
                                                                    }
                                                                    
                                                                    setUpRowData(row, currentMiner);
                                                                });
                                                            });
                                                        }
                                                    }

                                                    var showSkipped = true;
                                                    var showSuccess = true;
                                                    var showSleepMode = true;
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
                                                            if(curResultText.includes("Sleep Mode")) {
                                                                row.style.display = showSleepMode ? '' : 'none';
                                                            }
                                                        });

                                                        // If the table is grouped, resort by Slot ID & Breaker
                                                        const slotIDBreakerIndex = Array.from(popupResultElement.querySelector('thead').querySelectorAll('th')).findIndex(th => th.textContent === 'Slot ID & Breaker');
                                                        var grouped = $('#minerTable').attr('isGrouped');
                                                        if (grouped === 'true') {
                                                            const table = $('#minerTable').DataTable();
                                                            orderType = reversed ? 'desc' : 'asc';
                                                            table.order([slotIDBreakerIndex, orderType]).draw();
                                                        }
                                                    }

                                                    // Refresh button functionality
                                                    refreshAutoRebootButton.onclick = function() {

                                                        if(rebootAllMiners) {
                                                            const finishedHardRebootsButton = document.querySelector('#finishedHardReboots');
                                                            finishedHardRebootsButton.click();
                                                            startScan(timeFrame, autoreboot, rebootAllMiners);
                                                            return
                                                        }

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

                                                        function refreshTableLogic(rebootMiners) {
                                                            
                                                            console.log("Refreshed issue miners:", rebootMiners);

                                                            let rebootMinersLookup = {};
                                                            rebootMiners.forEach(miner => {
                                                                rebootMinersLookup[miner.id] = miner;
                                                            });

                                                            // Get what we're currently sorting by
                                                            var orderColumn = $('#minerTable').attr('colIndex') || 0;
                                                            var orderType = $('#minerTable').attr('orderType') || 'asc';
                                                            var grouped = $('#minerTable').attr('isGrouped');

                                                            // Loop through the table and heighlight the miner we're currently on for 0.5 seconds
                                                            var currentRow = 0;
                                                            var tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                            tableRows.forEach((row, index) => {
                                                                let minerID = row.minerID;
                                                                let currentMiner = rebootMinersLookup[minerID];

                                                                if(minerID) {
                                                                    rebootData[minerID] = rebootData[minerID] || {};
                                                                    rebootData[minerID].details = rebootData[minerID].details || {};
                                                                }
                                                                
                                                                // If the miner had been set to have a hard reboot recommend, then let's skip the check as we want to wait until the user marks that it has been hard rebooted
                                                                if(minerID && rebootData[minerID].details.main !== "Hard Reboot Recommended") {
                                                                    // Check the miner (If the currentMiner is no longer valid, then we can assume it is hashing again since it is no longer in the issue miners)
                                                                    if(!currentMiner) {
                                                                        let rowMinerDataCopy = row.minerDataCopy;
                                                                        rebootData[minerID] = rebootData[minerID] || {};
                                                                        rebootData[minerID].details = {};
                                                                        rebootData[minerID].details.main = "Successfully Hashing";
                                                                        rebootData[minerID].details.sub = ["Miner is now hashing again."];
                                                                        rebootData[minerID].details.color = '#218838';
                                                                        setUpRowData(row, rowMinerDataCopy);
                                                                    } else if(currentMiner) {
                                                                        parseMinerUpTimeData(currentMiner, timeFrame, (currentMiner, timeFrame,) => {
                                                                            setUpRowData(row, currentMiner);
                                                                        });
                                                                    }
                                                                }
                                                            });

                                                            
                                                            // Find any new miners in the rebootMiners that are not in the table
                                                            console.log("Checking for new miners to add to the table...");
                                                            for (const miner of rebootMiners) {
                                                                if (miner === undefined || miner === null || !miner.id) {
                                                                    continue;
                                                                }

                                                                var found = false;
                                                                tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                                tableRows.forEach((row, index) => {
                                                                    let minerID = row.minerID;
                                                                    if(minerID === miner.id) {
                                                                        found = true;
                                                                    }
                                                                });
                                                                console.log("Found:", found);

                                                                if (!found) {
                                                                    console.log('Adding new miner to the table:', miner.id);
                                                                    parseMinerUpTimeData(miner, timeFrame, (miner) => {
                                                                        rebootData[miner.id] = rebootData[miner.id] || {};
                                                                        rebootData[miner.id].details = rebootData[miner.id].details || {};
                                                                        rebootData[miner.id].details.sub = rebootData[miner.id].details.sub || [];
                                                                        rebootData[miner.id].details.sub.push("Just added to the table.");
                                                                        var newRow = document.createElement('tr');
                                                                        popupResultElement.querySelector('tbody').appendChild(newRow);
                                                                        setUpRowData(newRow, miner);

                                                                        // draw the row
                                                                        setTimeout(() => {
                                                                            $('#minerTable').DataTable().row.add(newRow).draw();
                                                                        }, 0);
                                                                    });
                                                                }
                                                            }

                                                            toggleSkippedMiners();

                                                            // Reset the target time
                                                            targetTime = Date.now() + countdown * 1000;

                                                            // Delete the invisible div to allow the user to click the table again
                                                            invisibleDiv.remove();

                                                            // Set the scan text to say "Refreshing in (60s)"
                                                            refreshText.textContent = `Refreshing in (${countdown}s)`;

                                                            // Set the scanned miners text
                                                            let newTotal = 0;
                                                            tableRows.forEach((row, index) => {
                                                                if(row.minerID) {
                                                                    newTotal++;
                                                                }
                                                            });
                                                            percentageText.textContent = '100% (' + newTotal + '/' + newTotal + ')';

                                                            // Resort the table
                                                            if (grouped === "false") {
                                                                console.log("Resorting table...");
                                                                $('#minerTable').DataTable().order([orderColumn, orderType]).draw();
                                                            }

                                                            // Save these back, since it weirdly gets messed up...?
                                                            $('#minerTable').attr('colIndex', orderColumn);
                                                            $('#minerTable').attr('orderType', orderType);
                                                            $('#minerTable').attr('isGrouped', grouped);
                                                            console.log("Refreshed table with order:", orderColumn, orderType);
                                                        }

                                                        if(rebootAllMiners) {
                                                            updateAllMinersData(true, (allMiners) => {
                                                                //Loop through the allMiners and check their hashrate efficiency
                                                                for (let index = allMiners.length - 1; index >= 0; index--) {
                                                                    const currentMiner = allMiners[index];
                                                                    console.log("Checking miner:", currentMiner);
                                                                    const expectedHash = currentMiner.expectedHashRate || 0;
                                                                    const currentHash = currentMiner.hashrate || 0;
                                                                    const hashEfficiency = Math.round((currentHash / expectedHash) * 100);

                                                                    let hashRatePercent = currentMiner.hashRatePercent || 0;
                                                                    hashRatePercent = hashRatePercent * 100;
                                                                    // If the miner is at or above the rebootAllMiners threshold, then remove it from the list
                                                                    if(hashEfficiency >= rebootAllMiners || hashRatePercent >= rebootAllMiners) {
                                                                        allMiners.splice(index, 1);
                                                                        continue;
                                                                    }
                                                                }

                                                                refreshTableLogic(allMiners);
                                                            });
                                                        } else {
                                                            retrieveIssueMiners((issueMiners) => {
                                                                // Only get the actual non hashing miners
                                                                issueMiners = issueMiners.filter(miner => miner.currentHashRate === 0 || miner.issueType === 'Non Hashing');
                                                                refreshTableLogic(issueMiners);
                                                            });
                                                        }
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
                                                    softRebootingMinersText.textContent = `Sent Soft Reboots: ${getTotalRebootCount()[0]}/${maxRebootAllowed}${getTotalRebootCount()[1]}`;

                                                    const softRebootingMinersTextInterval = setInterval(() => {
                                                        const rebootData = getTotalRebootCount();
                                                        const resetTime = rebootData[1];
                                                        const firstReboot = lastRebootTimes[Object.keys(lastRebootTimes)[0]];
                                                        softRebootingMinersText.textContent = `Sent Soft Reboots: ${rebootData[0]}/${maxRebootAllowed}${resetTime}`;
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
                                                    showSkippedButton.textContent = 'Hide Soft Reboot Miners';
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

                                                        // Set the button text to the opposite of what it was
                                                        this.textContent = showSkipped ? 'Hide Soft Reboot Miners' : 'Show Soft Reboot Miners';
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

                                                    showSuccessfulButton.textContent = 'Hide Successful Miners';
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

                                                        // Set the button text to the opposite of what it was
                                                        this.textContent = showSuccess ? 'Hide Successful Miners' : 'Show Successful Miners';
                                                    };

                                                    // Toggle Sleep Mode Miners
                                                    const toggleSleepModeButton = document.createElement('button');
                                                    toggleSleepModeButton.id = 'toggleSleepModeButton';
                                                    toggleSleepModeButton.style.cssText = `
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
                                                    toggleSleepModeButton.textContent = 'Hide Sleep Mode Miners';
                                                    firstDiv.appendChild(toggleSleepModeButton);
                                                    
                                                    // Add button hover effect
                                                    toggleSleepModeButton.addEventListener('mouseenter', function() {
                                                        this.style.backgroundColor = '#005a9e';
                                                    });

                                                    toggleSleepModeButton.addEventListener('mouseleave', function() {
                                                        this.style.backgroundColor = '#0078d4';
                                                    });

                                                    // Toggle Sleep Mode Miners functionality
                                                    toggleSleepModeButton.onclick = function() {
                                                        showSleepMode = !showSleepMode;
                                                        toggleSkippedMiners();

                                                        // Set the button text to the opposite of what it was
                                                        this.textContent = showSleepMode ? 'Hide Sleep Mode Miners' : 'Show Sleep Mode Miners';
                                                    };

                                                    // Get the 3 toggle buttons, find the longest one, and set the other two to the same width
                                                    const buttons = [showSkippedButton, showSuccessfulButton, toggleSleepModeButton];
                                                    buttons.forEach(button => button.style.width = `${200}px`);
                                                    

                                                    /*
                                                    // Add a checkbox for "Include Low Hashing Miners"
                                                    const includeLowHashingMinersContainer = document.createElement('div');
                                                    includeLowHashingMinersContainer.style.cssText = `
                                                        display: flex;
                                                        align-items: center;
                                                        margin-top: 10px;
                                                        align-self: flex-end;
                                                    `;
                                                    firstDiv.appendChild(includeLowHashingMinersContainer);
                                                    

                                                    const includeLowHashingMinersCheckbox = document.createElement('input');
                                                    includeLowHashingMinersCheckbox.id = 'includeLowHashingMinersCheckbox';
                                                    includeLowHashingMinersCheckbox.type = 'checkbox';
                                                    includeLowHashingMinersCheckbox.style.cssText = `
                                                        margin-right: 5px;
                                                    `;
                                                    includeLowHashingMinersContainer.appendChild(includeLowHashingMinersCheckbox);

                                                    // Add a label for the checkbox
                                                    const includeLowHashingMinersLabel = document.createElement('label');
                                                    includeLowHashingMinersLabel.htmlFor = 'includeLowHashingMinersCheckbox';
                                                    includeLowHashingMinersLabel.textContent = 'Include Low Hashing Miners';
                                                    includeLowHashingMinersContainer.appendChild(includeLowHashingMinersLabel);
                                                    */

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

                                                        // Set page title back to the original title
                                                        document.title = orginalTitle;
                                                    };

                                                    // Add the miner data to the table body
                                                    const popupTableBody = popupResultElement.querySelector('tbody');
                                                    Object.keys(rebootData).forEach(minerID => {
                                                        if (true) {
                                                            const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                            const row = document.createElement('tr');

                                                            let curMiner = rebootData[minerID].miner;
                                                            setUpRowData(row, curMiner);
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
                                                        $('#minerTable').DataTable().order([4, 'asc']).draw();

                                                        // Attach event listener for column sorting
                                                        $('#minerTable').DataTable().on('order.dt', function() {

                                                            $('#minerTable').attr('colIndex', $('#minerTable').DataTable().order()[0][0]);
                                                            $('#minerTable').attr('orderType', $('#minerTable').DataTable().order()[0][1]);
                                                            console.log("Order:", $('#minerTable').DataTable().order()[0][0], $('#minerTable').DataTable().order()[0][1]);

                                                            // If the table is sorted by the "Slot ID & Breaker" column, group the rows by container
                                                            const slotIDBreakerIndex = Array.from($('#minerTable th')).findIndex(th => th.textContent.includes('Slot ID & Breaker'));
                                                            console.log("Slot ID Breaker Index:", slotIDBreakerIndex);
                                                            if ($('#minerTable').DataTable().order()[0][0] === slotIDBreakerIndex) {
                                                                // Group rows by container
                                                                let currentContainer = null;
                                                                let containerGroup = null;
                                                                $('#minerTable tbody tr').each(function() {
                                                                    // If the row isn't hidden via display: none, group it
                                                                    if ($(this).css('display') !== 'none') {
                                                                        let container = `Container ` + $(this).find(`td:eq(${slotIDBreakerIndex})`).text().split('-')[0].substring(1);
                                                                        if (!/\d/.test(container)) {
                                                                            container = "Unknown";
                                                                        }
                                                                        if (container !== currentContainer) {
                                                                            currentContainer = container;
                                                                            const colCount = $('#minerTable thead tr th').length;
                                                                            containerGroup = $('<tr class="container-group"><td colspan="' + colCount + '" style="text-align: left; padding-left: 10px; background-color: #444947; color: white; height: 20px !important; padding: 5px; margin: 0px;">' + container + '</td></tr>');
                                                                            $(this).before(containerGroup);
                                                                        }
                                                                    }
                                                                });

                                                                // Set that the table is grouped
                                                                $('#minerTable').attr('isGrouped', 'true');
                                                            } else {
                                                                // Remove the container groups
                                                                $('.container-group').remove();

                                                                // Set that the table is not grouped
                                                                $('#minerTable').attr('isGrouped', 'false');
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
                                                minersScanData[minerID].miner = currentMiner;
                    
                                                // Run next miner
                                                runNextMiner();
                                            });
                                        });
                                    } else {
                                        checkMiner(minerID);
                                        runNextMiner();
                                    }

                                    if(callback) {
                                        callback(currentMiner, timeFrame);
                                    }
                                }
                                parseMinerUpTimeData(rebootMiners[0], timeFrame);

                                const waitTillDone = setInterval(() => {
                                    if (Object.keys(minersScanData).length === Object.keys(rebootMiners).length) {
                                        clearInterval(waitTillDone);

                                        // Remove the scanning element
                                        scanningElement.remove();
                                        progressLog.remove();
                                        clearInterval(scanningInterval);

                                        // Create a popup element for showing the results
                                        const cols = ['IP', 'Miner', 'Offline Count', 'Overall Hash Efficiency', 'Online Hash Efficiency', 'Slot ID', 'Serial Number'];
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
                                                const currentMiner =  minersScanData[minerID].miner;
                                                const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                const minerIP = currentMiner.ipAddress;
                                                const row = document.createElement('tr');
                                                const model = currentMiner.modelName;
                                                const rebootCount = minersScanData[minerID].downTimes;
                                                const overallHashRate = minersScanData[minerID].overallHashRate;
                                                const onlineHashRate = minersScanData[minerID].onlineHashRate;
                                                const minerSlotID = currentMiner.locationName;
                                                const minerSerialNumber = currentMiner.serialNumber;
                                                row.innerHTML = `
                                                    <td style="text-align: left;"><a href="http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/" target="_blank" style="color: white;">${minerIP}</a></td>
                                                    <td style="text-align: left;"><a href="${minerLink}" target="_blank" style="color: white;">${model}</a></td>
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
                            }

                            if(rebootAllMiners) {
                                console.log("Rebooting all miners...");
                                updateAllMinersData(true, (allMiners) => {

                                    //Loop through the allMiners and check their hashrate efficiency
                                    for (let index = allMiners.length - 1; index >= 0; index--) {
                                        const currentMiner = allMiners[index];
                                        const expectedHash = currentMiner.expectedHashRate || 0;
                                        const currentHash = currentMiner.hashrate || "error";
                                        const hashEfficiency = currentHash !== "error" ? Math.round((currentHash / expectedHash) * 100) : "error";

                                        let hashRatePercent = currentMiner.hashRatePercent || 0;
                                        hashRatePercent = hashRatePercent * 100;
                                        // If the miner is at or above 100% efficiency, then we can remove it from the list
                                        if(hashEfficiency >= rebootAllMiners || currentHash === "error" || hashRatePercent >= rebootAllMiners) {
                                            allMiners.splice(index, 1);
                                            continue;
                                        }

                                        // if locationName contains Minden_C18, remove it
                                        if(currentMiner.locationName.includes("Minden_C18")) {
                                            allMiners.splice(index, 1);
                                            continue;
                                        }
                                    }

                                    rebootLogic(allMiners);
                                });
                            } else {
                                retrieveIssueMiners((issueMiners) => {
                                    // If we are in auto reboot mode, remove any miner that isn't completely non-hashing
                                    if (autoreboot) {
                                        issueMiners = issueMiners.filter(miner => miner.currentHashRate === 0 || miner.issueType === 'Non Hashing');
                                    }
                                    rebootLogic(issueMiners)
                                });
                            }
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

                    function padSlotID(slotID) {
                        var splitSlotID = slotID.split('-');
                        var containerID = splitSlotID[0].split('_')[1];
                        var rackNum = Number(splitSlotID[1]);
                        var rowNum = Number(splitSlotID[2]);
                        var colNum = Number(splitSlotID[3]);
                        var rowWidth = 4;
                        var breakerNum = (rowNum-1)*rowWidth + colNum;

                        // Remakes the slot ID, but with added 0 padding
                        let reconstructedSlotID = `${containerID}-${rackNum.toString().padStart(2, '0')}-${rowNum.toString().padStart(2, '0')}-${colNum.toString().padStart(2, '0')}`;

                        // Adds together the slot ID and breaker number, where the breaker number is padded with spaces
                        let paddedSlotIDBreaker = `${reconstructedSlotID}  [${breakerNum.toString().padStart(2, '0')}]`;

                        return paddedSlotIDBreaker;
                    }


                    // Create a error scan button
                    const errorScanDropdown = document.createElement('div');
                    errorScanDropdown.classList.add('op-dropdown');
                    errorScanDropdown.style.display = 'inline-block';
                    errorScanDropdown.innerHTML = `
                        <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('errorScanDropdown'); return false;">
                            Error Scan
                            <m-icon name="chevron-down" class="button-caret-down" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                        </button>
                        <div id="errorScanDropdown" class="m-dropdown-menu is-position-right" aria-hidden="true">
                            <div class="m-menu">
                                <div class="m-menu-item" onclick="errorScan(true)">
                                    All Issue Miners Scan
                                </div>
                                <div class="m-menu-item" onclick="errorScan(false)">
                                    Non-Hashing Only Scan
                                </div>
                            </div>
                        </div>
                    `;



                    // Add the auto reboot button to the right of the dropdown
                    actionsDropdown.before(errorScanDropdown);

                    errorScan = function(allScan) {
                        //
                        let [scanningElement, progressBar, progressFill, scanningText, percentageText, progressLog, logEntries, addToProgressLog, setPreviousLogDone] = createScanOverlayUI();
                        retrieveIssueMiners((issueMiners) => {
                            let currentCheckLoadedInterval = null;

                            // Animate the dots cycling
                            let dots = 0;
                            let scanningInterval = setInterval(() => {
                                dots = (dots + 1) % 4;
                                scanningText.textContent = 'Scanning' + '.'.repeat(dots);
                            }, 500);

                            // Add 'cancel' button to bottom left of the scanning element
                            const cancelButton = document.createElement('button');
                            cancelButton.classList.add('m-button');
                            cancelButton.style.position = 'absolute';
                            cancelButton.style.bottom = '10px';
                            cancelButton.style.left = '10px';
                            cancelButton.style.backgroundColor = '#ff3832';
                            cancelButton.textContent = 'Cancel';
                            cancelButton.onclick = function() {
                                clearInterval(currentCheckLoadedInterval);
                                currentCheckLoadedInterval = null;
                                clearInterval(scanningInterval);
                                scanningElement.remove();
                                progressLog.remove();
                                // loop through openedWindows
                                openedWindows.forEach(curWindow => {
                                    if (curWindow.window) {
                                        curWindow.window.close();
                                    }
                                });
                            };
                            scanningElement.appendChild(cancelButton);

                            // Hover effect for the cancel button
                            cancelButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#ff5e57';
                            });

                            cancelButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#ff3832';
                            });

                            // Only get the actual non hashing miners
                            console.log("Issue Miners:", issueMiners);
                            offlineMiners = issueMiners.filter(miner => miner.statusName === 'Offline');
                            //issueMiners = issueMiners.filter(miner => miner.statusName === 'Online'); // && !miner.firmwareVersion.includes('BCFMiner'));
                            if(!allScan) {
                                issueMiners = issueMiners.filter(miner => miner.currentHashRate === 0 || miner.issueType === 'Non Hashing');
                            }
                            
                            let errorScanMiners = structuredClone(issueMiners);
                            let scanComplete = false;
                            GM_SuperValue.set('errorsFound', {});

                            if (issueMiners.length === 0 && offlineMiners.length === 0) {
                                clearInterval(scanningInterval);
                                scanningText.textContent = '[No miners to scan]';
                                return;
                            }

                            const scanMinersLookup = {};
                            issueMiners.forEach(miner => {
                                scanMinersLookup[miner.id] = structuredClone(miner);
                            });

                            let openedWindows = [];
                            let currentlyScanning = {};
                            GM_SuperValue.set('currentlyScanning', currentlyScanning);

                            let maxScan = 1; // currently WIP, anythign above 1 will cause issues

                            // fill the openedWindows array with false
                            for (let i = 0; i < maxScan; i++) {
                                openedWindows.push({window: false, nextReady: false});
                            }

                            let failLoadCount = 0;
                            let offlineCount = offlineMiners.length;
                            let noErrorCount = 0;
                            let handledOffline = false;

                            function openMinerGUILog() {
                                if(!handledOffline) {
                                    handledOffline = true;
                                    if(offlineMiners.length > 0) {
                                        offlineMiners.forEach(miner => {
                                            addToProgressLog(miner);
                                            setPreviousLogDone(miner.id, "✖", "Miner Offline, according to OptiFleet.");

                                            // Remove the miner from the errorScanMiners array
                                            errorScanMiners = errorScanMiners.filter(errorMiner => errorMiner.id !== miner.id);

                                            // Add the miner being offline to the errorsFound object
                                            const errorsFound = GM_SuperValue.get('errorsFound', {});
                                            errorsFound[miner.id] = [{
                                                name: "Miner Offline, according to OptiFleet.",
                                                short: "Miner Offline",
                                                icon: "https://img.icons8.com/?size=100&id=111057&format=png&color=FFFFFF"
                                            }];
                                            GM_SuperValue.set('errorsFound', errorsFound);
                                        });
                                    }
                                }

                                // Update the percentage text
                                percentageText.textContent = `${Math.round(((issueMiners.length - errorScanMiners.length) / issueMiners.length) * 100)}% (${issueMiners.length - errorScanMiners.length}/${issueMiners.length})`;

                                // Update the progress bar
                                progressFill.style.width = `${((issueMiners.length - errorScanMiners.length) / issueMiners.length) * 100}%`;

                                // Check if there are no miners left to scan
                                if (errorScanMiners.length === 0) {
                                    return;
                                }
                                
                                // Get first miner
                                let currentMiner = errorScanMiners[0];
                                for (let i = 1; i < errorScanMiners.length; i++) {
                                    if(currentlyScanning[currentMiner.ipAddress]) {
                                        currentMiner = errorScanMiners[i];
                                        if (i === errorScanMiners.length - 1) {
                                            return;
                                        }
                                    } else {
                                        break;
                                    }
                                }

                                const minerIP = currentMiner.ipAddress;
                                let guiLink = `http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/#blog`;
                                if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                    guiLink = `http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/#/logs`;
                                }

                                console.log("Opening miner GUI for:", currentMiner);
                                console.log("GUI Link:", guiLink);

                                // Open the miner in a new tab
                                addToProgressLog(currentMiner);

                                // loop through openedWindows
                                let currentWindowIndex = 0;
                                for (let index = 0; index < openedWindows.length; index++) {
                                    let curWindow = openedWindows[index].window;
                                    if(!curWindow || curWindow.closed) {
                                        currentlyScanning[minerIP] = currentMiner;
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        currentWindowIndex = index;
                                        let logWindow = window.open(guiLink, '_blank', 'width=1,height=1,left=0,top=' + (window.innerHeight - 400));
                                        openedWindows[index].window = logWindow;
                                        openedWindows[index].nextReady = false;
                                        break;
                                    } else if(openedWindows[index].nextReady) {
                                        currentlyScanning[minerIP] = currentMiner;
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        currentWindowIndex = index;
                                        openedWindows[index].nextReady = false;
                                        //redirect the current window to the new miner
                                        curWindow.location.href = guiLink;
                                        break;
                                    }
                                }

                                // Wait for the miner gui to load
                                let loaded = false;
                                currentCheckLoadedInterval = setInterval(() => {
                                    const guiLoaded = GM_SuperValue.get('minerGUILoaded_' + currentMiner.id, false);
                                    const errorsFound = GM_SuperValue.get('errorsFound', false);
                                    if(guiLoaded && errorsFound && errorsFound[currentMiner.id]) {
                                        loaded = true;
                                        const minerErrors = errorsFound[currentMiner.id] || [];
                                        console.log("Miner Errors:", minerErrors);
                                        let errorNames = "";
                                        minerErrors.forEach(error => {
                                            errorNames += `• ${error.name}\n`;
                                        });
                                        // if there are no errors, set the errorNames to "No Errors Found"
                                        if(errorNames === "") {
                                            errorNames = "No Errors Found";
                                            noErrorCount++;
                                        }
                                        setPreviousLogDone(currentMiner.id, "✔", errorNames);
                                        clearInterval(currentCheckLoadedInterval);
                                        
                                        GM_SuperValue.set('minerGUILoaded_' + currentMiner.id, false);
                                        delete currentlyScanning[minerIP];
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        openedWindows[currentWindowIndex].nextReady = true;
                                        errorScanMiners.shift();
                                        openMinerGUILog();
                                    }
                                }, 10);

                                // Check if the miner gui loaded in a certain amount of time
                                setTimeout(() => {
                                    if (!loaded && currentCheckLoadedInterval) {
                                        let failText = "Failed to load miner GUI.";
                                        if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                            failText = "Failed to load miner GUI or got stuck on Username/Password prompt.";
                                        }
                                        setPreviousLogDone(currentMiner.id, "✖", failText);
                                        failLoadCount++;
                                        clearInterval(currentCheckLoadedInterval);

                                        const errorsFound = GM_SuperValue.get('errorsFound', {});
                                        errorsFound[currentMiner.id] = [{
                                            name: failText,
                                            short: "GUI Load Fail",
                                            icon: "https://img.icons8.com/?size=100&id=111057&format=png&color=FFFFFF"
                                        }];
                                        GM_SuperValue.set('errorsFound', errorsFound);

                                        // Move to the next miner
                                        delete currentlyScanning[minerIP];
                                        console.log("Currently Scanning:", currentlyScanning);
                                        console.log("Currently Scanning Length:", Object.keys(currentlyScanning).length);
                                        GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                        openedWindows[currentWindowIndex].nextReady = true;
                                        errorScanMiners.shift();
                                        openMinerGUILog();
                                    }
                                }, 6000);
                            }
                            
                            for (let i = 0; i < maxScan; i++) {
                                openMinerGUILog();
                            }
                            //openMinerGUILog();

                            // Keep checking until scan is done
                            const checkScanDoneInterval = setInterval(() => {
                                let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                                if(errorScanMiners.length === 0 && Object.keys(currentlyScanning).length === 0) {

                                    if(Object.keys(errorsFoundSave).length === 0) {
                                        clearInterval(scanningInterval);
                                        scanningText.textContent = '[No errors found]';
                                    }

                                    clearInterval(checkScanDoneInterval);

                                    // Loop through all the opened windows and make sure they are closed
                                    openedWindows.forEach(curWindow => {
                                        if (curWindow.window) {
                                            curWindow.window.close();
                                        }
                                    });

                                    cancelButton.remove();

                                    const cols = ['Miner Errors'];
                                    createPopUpTable(`Error Log Scan Results`, cols, false, (popupResultElement) => {
                                        
                                        const firstDiv = popupResultElement.querySelector('div');

                                        function setUpRowData(row, currentMiner, error) {
                                            let minerID = currentMiner.id;
                                           
                                            row.innerHTML = `
                                                <td style="text-align: left; position: relative;">
                                                    ${error.name}
                                                    <div style="display: inline-block; margin-left: 5px; cursor: pointer; position: relative; float: right;">
                                                        <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0078d4; color: white; text-align: center; line-height: 20px; font-size: 12px; border: 1px solid black; font-weight: bold; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">!</div>
                                                        <div style="display: none; position: absolute; top: 20px; right: 0; background-color: #444947; color: white; padding: 5px; border-radius: 5px; z-index: 9999; white-space: nowrap; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
                                                            [Error Log]
                                                            <div style="display: block; padding: 5px; background-color: #444947; color: white; border-radius: 5px; margin-top: 5px; white-space: pre-wrap;">${error.text}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            `;
                                            
                                            row.minerID = minerID;
                                            row.minerDataCopy = structuredClone(currentMiner);

                                            console.log("Row:", row);
                                            console.log("Error:", error);
                                            if(!error.text) {
                                                row.innerHTML = `
                                                    <td style="text-align: left; position: relative;">
                                                        ${error.name}
                                                    </td>
                                                `;
                                            } else {

                                                var questionColor = 'red';
                                                if(questionColor) {
                                                    row.querySelector('td:last-child div[style*="position: relative;"] div').style.backgroundColor = questionColor;   
                                                }
                                                
                                                // Add hover event listeners to show/hide the full details
                                                const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                                document.body.appendChild(tooltip);
                                                questionMark.addEventListener('mouseenter', () => {
                                                    tooltip.style.display = 'block';

                                                    // Position the tooltip to the left of the question mark with the added width
                                                    const questionMarkRect = questionMark.getBoundingClientRect();
                                                    const tooltipRect = tooltip.getBoundingClientRect();
                                                    tooltip.style.left = `${questionMarkRect.left - tooltipRect.width}px`;
                                                    tooltip.style.right = 'auto';

                                                    // Set top position to be the same as the question mark
                                                    tooltip.style.top = `${questionMarkRect.top}px`;
                                                });

                                                // when clicked, open the error log
                                                questionMark.addEventListener('click', () => {
                                                    const ip = currentMiner.ipAddress;
                                                    let GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${ip}/#blog`;
                                                    if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                                        GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${ip}/#/logs`;
                                                    }
                                                    GM_SuperValue.set('quickGoToLog', {ip: ip, errorText: error.text, category: error.category});
                                                    window.open(GUILink, '_blank');
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

                                                // Observe for changes to the table and delete the tooltip if so
                                                const observer = new MutationObserver(() => {
                                                    tooltip.remove();
                                                    observer.disconnect();
                                                });

                                                observer.observe(row, { childList: true });
                                            }
                                        }

                                        /*
                                        // Add text saying the current soft rebooting miners from getTotalRebootCount() that updates
                                        const tipText = document.createElement('div');
                                        tipText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;
                                            border-radius: 5px;
                                            margin-top: 10px;
                                            align-self: flex-start;
                                            font-size: 0.8em;
                                        `;
                                        firstDiv.appendChild(tipText);
                                        tipText.textContent = `Note: This does not include BCFMiner firmware (Foundry GUI) Miners or Miners that are not online.`;
                                        */

                                        // Add the count of failLoadCount noErrorCount
                                        const containerDiv = document.createElement('div');
                                        containerDiv.style.cssText = `
                                            display: flex;
                                            gap: 10px;
                                            padding: 0px;
                                            background-color: #444947;
                                            border-radius: 10px;
                                            margin-top: 10px;
                                            align-self: flex-start; /* Align to the left side */
                                        `;

                                        const failLoadCountText = document.createElement('div');
                                        failLoadCountText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;
                                            border-radius: 5px;
                                            font-size: 0.8em;
                                        `;
                                        failLoadCountText.textContent = `GUI Load Fails: ${failLoadCount}`;

                                        const offlineCountText = document.createElement('div');
                                        offlineCountText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;
                                            border-radius: 5px;
                                            font-size: 0.8em;
                                        `;
                                        offlineCountText.textContent = `Offline Miners: ${offlineCount}`;

                                        const noErrorCountText = document.createElement('div');
                                        noErrorCountText.style.cssText = `
                                            padding: 5px;
                                            background-color: #444947;  
                                            border-radius: 5px;
                                            font-size: 0.8em;
                                        `;
                                        noErrorCountText.textContent = `No Errors Found Miners: ${noErrorCount}`;

                                        containerDiv.appendChild(failLoadCountText);
                                        containerDiv.appendChild(offlineCountText);
                                        containerDiv.appendChild(noErrorCountText);
                                        firstDiv.appendChild(containerDiv);

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
                                        finishedButton.textContent = 'Close Error Scan Results';
                                        firstDiv.appendChild(finishedButton);

                                        // Set the popupResultElement to be aligned to the left side
                                        firstDiv.style.left = '41%'

                                        // Now that the button is created, we can attach event listeners
                                        const finishedErrorScan = popupResultElement.querySelector('#finishedHardReboots');

                                        // Add button hover effect
                                        finishedErrorScan.addEventListener('mouseenter', function() {
                                            this.style.backgroundColor = '#45a049';
                                        });

                                        finishedErrorScan.addEventListener('mouseleave', function() {
                                            this.style.backgroundColor = '#4CAF50';
                                        });

                                        // Close button functionality
                                        finishedErrorScan.onclick = function() {
                                            scanningElement.remove();
                                            progressLog.remove();
                                            clearInterval(scanningInterval);

                                            popupResultElement.remove();
                                            popupResultElement = null;
                                        };

                                        // Add the miner data to the table body
                                        const popupTableBody = popupResultElement.querySelector('tbody');

                                        // Resorts the errors alphabetically by slot ID
                                        issueMiners.sort((a, b) => {
                                            let aSlotID = a.locationName;
                                            let bSlotID = b.locationName;

                                            let aSlotIDBreaker = padSlotID(aSlotID);
                                            let bSlotIDBreaker = padSlotID(bSlotID);

                                            return aSlotIDBreaker.localeCompare(bSlotIDBreaker);
                                        });

                                        issueMiners.forEach(miner => {
                                            const minerID = miner.id;
                                            const errors = errorsFoundSave[minerID] || [];
                                           

                                            errors.forEach((error, index) => {
                                                const row = document.createElement('tr');

                                                let curMiner = scanMinersLookup[minerID];
                                                setUpRowData(row, curMiner, error);
                                                popupTableBody.appendChild(row);
                                            });
                                        });

                                        // Loop through all the rows and group together the same miners by a single row
                                        const allRows = Array.from(popupTableBody.querySelectorAll('tr'));
                                        for (let i = 0; i < allRows.length; i++) {
                                            const currentRow = allRows[i];
                                            const previousRow = allRows[i - 1] || null;
                                            let currentMiner = currentRow.minerDataCopy;
                                            let minerID = currentRow.minerID;
                                            let model = currentMiner.modelName;
                                            let slotID = currentMiner.locationName;

                                            let paddedSlotIDBreaker = padSlotID(slotID);       
    
                                            let minerSerialNumber = currentMiner.serialNumber;
                                            let minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                            //http://root:root@${currentMiner.ipAddress}/

                                            console.log(currentMiner);

                                            // If the previous row is null or a different miner, then we need to create a new row
                                            if (!previousRow || currentRow.minerID !== previousRow.minerID) {
                                                let GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${currentMiner.ipAddress}/#blog`;
                                                if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                                    GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${currentMiner.ipAddress}/#/logs`;
                                                }

                                                const errorData = errorsFoundSave[minerID] || [];
                                                let errorCount = errorData.length;
                                                if(errorCount === 1 && !errorData[0].text) {
                                                    errorCount = '?';
                                                }

                                                let iconLinks = [];
                                                if(errorData) {
                                                    errorData.forEach(error => {
                                                        // Check if the icon already exists, if not add it, if so increment the count
                                                        if(!iconLinks.find(icon => icon.icon === error.icon)) {
                                                            iconLinks.push({icon: error.icon, count: 1, name: error.name});
                                                        } else {
                                                            iconLinks.find(icon => icon.icon === error.icon).count++;                                                            
                                                        }
                                                    });
                                                }

                                                // Create a span containing all the icons with the count to the bottom right of each.
                                                const iconSpan = document.createElement('span');
                                                iconSpan.style.cssText = `
                                                    display: inline-block;
                                                    margin-left: 0px;
                                                    float: right;
                                                    background-color: #333;
                                                    padding: 2px;
                                                    border-radius: 5px;
                                                    outline: 1px solid #000;
                                                `;
                                                
                                                iconLinks.forEach(icon => {
                                                    const iconDiv = document.createElement('div');
                                                    iconDiv.style.cssText = `
                                                        display: inline-block;
                                                        margin-top: 3px;
                                                        margin-left: -8px;
                                                    `;
                                                    iconDiv.innerHTML = `
                                                        <span style="position: relative; top: -10px; right: -10px; background-color: red; color: white; border-radius: 50%; padding: 1px 3px; font-size: 10px;">${icon.count}</span>
                                                        <img src="${icon.icon}" style="width: 18px; height: 18px; margin-right: 5px; margin-left: 0px;"/>
                                                    `;
                                                    iconSpan.appendChild(iconDiv);

                                                    // Remove the count if is less than 2
                                                    if(icon.count < 2) {
                                                        iconDiv.querySelector('span').remove();

                                                        let imgElement = iconDiv.querySelector('img');

                                                        // Adjust the icon padding/margins to account for the missing count
                                                        iconDiv.style.paddingLeft = '2px';
                                                        iconDiv.style.paddingRight = '2px';
                                                        iconDiv.style.marginLeft = '0px';
                                                        iconDiv.style.marginRight = '0px';
                                                        imgElement.style.marginLeft = '0px';
                                                        imgElement.style.marginRight = '0px';
                                                        imgElement.style.paddingLeft = '0px';
                                                        imgElement.style.paddingRight = '0px';

                                                        // Fixes the margin of the first icon
                                                        if(iconLinks.length > 1 && icon === iconLinks[0]) {
                                                            iconDiv.style.marginLeft = '1px';
                                                        }
                                                    }

                                                    // Add a tooltip to show the name of the error
                                                    const iconDivTooltip = iconDiv.querySelector('span');
                                                    const tooltip = document.createElement('div');
                                                    tooltip.style.cssText = `
                                                        display: none;
                                                        position: absolute;
                                                        background-color: #444947;
                                                        color: white;
                                                        padding: 5px 10px;
                                                        border-radius: 5px;
                                                        font-size: 12px;
                                                        z-index: 9999;
                                                        white-space: nowrap;
                                                    `;
                                                    tooltip.textContent = icon.name;
                                                    document.body.appendChild(tooltip);

                                                    // Add hover event listeners to show/hide the full details
                                                    iconDiv.addEventListener('mouseenter', () => {
                                                        tooltip.style.display = 'block';

                                                        // Calculate the position of the icon relative to the scrollable container
                                                        const iconRect = iconDiv.getBoundingClientRect();
                                                        const containerRect = iconDiv.offsetParent.getBoundingClientRect();

                                                        // Position tooltip relative to the iconDiv within the scrollable container
                                                        const tooltipOffset = 5; // Gap between the icon and tooltip
                                                        tooltip.style.top = `${iconRect.top}px`;
                                                        tooltip.style.left = `${iconRect.right}px`; 
                                                    });

                                                    iconDiv.addEventListener('mouseleave', () => {
                                                        tooltip.style.display = 'none';
                                                    });
                                                });

                                                let errorCountText = "Error Count: " + errorCount;
                                                if(errorCount === '?') {
                                                    errorCountText = errorData[0].short || errorData[0].name || "Error Count: ?";
                                                }
                                                    
                                                // Create a new row to contain the miner's information
                                                const newRow = document.createElement('tr');
                                                newRow.style.backgroundColor = '#444947';
                                                newRow.style.color = 'white';
                                                newRow.style.height = '20px !important';
                                                newRow.style.padding = '5px';
                                                newRow.style.margin = '0px';
                                                newRow.innerHTML = `
                                                    <td colspan="7" style="text-align: right; padding-right: 6px; padding-left: 6px;">
                                                        <span class="error-guilink-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: left; left: 5px;">
                                                            <a href="${GUILink}" target="_blank" style="color: white;">${currentMiner.ipAddress}</a>
                                                        </span>
                                                        <span class="error-link-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: left; left: 5px;">
                                                            <a href="${minerLink}" target="_blank" style="color: white;">${model}</a>
                                                        </span>
                                                        <span class="error-serialnumber-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: left; left: 5px;">
                                                            ${minerSerialNumber}
                                                        </span>
                                                        <span style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: right;">
                                                            ${paddedSlotIDBreaker}
                                                        </span>
                                                        <span class="error-count-text" style="background-color: #333; padding: 5px; border-radius: 5px; outline: 1px solid #000; margin-left: 5px; float: right;">
                                                            ${errorCountText}
                                                        </span>
                                                    </td>
                                                `;
                                                newRow.querySelector('td').appendChild(iconSpan);

                                                // Add a plus/minus button to expand/collapse the category
                                                const toggleButtonSpan = document.createElement('span');
                                                toggleButtonSpan.style.cssText = `
                                                    padding: 5px;
                                                    border-radius: 5px;
                                                    outline: 1px solid #000;
                                                    margin-left: 5px;
                                                    float: left;
                                                    left: 5px;
                                                `;

                                                // Inject CSS into the document's head
                                                const style = document.createElement('style');
                                                style.textContent = `
                                                    .unselectable {
                                                        -webkit-user-select: none; /* Safari */
                                                        -moz-user-select: none;    /* Firefox */
                                                        -ms-user-select: none;     /* Internet Explorer/Edge */
                                                        user-select: none;         /* Non-prefixed version, currently supported by Chrome, Opera and Edge */
                                                    }
                                                `;
                                                document.head.appendChild(style);

                                                const toggleButton = document.createElement('button');
                                                toggleButton.textContent = '-';
                                                toggleButton.style.cssText = `
                                                    background-color: #0078d4;
                                                    color: white;
                                                    border: none;
                                                    cursor: pointer;
                                                    border-radius: 5px;
                                                    padding: 5px;
                                                    margin-right: 5px;
                                                    transition: background-color 0.3s;
                                                    width: 20px;
                                                    height: 20px;
                                                    display: flex;
                                                    justify-content: center;
                                                    align-items: center;
                                                `;

                                                // Add the button to the row
                                                newRow.querySelector('td').prepend(toggleButtonSpan);
                                                toggleButtonSpan.appendChild(toggleButton);
                                                
                                                // Add the unselectable class to all the elements
                                                newRow.classList.add('unselectable');

                                                // Add button hover effect
                                                toggleButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#005a9e';
                                                });

                                                toggleButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#0078d4';
                                                });

                                                let lastClickTime = 0;
                                                function expandCollapseRows() {
                                                    // Prevent double clicking
                                                    const currentTime = new Date().getTime();
                                                    if (currentTime - lastClickTime < 10) {
                                                        return;
                                                    }
                                                    lastClickTime = currentTime;
                                                    const isExpanded = toggleButton.textContent === '-';
                                                    toggleButton.textContent = isExpanded ? '+' : '-';
                                                    let nextRow = newRow.nextElementSibling;
                                                    while (nextRow && nextRow.minerID === minerID) {
                                                        nextRow.style.display = isExpanded ? 'none' : '';
                                                        nextRow = nextRow.nextElementSibling;
                                                    }
                                                }

                                                // Add click event to toggle the visibility of the rows
                                                toggleButton.addEventListener('click', function() {
                                                    expandCollapseRows();
                                                });
                                                currentRow.before(newRow);

                                                //Click the button to start collapsed
                                                toggleButton.click();

                                                // Clicking on the top row will expand/collapse the category
                                                newRow.addEventListener('click', function() {
                                                    expandCollapseRows();
                                                });
                                            }
                                        }

                                        // Get all error-count-text elements, find the max width, and set all to that width
                                        const setMaxWidth = (selector) => {
                                            const elements = Array.from(popupTableBody.querySelectorAll(selector));
                                            const maxWidth = Math.max(...elements.map(text => text.offsetWidth));
                                            elements.forEach(text => {
                                                text.style.width = `${maxWidth + 2}px`;
                                                text.style.textAlign = 'center';
                                            });
                                        };

                                        setMaxWidth('.error-count-text');
                                        setMaxWidth('.error-guilink-text');
                                        setMaxWidth('.error-link-text');
                                        setMaxWidth('.error-serialnumber-text');
                                    });
                                }
                            }, 100);

                        });
                    };

                    if(siteName.includes("Minden")) {
                        // Create a auto reboot button to the right of the dropdown
                        const autoRebootButton = document.createElement('button');
                        autoRebootButton.classList.add('m-button');
                        autoRebootButton.style.marginLeft = '10px';
                        autoRebootButton.textContent = 'Auto Reboot';
                        autoRebootButton.onclick = function(event) {
                            event.preventDefault(); // Prevent the default behavior of the button

                            startScan(60*60*24*7, true, false);
                        };

                        // Add the auto reboot button to the right of the dropdown
                        actionsDropdown.before(autoRebootButton);

                        // Create a 'full' auto reboot button to the right of the dropdown
                        const fullAutoRebootButton = document.createElement('button');
                        fullAutoRebootButton.classList.add('m-button');
                        fullAutoRebootButton.style.marginLeft = '10px';
                        fullAutoRebootButton.textContent = 'Full Auto Reboot';
                        fullAutoRebootButton.onclick = function(event) {
                            event.preventDefault(); // Prevent the default behavior of the button

                            // Create popup to type in what percentage efficiency to reboot at
                            const popup = document.createElement('div');
                            popup.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.5);
                                z-index: 1000;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            `;
                            document.body.appendChild(popup);

                            const popupContent = document.createElement('div');
                            popupContent.style.cssText = `
                                padding: 20px;
                                background-color: #333;
                                border-radius: 10px;
                            `;
                            popup.appendChild(popupContent);

                            const popupTitle = document.createElement('h2');
                            popupTitle.textContent = 'Efficiency percentage to reboot miners when at/below:';
                            popupTitle.style.color = 'white';
                            popupTitle.style.marginBottom = '10px';
                            popupContent.appendChild(popupTitle);

                            const currentEfficiency = GM_SuperValue.get('rebootEfficiency', 90);
                            const efficiencyInput = document.createElement('input');
                            efficiencyInput.type = 'number';
                            efficiencyInput.min = 0;
                            efficiencyInput.max = 100;
                            efficiencyInput.value = currentEfficiency;
                            efficiencyInput.style.width = '100%';
                            efficiencyInput.style.padding = '10px';
                            efficiencyInput.style.marginBottom = '10px';
                            efficiencyInput.style.color = 'white';
                            popupContent.appendChild(efficiencyInput);

                            const buttonsDiv = document.createElement('div');
                            buttonsDiv.style.display = 'flex';
                            buttonsDiv.style.justifyContent = 'space-between';
                            popupContent.appendChild(buttonsDiv);
                            

                            const submitButton = document.createElement('button');
                            submitButton.textContent = 'Submit';
                            submitButton.style.padding = '10px 20px';
                            submitButton.style.backgroundColor = '#0078d4';
                            submitButton.style.color = 'white';
                            submitButton.style.border = 'none';
                            submitButton.style.cursor = 'pointer';
                            submitButton.style.borderRadius = '5px';
                            submitButton.style.transition = 'background-color 0.3s';
                            submitButton.style.display = 'block';
                            submitButton.style.marginTop = '10px';
                            buttonsDiv.appendChild(submitButton);

                            submitButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#005a9e';
                            });

                            submitButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#0078d4';
                            });

                            submitButton.onclick = function() {
                                const efficiency = efficiencyInput.value;
                                console.log('Rebooting at efficiency:', efficiency);
                                GM_SuperValue.set('rebootEfficiency', efficiency);
                                startScan(60*60*24*7, true, efficiency);
                                popup.remove();
                            }

                            const closeButton = document.createElement('button');
                            closeButton.textContent = 'Cancel';
                            closeButton.style.padding = '10px 20px';
                            closeButton.style.backgroundColor = '#ff5e57';
                            closeButton.style.color = 'white';
                            closeButton.style.border = 'none';
                            closeButton.style.cursor = 'pointer';
                            closeButton.style.borderRadius = '5px';
                            closeButton.style.transition = 'background-color 0.3s';
                            closeButton.style.display = 'block';
                            closeButton.style.marginTop = '10px';
                            closeButton.style.marginLeft = '10px';
                            buttonsDiv.appendChild(closeButton);

                            closeButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#ff3832';
                            });

                            closeButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#ff5e57';
                            });

                            closeButton.onclick = function() {
                                popup.remove();
                            }
                        };

                        // Add the full auto reboot button to the right of the dropdown
                        actionsDropdown.before(fullAutoRebootButton);
                    }
                }

            }, 1000);
        }
        
        // Individual Miner Page added data boxes
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Miners/IndividualMiner")) {

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
        }
        
        // Miner Map/List, add temperature data
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/Miners/Map") || currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/Miners/List")) {
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
                if (mBox) {
                    retrieveContainerTempData((containerTempData) => {
                        var containerElement = document.querySelector('div.dropdown.clickable[onclick="$(`#zoneList`).data(\'kendoDropDownList\').toggle()"]');
                        if(!containerElement) {
                            containerElement = document.querySelector('div.dropdown.clickable[onclick*="ddlZones"]');
                        }
                        console.log(containerElement);
                        if (containerElement) {
                            const containerText = containerElement.textContent.trim();
                            // Make sure we in the minden site
                            if(containerText !== "zones" && !containerText.includes('Minden')) {
                                mBox.style.display = 'none';
                                return;
                            } else {
                                mBox.style.display = 'block';
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

        // Add temps for all containers if in overview page
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview")) {
            let lastRan = 0;
            function addTemperatureData() {
                const containers = document.querySelectorAll('.m-box.stat-panel.good');
                if (containers.length === 0) {
                    setTimeout(addTemperatureData, 10);
                    return;
                }

                console.log('Adding temperature data to containers:', containers.length);
                
                containers.forEach(container => {
                    // Add the temperature title if it doesn't exist
                    if (!container.querySelector('.temp-text-title')) {
                        const tempElement = document.createElement('div');
                        tempElement.className = 'temp-text-title';
                        tempElement.innerText = 'Temperature:';
                        container.appendChild(tempElement);
                    }
                });

                function getTemp() {
                    if (Date.now() - lastRan < 5000) {
                        return;
                    }
                    lastRan = Date.now();
                    retrieveContainerTempData((containerTempData) => {
                        containers.forEach(container => {
                            const containerNum = parseInt(container.querySelector('.m-heading').innerText.split('_')[1].substring(1));
                            if (isNaN(containerNum) || !containerTempData[containerNum]) {
                                return;
                            }
                            const tempValue = containerTempData[containerNum].temp.toFixed(2);
                            let tempElement = container.querySelector('.temp-text');
                            if(!tempElement) {
                                tempElement = document.createElement('div');
                                tempElement.className = 'temp-text';
                                container.appendChild(tempElement);
                            }
                            tempElement.innerText = tempValue + '°F';
                            if (tempValue > 80) {
                                tempElement.style.color = 'red';
                            } else if (tempValue > 70) {
                                tempElement.style.color = 'yellow';
                            } else {
                                tempElement.style.color = 'white';
                            }
                        });
                    });
                }

                getTemp();
            }

            addTemperatureData();
            setInterval(() => {
                addTemperatureData();
            }, 5000);

            // Observer any changes, if 'temp-text-title' is no longer there, then re-add it
            const observer = new MutationObserver((mutationsList, observer) => {
                addTemperatureData();
            });

            // Start observing the container
            observer.observe(document.body, { childList: true, subtree: true });
            
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
        let taskName = GM_SuperValue.get("taskName", "");
        const detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));
        const minerType = detailsData['type'];

        if (taskName !== "") {
            // If the minerType is contained in the URL, then we probably opened up the right excel sheet
            if(currentUrl.toLowerCase().includes(minerType.toLowerCase())) {
                console.log("Opened the right excel sheet");
                GM_SuperValue.set('openedExcel', true);
            }

            setTimeout(() => {
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

                    // Close the window
                    window.close();
                });

                // -- Find the actual list item in the planner and click it

                // Select the parent element
                const parentElement = document.querySelector('.ms-List-page');

                // Get all inner elements with the specified attributes
                const innerElements = parentElement.querySelectorAll('div[data-is-focusable="true"][role="row"][data-is-draggable="false"][draggable="false"]');

                // Initialize an array to store elements with the required aria-label
                const matchingElements = [];
                var backUpElement = null;

                // Loop through each inner element and check the aria-label
                innerElements.forEach(element => {
                    const ariaLabel = element.getAttribute('aria-label').toLowerCase();
                    console.log(ariaLabel);
                    if (ariaLabel.includes(minerType.toLowerCase()) && ariaLabel.includes('minden') && ariaLabel.includes('gv')) {
                        // Extract the number between "bitmain" and "minden"
                        const match = ariaLabel.match(new RegExp(`${minerType.toLowerCase()}\\s*(\\d+)\\s*minden`, 'i'));
                        if (match) {
                            const number = parseInt(match[1], 10);
                            matchingElements.push({ element, number });
                        }
                    }

                    if (ariaLabel.includes(minerType.toLowerCase())) {
                        backUpElement = element;
                    }
                });

                // Find the element with the largest number
                let largestElement = null;
                let largestNumber = 0;

                matchingElements.forEach(item => {
                    if (item.number > largestNumber) {
                        largestNumber = item.number;
                        largestElement = item.element;
                    }
                });

                if(largestElement === null) {
                    largestElement = backUpElement;
                }

                // Click the largest element link (find the button with the role 'link')
                const linkButton = largestElement.querySelector('button[role="link"]');
                if (linkButton) {
                    // Scroll to the element
                    linkButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Highlight the element
                    largestElement.style.backgroundColor = 'yellow';

                    setTimeout(() => {
                        // Instant scroll, in case the smooth scroll didn't make it/got interrupted
                        linkButton.scrollIntoView({ behavior: 'auto', block: 'center' });

                        // Simulate a click on the link button
                        GM_SuperValue.set('openedExcel', false);
                        linkButton.click();
                        

                        // Inteval checking if taskname is empty to close the page
                        const interval = setInterval(() => {
                            let excelOpened = GM_SuperValue.get('openedExcel', false);
                            taskName = GM_SuperValue.get("taskName", "");
                            if (taskName === "" || excelOpened) {
                                window.close();
                            }
                        }, 100);

                        // Simulate a right click and copy the link
                        //linkButton.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));

                        // Another timer which adds to overlay that it failed to open and that you need to allow 'pop ups'
                        setTimeout(() => {
                            const overlay2 = document.createElement('div');
                            overlay2.style.position = 'fixed';
                            overlay2.style.top = '20px';
                            overlay2.style.right = '20px';
                            overlay2.style.backgroundColor = '#f2f2f2';
                            overlay2.style.padding = '10px';
                            overlay2.style.borderRadius = '5px';
                            overlay2.style.color = '#333';
                            overlay2.style.fontSize = '14px';
                            overlay2.style.fontWeight = 'bold';
                            overlay2.style.outline = '2px solid #333'; // Add outline
                            overlay2.innerHTML = `
                                <p>Failed to open the link.</p>
                                <p>Please set 'Always allow pop-ups and redirects' on this page.</p>
                            `;
                            // Make sure it is always layered on top
                            overlay2.style.zIndex = '9999';
                            document.body.appendChild(overlay2);

                            // Timeout for one tick
                            setTimeout(() => {
                                // Position the old overlay below the new overlay
                                const overlay2Rect = overlay2.getBoundingClientRect();
                                overlay.style.top = `${overlay2Rect.bottom + 20}px`;
                            }, 0);
                        }, 1000);
                    }, 500);
                }
            }, 500);
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
                document.body.removeChild(popup);

                window.close();
            });

        }

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
    }

    // See if the URL likly contains a IP address
    const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    const ipURLMatch = currentUrl.match(ipRegex);

    // Return if the URL doesn't match the IP regex
    if (ipURLMatch) {
        const quickGoToLog = GM_SuperValue.get('quickGoToLog', false);
        let findLog = false;
        let selectCategory = "Current Logs";
        if(quickGoToLog && currentUrl.includes(quickGoToLog.ip)) {
            findLog = quickGoToLog.errorText;
            selectCategory = quickGoToLog.category;
            GM_SuperValue.set('quickGoToLog', false);
        }

         // Scan Error Logs Logic
         let isScanning = false;
         let homePage = document.getElementById('homePage');
         let currentlyScanning = GM_SuperValue.get('currentlyScanning', {});
         let foundMiner = null;
         let isFoundry = currentUrl.includes("#/");
         if (currentlyScanning && Object.keys(currentlyScanning).length > 0) {
             // Loop through currentlyScanning via object keys and find if the ipAdress matches any of the miners
             Object.keys(currentlyScanning).forEach(miner => {
                 let currentMiner = currentlyScanning[miner];
                 if(currentUrl.includes(currentMiner.ipAddress)) {
                     foundMiner = currentMiner;
                     return;
                 }
             });
 
             if (foundMiner) {
                isScanning = true;
             }
         }
 
        let loadedFoundryGUI = false;
        if (isFoundry) {
            function clickCategory() {
                console.log('Clicking category');
                let tabs = document.querySelectorAll('.react-tabs__tab-list');

                if(!tabs || tabs.length === 0 || !tabs[0].childNodes || tabs[0].childNodes.length === 0) {
                    setTimeout(() => {
                        clickCategory();
                    }, 0);
                    return;
                }

                // loop through all the tabs
                tabs.forEach(tab => {
                    // loop through all the tab elements
                    tab.childNodes.forEach(tabElement => {
                        // If the tab element contains the category text, then click it
                        if(tabElement.textContent.includes(selectCategory)) {
                            tabElement.click();
                            // then click document body to fix the weird selection visual
                            setTimeout(() => {
                                if(!isScanning) {
                                    let refreshButton = document.querySelector('.m-button.is-ghost');
                                    console.log(refreshButton);
                                    refreshButton.click();
                                }
                            }, 1);
                        }

                        if(isScanning && tabElement.textContent.includes('Reboot Logs')) {
                            setTimeout(() => {
                                tabElement.click();
                            }, 1000);

                            // repeativly check if loadedFoundryGUI is the true then click and end the loop
                            let interval = setInterval(() => {
                                if(loadedFoundryGUI) {
                                    tabElement.click();
                                    clearInterval(interval);
                                }
                            }, 500);
                        }
                    });
                });
            }
            clickCategory();
         }

        let clickedAutoRefresh = false;
        let changingLog = false;
        let lastTextLog = "";
        function setUpErrorLog() {
            // Locate the log content element
            const logContent = document.querySelector('.log-content') || document.querySelector('.logBox-pre');

            console.log('Setting up error log1');

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

            if(!logContent) {
                removeOldErrorTab();
                if(!window.location.href.includes('log')) {
                    clickedAutoRefresh = false;
                }
                return;
            }

            const existingErrorElement = document.getElementById(`errorLogElement`);
            if (existingErrorElement) {
                return;
            } else {
                if(lastTextLog !== logContent.textContent) {
                    lastTextLog = logContent.textContent;
                } else {
                    return;
                }
            }

            // Return if the log content is empty
            if (!logContent.textContent || logContent.textContent.length === 0) {
                return;
            }

            removeOldErrorTab();

            console.log('Setting up error log2');

            // If the log content exists, run the error tab setup
            if (logContent) {
                // On tab change
                const tabs = document.querySelectorAll('.tab span');
                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        removeOldErrorTab();
                        setTimeout(runAntMinerGUIAdjustments, 500);
                    });
                });

                // Make sure the log content is not overlayed over anything
                logContent.style.position = 'relative';

                // If we didn't already add the error tab, add it
                const oldErrorTab = document.querySelector('[data-id="errors"]');
                if (!oldErrorTab) {
                    const errorsToSearch = {
                        /*
                        'Test Error': {
                            icon: "https://icons8.com/icon/35881/test-passed",
                            start: "Booting Linux on physical",
                        },
                        */
                        'Bad Hashboard Chain': {
                            icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
                            start: ["get pll config err", /Chain\[0\]: find .* asic, times/], // 0
                            end: ["stop_mining: soc init failed"],
                            conditions: (text) => {
                                return text.includes('only find');
                            }
                        },
                        'Fan Speed Error': {
                            icon: "https://img.icons8.com/?size=100&id=t7Gbjm3OaxbM&format=png&color=FFFFFF",
                            start: ["Error, fan lost,", "Exit due to FANS NOT DETECTED | FAN FAILED", /\[WARN\] FAN \d+ Fail/],
                            end: ["stop_mining: fan lost", " has failed to run at expected RPM"],
                        },
                        'SOC INIT Fail': {
                            icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
                            start: "ERROR_SOC_INIT",
                            end: ["ERROR_SOC_INIT", "stop_mining: soc init failed!"],
                            onlySeparate: true
                        },
                        'EEPROM Error': {
                            icon: "https://img.icons8.com/?size=100&id=9040&format=png&color=FFFFFF",
                            start: "eeprom error crc 3rd region",
                            end: "eeprom error crc 3rd region",
                            onlySeparate: true
                        },
                        'Hashboard Init Fail': {
                            icon: "https://img.icons8.com/?size=100&id=35849&format=png&color=FFFFFF",
                            start: "Exit due to HASHBOARD INITIALIZATION FAILED",
                            onlySeparate: true
                        },
                        'Target Hashrate Fail': {
                            icon: "https://img.icons8.com/?size=100&id=20767&format=png&color=FFFFFF",
                            start: "Exit due to Unable to Generate Given Target Hashrate",
                            onlySeparate: true
                        },
                        'Voltage Abnormity': {
                            icon: "https://img.icons8.com/?size=100&id=61096&format=png&color=FFFFFF",
                            start: ["chain avg vol drop from", "ERROR_POWER_LOST"],
                            end: ["power voltage err", "stop_mining_and_restart", "stop_mining: soc init failed", "stop_mining: get power type version failed!", "stop_mining: power status err, pls check!", "stop_mining: power voltage rise or drop, pls check!"],
                        },
                        'Temperature Sensor Error': {
                            icon: "https://img.icons8.com/?size=100&id=IN6gab7HZOis&format=png&color=FFFFFF",
                            start: "Exit due to TEMPERATURE SENSORS FAILED",
                        },
                        'Temperature Overheat': {
                            icon: "https://img.icons8.com/?size=100&id=er279jFX2Yuq&format=png&color=FFFFFF",
                            start: "asic temp too high",
                            end: "stop_mining: asic temp too high",
                        },
                        'Network Lost': {
                            icon: "https://img.icons8.com/?size=100&id=Kjoxcp7iiC5M&format=png&color=FFFFFF",
                            start: ["WARN_NET_LOST", "ERROR_NET_LOST"],
                            end: ["ERROR_UNKOWN_STATUS: power off by NET_LOST", "stop_mining_and_restart: network connection", "stop_mining: power off by NET_LOST", "network connection resume", "network connection lost for"],
                        },
                        'Bad Chain ID': {
                            icon: "https://img.icons8.com/?size=100&id=W7rVpJuanYI8&format=png&color=FFFFFF",
                            start: "bad chain id",
                            end: "stop_mining: basic init failed!",
                            unimportant: true
                        },
                        'Firmware Error': {
                            icon: "https://img.icons8.com/?size=100&id=hbCljOlfk4WP&format=png&color=FFFFFF",
                            start: "Firmware registration failed",
                            unimportant: true
                        },
                        'ASIC Error': {
                            icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
                            start: "test_loop_securely_find_asic_num",
                            unimportant: true
                        },
                        'Defendkey Error': {
                            start: "defendkey: probe of defendkey failed with error",
                            unimportant: true
                        },
                        'SN File Error': {
                            start: "Open miner sn file /config/sn error",
                            unimportant: true
                        },
                        'Allocate Memory Error': {
                            start: "failed to allocate memory for node linux",
                            unimportant: true
                        },
                        'Modalias Failure': {
                            start: "modalias failure",
                            unimportant: true
                        },
                        'CLKMSR Failure': {
                            start: "clkmsr ffd18004.meson_clk_msr: failed to get msr",
                            unimportant: true
                        },
                        'Unpack Failure': {
                            start: "Initramfs unpacking failed",
                            unimportant: true
                        },
                        'I2C Device': {
                            start: "Failed to create I2C device",
                            unimportant: true
                        },
                        'No Ports': {
                            start: "hub doesn't have any ports",
                            unimportant: true
                        },
                        'Thermal Binding': {
                            start: "binding zone soc_thermal with cdev thermal",
                            unimportant: true
                        },
                        'PTP Init Failure': {
                            start: "fail to init PTP",
                            unimportant: true
                        },
                        'Ram Error': {
                            icon: "https://img.icons8.com/?size=100&id=2lS2aIm5uhCG&format=png&color=FFFFFF",
                            start: "persistent_ram: uncorrectable error in header",
                            unimportant: true
                        }
                    }

                    // Search through the log and locate errors
                    const logText = logContent.innerText;
                    var errorsFound = []; // Array to store the errors found
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
                                let curIndex;
                                if (typeof start === 'string') {
                                    curIndex = logText.indexOf(start, lastEndIndex);
                                } else if (start instanceof RegExp) {
                                    const match = logText.slice(lastEndIndex).match(start);
                                    if (match) {
                                        curIndex = lastEndIndex + match.index;
                                    } else {
                                        curIndex = -1; // No match found
                                    }
                                } else {
                                    throw new Error('Unsupported type for start');
                                }

                                if (curIndex !== -1 && (startIndex === -1 || curIndex < startIndex)) {
                                    startIndex = curIndex;
                                }
                            }

                            if (startIndex !== -1) {

                                // If errorData.end isn't found, just set it to be start
                                if (!errorData.end || errorData.end === "" || errorData.end === undefined) {
                                    errorData.end = errorData.start;
                                }

                                var endIndex = -1;
                                if (!Array.isArray(errorData.end)) {
                                    errorData.end = [errorData.end];
                                }

                                const separatorTexts = ["start the http log", "****power off hashboard****"];
                                for (const end of errorData.end) {
                                    let curIndex;
                                    if (typeof end === 'string') {
                                        curIndex = logText.indexOf(end, startIndex);
                                    } else if (end instanceof RegExp) {
                                        const match = logText.slice(startIndex).match(end);
                                        if (match) {
                                            curIndex = startIndex + match.index;
                                        } else {
                                            curIndex = -1; // No match found
                                        }
                                    } else {
                                        throw new Error('Unsupported type for end');
                                    }
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
                                        if(errorsFound.some(err => err.text.includes(errorText))) {
                                            console.log('Error text already found');
                                            errorTextAlreadyFound = true;
                                        }
                                    }

                                    // Check if the error text meets the conditions
                                    if (typeof errorData.conditions === 'function' ? errorData.conditions(errorText) : true && !errorTextAlreadyFound) {
                                        errorsFound.push({
                                            name: error,
                                            icon: errorData.icon,
                                            text: errorText.trimEnd(),
                                            start: startIndex,
                                            end: endIndex,
                                            unimportant: errorData.unimportant || false
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

                    // Find all the times 'error' or 'fail' is mentioned in the log if it isn't already found in the defined errors, mark is as an Unknown Error
                    const errorRegex = /error/gi;
                    const failRegex = /fail/gi;
                    const errorMatches = [...logText.toLowerCase().matchAll(errorRegex), ...logText.toLowerCase().matchAll(failRegex)];
                    for (const match of errorMatches) {
                        
                        // Check if the error is already found
                        const matchIndex = match.index;
                        if (!errorsFound.some(error => matchIndex >= error.start && matchIndex <= error.end)) {
                            // Find the start and end of the line
                            const start = logText.lastIndexOf('\n', matchIndex) + 1;
                            const end = logText.indexOf('\n', matchIndex) + 1;
                            const errorText = logText.substring(start, end);

                            // Add the error to the list of errors
                            errorsFound.push({
                                name: 'Unknown Error',
                                text: errorText.trimEnd(),
                                start: start,
                                end: end,
                                unimportant: true
                            });
                        }
                    }

                    function createErrorTab(title, errors) {
                        // Create a new element to display the errors
                        if (errors.length > 0) {
                            // Locate the menu element
                            let menu = document.querySelector('.menu-t.menu');
                            if(!menu) {
                                menu = document.querySelector('.m-uishell-left-panel');

                                // Find and toggle off auto refresh if it is on (<label for="toggle" class="switch"></label>)
                                const autoRefresh = document.querySelector('.switch[for="toggle"]');
                                if(autoRefresh && !clickedAutoRefresh) {
                                    autoRefresh.click();
                                    clickedAutoRefresh = true;
                                }
                            }

                            if (menu) {
                                // Set the menu's scroll bar to be a nice skinny dark one
                                menu.style.overflowY = 'auto';
                                menu.style.scrollbarWidth = 'thin';
                                menu.style.scrollbarColor = '#444 #222';

                                const style = document.createElement('style');
                                style.textContent = `
                                    .menu-t.menu::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    .menu-t.menu::-webkit-scrollbar-track {
                                        background: #222;
                                    }
                                    .menu-t.menu::-webkit-scrollbar-thumb {
                                        background-color: #444;
                                        border-radius: 10px;
                                        border: 2px solid #222;
                                    }
                                    li .item {
                                        display: flex;
                                        align-items: center;
                                    }

                                    .item .icon,
                                    .item .itm-name,
                                    .item div {
                                        display: inline-block;
                                        vertical-align: middle;
                                        margin: 0;
                                    }
                                    .item div {
                                        margin-left: auto; /* Pushes the "i" icon to the right */
                                        line-height: normal; /* Adjust to align the circle vertically */
                                    }
                                `;
                                document.head.appendChild(style);
                                

                                // Add line separator, if it doesn't already exist
                                if (!document.querySelector('.separator')) {
                                    const separator = document.createElement('li');
                                    separator.style.borderBottom = '1px solid #ccc';
                                    separator.style.margin = '10px 0';
                                    separator.classList.add('separator');
                                    menu.appendChild(separator);
                                }

                                // Create a new list item for errors
                                const errorTab = document.createElement('li');
                                errorTab.classList.add('item');
                                errorTab.setAttribute('data-id', 'errors');
                                errorTab.innerHTML = `<i class="error-ico icon"></i> <span class="itm-name" data-locale="errors">${title}</span> <i class="drop-icon"></i>`;

                                // Check if errorTab is pressed
                                errorTab.addEventListener('click', () => {
                                    setTimeout(adjustLayout, 0);
                                });

                                if(isFoundry) {
                                    // Add a nice font to the error tab and sub-menu
                                    const fontStyle = document.createElement('style');
                                    fontStyle.textContent = `
                                        .menu-t.menu, .sub-menu.menu, .itm-name  {
                                            font-family: 'Arial', sans-serif;
                                            font-size: 14px;
                                        }
                                    `;
                                    document.head.appendChild(fontStyle);

                                    
                                    errorTab.style.marginBottom = '10px';

                                    // click error tab twice to fix it appearing opened
                                    setTimeout(() => {
                                        errorTab.click();
                                        errorTab.click();
                                    }, 0);
                                }

                                // Light blue text when hovering over the error tab
                                errorTab.addEventListener('mouseover', () => {
                                    errorTab.style.color = '#5FB2FF';

                                    // change mouse cursor to pointer
                                    errorTab.style.cursor = 'pointer';
                                });

                                errorTab.addEventListener('mouseout', () => {
                                    errorTab.style.color = '#E2E2E2';

                                    // change mouse cursor to default
                                    errorTab.style.cursor = 'default';
                                });

                                // Create a sub-menu for the errors
                                const errorSubMenu = document.createElement('ul');
                                errorSubMenu.classList.add('sub-menu', 'menu');
                                errorSubMenu.id = 'errorSubMenu';

                                // set a slight padding to the sub-menu
                                errorSubMenu.style.paddingLeft = '10px';
                                
                                // Find and replace the drop icon so it doesn't flip when the other sub-menu is opened
                                const dropIcon = errorTab.querySelector('.drop-icon');
                                if (dropIcon) {
                                    dropIcon.remove();
                                }

                                const dropIcon2 = document.createElement('i');
                                dropIcon2.classList.add('icon2');
                                dropIcon2.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=2760&format=png&color=FFFFFF)';
                                dropIcon2.style.width = '16px';
                                dropIcon2.style.height = '16px';
                                dropIcon2.style.display = 'inline-block';
                                dropIcon2.style.backgroundSize = 'contain';
                                if(isFoundry) {
                                    dropIcon2.style.position = 'relative';
                                    dropIcon2.style.float = 'right';
                                    dropIcon2.style.marginRight = '10px';
                                }
                                errorTab.appendChild(dropIcon2);

                                // Swap the left empty icon source with the error icon
                                const errorIcon = errorTab.querySelector('.error-ico');
                                if (errorIcon) {
                                    errorIcon.style.backgroundImage = 'url(https://img.icons8.com/?size=100&id=24552&format=png&color=FFFFFF)';
                                    
                                    errorIcon.style.display = 'inline-block';
                                    errorIcon.style.backgroundSize = 'contain';
                                    errorIcon.style.marginRight = '5px';
                                }

                                // Populate the sub-menu with error details
                                errors.forEach((error, index) => {
                                    const errorItem = document.createElement('li');
                                    errorItem.classList.add('item');
                                    errorItem.setAttribute('data-id', `error-${index}`);
                                    errorItem.innerHTML = `<i class="error-detail-ico icon"></i> <span class="itm-name">${error.name}</span>`;
                                    if(isFoundry) {
                                        errorItem.style.cursor = 'pointer';
                                        // add padding to the error item
                                        errorItem.style.padding = '5px 8px 5px 0px';
                                        errorItem.style.verticalAlign = 'middle';
                                    }

                                    function resetLogText() {
                                        // Remove any children of the log content
                                        while (logContent.firstChild) {
                                            logContent.removeChild(logContent.firstChild);
                                        }

                                        // Re-add the original log content
                                        logContent.textContent = logText;
                                    }
                                    errorItem.addEventListener('click', () => {
                                        changingLog = true;

                                        resetLogText();

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

                                        setTimeout(() => {
                                            changingLog = false;
                                        }, 0);
                                    });
                                    errorSubMenu.appendChild(errorItem);

                                    // highlight text when hovering over the error
                                    errorItem.addEventListener('mouseover', () => {
                                        errorItem.style.backgroundColor = '#444';
                                        errorItem.style.color = '#fff';
                                    });

                                    errorItem.addEventListener('mouseout', () => {
                                        errorItem.style.backgroundColor = 'transparent';
                                        errorItem.style.color = '#E2E2E2';
                                    });

                                    if(findLog && error.text.includes(findLog)) {
                                        // Open the error list
                                        setTimeout(() => {
                                            errorTab.click();

                                            // Scroll to the error item
                                            errorItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                            // highlight that fades out
                                            errorItem.style.transition = 'background-color 1s';
                                            errorItem.style.backgroundColor = '#444';
                                            setTimeout(() => {
                                                errorItem.style.backgroundColor = 'transparent';
                                            }, 1000);
                                        }, 0);

                                        // Go to the error
                                        errorItem.click();
                                        findLog = false;
                                    }

                                    // Set the icon for the error <i class="error-detail-ico icon"></i>
                                    const errorDetailIcon = errorItem.querySelector('.error-detail-ico');
                                    if (errorDetailIcon) {
                                        errorDetailIcon.style.backgroundImage = error.icon !== undefined ? `url(${error.icon})` : 'url(https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF)';
                                        errorDetailIcon.style.display = 'inline-block';
                                        errorDetailIcon.style.backgroundSize = 'contain';
                                        errorDetailIcon.style.marginRight = '5px';
                                        errorDetailIcon.style.width = '22px';
                                        errorDetailIcon.style.height = '22px';
                                    }
                                    
                                    // Create an info icon to the right that will show the error text
                                    const infoIcon = document.createElement('div');
                                    infoIcon.style.width = '14px';
                                    infoIcon.style.height = '14px';
                                    infoIcon.style.borderRadius = '50%';
                                    infoIcon.style.backgroundColor = '#0078d4';
                                    infoIcon.style.color = 'white';
                                    infoIcon.style.textAlign = 'center';
                                    infoIcon.style.verticalAlign = 'middle';
                                    infoIcon.style.lineHeight = '14px';
                                    infoIcon.style.fontSize = '8px';
                                    infoIcon.style.border = '1px solid black';
                                    infoIcon.style.fontWeight = 'bold';
                                    infoIcon.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
                                    infoIcon.style.cursor = 'pointer';
                                    infoIcon.style.position = 'relative';
                                    infoIcon.style.float = 'right';
                                    infoIcon.style.display = 'inline-block';
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

                            adjustLayout();
                        }
                    }

                    if(isScanning) {
                        const minerID = foundMiner.id;
                        let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                        errorsFoundSave[minerID] = errorsFound.filter(error => !error.unimportant) || [];

                        if(isFoundry) {
                            let category = "";
                            let selectedCurrent = document.querySelector('.react-tabs__tab.react-tabs__tab--selected');
                            if(selectedCurrent) {
                                category = selectedCurrent.textContent;
                            }

                            // If we're on the Reboot Logs, get the error with highest start index
                            if(category === "Reboot Logs") {
                                let lastError = errorsFoundSave[minerID].sort((a, b) => b.start - a.start)[0];
                                if(lastError && lastError.text) {

                                    // Remove all errors that are before the last error
                                    errorsFoundSave[minerID] = [lastError];

                                    // split the error text and get the date "11/02/24 00:27:35 Exit due to FANS NOT DETECTED | FAN FAILED"
                                    errorsFoundSave[minerID].forEach(error => {
                                        const errorText = error.text.split(' ');
                                        const date = errorText[0];
                                        const time = errorText[1];

                                        // check if the date is today
                                        const today = new Date();
                                        const todayString = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;
                                        
                                        if(date !== todayString) {
                                            errorsFoundSave[minerID] = [];
                                            //alert('No errors found today\n\n' + error.text + '\n\n Date: ' + date + '\n\n todayString: ' + todayString);
                                        }
                                    });
                                }
                            }

                            // loop through errorsFoundSave[minerID] and add the category to each error
                            errorsFoundSave[minerID].forEach(error => {
                                if(!error) {
                                    return;
                                }
                                error.category = category;
                            });

                            /* goofy
                            if(category === "Reboot Logs") {
                                GM_SuperValue.set('errorsFound', errorsFoundSave);
                                GM_SuperValue.set('minerGUILoaded_' + foundMiner.id, true);
                                return;
                            }
                                */

                            // if the category isn't Reboot Logs, and the errors are empty, return
                            if(category !== "Reboot Logs" && errorsFoundSave[minerID].length === 0) {
                                loadedFoundryGUI = true;
                                return;
                            }
                        }

                        // Save the errors found
                        GM_SuperValue.set('errorsFound', errorsFoundSave);
                        GM_SuperValue.set('minerGUILoaded_' + foundMiner.id, true);
                        console.log('Errors found and saved');
                    }

                    createErrorTab("Main Errors", errorsFound.filter(error => !error.unimportant));
                    createErrorTab("Other Errors", errorsFound.filter(error => error.unimportant));
                }

                //setTimeout(adjustLayout, 500);
            } else {
                removeOldErrorTab();
            }
        }

        function adjustLayout() {
            homePage = document.getElementById('homePage');
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
                    const logContent = document.querySelector('.log-content');
                    const footer = document.querySelector('.footer.clearfix');
                    const mainContent = document.querySelector('.main-content');
                    if (logContent) {
                        mainContent.style.paddingBottom = '0';
                        footer.style.display = 'none';
                    } else {
                        const footerHeight = footer.offsetHeight;
                        mainContent.style.paddingBottom = `${footerHeight}px`;
                        footer.style.display = 'block';
                    }

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

                    // Find the footer and set the width to the same as homePage
                    if (footer) {
                        footer.style.width = homePage.style.width;
                    } else {
                        console.error('Footer not found');
                    }
                }
            }
        }  

        // Function to check the current URL
        var lastRunTime = 0; // Note this run time is refering to last time the function was run, not the miner run/uptime time
        var lastRealUpTime = 0;
        var lastUpTimeInterval = null;
        function runAntMinerGUIAdjustments() {
            // Check if the last run was less than 10ms ago, stops it from running too often
            if (Date.now() - lastRunTime < 10) {
                return;
            }
            lastRunTime = Date.now();

            // Add link to firmware downloads if on firmware upgrade page
            const formsContent = document.querySelector('.forms-content');
            const formsTitle = document.querySelector('.forms-title[data-locale="update"]');
            
            if (formsContent && formsTitle) {
                const linkAlreadyExists = formsContent.querySelector('a[href="https://shop.bitmain.com/support/download"]');
                if (linkAlreadyExists) { return; }
                const link = document.createElement('a');
                link.href = 'https://shop.bitmain.com/support/download';
                link.target = '_blank'; // Open in a new tab
                link.textContent = 'Bitmain Firmware Downloads Page';
                link.style.display = 'block';
                link.style.marginBottom = '10px';
                formsContent.insertBefore(link, formsContent.firstChild);

                // on press, save the current miner type and algorithm
                link.addEventListener('click', () => {
                    const minerType = document.querySelector('.miner-type').textContent;
                    const algorithm = document.querySelector('.algorithm').textContent;
                    GM_SuperValue.set('minerType', minerType);
                    GM_SuperValue.set('algorithm', algorithm);
                });

                // Foundry Site Ops Firmware Downloads
                const foundryLink = document.createElement('a');
                foundryLink.href = 'https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/Ejr69n4RQN5Nk9JjF4fW00YBnxf38XEYL7Ubf9xIwgh9bA?e=HwAMls';
                foundryLink.target = '_blank'; // Open in a new tab
                foundryLink.textContent = 'Foundry Site Ops Firmware Downloads';
                foundryLink.style.display = 'block';
                foundryLink.style.marginBottom = '10px';
                formsContent.insertBefore(foundryLink, link.nextSibling);
            }
        }

        // Function to update the estimated time
        function updateEstimatedTime() {
            const minerRunningTimeElement = document.querySelector('td span[data-locale="mRunTm"]');
            if (!minerRunningTimeElement || !minerRunningTimeElement.nextElementSibling) {
                setTimeout(updateEstimatedTime, 0);
                return;
            }

            // Function to parse the current running time
            function parseRunningTime(stringReturn = false) {
                const timeElements = minerRunningTimeElement.nextElementSibling.querySelectorAll('.num');
                const days = parseInt(timeElements[0].textContent, 10);
                const hours = parseInt(timeElements[1].textContent, 10);
                const minutes = parseInt(timeElements[2].textContent, 10);
                const seconds = parseInt(timeElements[3].textContent, 10);
                if (stringReturn) {
                    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
                }

                return { days, hours, minutes, seconds };
            }

            // Function to format the time
            function formatTime({ days, hours, minutes, seconds }) {
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }

            // Get the current estimated time element
            let estimatedTimeElement = document.querySelector('.estimated-time');
            if (estimatedTimeElement) {
                if (lastRealUpTime === parseRunningTime(true)) {
                    return;
                } else {
                    clearInterval(lastUpTimeInterval);
                }
            }
            lastRealUpTime = parseRunningTime(true);
            

            // Create a new element for the estimated time if it doesn't already exist
            if(!estimatedTimeElement) {
                estimatedTimeElement = document.createElement('span');
                estimatedTimeElement.className = 'estimated-time';
                estimatedTimeElement.style.display = 'block';
                minerRunningTimeElement.parentNode.appendChild(estimatedTimeElement);
            }

            // Function to increment the time
            function incrementTime(time) {
                time.seconds++;
                if (time.seconds >= 60) {
                    time.seconds = 0;
                    time.minutes++;
                }
                if (time.minutes >= 60) {
                    time.minutes = 0;
                    time.hours++;
                }
                if (time.hours >= 24) {
                    time.hours = 0;
                    time.days++;
                }
                return time;
            }

            // Initial time
            let currentTime = parseRunningTime();
            currentTime = incrementTime(currentTime);
            estimatedTimeElement.textContent = `Estimated Live: ${formatTime(currentTime)}`;

            // Update the estimated time every second
            lastUpTimeInterval = setInterval(() => {
                currentTime = incrementTime(currentTime);
                estimatedTimeElement.textContent = `Estimated Live: ${formatTime(currentTime)}`;
            }, 1000);
        }

        // Call the function to start updating the estimated time
        updateEstimatedTime();

        // Run the check on mutation
        const observer = new MutationObserver((mutations) => {
            const logContent = document.querySelector('.logBox-pre');
            if (!logContent) {
                adjustLayout();
                updateEstimatedTime();
                runAntMinerGUIAdjustments();
            }
            
            setUpErrorLog();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Auto select saved miner type and algorithm
    if (currentUrl.includes("https://shop.bitmain.com/support/download")){
        setTimeout(() => {
            var minerType = GM_SuperValue.get('minerType', '').toLowerCase();
            var algorithm = GM_SuperValue.get('algorithm', '').toLowerCase();

            if(algorithm === "sha256d") {
                algorithm = "sha256";
            }

            // Remove the saved values
            GM_SuperValue.set('minerType', '');
            GM_SuperValue.set('algorithm', '');

            if (minerType !== '' && algorithm !== '') {
                const algorithmDropdown = document.querySelector('.filter-box .filter:nth-child(1) input');
                const modelDropdown = document.querySelector('.filter-box .filter:nth-child(2) input');

                if (algorithmDropdown && modelDropdown) {
                   

                    var algorithmDropdownFound = false;
                    var modelDropdownFound = false;

                    const intervalAlgorithm = setInterval(() => {
                        algorithmDropdown.focus();
                        algorithmDropdown.click();
    
                        algorithmDropdown.style.backgroundColor = '#ffcc99';

                        setTimeout(() => {
                            const algorithmOptions = document.querySelectorAll('.filter-box .filter:nth-child(1) ul li');
                            algorithmOptions.forEach(option => {
                                console.log(option.textContent);
                                if (option.textContent.toLocaleLowerCase().trim().includes(algorithm)) {
                                    option.focus();
                                    option.click();
                                    algorithmDropdown.style.backgroundColor = '#99ff99';
                                    algorithmDropdownFound = true;
                                    clearInterval(intervalAlgorithm);
                                    const intervalModel = setInterval(() => {
                                        modelDropdown.focus();
                                        modelDropdown.click();
                
                                        modelDropdown.style.backgroundColor = '#ffcc99';
                
                                        setTimeout(() => {
                                            const modelOptions = document.querySelectorAll('.filter ul li');
                                            modelOptions.forEach(option => {
                                                if (option.textContent.toLocaleLowerCase().trim() === minerType) {
                                                    option.focus();
                                                    option.click();
                                                    // set it a light green color
                                                    modelDropdown.style.backgroundColor = '#99ff99';
                                                    modelDropdownFound = true;
                                                    clearInterval(intervalModel);
                                                    return;
                                                }
                                            });
                
                                            // If the algorithm wasn't found, set it to red
                                            if(!modelDropdownFound) {
                                                modelDropdown.style.backgroundColor = '#ff6666';
                                            }
                                        }, 100);
                                    }, 200);
                                    return;
                                }
                            });

                            // If the algorithm wasn't found, set it to red
                            if (!algorithmDropdownFound) {
                                algorithmDropdown.style.backgroundColor = '#ff6666';
                            }
                        }, 100);
                    }, 200);
                }
            }
        }, 800);
    }
});

// Should fix darkmode messing with the form...?
if(currentUrl.includes("https://forms.office.com/pages/responsepage.aspx")) {
    //Opt out of darkmode, insert <meta name="color-scheme" content="only light"> into head
    const head = document.querySelector('head');
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'color-scheme');
    meta.setAttribute('content', 'only light');
    head.appendChild(meta);
}

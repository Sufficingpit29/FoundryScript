// To do:
// Maybe add a "real lower hashers" tab?
// Maybe more pagination since it can still crash
// Maybe save timeout/long time realtime check miners and make logic around shoving those to ends of queues to not overly slow down?
// window.ma.miners

// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      7.7.6
// @description  Adds various features to the OptiFleet website to add additional functionality.
// @author       Matthew Axtell
// @match        *://*/*
// @icon         https://foundryoptifleet.com/img/favicon-32x32.png
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet.js
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiFleet.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/HackyWorkAround.js
// @require      https://foundryoptifleet.com/scripts/axios.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js
// @require      https://cdn.datatables.net/colreorder/1.6.2/js/dataTables.colReorder.min.js
// @require      https://cdn.datatables.net/responsive/2.4.0/js/dataTables.responsive.min.js
// @require      https://cdn.jsdelivr.net/npm/datatables.net-colresize/js/dataTables.colResize.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @require      https://raw.githubusercontent.com/InvokIT/js-untar/refs/heads/master/build/dist/untar.js
// @resource     https://cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css
// @resource     https://cdn.datatables.net/colreorder/1.6.2/css/colReorder.dataTables.min.css
// @resource     https://cdn.datatables.net/responsive/2.4.0/css/responsive.dataTables.min.css
// @resource     https://cdn.jsdelivr.net/npm/datatables.net-colresize@1.1.0/css/dataTables.colResize.min.css
// @run-at       document-start
// ==/UserScript==


let currentURL = window.location.href;
if(currentURL.includes("OptiWatch")) {
    return;
}

const allowedSites = [
    "foundryoptifleet.com",
    "planner",
    "sharepoint",
    "planner.cloud.office",
    "bitmain",
];

console.log("Current URL:", currentURL);

// See if the URL likly contains a IP address
const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
const ipURLMatch = currentURL.match(ipRegex);

// Check if the current URL is allowed
const allowedSiteMatch = allowedSites.some(site => currentURL.includes(site));

if(!ipURLMatch && !allowedSiteMatch) {
    console.log("Script not for this site, exiting...");
    return false;
}

function isFunction(v) {
    return v instanceof Function;
}

// Feature enable config menu
const features = [
    // All
    { name: 'SN Bar Code Scan', id: 'snBarCodeScan', category: 'All' },
    { name: 'Paste SN', id: 'pasteSN', category: 'All' },
    { name: 'Alert System', id: 'alertSystem', category: 'All' },
    { name: 'Auto-Select Pool', id: 'autoSelectPool', category: 'All' },

    // Overview Page
    { name: 'Sleep Mode Miners', id: 'sleepModeMiners', category: 'Overview' },
    { name: 'Averaged Container Temps', id: 'avgContainerTemps', category: 'Overview' },

    // Miner List
    { name: 'Miner Name Link', id: 'minerNameLink', category: 'Miner Table' },
    { name: 'Breaker Number', id: 'breakerNumber', category: 'Miner Table' },
    { name: 'Realtime Hashrate', id: 'realtimeHashrateData', category: 'Miner Table', startOff: true },
    { name: 'Right Click Context Menu', id: 'rightClickContextMenu', category: 'Miner Table' },

    // Issues page
    { name: 'Down Scan', id: 'downScan', category: 'Issues' },
    { name: 'Error Scan', id: 'errorScan', category: 'Issues' },
    { name: 'Auto Reboot', id: 'autoReboot', category: 'Issues' },
    { name: 'Planner Card Scan', id: 'plannerCardScan', category: 'Issues' },
    { name: 'Export Selected Miners', id: 'exportSelectedMiners', category: 'Issues' },

    // Individual miner page
    { name: 'Add Customer Name', id: 'customerName', category: 'Individual Miner' },
    { name: 'Copy Buttons', id: 'copyButtons', category: 'Individual Miner' },
    { name: 'Sharepoint & Planner', id: 'quickSharepointPlanner', category: 'Individual Miner' },
    { name: 'Planner Card Info', id: 'plannerCardScanMiner', category: 'Individual Miner' },
    { name: 'Breaker Number', id: 'breakerNumberMiner', category: 'Individual Miner' },
    { name: 'Times Down', id: 'downCount', category: 'Individual Miner' },
    { name: 'Last Soft Reboot', id: 'lastSoftReboot', category: 'Individual Miner' },
    { name: 'Current Log Tab', id: 'PoolConfigModal', category: 'Individual Miner' },

    // GUI page
    { name: 'Estimated Live Time', id: 'estimatedLiveTime', category: 'GUI' },
    { name: 'Firmware Links', id: 'firmwareLinks', category: 'GUI' },
    { name: 'Start at log bottom', id: 'startAtLogBottom', category: 'GUI' },
    { name: 'Miner Log Errors/Info', id: 'minerLogErrorsInfo', category: 'GUI' },
    { name: 'SlotID Link', id: 'slotIDLink', category: 'GUI' },
];

const categories = [...new Set(features.map(feature => feature.category))];

const savedFeatures = GM_SuperValue.get('features', {});
features.forEach(feature => {
    if (savedFeatures[feature.id] === undefined) {
        savedFeatures[feature.id] = feature.startOff ? false : true;
    }
});
GM_SuperValue.set('features', savedFeatures); // Save the default features

if(currentURL.includes("https://foundryoptifleet.com")) {
    // Add the config cog icon and toggle menu
    const configIcon = document.createElement('img');
    configIcon.setAttribute('src', 'https://img.icons8.com/?size=100&id=2969&format=png&color=FFFFFF');
    configIcon.setAttribute('alt', 'Config Icon');
    configIcon.setAttribute('style', 'cursor: pointer; width: 24px; height: 24px;');
    configIcon.setAttribute('id', 'configIcon');

    const configMenu = document.createElement('div');
    configMenu.setAttribute('id', 'configMenu');
    configMenu.setAttribute('style', `
        display: none; 
        position: absolute; 
        top: 50px; 
        right: 0; 
        background-color: #333; 
        color: white; 
        padding: 20px; 
        border-radius: 10px; 
        z-index: 1000; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 280px;
    `);

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.setAttribute('style', 'margin-bottom: 5px;');
        categoryDiv.innerHTML = `
            <h3 style="cursor: pointer; padding: 8px; background-color: #444; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                ${category}
                <span style="font-size: 12px;">&#9660;</span>
            </h3>
        `;
        const featureList = document.createElement('div');
        featureList.setAttribute('style', 'display: none; padding-left: 20px; margin-top: 10px;');

        features.filter(feature => feature.category === category).forEach(feature => {
            const featureToggle = document.createElement('div');
            featureToggle.setAttribute('style', 'margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;');
            featureToggle.innerHTML = `
                <span style="flex-grow: 1;">${feature.name}</span>
                <label class="switch">
                    <input type="checkbox" id="${feature.id}" ${savedFeatures[feature.id] ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
            `;
            featureList.appendChild(featureToggle);

            featureToggle.querySelector('input').addEventListener('change', () => {
                savedFeatures[feature.id] = featureToggle.querySelector('input').checked;
                showSaveButton();
            });
        });

        categoryDiv.appendChild(featureList);
        configMenu.appendChild(categoryDiv);

        categoryDiv.querySelector('h3').addEventListener('click', () => {
            const isVisible = featureList.style.display === 'block';
            featureList.style.display = isVisible ? 'none' : 'block';
            categoryDiv.querySelector('span').innerHTML = isVisible ? '&#9660;' : '&#9650;';
        });
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:checked + .slider:before {
            transform: translateX(14px);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('DOMContentLoaded', (event) => {
        document.body.appendChild(configMenu);
    });

    configIcon.addEventListener('click', () => {
        configMenu.style.display = configMenu.style.display === 'none' ? 'block' : 'none';
    });

    function tryAddConfigIcon() {
        // Don't if already added
        if(document.getElementById('configIcon')) {
            return;
        }

        // Get all buttons and loop through them to find the user button
        const allButtons = document.querySelectorAll('button');
        let userButton = false;
        // loop and print each button for testing
        allButtons.forEach(button => {
            if(button.getAttribute('onclick') === "ms.toggleUserDropdown();") {
                userButton = button;
                return;
            }
        });

        if (userButton) {
            userButton.parentNode.insertBefore(configIcon, userButton.nextSibling);
        } else {
            setTimeout(() => {
                tryAddConfigIcon();
            }, 100);
        }
    }

    tryAddConfigIcon();

    function showSaveButton() {
        let saveButton = document.getElementById('saveButton');
        const currentFeatures = GM_SuperValue.get('features', {});
        const hasChanges = Object.keys(currentFeatures).some(key => currentFeatures[key] !== savedFeatures[key]);

        if (hasChanges) {
            if (!saveButton) {
                console.log('Creating save button');
                saveButton = document.createElement('button');
                saveButton.id = 'saveButton';
                saveButton.innerText = 'Save & Refresh';
                saveButton.style.backgroundColor = '#4CAF50';
                saveButton.style.color = 'white';
                saveButton.style.border = 'none';
                saveButton.style.borderRadius = '5px';
                saveButton.style.padding = '10px 20px';
                saveButton.style.cursor = 'pointer';
                saveButton.style.marginTop = '10px';
                saveButton.addEventListener('click', () => {
                    GM_SuperValue.set('features', savedFeatures);
                    location.reload();
                });
                configMenu.appendChild(saveButton);
            }
        } else if (saveButton) {
            saveButton.remove();
        }
    }
}

//https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/board?tid=6681433f-a30d-43cd-8881-8e964fa723ad
function getPlannerID(string) {
    try {
        const plannerID = string.split('plan/')[1].split('/')[0];
        return plannerID;
    } catch (error) {
        console.log('Error extracting planner ID from URL:', string);
        console.log('Error:', error);
        return null;
    }
}

function isFoundryFirmware(text) {
    const names = ["FoSMiner", "FDMiner"]
    return names.some(name => text.includes(name));
}

// Get Task board data
let plannerBuckets = false;
let plannerTasks = false;
let planID = false;

// if url has planner in it, like https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad
// extract the TbJIxx_byEKhuMp-C4tXLGUAD3Tb
if(currentURL.includes('planner')) {
    planID = getPlannerID(currentURL);

    // Wait until the element is in the DOM
    const plannerDataGrabber = setInterval(() => {
        const button = document.querySelector('#taskFiltersButton');
        if (!button) return;

        // Loop through keys to find the internal React fiber key
        const fiberKey = Object.keys(button).find(key => key.startsWith('__reactFiber$'));
        if (!fiberKey) return;

        const fiber = button[fiberKey];
        const props = fiber?.return?.memoizedProps;
        const taskData = props?.taskData;
        const buckets = props?.buckets;

        if (taskData && taskData.length > 0 && buckets && buckets.length > 0) {
            console.log('✅ Found taskData!', taskData);
            console.log('✅ Found buckets!', buckets);
            plannerTasks = taskData;
            plannerBuckets = buckets;
            clearInterval(plannerDataGrabber);
        } else {
            console.log('Waiting for taskData...');
        }
    }, 500);
}

const username = 'root';
const password = 'root';
async function fetchGUIData(url, responseType, type, timeout) {
    return new Promise((resolve, reject) => {
        // First, ping the IP to check if it exists (wacky workaround since GM_xmlhttpRequest doesn't support parallel requests, not that this really fixes it all that well)
        const ip = new URL(url).hostname;
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: `http://${ip}`,
            timeout: timeout || 8000, // Set a timeout for the ping
            onload: function(pingResponse) {
                if ((pingResponse.status >= 200 && pingResponse.status < 400) || pingResponse.status === 401) {
                    // If the ping is successful, proceed with fetching the GUI data
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        user: username,
                        password: password,
                        responseType: responseType || 'text',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                if(responseType === 'arraybuffer' && type === 'tar.gz') {
                                    // Extract the logs from the response (uncompress the .gz and get the various .log files)
                                    try {
                                        // Step 1: Decompress the .gz file
                                        const decompressedData = pako.inflate(new Uint8Array(response.response));
                            
                                        // Step 2: Parse the .tar archive
                                        untar(decompressedData.buffer)
                                            .then(files => {
                                                resolve(files);
                                            })
                                    } catch (error) {
                                        console.error("Error processing .tar.gz file:", error);
                                    }
                                } else {
                                    resolve(response.responseText);
                                }
                            } else if (response.status === 401) {
                                reject('Authentication failed. Please check your username and password.');
                            } else {
                                reject(`HTTP error! status: ${response.status}`);
                            }
                        },
                        onerror: function(error) {
                            reject('There was a problem with the fetch operation:', error);
                        }
                    });
                } else {
                    reject(`Ping failed! Unable to reach IP: ${ip} status: ${pingResponse.status}`);
                }
            },
            ontimeout: function() {
                reject(`Ping timeout! Unable to reach IP: ${ip}`);
            },
            onerror: function() {
                reject(`Ping error! Unable to reach IP: ${ip}`);
            }
        });
    });
}
function fetchAndCombineLogs(ip) {
    if (ip.includes("http")) {
        ip = new URL(ip).hostname;
    }

    const logDirUrl = `http://${ip}/cgi-bin/getLogDir.cgi`;
    const currentLogUrl = `http://${ip}/files/logs/foundryminerExec.log`;

    return fetchGUIData(logDirUrl)
        .then(logDirResponse => {
            const logs = JSON.parse(logDirResponse).logs;
            const previousLogs = logs.previous || [];
            const todayLogs = logs.today || [];

            // Combine previous and today logs, then find the newest logs- file
            const allLogs = [...previousLogs, ...todayLogs];
            const newestLogFile = allLogs
                .filter(log => log.fileName.startsWith("logs-") && log.fileName.endsWith(".tar.gz"))
                .sort((a, b) => new Date(b.fileMod) - new Date(a.fileMod))[0];

            if (!newestLogFile) {
                throw new Error("No logs- file found in the directory.");
            }

            const newestLogUrl = `http://${ip}/files/logs/${newestLogFile.fileName}`;

            return fetchGUIData(newestLogUrl, "arraybuffer", "tar.gz", 16000)
                .then(response => {
                    // Gets all miner logs with "foundryminerExec" in the name
                    const minerLogs = response.filter(file => file.name.includes("foundryminerExec"));
                    const lastLogFile = minerLogs[minerLogs.length - 1];

                    // Convert ArrayBuffer of lastLogFile.buffer to string
                    const decoder = new TextDecoder('utf-8');
                    const logString = decoder.decode(lastLogFile.buffer);

                    return fetchGUIData(currentLogUrl).then(currentLog => {
                        const fullLogString = "----------"+newestLogFile.fileName + " foundryminerExec LOG START----------\n\n" + logString + "\n" + currentLog;
                        return fullLogString;
                    });
                });
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

// Where we define the different error strctures to locate
const errorsToSearch = {
    /*
    'Test Error': {
        icon: "https://icons8.com/icon/35881/test-passed",
        start: "Booting Linux on physical",
    },
    */
    //1970-01-01 00:00:13 Miner sn: HKYQANUBCAAAG015X
    'Miner Serial Number': {
        icon: "https://img.icons8.com/?size=100&id=11878&format=png&color=FFFFFF",
        start: "Miner sn: ",
        type: "Info",
        textReturn: (text) => {
            return "SN: " + text.split("Miner sn: ")[1].replace(/\r?\n|\r/g, '');
        },
        showOnce: "last",
    },
    'Hashboard Model': {
        icon: "https://img.icons8.com/?size=100&id=TCPyCvcuaQTs&format=png&color=FFFFFF",
        start: ["board_name:", "load machine"],
        end: "machine : ",
        type: "Info",
        textReturn: (text) => {
            if(text.includes("board_name")) {
                return "HB: " + text.split("board_name:")[1].replace(/\r?\n|\r/g, '');
            } else {
                return "HB: " + text.split("machine : ")[1].replace(/\r?\n|\r/g, '').trim();
            }
        },
        showOnce: "last",
    },

    'Hashboard Model Mismatch': {
        icon: "https://img.icons8.com/?size=100&id=Aqjz8Pn0nyLl&format=png&color=FFFFFF",
        start: ["board_name:", "load machine", "different board name for"],
        end: "machine : ",
        type: "Main",
        conditions: (text) => {
            if(text.includes("different board name for")) {
                return true;
            } else if(text.includes("board_name")) {
                // Extract the miner and board name from the text 2025-02-14 05:29:17 miner:BHB56804,board_name:BHB56804
                const minerName = text.split("miner:")[1].split(",")[0].replace(/\r?\n|\r/g, '');
                const boardName = text.split("board_name:")[1].replace(/\r?\n|\r/g, '');
                return minerName !== boardName;
            } else {
                /*
                2025-01-28 16:35:08 load machine BHB42651 conf
                2025-01-28 16:35:08 machine : BHB42651
                */
                const loadName = text.split("load machine ")[1].split(" conf")[0].trim();
                const machineName = text.split("machine : ")[1].replace(/\r?\n|\r/g, '').trim();
                return loadName !== machineName;
            }
        },
        showOnce: "last",
    },

    'Bad Hashboard Chain': {
        icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
        start: ["get pll config err", /Chain\[0\]: find .* asic, times/],
        end: ["stop_mining: soc init failed", "stop_mining: asic number is not right"],
        type: "Main",
        conditions: (text) => {
            return text.includes('only find') || text.includes('asic number is not right');
        },
        textReturn: (text) => {
            return text.match(/Chain\s\d+\sonly\sfind/g)
                ? "Bad HB Chain [" + text.match(/Chain\s\d+\sonly\sfind/g).map(match => match.replace("Chain ", "").replace(" only find", "")).join(", ") + "]"
                : "Bad HB Chain [?]";
        }
    },
    'Bad ASIC Number': {
        icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
        start: ["bad asic num"],
        end: "] asic[",
        type: "Main",
        textReturn: (text) => {
            /*
            2025-04-12 01:22:12 chain[2] bad asic num: 9 9 0
            2025-04-12 01:22:12 chain[2] asic[8] [124] 7205547-7205423 [0] 25514-25514
            */

            const badAsicLines = text.match(/chain\[\d+\]\sbad\sasic\snum:\s\d+\s\d+\s\d+/g);
            if (badAsicLines) {
                const badAsicNumbers = badAsicLines.map(line => {
                    const chainNumber = line.match(/chain\[(\d+)\]/)[1];
                    const asicNumbers = line.match(/bad\sasic\snum:\s(\d+)\s(\d+)\s(\d+)/);
                    if (asicNumbers) {
                        return chainNumber//`[${chainNumber}]: (${asicNumbers[1]}, ${asicNumbers[2]}, ${asicNumbers[3]})`;
                    }
                }).join(", ");
                return badAsicNumbers ? "Bad ASIC Num [" + badAsicNumbers + "]" : "Bad ASIC Number [?]";
            }

            return "Bad ASIC Number";
        }
    },
    'Bad Hashboard Chain FDMiner ': {
        icon: "https://img.icons8.com/?size=100&id=oirUg9VSEnSv&format=png&color=FFFFFF",
        start: [/Count Detected : \d+ Expected : \d+/, "No ChippyResponse recvd from"],
        end: ["HB_INIT_FAIL"],
        type: "Main",
        textReturn: (text) => {
            console.log("Figuring out bad HB chain from text: ", text);
            const detectedAsics = text.match(/ASIC Count Detected : \d+ Expected : \d+/g);
            if (detectedAsics) {
                /*
                04/04/25 00:20:17.599 L1 HB   ASIC count Doesnot match with MinerMidel.ASIC Count Detected : 96 Expected : 126
                04/04/25 00:20:17.599 L0 HB   HB1: 96 ASICs Detected
                04/04/25 00:20:17.600 L1 HB    Unable to init HB1
                04/04/25 00:20:17.600 L0 HB    HB1 is ready to mine
                04/04/25 00:20:17.600 L0 HB    HB1 init cmplt
                04/04/25 00:20:17.600 L0 HB   HB1: Pool Changed from -1 to 0
                04/04/25 00:20:17.603 L0 HB   HB3: 126 ASICs Detected
                04/04/25 00:20:17.607 L1 HB    Incorrect chippy Response Detected
                04/04/25 00:20:17.607 L0 HB   HB2: 0 ASICs Detected
                04/04/25 00:20:17.608 L1 HB    Unable to init HB2
                04/04/25 00:20:17.608 L0 HB    HB2 is ready to mine
                04/04/25 00:20:17.608 L0 HB    HB2 init cmplt
                04/04/25 00:20:17.608 L0 HB   HB2: Pool Changed from -1 to 0
                04/04/25 00:20:18.378 L1 MAIN Unable To Init HB1
                04/04/25 00:20:18.378 L0 MAIN  HB1 init done
                04/04/25 00:20:18.378 L0 MAIN Waiting for HB2 Init
                04/04/25 00:20:18.378 L0 MAIN  HB2 init done
                04/04/25 00:20:18.379 L0 MAIN Waiting for HB3 Init
                04/04/25 00:20:18.379 L0 MAIN  HB3 init done
                04/04/25 00:20:18.379 L5 MAIN 	Stage	:	12
                04/04/25 00:20:18.379 L0 MAIN Running Fans at FullSpeed
                04/04/25 00:20:18.379 L3 MAIN Exiting after Uptime : 0 s
                04/04/25 00:20:18.379 L8 MAIN Set Exit time to 13796
                04/04/25 00:20:18.379 L8 MAIN exitErrNo :6 ,errMsg : HB_INIT_FAIL
                04/04/25 00:20:18.381 L0 MAIN Disabling Hashboards
                04/04/25 00:20:18.397 L0 MAIN Disabled HB 1
                04/04/25 00:20:18.413 L0 MAIN Disabled HB 2
                04/04/25 00:20:18.428 L0 MAIN Disabled HB 3
                */

               // Find each ASICs Detected line and get the number of ASICs detected for the HB number
                const asicDetectedLines = text.match(/HB\d+: \d+ ASICs Detected/g);
                if (asicDetectedLines) {
                    const expectedCount = detectedAsics[0].split(" : ")[2].trim();
                    const badHBs = asicDetectedLines.map(line => {
                        const [hb, count] = line.split(": ");
                        const hbNumber = hb.replace("HB", "").trim();
                        const detectedCount = count.replace("ASICs Detected", "").trim();
                        console.log("HB Number: ", hbNumber, " Detected Count: ", detectedCount, " Expected Count: ", expectedCount);
                        return parseInt(detectedCount) !== parseInt(expectedCount) ? hbNumber : null;
                    }).filter(Boolean);
                    return "Bad HB Chain [" + badHBs.join(", ") + "]";
                }
            }

            //No ChippyResponse recvd from HB1
            const chippyResponseLines = text.match(/No ChippyResponse recvd from HB\d+/g);
            if (chippyResponseLines) {
                const badHBs = chippyResponseLines.map(line => {
                    const hbNumber = line.split("HB")[1].trim();
                    return hbNumber.replace("No ChippyResponse recvd from ", "").trim();
                });
                return "Bad HB Chain [" + badHBs.join(", ") + "]";
            }

            return "Bad HB Chain [?]";
        }
    },
    'Bad Hashboard Chain FDMiner ': {
        icon: "https://img.icons8.com/?size=100&id=oirUg9VSEnSv&format=png&color=FFFFFF",
        start: ["No ChippyResponse recvd", /HB\d+: \d+ ASICs Detected/],
        end: ["Unable to init HB", "Incorrect No of Chips Detected. Check HB"],
        type: "Main",
        conditions: (text) => {
            return text.includes('Unable to init HB') || text.includes('Incorrect No of Chips Detected. Check HB');
        },
        textReturn: (text) => {
            // Find all Incorrect No of Chips Detected. Check HB# lines
            const incorrectChipsLines = text.match(/Incorrect No of Chips Detected. Check HB\d+/g);
            if (incorrectChipsLines) {
                const badHBs = incorrectChipsLines.map(line => {
                    const hbNumber = line.split("HB")[1].trim();
                    return hbNumber.replace("Incorrect No of Chips Detected. Check ", "").trim();
                });
                return "Bad HB Chain [" + badHBs.join(", ") + "]";
            }

            // Finda all the Unable to init HB#
            const unableToInitLines = text.match(/Unable to init HB\d+/g);
            if (unableToInitLines) {
                const badHBs = unableToInitLines.map(line => {
                    const hbNumber = line.split("HB")[1].trim();
                    return hbNumber.replace("Unable to init ", "").trim();
                });
                return "Bad HB Chain [" + badHBs.join(", ") + "]";
            }

            return "Bad HB Chain [?]";
        }
    },
    'Fan Speed Error': {
        icon: "https://img.icons8.com/?size=100&id=t7Gbjm3OaxbM&format=png&color=FFFFFF",
        start: ["Error, fan lost,", "Exit due to FANS NOT DETECTED | FAN FAILED", /FAN \d+ Fail/, "Expected RPM", /Fan \d+ Fail/, "Fans have Failed", "to run at expected RPM", "minFans Required", "Expected RPM:", "Fan Fail count", "Detected less than the min Required number of fans"],
        end: ["stop_mining_and_restart: fan lost", "stop_mining: fan lost", "ERROR_FAN_LOST: fan lost"],
        type: "Main",
        shouldGroup: (text) => {
            return true;//text.includes("has failed to run at expected RPM") || text.includes("Expected RPM") || text.includes("Fan Fail count");
        },
        textReturn: (text) => {
            /*
            04/04/25 05:02:53.545 L1 FAN   FAN 1 Fail
            04/04/25 05:02:53.546 L1 FAN  Fan Fail count 1/5
            04/04/25 05:02:53.546 L8 FAN  tSpeed: 27 pSpeed: 25.93 Expected RPM: 2576  MinRatedPe: 20.74 CurrentFanPer: 0  Current FANRPM: 0
            */
            const fanFailLines1 = text.match(/FAN \d+ Fail/g);
            if (fanFailLines1) {
                const fanFailNumbers = fanFailLines1.map(line => line.replace("FAN ", "").replace(" Fail", "").trim()).join(", ");
                return "Fan Fail [" + fanFailNumbers + "]";
            }

            /*
            Fan 4 has failed to run at expected RPM
            */

            const fanFailLines3 = text.match(/Fan \d+ has failed to run at expected RPM/g);
            if (fanFailLines3) {
                const fanFailNumbers = fanFailLines3.map(line => line.replace("Fan ", "").replace(" has failed to run at expected RPM", "").trim()).join(", ");
                return "Fan Fail [" + fanFailNumbers + "]";
            }

            /*
            2025-03-29 03:36:12 Error, fan lost, only find 3 (< 4)
            2025-03-29 03:36:12 fan_id = 0, fan_speed = 0
            2025-03-29 03:36:12 fan_id = 1, fan_speed = 6970
            2025-03-29 03:36:12 fan_id = 2, fan_speed = 7000
            2025-03-29 03:36:12 fan_id = 3, fan_speed = 6990
            2025-03-29 03:36:12 Sweep error string = F:1.
            2025-03-29 03:36:12 ERROR_FAN_LOST: fan lost
            2025-03-29 03:36:12 stop_mining: fan lost
            */

            /*
            2025-04-05 21:34:13 Error, fan lost, only find 3 (< 4)
            2025-04-05 21:34:13 fan_id = 0, fan_speed =  3450(corresponding to FAN3 on control board PCB)
            2025-04-05 21:34:13 fan_id = 1, fan_speed =  3720(corresponding to FAN1 on control board PCB)
            2025-04-05 21:34:13 fan_id = 2, fan_speed =     0(corresponding to FAN2 on control board PCB)
            2025-04-05 21:34:13 fan_id = 3, fan_speed =  6000(corresponding to FAN4 on control board PCB)
            2025-04-05 21:34:13 Sweep error string = F:1.
            2025-04-05 21:34:13 ERROR_FAN_LOST: fan lost
            2025-04-05 21:34:13 stop_mining: fan lost
            */
            const fanFailLines2 = text.match(/fan_id = \d+, fan_speed =\s*\d+/g)
            if (fanFailLines2) {
                // For all fan speed 0 lines, get the fan number
                console.log("Fan Fail Lines: ", fanFailLines2);
                let fanSpeeds = [];
                
                for (const line of fanFailLines2) {
                    // Extract the fan number and speed from the line
                    const fanNumber = line.split("fan_id = ")[1].split(",")[0].trim();
                    const fanSpeed = line.split("fan_speed = ")[1].trim().split("(")[0].trim();
                    console.log("Fan Number: ", fanNumber, " Fan Speed: ", fanSpeed);
                    fanSpeeds.push(Number(fanSpeed));
                }

                // If any of the fan numbers are 0, or are far away from the others, return them as failed fans
                let failedFans = [];
                
                for (let i = 0; i < fanSpeeds.length; i++) {
                    let fanSpeed = fanSpeeds[i];
                    if(fanSpeed === 0 || Math.abs(fanSpeed - Math.max(...fanSpeeds)) > 2000) {
                        failedFans.push(i);
                    }
                }

                const fanFailNumbers = failedFans.map(fan => fan.toString()).join(", ");
                return "Fan Fail [" + fanFailNumbers + "]";
            }
            return "Fan Fail";
        },
    },
    'SOC INIT Fail': {
        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
        start: "ERROR_SOC_INIT",
        end: ["ERROR_SOC_INIT", "stop_mining: soc init failed!", "stop_mining: basic init failed!"],
        type: "Main",
        onlySeparate: true
    },
    'Max ASIC Fail Num': {
        icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
        start: "miner has reached find asic max fail num,reboot times:",
        textReturn: (text) => {
            // miner has reached find asic max fail num,reboot times:11.
            const failNum = text.split("reboot times:")[1].trim().split(".")[0];
            return "Max ASIC Fail Num (" + failNum + " Reboots)";
        },
        type: "Main",
    },
    'EEPROM Error': {
        icon: "https://img.icons8.com/?size=100&id=9040&format=png&color=FFFFFF",
        start: ["eeprom error crc 3rd region", "EEPROM error", /load chain \d+ eeprom data/],
        end: "got nothing",
        type: "Main",
        conditions: (text) => {
            if(text.includes("load chain")) {
                return text.includes("got nothing");
            }
            return true;
        },
        onlySeparate: true
    },
    'Hashboard Init Fail': {
        icon: "https://img.icons8.com/?size=100&id=35849&format=png&color=FFFFFF",
        start: "Exit due to HASHBOARD INITIALIZATION FAILED",
        type: "Main",
        onlySeparate: true
    },
    'Target Hashrate Fail': {
        icon: "https://img.icons8.com/?size=100&id=20767&format=png&color=FFFFFF",
        start: "Exit due to Unable to Generate Given Target Hashrate",
        type: "Main",
        onlySeparate: true
    },
    'Voltage Abnormity': {
        icon: "https://img.icons8.com/?size=100&id=61096&format=png&color=FFFFFF",
        start: ["chain avg vol drop from", "ERROR_POWER_LOST", "failed to scale voltage up", "bitmain_get_sample_voltage"],
        end: ["power voltage can not meet the target", "power voltage err", "ERROR_POWER_LOST: power voltage rise or drop", "stop_mining_and_restart: power voltage read failed", "power voltage abnormity", "stop_mining: soc init failed", "stop_mining: get power type version failed!", "stop_mining: power status err, pls check!", "stop_mining: power voltage rise or drop, pls check!", "stop_mining: pic check voltage drop"],
        type: "Main",
        shouldGroup: (text) => {
            return true;
        },
    },
    'Low Voltage': {
        icon: "https://img.icons8.com/?size=100&id=16422&format=png&color=FFFFFF",
        start: ["vol:", "bitmain_get_sample_voltage"],
        conditions: (text) => {
            // temp:14,vol:0.13,power:222
            // if it has temp and power
            if(text.includes("temp:") && text.includes("power:")) {
                // Extract the voltage number from the text 2025-02-14 05:29:17 temp:-6,vol:14.98,power:569
                const parts = text.split("vol:");
                if (parts.length > 1) {
                    const volPart = parts[1].split(",")[0];
                    const voltage = parseFloat(volPart);
                    return voltage < 1;
                }
            }

            if(text.includes("bitmain_get_sample_voltage")) {
                const parts = text.split("bitmain_get_sample_voltage:")[1].split(",")[0];
                const voltage = parseFloat(parts);
                if(voltage < 1) {
                    return true
                }
            }

            return false
        },
        type: "Main",
        textReturn: (text) => {

            if(text.includes("bitmain_get_sample_voltage")) {
                const parts = text.split("bitmain_get_sample_voltage:")[1].split(",")[0];
                const voltage = parseFloat(parts);
                if(voltage < 0) {
                    return "Bad Voltage (" + voltage + "V)";
                }
                return "Low Voltage (" + voltage + "V)";
            }

            // Extract the voltage number from the text 2025-02-14 05:29:17 temp:-6,vol:14.98,power:569
            const parts = text.split("vol:");
            if (parts.length > 1) {
                const volPart = parts[1].split(",")[0];
                const voltage = parseFloat(volPart);
                if(voltage < 0) {
                    return "Bad Voltage (" + voltage + "V)";
                }
                return "Low Voltage (" + voltage + "V)";
            }
        },
        showOnce: "last",
    },

    'Power Status Fail': {
        icon: "https://img.icons8.com/?size=100&id=16422&format=png&color=FFFFFF",
        start: "bitmain_get_power_status failed",
        type: "Main",
    },
    "Error Status": {
        icon: "https://img.icons8.com/?size=100&id=6SQJcUEPQTXf&format=png&color=FFFFFF",
        start: "err status:",
        type: "Main",
    },
    'Temperature Sensor Error': {
        icon: "https://img.icons8.com/?size=100&id=IN6gab7HZOis&format=png&color=FFFFFF",
        start: "Exit due to TEMPERATURE SENSORS FAILED",
        type: "Main",
    },
    'Temperature Too Low Error': {
        icon: "https://img.icons8.com/?size=100&id=0Bm1Quaegs8d&format=png&color=FFFFFF",
        start: "ERROR_TEMP_TOO_LOW",
        end: "stop_mining",
        type: "Main",
    },
    /*
    'Voltage over 13.20 V': {
        icon: "https://img.icons8.com/?size=100&id=MWJoGGglMjH8&format=png&color=FFFFFF",
        start: "temp:",
        conditions: (text) => {
            // Extract the voltage number from the text 2025-02-14 05:29:17 temp:-6,vol:14.98,power:569
            const parts = text.split("vol:");
            if (parts.length > 1) {
                const volPart = parts[1].split(",")[0];
                const voltage = parseFloat(volPart);
                return voltage >= 13.20;
            }
            return false;
        },
        showOnce: "last",
    },
    */
    'Temp ≤ 0°C|32°F': {
        icon: "https://img.icons8.com/?size=100&id=-uAldka8Jgn4&format=png&color=FFFFFF",
        start: "temp:",
        type: "Main",
        conditions: (text) => {
            // Extract the temp number from the text 2025-02-14 05:29:17 temp:-6,vol:14.98,power:569
            const parts = text.split("temp:");
            if (parts.length > 1) {
                const tempPart = parts[1].split(",")[0];
                const temperature = parseInt(tempPart, 10);
                return temperature <= 0;
            }
            return false;
        },
        showOnce: "last",
    },
    'Temperature Overheat': {
        icon: "https://img.icons8.com/?size=100&id=er279jFX2Yuq&format=png&color=FFFFFF",
        start: ["asic temp too high", "ERROR_TEMP_TOO_HIGH", "Exit due to SHUTDOWN TEMPERATURE LIMIT REACHED"],
        end: ["stop_mining: asic temp too high", "stop_mining: over max temp"],
        type: "Main",
    },
    /*
    'Temp ≥ 50°C|122°F': {
        icon: "https://img.icons8.com/?size=100&id=6444&format=png&color=FFFFFF",
        start: "temp:",
        conditions: (text) => {
            // Extract the temp number from the text 2025-02-14 05:29:17 temp:-6,vol:14.98,power:569
            const parts = text.split("temp:");
            if (parts.length > 1) {
                const tempPart = parts[1].split(",")[0];
                const temperature = parseInt(tempPart, 10);
                return temperature >= 50;
            }
            return false;
        },
        showOnce: "last",
    },*/
    'Network Lost': {
        icon: "https://img.icons8.com/?size=100&id=Kjoxcp7iiC5M&format=png&color=FFFFFF",
        start: ["WARN_NET_LOST", "ERROR_NET_LOST"],
        end: ["ERROR_UNKOWN_STATUS: power off by NET_LOST", "stop_mining_and_restart: network connection", "stop_mining: power off by NET_LOST", "network connection resume", "network connection lost for"],
        type: "Main",
    },
    'Read/Write Error': {
        icon: "https://img.icons8.com/?size=100&id=keFsyAFvNFX5&format=png&color=FFFFFF",
        start: "fail to write",
        end: "fail to read",
        type: "Main"
    },
    'Main Error Occurance': {
        icon: "https://img.icons8.com/?size=100&id=38975&format=png&color=FFFFFF",
        start: "MAIN Error occured",
        type: "Main",
        textReturn: (text) => {
            // 04/06/25 03:10:13.860 L0 MAIN Error occured: 	{"errNo":"600","msg":["Failed to Detect Chippy","Check Following HB - HB1"]}

            // Get the error data and convert to a object
            const errorData = text.split("MAIN Error occured: ")[1].replace(/\r?\n|\r/g, '');
            const errorObject = JSON.parse(errorData.replace(/\\/g, ''));
            const errorMessage = errorObject.msg.join(", ");
            const errorNumber = errorObject.errNo;

            return "MEO: [" + errorNumber + "] " + errorMessage;
        }
    },
    'TSensor Error': {
        icon: "https://img.icons8.com/?size=100&id=123900&format=png&color=FFFFFF",
        start: "fail to read tsensor by iic",
        type: "Other",
    },
    'PIC Temp Error': {
        icon: "https://img.icons8.com/?size=100&id=IN6gab7HZOis&format=png&color=FFFFFF",
        start: "fail to read pic temp",
        type: "Other"
    },
    'Nonce Buffer Full': {
        icon: "https://img.icons8.com/?size=100&id=Hd082AfY0mbD&format=png&color=FFFFFF",
        start: "nonce_read_out buffer is full!",
        type: "Other"
    },
    'Reg Buffer Full': {
        icon: "https://img.icons8.com/?size=100&id=Hd082AfY0mbD&format=png&color=FFFFFF",
        start: "reg_value_buf buffer is full!",
        type: "Other"
    },
    'Reg CRC Error': {
        icon: "https://img.icons8.com/?size=100&id=IzwgH77KrB9L&format=png&color=FFFFFF",
        start: "reg crc error",
        type: "Other"
    },
    'Nonce CRC Error': {
        icon: "https://img.icons8.com/?size=100&id=nMIFbmGDOQri&format=png&color=FFFFFF",
        start: "nonce crc error",
        type: "Other"
    },
    'Hash2_32 Error': {
        icon: "https://img.icons8.com/?size=100&id=0OqFiOxbTdXT&format=png&color=FFFFFF",
        start: "hash2_32 error",
        type: "Other"
    },
    'I2C Error': {
        icon: "https://img.icons8.com/?size=100&id=47752&format=png&color=FFFFFF",
        start: "IIC_SendData checkack",
        type: "Other"
    },
    'Read SDA Error': {
        icon: "https://img.icons8.com/?size=100&id=47752&format=png&color=FFFFFF",
        start: "error! read SDA return 0",
        end: "i2c_check_ack:290 ack error",
        type: "Other"
    },
    'Bad Chain ID': {
        icon: "https://img.icons8.com/?size=100&id=W7rVpJuanYI8&format=png&color=FFFFFF",
        start: "bad chain id",
        end: "stop_mining: basic init failed!",
        type: "Other"
    },
    'Firmware Error': {
        icon: "https://img.icons8.com/?size=100&id=hbCljOlfk4WP&format=png&color=FFFFFF",
        start: "Firmware registration failed",
        type: "Other"
    },
    'ASIC Error': {
        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
        start: "test_loop_securely_find_asic_num",
        type: "Other"
    },
    'Defendkey Error': {
        icon: "https://img.icons8.com/?size=100&id=BqBqC9QVDQrd&format=png&color=FFFFFF",
        start: "defendkey: probe of defendkey failed with error",
        type: "Other"
    },
    'SN File Error': {
        icon: "https://img.icons8.com/?size=100&id=sMVM8zkGFw2r&format=png&color=FFFFFF",
        start: "Open miner sn file /config/sn error",
        type: "Other"
    },
    'Allocate Memory Error': {
        icon: "https://img.icons8.com/?size=100&id=ZbgOH8S7aNFB&format=png&color=FFFFFF",
        start: "failed to allocate memory for node linux",
        type: "Other"
    },
    'Modalias Failure': {
        icon: "https://img.icons8.com/?size=100&id=RdfQcH0NSwo1&format=png&color=FFFFFF",
        start: "modalias failure",
        type: "Other"
    },
    'CLKMSR Failure': {
        icon: "https://img.icons8.com/?size=100&id=T6eNtBzusujD&format=png&color=FFFFFF",
        start: "clkmsr ffd18004.meson_clk_msr: failed to get msr",
        type: "Other"
    },
    'Unpack Failure': {
        icon: "https://img.icons8.com/?size=100&id=4nmZphA6KAL2&format=png&color=FFFFFF",
        start: "Initramfs unpacking failed",
        type: "Other"
    },
    'I2C Device': {
        icon: "https://img.icons8.com/?size=100&id=9078&format=png&color=FFFFFF",
        start: "Failed to create I2C device",
        type: "Other"
    },
    'No Ports': {
        icon: "https://img.icons8.com/?size=100&id=91076&format=png&color=FFFFFF",
        start: "hub doesn't have any ports",
        type: "Other"
    },
    'Thermal Binding': {
        icon: "https://img.icons8.com/?size=100&id=8bhyzQ0ncJqR&format=png&color=FFFFFF",
        start: "binding zone soc_thermal with cdev thermal",
        type: "Other"
    },
    'PTP Init Failure': {
        icon: "https://img.icons8.com/?size=100&id=mtsC9dJebzYW&format=png&color=FFFFFF",
        start: "fail to init PTP",
        type: "Other"
    },
    'Ram Error': {
        icon: "https://img.icons8.com/?size=100&id=2lS2aIm5uhCG&format=png&color=FFFFFF",
        start: "persistent_ram: uncorrectable error in header",
        type: "Other"
    },
    'Pins Error': {
        icon: "https://img.icons8.com/?size=100&id=110969&format=png&color=FFFFFF",
        start: "did not get pins for",
        type: "Other"
    },
    'Bone Capemgr': {
        icon: "https://img.icons8.com/?size=100&id=7WuWQLicqKdy&format=png&color=FFFFFF",
        start: "bone-capemgr bone_capemgr",
        type: "Other"
    },
    'OMAP HSMMC Error': {
        icon: "https://img.icons8.com/?size=100&id=5k62AODVrDXf&format=png&color=FFFFFF",
        start: "omap_hsmmc mmc",
        type: "Other"
    },
    'Dummy Regulator': {
        icon: "https://img.icons8.com/?size=100&id=byEdLu15HrqW&format=png&color=FFFFFF",
        start: "using dummy regulator",
        type: "Other"
    },
    'Other': {
        icon: "https://img.icons8.com/?size=100&id=0OqFiOxbTdXT&format=png&color=FFFFFF",
        start: "The last error numbers are different.",
        type: "Other",
        textReturn: (text) => {
            if(text.includes("The last error numbers are different.")) {
                return "Different error numbers";
            } else {
                
            }
            return "Unknown error";
        }
    }
}

function excludeUnknowns(text) {
    const contains = [
        '"error":null',
    ]
    for (const str of contains) {
        if (text.includes(str)) {
            return true;
        }
    }
    return false;
}

function runErrorScanLogic(logText) {
    console.log('Running error scan logic');
    //console.log('Log text:', logText);
    // Search through the log and locate errors
    var showOnceErrors = {};
    var errorsFound = []; // Array to store the errors found
    for (const error in errorsToSearch) {
        const errorData = errorsToSearch[error];
        var lastEndIndex = 0;
        var maxIterations = 500;
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
                            errorTextAlreadyFound = true;
                        }
                    }

                    // Remove the error from the showOnceErrors object if it's already been found
                    if (errorData.showOnce === "last") {
                        const previousErrorIndex = showOnceErrors[error];
                        if (previousErrorIndex) {
                            errorsFound.splice(previousErrorIndex - 1, 1);
                            showOnceErrors[error] = null;
                        }
                    }
                        

                    // Check if the error text meets the conditions
                    if (typeof errorData.conditions === 'function' ? errorData.conditions(errorText) : true && !errorTextAlreadyFound) {
                        let shouldAddNew = true;
                        const lastErrorIndex = errorsFound.length - 1;
                        const lastError = errorsFound[lastErrorIndex];
                        if(lastError && lastError.name === error && ((!isFunction(errorData.shouldGroup) && errorData.shouldGroup != false) || (isFunction(errorData.shouldGroup) && errorData.shouldGroup(errorText))) ) {
                            // If the error should be grouped, find the last occurrence of the error in the errorsFound array and update it, but only if it is directly after the last error found
                            if (lastError.end >= startIndex-1) {
                                // Update the last error found with the new error text
                                lastError.text += "\n" + errorText.trimEnd();
                                lastError.end = endIndex;

                                let testReturn = errorData.textReturn ? errorData.textReturn(lastError.text) : error;
                                lastError.textReturn = testReturn;
                                shouldAddNew = false;
                            }
                        } 
                        
                        if(shouldAddNew) {
                            let textReturn = errorData.textReturn ? errorData.textReturn(errorText) : error;
                            
                            errorsFound.push({
                                name: error,
                                icon: errorData.icon || "https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF",
                                text: errorText.trimEnd(),
                                start: startIndex,
                                end: endIndex,
                                type: errorData.type || "Other",
                                textReturn: textReturn 
                            });
                            

                            // So we know the previous error to remove it if it's found again
                            if (errorData.showOnce) {
                                showOnceErrors[error] = errorsFound.length;
                            }
                        }

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

    // Find all the times 'error' or 'fail' or 'not found' is mentioned in the log if it isn't already found in the defined errors, mark is as an Unknown Error
    const errorRegex = /error/gi;
    const failRegex = /fail/gi;
    const notFoundRegex = /not found/gi; // disabled for now
    const errorMatches = [...logText.toLowerCase().matchAll(errorRegex), ...logText.toLowerCase().matchAll(failRegex)];
    for (const match of errorMatches) {
        // Check if the error is already found
        const matchIndex = match.index;
        if (!errorsFound.some(error => matchIndex >= error.start && matchIndex <= error.end)) {
            // Find the start and end of the line
            const start = logText.lastIndexOf('\n', matchIndex) + 1;
            const end = logText.indexOf('\n', matchIndex) + 1;
            const errorText = logText.substring(start, end);

            // Don't add if it is set to be excluded
            if(excludeUnknowns(errorText)) {
                continue;
            }

            // Add the error to the list of errors
            errorsFound.push({
                name: 'Unknown Error',
                icon: "https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF",
                text: errorText.trimEnd(),
                start: start,
                end: end,
                type: "Other"
            });
        }
    }
    return errorsFound;
}

// Define the errors to condense
const errorsToCondense = [
    '!!! reg crc error',
    'nonce crc error',
    'hash2_32 error',
    'reg_value_buf buffer is full!',
    'fail to read tsensor by iic, chain',
    'fail to read pic temp for chain',
    'fail to write',
    'fail to read',
    "bitmain_get_power_status failed"
];

// Loop through the log text and find occurrences of the defined errors, count them up and condense to the very last one
function cleanErrors(logText) {
    let logLines = logText.split('\n');
    let errorCounts = {};
    let lastErrorLine = {};

    // Count occurrences of each error and track the last line it appears on
    for (let i = 0; i < logLines.length; i++) {
        let foundError = errorsToCondense.find(error => logLines[i].includes(error));
        if (foundError) {
            if (!errorCounts[foundError]) {
                errorCounts[foundError] = 0;
            }
            errorCounts[foundError]++;
            lastErrorLine[foundError] = i;
        }
    }

    // Replace the last occurrence of each error with the condensed version
    for (const error in errorCounts) {
        if (errorCounts[error] > 1) {
            logLines[lastErrorLine[error]] = `${error} (x${errorCounts[error]})`;
        }
    }

    // Remove all other occurrences of the errors
    logLines = logLines.filter((line, index) => {
        let foundError = errorsToCondense.find(error => line.includes(error));
        return !foundError || lastErrorLine[foundError] === index;
    });

    logText = logLines.join('\n');

    return logText;
}

function cutOffPreviousLog(logText) {
    // Removes previous logs starts for Foundry GUI logs
    const startIndex = logText.lastIndexOf("----------Start");
    if (startIndex !== -1) {
        logText = logText.substring(startIndex);
    }
    return logText;
}


window.addEventListener('load', function () {
    var urlLookupExcel = {};
    const defaultExcelLink = "https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3";

    urlLookupExcel["Bitmain"] = GM_SuperValue.get("bitmainLink", defaultExcelLink);
    urlLookupExcel["Fortitude"] = GM_SuperValue.get("fortitudeLink", defaultExcelLink);;
    urlLookupExcel["RAMM"] = GM_SuperValue.get("rammLink", defaultExcelLink);

    const urlLookupPlanner = {
        "Bitmain": "https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/board",
        "Fortitude": "https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/board",
        "RAMM": "https://planner.cloud.microsoft/webui/plan/FHYUYbYUfkqd2-oSKLk7xGUAHvRz/view/board"
    };

    const urlLookupPlannerGrid = {
        "Fortitude": "https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/grid",
        "RAMM": "https://planner.cloud.microsoft/webui/plan/FHYUYbYUfkqd2-oSKLk7xGUAHvRz/view/grid",
        "Bitmain": "https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/grid",
    }

    //-----------------

    function getSelectedSiteId() {
        return JSON.parse(localStorage.getItem("selectedSite"));
    }

    function getSelectedSiteName() {
        return localStorage.getItem("selectedSiteName");
    }

    function getSelectedCompanyId() {
        return JSON.parse(localStorage.getItem("selectedCompany"));
    }

    function OptiFleetSpecificLogic() {
        var allMinersData = {};
        var allMinersLookup = {};
        let frozenMiners = [];
        const disableFrozenMiners = true;
        let gotFrozenData = false;
        let gotFrozenDataFor = {};
        let activeMiners = 0;
        let foundActiveMiners = false;

        let averagedContainerMinerTemps = {};

        let OptiFleetService2 = Object.getPrototypeOf(unsafeWindow.ms);
        var serviceInstance = Object.getPrototypeOf(unsafeWindow.ms);
        
        var viewServiceInstance = new MinerViewService();
        var siteId = getSelectedSiteId();
        var siteName = getSelectedSiteName();
        var companyId = getSelectedCompanyId();
        var lastSiteId = siteId;
        var lastCompanyId = companyId;
        var lastMinerDataUpdate = 0;
        var reloadCards = false;
        
        let minerSNLookup = GM_SuperValue.get("minerSNLookup_"+siteName, {});

        let lastUpTime = {}; //GM_SuperValue.get("lastUpTime_"+siteName, {});

        function retrieveIssueMiners(callback) {
            // In case we swap company/site (Not actually sure if it matters for site, but might as well)
            __awaiter(serviceInstance, void 0, void 0, function* () {
                siteId = getSelectedSiteId();
                siteName = getSelectedSiteName();
                serviceInstance.get(`/Issues?siteId=${siteId}&zoneId=-1`).then(res => {
                    res.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");
                    if (callback) {
                        console.log("Retrieved issue miners", res.miners);
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
            const majorAlertEnable = GM_SuperValue.get("majorAlertEnable", "false") === "true";
            const majorAlertTTS = GM_SuperValue.get("majorAlertTTS", "false") === "true";

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
            
            const majorAlertEnableContainer = document.createElement('div');
            majorAlertEnableContainer.style.display = 'flex';
            majorAlertEnableContainer.style.alignItems = 'center';

            const majorAlertEnableInput = document.createElement('input');
            majorAlertEnableInput.type = 'checkbox';
            majorAlertEnableInput.checked = majorAlertEnable;
            majorAlertEnableInput.style.marginBottom = '10px';
            majorAlertEnableInput.style.width = '20px'; // Set the width smaller
            majorAlertEnableInput.style.height = '20px'; // Set the height smaller
            majorAlertEnableInput.style.marginRight = '10px'; // Add some space to the right

            const majorAlertEnableLabelText = document.createElement('span');
            majorAlertEnableLabelText.innerText = 'Enable/Disable major notifications.';
            majorAlertEnableLabelText.style.color = '#fff'; // Set text color to white for better contrast
            majorAlertEnableLabelText.style.marginBottom = '10px';

            majorAlertEnableContainer.appendChild(majorAlertEnableInput);
            majorAlertEnableContainer.appendChild(majorAlertEnableLabelText);

            // Add TTS option if major alert is enabled
            const majorAlertTTSEnableContainer = document.createElement('div');
            majorAlertTTSEnableContainer.style.display = 'flex';
            majorAlertTTSEnableContainer.style.alignItems = 'center';

            const majorAlertTTSEnableInput = document.createElement('input');
            majorAlertTTSEnableInput.type = 'checkbox';
            majorAlertTTSEnableInput.checked = majorAlertTTS;
            majorAlertTTSEnableInput.style.marginBottom = '10px';
            majorAlertTTSEnableInput.style.width = '20px'; // Set the width smaller
            majorAlertTTSEnableInput.style.height = '20px'; // Set the height smaller
            majorAlertTTSEnableInput.style.marginRight = '10px'; // Add some space to the right

            const majorAlertTTSEnableLabelText = document.createElement('span');
            majorAlertTTSEnableLabelText.innerText = 'Enable/Disable TTS for major notifications.';
            majorAlertTTSEnableLabelText.style.color = '#fff'; // Set text color to white for better contrast
            majorAlertTTSEnableLabelText.style.marginBottom = '10px';

            majorAlertTTSEnableContainer.appendChild(majorAlertTTSEnableInput);
            majorAlertTTSEnableContainer.appendChild(majorAlertTTSEnableLabelText);

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
                GM_SuperValue.set("majorAlertEnable", majorAlertEnableInput.checked.toString());
                GM_SuperValue.set("majorAlertTTS", majorAlertTTSEnableInput.checked.toString());
                
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
            popup.appendChild(majorAlertEnableContainer);
            popup.appendChild(majorAlertTTSEnableContainer);
            popup.appendChild(saveButton);
            popup.appendChild(cancelButton);

            document.body.appendChild(popup);
        }
        
        
        // Add a small edit button to bottom right
        if(currentURL.includes("https://foundryoptifleet.com/Content/Issues/Issues") && siteName.includes("Minden") && savedFeatures["alertSystem"]) {

            // Find hubspot-messages-iframe-container and remove it
            const interval = setInterval(() => {
                const hubspotMessagesIframeContainer = document.querySelector('#hubspot-messages-iframe-container');
                if (hubspotMessagesIframeContainer) {
                    hubspotMessagesIframeContainer.remove();
                    clearInterval(interval);
                }
            }, 500);

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
                const majorAlertEnable = GM_SuperValue.get("majorAlertEnable", "false") === "true";
                const majorAlertTTS = GM_SuperValue.get("majorAlertTTS", "false") === "true";

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
                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');

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
                    if(minerCount >= majoralertThreshold && majorAlertEnable) {
                        notification.style.backgroundColor = 'red';
                        notification.style.color = 'white';
                        notification.style.fontWeight = 'bold';

                        document.body.click();

                        if(new Date().getTime() - GM_SuperValue.get("majorAlert_LastPlayed", 0) > 5000) {
                            const audio = new Audio('https://cdn.freesound.org/previews/521/521973_311243-lq.mp3');
                            audio.play();
                            GM_SuperValue.set("majorAlert_LastPlayed", new Date().getTime());
                        }
                        
                        if(majorAlertTTS && (new Date().getTime() - GM_SuperValue.get("majorAlertTTS_LastSpoken", 0)) > 20000) {
                            GM_SuperValue.set("majorAlertTTS_LastSpoken", new Date().getTime());
                            var msg = new SpeechSynthesisUtterance();
                            msg.text = "There are " + allMiners + " miners with issues. " + nonHashingMinerCount + " are non hashing. " + lowHashingMinerCount + " are low hashing.";
                            window.speechSynthesis.speak(msg);
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
        if( siteName.includes("Minden") && savedFeatures["alertSystem"] ) {
            // Miner issue notification every minute
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

        function createHashRateElements() {}

        let onUpdateAdditionalCallBacks = [];
        function addAdditionalUpdateCallback(callback) {
            if (typeof callback === 'function') {
                onUpdateAdditionalCallBacks.push(callback);
            } else {
                console.error("Callback is not a function:", callback);
            }
        }

        function onUpdateAdditional(allMinersData) {
            for (let i = 0; i < onUpdateAdditionalCallBacks.length; i++) {
                const callback = onUpdateAdditionalCallBacks[i];
                if (typeof callback === 'function') {
                    callback(allMinersData);
                }
            }
        }
        
        function updateAllMinersData(keepTrying = false, callback) {
            console.log("Updating all miners data");
            // Reset allMinersLookup
            delete allMinersLookup;
            allMinersLookup = {};

            // Get the current site and company ID
            lastSiteId = siteId;
            lastCompanyId = companyId;

            viewServiceInstance = new MinerViewService();
            siteId = getSelectedSiteId();
            siteName = getSelectedSiteName();
            companyId = getSelectedCompanyId();

            // In case we swap company/site (Not actually sure if it matters for site, but might as well)
            __awaiter(this, void 0, void 0, function* () {
                serviceInstance.get(`/MinerInfo?siteId=${siteId}&zoneId=${-1}&zoneName=All%20Zones`)
                    .then((resp) => {

                    // Populate the minerSNLookup
                    minerSNLookup = {};
                    resp.miners.forEach(miner => {
                        minerSNLookup[miner.serialNumber] = {
                            minerID: miner.id,
                            slotID: miner.locationName.replace("Minden_", ""),
                            ipAddress: miner.ipAddress,
                            macAddress: miner.macAddress,
                            discoveredSerialNumber: miner.discoveredSerialNumber,
                        };
                        allMinersLookup[miner.id] = miner;

                        //GM_SuperValue.set(miner.macAddress, minerSNLookup[miner.serialNumber]);

                        /*
                        if(miner.avgBoardTemperature > 0) {
                            let minerContainer = miner.locationName;
                            minerContainer = minerContainer.replace("Minden_", "");
                            minerContainer = minerContainer.split("-")[0];
                            averagedContainerMinerTemps[minerContainer] = averagedContainerMinerTemps[minerContainer] || { total: 0, count: 0 };
                            averagedContainerMinerTemps[minerContainer].total += miner.avgBoardTemperature;
                            averagedContainerMinerTemps[minerContainer].count++;
                        }*/
                    });

                    /*
                    averagedContainerMinerTemps = Object.keys(averagedContainerMinerTemps).reduce((acc, key) => {
                        acc[key] = acc[key].total / acc[key].count;
                        return acc;
                    }, averagedContainerMinerTemps);
                    console.log("Averaged Container Miner Temps:", averagedContainerMinerTemps);*/

                    GM_SuperValue.set("minerSNLookup_"+siteName, minerSNLookup);

                    let currentSiteNames = GM_SuperValue.get("siteNames", {});
                    currentSiteNames[siteName] = new Date().getTime();
                    GM_SuperValue.set("siteNames", currentSiteNames);

                    // Set the IP Address to "Lease Expired" if it's null
                    resp.miners.filter(miner => miner.ipAddress == null).forEach(miner => miner.ipAddress = "Lease Expired");

                    let miners = resp.miners;
                    //console.log("Miners Data:", miners);
    
                    if(keepTrying && Date.now() - lastMinerDataUpdate > 1000 && miners.length === 0) {
                        console.log("Retrying to get miner data");
                        setTimeout(function() {
                            updateAllMinersData(true);
                        }, 500);
                    }
                    
                    if(!disableFrozenMiners) {
                        // Sets up a lookup table
                        delete frozenMiners;
                        frozenMiners = [];
                        miners.forEach(miner => {
                            
                            // If the miner is frozen, add it to the frozen miners list
                            const minerID = miner.id;
                            const uptimeValue = miner.uptimeValue;
                            const lastUptimeData = lastUpTime[minerID] || { value: -1, time: -1, addedToList: false, lastHashRate: -1, sameHashRateCount: 0 };
                            const lastUptimeValue = lastUptimeData.value;
                            const lastUptimeTime = lastUptimeData.time;
                            const isHashing = miner.hashrate > 0;
                            const uptimeOverZero = uptimeValue > 0;
                            const minerOnline = miner.statusName === 'Online';
                            const notSameStatusUpdate = lastUptimeTime !== -1 && miner.lastStatsUpdate !== lastUptimeTime;
                            const sameBetweenChecks = uptimeValue === lastUptimeValue && notSameStatusUpdate;
                            const wasInListBefore = uptimeValue === lastUptimeValue && lastUptimeData.addedToList;
                            const sameHashRate = notSameStatusUpdate && lastUptimeData.lastHashRate === miner.hashrate;

                            if(!foundActiveMiners && (miner.statusName === 'Online' || miner.statusName === 'Offline')) {
                                activeMiners++;
                            }

                            if(notSameStatusUpdate) {
                                gotFrozenData = true;
                                gotFrozenDataFor[minerID] = true;
                            }
                            
                            lastUpTime[minerID] = { value: uptimeValue, time: miner.lastStatsUpdate };
                            if(sameHashRate) {
                                lastUpTime[minerID].sameHashRateCount++;
                            } else {
                                lastUpTime[minerID].sameHashRateCount = 0;
                            }

                            if (uptimeOverZero && isHashing && minerOnline && (sameBetweenChecks || wasInListBefore)) { // || lastUptimeData.sameHashRateCount > 2)) {
                                frozenMiners.push(miner);
                                lastUpTime[minerID].addedToList = true;
                            }

                            lastUpTime[minerID].lastHashRate = miner.hashrate;
                        });
                        GM_SuperValue.set("lastUpTime_"+siteName, lastUpTime);
                        foundActiveMiners = true;
                    }

                    // Get the miners data
                    allMinersData = [ ...miners ];

                    // Setup the hash rate elements
                    reloadCards = true;
                    createHashRateElements();

                    // Call the callback function if it exists
                    if (callback) {
                        callback(allMinersData);
                    }

                    onUpdateAdditional(allMinersData);

                    delete miners;
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

        function setupRefreshCheck() {
            // Looks for refreshing and then updates the hash rate elements
            const shadowRoot = document.querySelector('#refreshBtn').shadowRoot;
            const targetIcon = shadowRoot.querySelector('m-icon[name="refresh-cw"]');
            let currentTimeout = null;
            if (targetIcon) {
                const observer = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            // Clear the timeout
                            if(currentTimeout) {
                                clearTimeout(currentTimeout);
                            }

                            // timeout checking if transform rotate is 0
                            currentTimeout = setTimeout(() => {
                                const transform = targetIcon.style.transform;
                                if(transform.includes('rotate(0deg)')) {
                                    updateAllMinersData();
                                }
                            }, 1000);
                        }
                    }
                });

                observer.observe(targetIcon, { attributes: true });
            } else {
                console.log('Target icon not found, trying again in 1 second.');
                setTimeout(setupRefreshCheck, 1000);
            }
        }
        setupRefreshCheck();

        function retrieveContainerTempData(callback) {
            serviceInstance.get(`/sensors?siteId=${siteId}`)
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
                        "count": 0,
                        "temps": {}
                    };

                    containerTempData[containerName].temp += sensor.temp;
                    containerTempData[containerName].count++;
                    containerTempData[containerName].temps[sensor.sensorName] = sensor.temp;
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

        let updatePlannerCardsData = function() {}; // Placeholder function for the actual function that will be created later

        getPlannerCardData = function() { 
            // Create the iframes for the planner boards
            let plannerKeys = [`Bitmain`, `Fortitude`, `RAMM`];
            let plannerPages = [];
            for (const key of plannerKeys) {
                const url = urlLookupPlanner[key];
                plannerPages.push(url);
            }
            let key = plannerKeys[0];
            const plannerID = getPlannerID(urlLookupPlanner[key]);
            GM_SuperValue.set("plannerPageLoaded_"+plannerID, false);
            GM_SuperValue.set("plannerCardsClosePage_"+plannerID, "searching");
            GM_SuperValue.set("plannerCardsData_Pages", plannerPages);

            const newWindow = window.open(urlLookupPlanner[key], '_blank');
            newWindow.document.title = 'Planner Cards Data';

            // Interval to check the data loaded
            let collectionStarted = false;
            const checkDataInterval = setInterval(() => {
                const lastCollectionTime = GM_SuperValue.get('plannerCardsDataTime', 0);
                const currentTime = new Date().getTime();
                const timeDiff = (currentTime - lastCollectionTime) / 1000;
        
                if (timeDiff < 10 && !collectionStarted) {
                    collectionStarted = true;
                }
        
                if (!collectionStarted) {
                    return;
                }
        
                let plannerCardsDataAll = {};
                for (const key in urlLookupPlanner) {
                    const plannerID = getPlannerID(urlLookupPlanner[key]); //.match(/plan\/([^?]+)/)[1].split('/')[0];
                    const data = GM_SuperValue.get("plannerCardsData_" + plannerID, {});
                    plannerCardsDataAll = { ...plannerCardsDataAll, ...data };

                    // if plannerCardsClosePage_ is true, close the page
                    if(GM_SuperValue.get("plannerCardsClosePage_"+plannerID, false) == true) {
                        GM_SuperValue.set("plannerCardsClosePage_"+plannerID, false);
                        return;
                    }
                }

                // if all the windows are closed
                if (!GM_SuperValue.get("plannerCardsData_Pages", false)) {
                    clearInterval(checkDataInterval);
                    // Time out to close the window
                    setTimeout(() => {
                        updatePlannerCardsData();
                    }, 100);
                }
            }, 1000);
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
                    if (key === 'Zone / Rack / Row / Position') {
                        value = value.replace(/ \/ /g, '-');

                        // Split the first part of the value to get the zone
                        const zone = value.split('-')[0];
                        details['Facility'] = zone.split('_')[0];

                        // Set the value to the rest of the value
                        //value = value.replace(zone + '-', '');
                    }
                    details[key] = value;
                }
            }
            return details;
        }

        function getMinerDetails() {
            let cleanedText = getCleanMinerDetails();
            var minerDetailsCrude = parseMinerDetails(cleanedText);
            let model = minerDetailsCrude['Model'] || "";
            let serialNumber = minerDetailsCrude[model] || "";
            const minerDetails = {
                model: minerDetailsCrude['Model'],
                serialNumber: serialNumber,
                facility: minerDetailsCrude['Facility'],
                ipAddress: minerDetailsCrude['Network'],
                locationID: minerDetailsCrude['Zone / Rack / Row / Position'].replace(/ \/ /g, "-"),
                activePool: minerDetailsCrude['Active Pool'],
                status: minerDetailsCrude['Status'],
                owner: minerDetailsCrude['Owner'],
            };

            console.log("Miner Details:", minerDetails);
            return [cleanedText, minerDetails];
        }

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

        // Convert the hash rate to the best type
        function convertHashRate(hashRate, fromType) {
            // Run through the hash rate types until we find the best one to display
            var hashType = 'H';
            hashRate = convertRates(hashRate, fromType, hashType);
            for (const [key, value] of Object.entries(hashRateTypes)) {
                if (hashRate >= value) {
                    hashType = key;
                }
            }

            // Convert the hash rate to the best type
            hashRate = convertRates(hashRate, 'H', hashType).toFixed(2);

            return [parseFloat(hashRate), hashType];
        }

        // Non-Bitcoin Hash Rate Logic
        if(currentURL.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview")) {

            setInterval(function() {
                // Constantly checks if there siteId or companyId changes
                if(getSelectedSiteId() !== siteId || getSelectedCompanyId() !== companyId) {
                    //updateAllMinersData(true);
                    console.log("Site ID or Company ID has changed.");
    
                    // Reload the page (Just far easier than trying to update the data and handle all the edge cases)
                    window.location.reload();
                }
            }, 500);

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
                hashRateCard.style.marginTop = '0px';
                hashRateCard.style.marginBottom = '0px';

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
            createHashRateElements = function() {

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
                        if (minerModels.includes(minerData.modelName)) {
                            // Check if the miner is in the hash rate types
                            if (!totalHashRates[hashRateType]) {
                                totalHashRates[hashRateType] = {
                                    "totalHashRate": 0,
                                    "totalHashRatePotential": 0,
                                    "totalMiners": 0
                                };
                            }

                            // Add the hash rate to the total hash rate
                            totalHashRates[hashRateType].totalHashRate += minerData.hashrate;
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

            function addSleepModeMiners(allMinersData) {
                if(!savedFeatures["sleepModeMiners"]) { return; }

                // Loop through all miners and find the sleep mode miners
                let sleepModeMiners = 0;
                for (const [index, minerData] of Object.entries(allMinersData)) {
                    if( minerData.powerModeName === "Sleep" ) {
                        sleepModeMiners++;
                    }
                }

                let sleepModeMinersElement = document.getElementById('sleepModeMinersElement');

                if( sleepModeMinersElement ) {
                    // Update the sleep mode miners element
                    sleepModeMinersElement.innerHTML = `${sleepModeMiners} Sleep Mode`;
                } else {
                    // Find the sleep mode text & update it or add it to the page
                    let hashRateCard;
                    document.querySelectorAll('.bar-chart-card').forEach(card => {
                        const heading = card.querySelector('.bar-chart-card-title m-heading');
                        if (heading && heading.textContent.trim() === 'Hash Rate') {
                            hashRateCard = card;
                        }
                    });

                    let mStack = hashRateCard.querySelector('m-stack');
                    let ratedEfficiencyElement = mStack.lastElementChild;

                    const sleepModeMetric = document.createElement('div');
                    sleepModeMetric.className = 'site-utilization-metrics';
                    sleepModeMetric.innerHTML = `
                        <div class="metric-row" style="font-size: 0.8em;">
                            <a class="m-link" id="sleepModeMinersElement" href="https://foundryoptifleet.com/Content/Reports/KeyMetricsReport" target="_blank">${sleepModeMiners} Sleep Mode</a>
                        </div>
                    `;

                    // Move the ratedEfficiencyElement into the new sleepModeMetric
                    sleepModeMetric.insertBefore(ratedEfficiencyElement, sleepModeMetric.firstChild);

                    mStack.appendChild(sleepModeMetric);
                }
            }

            addAdditionalUpdateCallback(addSleepModeMiners);
        }

        // SN Scanner Logic
        if(currentURL.includes("https://foundryoptifleet.com/")) {

            function createNotification(text) {
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background-color: #dc3545;
                    color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 999999;
                    transition: opacity 0.5s ease;
                    opacity: 1;
                `;
                notification.textContent = text;
                document.body.appendChild(notification);

                setTimeout(function() {
                    notification.style.opacity = '0';
                }, 8000);
            }

            // Check is the user ever inputs something
            var serialInputted = "";
            var lastInputTime = 0;
            var timeoutId;
            document.addEventListener('keydown', function(event) {

                if(!savedFeatures["snBarCodeScan"]) {
                    return;
                }

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

                        // Checks to see if there is Shift and Enter in the string, if not, stop
                        if ( !shiftMatchCount ) {
                            //console.log("No Enter/Shift or Low Length", serialInputted);
                            serialInputted = "";
                            return;
                        }

                        // if allMinersData is empty, notify the user that the data is still loading
                        if (Object.keys(minerSNLookup).length === 0) {
                            createNotification("Miner data is still loading, please wait a moment.");
                            return;
                        }

                        // Look up the miner serial number
                        let lookUpMiner = minerSNLookup[serialInputted];

                        // If we found the miner, open the miner page
                        if(lookUpMiner) {
                            window.open(`https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${lookUpMiner.minerID}`).focus();
                        } else {
                            createNotification("Miner with serial number " + serialInputted + " not found.");

                            console.log("Miner with serial number", serialInputted, "not found.");
                        }
                    }, 500);
                }
                lastInputTime = Date.now();
            });

            document.addEventListener('paste', function(event) {
                if(!savedFeatures["pasteSN"]) {
                    return;
                }

                console.log('Paste event detected!');
                
                let clipboardData = event.clipboardData || window.clipboardData || unsafeWindow.clipboardData;
                let pastedData = clipboardData.getData('text');
                pastedData = pastedData.replace("http://root:root@", "");
                pastedData = pastedData.split('/')[0].trim();
                
                console.log('Pasted data:', `[${pastedData}]`);
                // If that wasn't pasted in an actual input, then we open the miner page
                let hasSpaces = pastedData.includes(' ');
                let activeElement = document.activeElement;
                if(activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && !hasSpaces) {
                    // If the pasted data is a serial number, open the miner page
                    let lookUpMiner = minerSNLookup[pastedData] || Object.values(minerSNLookup).find(data => data.macAddress === pastedData || data.ipAddress === pastedData || data.discoveredSerialNumber === pastedData);
                    if(lookUpMiner) {
                        window.open(`https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${lookUpMiner.minerID}`).focus();
                    } else if(pastedData.length === 17) {
                        createNotification("Miner with serial number " + pastedData + " not found.");
                    }
                }    
            });
        }

        // Copy Miner Details Logic
        if (currentURL.includes("foundryoptifleet.com/Content/Miners/IndividualMiner")) {
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

            function getCleanMinerDetails() {
                const container = document.querySelector('.miner-details');
                if (!container) return;

                let textToCopy = '';
                const formControls = container.querySelectorAll('.m-form-control');
                formControls.forEach(control => {
                    const label = control.querySelector('.m-label.is-secondary');
                    const info = control.querySelector('.miner-detail-info');
                    if (label && info) {
                        textToCopy += `${label.textContent.trim()}\n`;
                        const primaryText = info.querySelector('.m-text:not(.is-secondary), .m-link');
                        const secondaryText = info.querySelector('.m-text.is-secondary, span.is-secondary');
                        
                        if (primaryText) {
                            textToCopy += `${primaryText.textContent.trim()}\n`;
                        }
                        if (secondaryText) {
                            textToCopy += `${secondaryText.textContent.trim()}\n`;
                        }
                        if (!primaryText && !secondaryText) {
                            textToCopy += `${info.textContent.trim()}\n`;
                        }
                        textToCopy += '\n';
                    }
                });
                
                // Remove Copy/Copied text
                textToCopy = textToCopy.replace(/Copy/g, '');
                textToCopy = textToCopy.replace(/Copied/g, '');

                return textToCopy;
            }

            function copyAllDetails() {
                let textToCopy = getCleanMinerDetails();
                copyTextToClipboard(textToCopy);
            }

            function copyAllDetailsForSharepoint(onlyPlanner, issue, log, type, hbSerialNumber, hbModel, hbVersion, chainIssue, binNumber, skuID) {
                var [cleanedText, minerDetails] = getMinerDetails();
                console.log(minerDetails);
                const { model, serialNumber, facility, ipAddress, locationID, activePool, status } = minerDetails;
                let modelLite = model.replace('Antminer ', '');
                let modelLiteSplit = modelLite.split(' (');
                modelLite = modelLiteSplit[0];
                modelLiteSplit[1] = modelLiteSplit[1] || '';
                let hashRate = modelLiteSplit[1].replace(')', '');
                let modelWithoutParens = model.replace('(', '').replace(')', '');

                minerDetails['type'] = type;
                minerDetails['issue'] = issue;
                minerDetails['log'] = log;
                minerDetails['hashRate'] = hashRate;

                //replace THs with T
                hashRate = hashRate.replace(' THs', 'T');

                console.log(`${modelLite}_${hashRate}_${serialNumber}_${issue}`);
                console.log(cleanedText);

                console.log("Task Comment:", log);

                // reset this just in case
                GM_SuperValue.set("locatePlannerCard", false);

                GM_SuperValue.set("taskName", `${serialNumber}_${modelLite}_${hashRate}_${issue}`);
                GM_SuperValue.set("taskNotes", cleanedText);
                GM_SuperValue.set("taskComment", log);
                GM_SuperValue.set("detailsData", JSON.stringify(minerDetails));

                /*
                new Date().getTime():

                This gets the current time in milliseconds since the Unix epoch (January 1, 1970).
                new Date().getTimezoneOffset():

                This returns the difference, in minutes, between UTC and the local time. For example, if your local time is UTC+2, this will return -120.
                new Date().getTimezoneOffset() * 60000:

                This converts the timezone offset from minutes to milliseconds (60000 milliseconds = 1 minute).
                new Date().getTime() - new Date().getTimezoneOffset() * 60000:

                This adjusts the current time to UTC by subtracting the timezone offset in milliseconds.
                new Date(...).toISOString():

                This converts the adjusted time to an ISO 8601 string in UTC (e.g., 2023-10-05T00:00:00.000Z).
                .slice(0, 10):

                This extracts the date part (YYYY-MM-DD) from the ISO string.
                */
                const currentDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10); // YYYY-MM-DD format
                let textToCopy = `${serialNumber}\t${modelLite}\t${hashRate}\t${issue}\t${status}\t${currentDate}`;

                /*
                if(type === "Fortitude") {
                    textToCopy = `${serialNumber}\t${modelWithoutParens}\t${hbSerialNumber}\t${hbModel}\t${hbVersion}\t${chainIssue}\t${binNumber}`;
                    GM_SuperValue.set("taskName", `${serialNumber}_${modelLite}_${hashRate}_${issue}_${skuID}`);
                }*/

                if(!onlyPlanner) {
                    copyTextToClipboard(textToCopy);
                    const sharePointLinks = {
                        "Bitmain": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/EoZ4RPEfVj9EjKlBzWmVHVcBcqZQzo2BiBC8_eM0WoABiw?e=wOZWEz",
                        "Fortitude": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/En56U6QoEzVCsNkYkXQOqxIBFLcql6OxnNJYBTX_r6ZIsw?e=oEb1JA",
                        "RAMM": "https://foundrydigitalllc.sharepoint.com/:f:/s/SiteOps/EsrLwwsTo8JCr2aO7FT924sBrQ-oP4Nehl8sFROGcirBwg?e=jKhBzT"
                    }

                    window.open(sharePointLinks[type]).focus();
                } else {
                    let plannerUrl = urlLookupPlanner[type];
                    window.open(plannerUrl).focus();
                }
                
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
                                <label for="log" style="display: block; font-weight: bold;">Comment/Log:</label>
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
                            <div id="skuIDContainer" style="margin-bottom: 10px; display: none;">
                                <label for="skuID" style="display: block; font-weight: bold;">SKU:</label>
                                <input type="text" id="skuID" name="skuID" style="width: 100%; padding: 5px; color: white;">
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
                                    <button type="button" id="submitBtn1" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease;">Sharepoint</button>
                                    <button type="button" id="submitBtn2" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; margin-left: 10px;">Planner</button>
                                    <button type="button" id="cancelBtn" style="background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; margin-left: 10px;">Close</button>
                                </div>
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
                    const skuIDContainer = popupElement.querySelector('#skuIDContainer');

                    const normalIssueContainer = popupElement.querySelector('#normalIssueContainer');

                    /*
                    if (type !== "Fortitude") {
                        hbSerialNumberContainer.style.display = 'none';
                        hbModelContainer.style.display = 'none';
                        hbVersionContainer.style.display = 'none';
                        chainIssueContainer.style.display = 'none';
                        binNumberContainer.style.display = 'none';
                        skuIDContainer.style.display = 'none';
                    } else {
                        hbSerialNumberContainer.style.display = 'block';
                        hbModelContainer.style.display = 'block';
                        hbVersionContainer.style.display = 'block';
                        chainIssueContainer.style.display = 'block';
                        binNumberContainer.style.display = 'block';
                        skuIDContainer.style.display = 'block';
                    }*/
                });

                // Get the customer name of this miner and set the type to that, if it matches one of our options
                const customerName = unsafeWindow.im.miner.subcustomerName;
                const typeOptions = popupElement.querySelector('#type').options;
                let foundType = false;
                for (let i = 0; i < typeOptions.length; i++) {
                    if (customerName.includes(typeOptions[i].value)) {
                        typeOptions[i].selected = true;
                        foundType = true;
                        break;
                    }
                }

                // If we didn't find the type, highlight the type input
                if (!foundType) {
                    popupElement.querySelector('#type').style.backgroundColor = '#c82333';
                    setTimeout(function() {
                        popupElement.querySelector('#type').style.transition = 'background-color 1s ease';
                        popupElement.querySelector('#type').style.backgroundColor = '#222';
                    }, 1000);

                    // Set that it is unknown
                    popupElement.querySelector('#type').value = '';
                }

                // Function to submit Issue and Log
                function submitIssueLog(onlyPlanner) {
                    const issue = document.getElementById("issue").value;
                    const log = document.getElementById("log").value;
                    const type = document.getElementById("type").value;

                    // make sure type is not unknown
                    if(type === "") {
                        alert("Please select a valid type.");
                        return;
                    }

                    const hbSerialNumber = document.getElementById("hbSerialNumber").value;
                    const hbModel = document.getElementById("hbModel").value;
                    const hbVersion = document.getElementById("hbVersion").value;
                    const chainIssue = document.getElementById("chainIssue").value;
                    const binNumber = document.getElementById("binNumber").value;
                    const skuID = document.getElementById("skuID").value;

                    // Remove the popup element
                    //popupElement.remove();

                    // Copy the details for Quick Sharepoint & Planner and set the taskName and taskNotes
                    copyAllDetailsForSharepoint(onlyPlanner, issue, log, type, hbSerialNumber, hbModel, hbVersion, chainIssue, binNumber, skuID);
                }

                // Function to cancel Issue and Log
                function cancelIssueLog() {
                    // Remove the popup element
                    popupElement.remove();
                }

                // Append the popup element to the document body
                document.body.appendChild(popupElement);

                // Attach event listeners to the buttons
                document.getElementById('submitBtn1').addEventListener('click', function() {
                    submitIssueLog(false);
                });
                document.getElementById('submitBtn2').addEventListener('click', function() {
                    submitIssueLog(true);
                });
                document.getElementById('cancelBtn').addEventListener('click', cancelIssueLog);
            }

            function addCustomerNameText() {
                if(!savedFeatures["customerName"]) { return; }

                // Find modelInfo, then get the main m-stack parent, then add the customer name text to the end
                const modelInfo = document.querySelector('#modelInfo');
                if (modelInfo && unsafeWindow.im && unsafeWindow.im.miner && unsafeWindow.im.miner.subcustomerName) {
                    const customerName = unsafeWindow.im.miner.subcustomerName;
                    const customerNameElement = document.createElement('div');
                    customerNameElement.className = 'm-form-control';
                    customerNameElement.innerHTML = `
                        <div class="m-label is-secondary">
                            Customer
                        </div>
                        <div class="miner-detail-info">
                            <div class="m-text is-size-xs">${customerName}</div>
                        </div>
                    `;
                    modelInfo.closest('.m-stack').appendChild(customerNameElement);
                } else {
                    // Try again in 100ms
                    setTimeout(addCustomerNameText, 100);
                }
            }
            addCustomerNameText();
            

            function addCopyButton(element, textToCopy) {
                if (element.querySelector('.copyBtn')) {return};

                const copyButton = document.createElement('button');
                copyButton.innerText = 'Copy';
                copyButton.className = 'copyBtn';
                copyButton.style.fontSize = '9px';
                copyButton.style.float = 'right'; // Align to the right
                copyButton.style.marginLeft = '10px'; // Add some space to the left
                copyButton.style.padding = '2px 5px';
                copyButton.onclick = function (event) {
                    event.preventDefault();
                    copyTextToClipboard(textToCopy);
                    copyButton.innerText = 'Copied';
                    setTimeout(() => {
                        copyButton.innerText = 'Copy';
                    }, 2000);
                };

                // Check if there is a secondary text element
                const secondaryText = element.querySelector('.is-secondary');
                if (secondaryText) {
                    secondaryText.appendChild(copyButton);
                } else {
                    element.appendChild(copyButton);
                }
            }

            function addCopyButtonsToElements() {
                if(!savedFeatures["copyButtons"]) { return; }
                const detailSections = document.querySelectorAll('.miner-detail-info');

                detailSections.forEach(section => {
                    const primaryText = section.querySelector('.m-text:not(.is-secondary), .m-link');
                    const secondaryText = section.querySelector('.m-text.is-secondary, span.is-secondary');

                    if (primaryText) {
                        let textToCopy = primaryText.textContent.trim();
                        addCopyButton(primaryText, textToCopy);
                    }
                    if (secondaryText) {
                        let textToCopy = secondaryText.textContent.trim();
                        addCopyButton(secondaryText, textToCopy);
                    }
                    if (!primaryText && !secondaryText) {
                        let textToCopy = section.textContent.trim();
                        addCopyButton(section, textToCopy);
                    }
                });
            }

            const container = document.querySelector('.miner-details');
            if (container) {
                // Add spacer div
                if (!container.querySelector('.spacer')) {
                    const spacer = document.createElement('div');
                    spacer.className = 'spacer';
                    spacer.style.height = '10px';
                    container.insertBefore(spacer, container.firstChild);
                }

                if (!container.querySelector('.copyAllBtn') && savedFeatures["copyButtons"]) {
                    const copyAllButton = document.createElement('button');
                    copyAllButton.innerText = 'Copy All';
                    copyAllButton.className = 'copyBtn copyAllBtn';
                    copyAllButton.style.width = '100%';
                    copyAllButton.onclick = function (event) {
                        event.preventDefault();
                        copyAllDetails();
                        //showSuccessMessage(container, "All details copied!");

                        // Change the button text to 'All details copied!' for 2 seconds
                        copyAllButton.innerText = 'All details copied!';
                        setTimeout(() => {
                            copyAllButton.innerText = 'Copy All';
                        }, 2000);
                    };
                    container.insertBefore(copyAllButton, container.firstChild);
                }

                if (!container.querySelector('.sharepointPasteBtn') && siteName.includes("Minden") && savedFeatures["quickSharepointPlanner"]) {
                    const sharepointPasteButton = document.createElement('button');
                    sharepointPasteButton.innerText = 'Quick Sharepoint & Planner';
                    sharepointPasteButton.className = 'copyBtn sharepointPasteBtn';
                    sharepointPasteButton.style.width = '100%';
                    sharepointPasteButton.onclick = function (event) {
                        event.preventDefault();
                        createDataInputPopup();
                    };
                    container.insertBefore(sharepointPasteButton, container.firstChild);
                }
            }

            function setModelEditSumbitToUpdate() {
                const MinerEditorModal = document.querySelector('#MinerEditorModal');
                if (MinerEditorModal) {
                    const submitButton = MinerEditorModal.querySelector('#modalSubmitButton');

                    if (submitButton.getAttribute('observing') === 'true') {
                        return;
                    }

                    // Override the submit button onclick to get the status
                    const originalSubmitButtonOnClick = submitButton.onclick;
                    submitButton.onclick = function() {
                        // Get whatever element has aria-controls="MinerEditorModal-statusInput_listbox" in MinerEditorModal
                        const statusInput = MinerEditorModal.querySelector('[aria-controls="MinerEditorModal-statusInput_listbox"]');
                        const status = statusInput.textContent.trim();


                        // Update the miner details
                        const minerStatusElement = document.querySelector('#statusInfo');
                        if (minerStatusElement) {
                            minerStatusElement.textContent = status;
                        }

                        // Call the original submit button onclick
                        originalSubmitButtonOnClick();
                    };

                    // Set that we're observing the submit button
                    submitButton.setAttribute('observing', 'true');
                }
            }
            
            function addMutationObserver() {
                const observer = new MutationObserver(() => {
                    //fixAccountWorkerFormatting();
                    setModelEditSumbitToUpdate();
                    addCopyButtonsToElements();
                    
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }

            //addCopyButtonsToElements();
            addMutationObserver();
            
            // Add "Log" Tab
            const tabsContainer = document.querySelector('.tabs');
            let customTabExists = false;
            const createCustomTab = (id, title, fetchDataCallback) => {
                const customTab = document.createElement('div');
                customTab.id = id;
                customTab.className = 'tab';
                customTab.custom = true;
                customTab.innerText = title;
                customTab.style.float = 'right';
                if(!customTabExists) {
                    customTab.style.cssText = `
                        margin-left: auto;
                        margin-right: 0px;
                    `;
                } else {
                    customTab.style.cssText = `
                        margin-right: 0px;
                    `;
                }
                customTabExists = true;
                customTab.onclick = function() {
                    // Swaps to the selected tab
                    $(this).addClass("selected");
                    $(this).siblings(".tab").removeClass("selected");

                    // Removes the active class from the other tab content
                    let tabContent = document.querySelector('.tab-content');
                    let children = tabContent.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.remove("active");
                    }
                    
                    // Add the new data to the tab content (deletes if it already exists)
                    const customTabContainer = document.createElement('div');
                    customTabContainer.className = 'customTabContainer active';
                    customTabContainer.style.display = 'flex';
                    customTabContainer.style.flexDirection = 'column';
                    customTabContainer.style.alignItems = 'center';
                    customTabContainer.style.justifyContent = 'center';
                    customTabContainer.style.height = '100%';
                    customTabContainer.style.color = '#fff';

                    const loadingText = document.createElement('div');
                    loadingText.textContent = 'Retrieving data...';
                    loadingText.style.marginBottom = '10px';
                    customTabContainer.appendChild(loadingText);

                    const loadingSpinner = document.createElement('div');
                    loadingSpinner.style.border = '6px solid #f3f3f3';
                    loadingSpinner.style.borderTop = '6px solid #3498db';
                    loadingSpinner.style.borderRadius = '50%';
                    loadingSpinner.style.width = '40px';
                    loadingSpinner.style.height = '40px';
                    loadingSpinner.style.animation = 'spin 2s linear infinite';
                    customTabContainer.appendChild(loadingSpinner);

                    tabContent.appendChild(customTabContainer);

                    const style = document.createElement('style');
                    style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `;
                    document.head.appendChild(style);

                    fetchDataCallback(customTabContainer, loadingText, loadingSpinner);
                };
                
                tabsContainer.appendChild(customTab);
            };

            const quickGoToLog = GM_SuperValue.get('quickGoToLog', false);
            let findLog = false;
            if(quickGoToLog && currentURL.includes(quickGoToLog.minerID)) {
                findLog = quickGoToLog.errorText;
                GM_SuperValue.set('quickGoToLog', false);
            }

            if(savedFeatures["currentLogTab"]) {
                function SetUpLog(customTabContainer, loadingText, loadingSpinner, responseText, fullLog, isHistoryLog, isFoundryFirmware) {

                    // Add divider to m-nav
                    const mnav = document.querySelector('.m-nav');
                    const divider = document.createElement('div');
                    divider.className = 'm-divider has-space-m';
                    divider.classList.add('error-divider');
                    mnav.appendChild(divider);

                    let orignalLogText = "";
                    function createErrorTab(title, errors, defaultOpen = false) {
                        // If there are no errors
                        if(errors.length === 0) {
                            return;
                        }

                        const errorTab = document.createElement('div');
                        errorTab.className = 'm-nav-group';
                        errorTab.classList.add('error-tab');

                        // Create the header with the dynamic title
                        const header = `
                            <div class="m-nav-group-header">
                                <div class="m-nav-group-label">
                                    <m-icon name="error" size="l" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                                    ${title}
                                </div>
                                <m-icon name="chevron-down" data-dashlane-shadowhost="true" data-dashlane-observed="true" class="flip"></m-icon>
                            </div>
                        `;
                    
                        // Create the group items with icons dynamically
                        const items = errors.map((error, index) => `
                            <div class="m-nav-group-item" style="display: flex; align-items: center;">
                                <img src="${error.icon}" width="16" height="16" style="margin-right: 8px;" />
                                <a href="#" class="m-nav-item" data-error-index="${index}">${error.textReturn}</a>
                            </div>
                        `).join('');
                        
                        // Combine all parts into the final HTML
                        errorTab.innerHTML = `
                            ${header}
                            <div class="m-nav-group-section" style="display: none;">
                                <div class="m-nav-group-items">
                                    ${items}
                                </div>
                            </div>
                        `;
                    
                        // Add collapse and open logic
                        const headerElement = errorTab.querySelector('.m-nav-group-header');
                        const sectionElement = errorTab.querySelector('.m-nav-group-section');
                        const chevronIcon = errorTab.querySelector('.m-nav-group-header m-icon');
                    
                        headerElement.addEventListener('click', () => {
                            const isOpen = sectionElement.style.display === 'block';
                            sectionElement.style.display = isOpen ? 'none' : 'block';
                            chevronIcon.classList.toggle('flip', !isOpen);
                        });

                        if (defaultOpen) {
                            sectionElement.style.display = 'block';
                            chevronIcon.classList.add('flip');
                        }
                    
                        // Add click event listener to each error item
                        const errorItems = errorTab.querySelectorAll('.m-nav-item');
                        errorItems.forEach(errorItem => {
                            const errorIndex = errorItem.getAttribute('data-error-index');
                            const error = errors[errorIndex];

                            errorItem.addEventListener('click', (event) => {
                                event.preventDefault();
                                handleErrorClick(error, orignalLogText);
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
                        });
                    
                        mnav.appendChild(errorTab);
                        return errorTab;
                    }
                    
                    let logElement;
                    function handleErrorClick(error, orignalLogText) {
                        logElement = document.querySelector('#logElement');

                        // Reset log text
                        while (logElement.firstChild) {
                            logElement.removeChild(logElement.firstChild);
                        }
                        logElement.textContent = orignalLogText;
                    
                        // Create a new element to highlight the error
                        const errorElement = document.createElement('span');
                        errorElement.style.backgroundColor = '#780707';
                        
                        const errorTextNode = document.createElement('span');
                        errorTextNode.style.fontWeight = 'bolder';
                        //errorTextNode.style.textShadow = '1px 1px 2px black';
                        errorTextNode.style.color = 'white';
                        errorTextNode.textContent = error.text;
                        errorElement.appendChild(errorTextNode);
                        errorElement.style.width = logElement.scrollWidth + 'px';
                        errorElement.style.display = 'block';
                    
                        // Create a copy button
                        const copyButton = document.createElement('button');
                        copyButton.textContent = 'Copy';
                        copyButton.style.position = 'absolute';
                        copyButton.style.bottom = '2px';
                        copyButton.style.left = '2px';
                        copyButton.style.backgroundColor = '#4CAF50'; // Green background
                        copyButton.style.border = 'none';
                        copyButton.style.color = 'white'; // White text
                        copyButton.style.cursor = 'pointer';
                        copyButton.style.padding = '3px 6px';
                        copyButton.style.fontSize = '10px';
                        copyButton.style.fontWeight = 'bold';
                        copyButton.style.borderRadius = '5px'; // Rounded corners
                        copyButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // Subtle shadow
                        copyButton.style.zIndex = '1';
                        copyButton.style.display = 'none'; // Initially hidden

                        // Add hover effect
                        copyButton.addEventListener('mouseover', () => {
                            copyButton.style.backgroundColor = '#45a049'; // Darker green on hover
                        });

                        copyButton.addEventListener('mouseout', () => {
                            copyButton.style.backgroundColor = '#4CAF50'; // Original green when not hovering
                        });

                        copyButton.addEventListener('click', () => {
                            // disable default behavior
                            event.preventDefault();

                            // copy text to clipboard
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(error.text).then(() => {
                                    console.log('Text copied to clipboard');
                                }).catch(err => {
                                    console.error('Failed to copy text: ', err);
                                });
                            } else {
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
                            copyButton.textContent = 'Copied!';
                            setTimeout(() => {
                                copyButton.textContent = 'Copy';
                            }, 1000);
                        });
                    
                        errorElement.style.position = 'relative';
                        errorElement.appendChild(copyButton);
                    
                        errorElement.addEventListener('mouseover', () => {
                            copyButton.style.display = 'block';
                        });
                    
                        errorElement.addEventListener('mouseout', () => {
                            copyButton.style.display = 'none';
                        });

                        // Also copy if you right click on the error
                        errorElement.addEventListener('contextmenu', (event) => {
                            event.preventDefault();
                            copyButton.click();
                        });
                    
                        // Replace the error text in the log with the highlighted version
                        const logTextNode = logElement.childNodes[0];
                        const beforeErrorText = logTextNode.textContent.substring(0, error.start);
                        const afterErrorText = logTextNode.textContent.substring(error.end);

                        logTextNode.textContent = beforeErrorText;
                        
                        logElement.insertBefore(errorElement, logTextNode.nextSibling);
                        logElement.insertBefore(document.createTextNode(afterErrorText), errorElement.nextSibling);
                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Remove the loading text and spinner
                    customTabContainer.removeChild(loadingText);
                    customTabContainer.removeChild(loadingSpinner);
                    if (isHistoryLog) {
                        // Create a sleek log element with pagination and editable page input
                        const logElement = document.createElement('div');
                        logElement.id = 'logElement';
                        logElement.style.cssText = `
                            background-color: #18181b;
                            color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            max-height: 400px;
                            overflow-y: auto;
                            overflow-x: auto;
                            font-family: 'Courier New', Courier, monospace;
                            white-space: pre;
                            width: 100%;
                            scrollbar-width: thin;
                            scrollbar-color: #888 #333;
                        `;

                        responseText = responseText.trim();

                        let startSectionText = "----------Start Foundry Miner";
                        let logSections = responseText.split(startSectionText);
                        
                        // Readd startSectionText to the beginning of each section
                        for (let i = 1; i < logSections.length; i++) {
                            logSections[i] = startSectionText + logSections[i];
                        }

                        if(!isFoundryFirmware) {
                            // Instead we will split by detecting the change of the date suddenly, but only if the next line date is less than prev line.
                            /*
                            For example:
                                2025-04-04 15:54:41 enable power watchdog: 0x0001
                                1970-01-01 00:00:13 Invalid config option --bitmain-freq-level: '' is not a number
                            */
                            
                            const logLines = responseText.split('\n');
                            logSections = [];
                            let currentSection = '';
                            let prevDate = null;
                            logLines.forEach(line => {
                                const dateMatch = line.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                                if (dateMatch) {
                                    const currentDate = new Date(dateMatch[1]);
                                    if (prevDate && currentDate < prevDate) {
                                        logSections.push(currentSection.trim());
                                        currentSection = line + '\n'; // Start a new section with the current line
                                    } else {
                                        currentSection += line + '\n'; // Append to the current section
                                    }
                                    prevDate = currentDate;
                                } else {
                                    currentSection += line + '\n'; // Append to the current section
                                }
                            });

                            if (currentSection) {
                                logSections.push(currentSection.trim()); // Push the last section
                            }
                            //
                        }


                        const totalPages = logSections.length;
                        let currentPage = totalPages - 1; // Start from the last page

                        const pageInfo = document.createElement('span');
                        pageInfo.style.cssText = `
                            color: #fff;
                            font-size: 14px;
                        `;

                        customTabContainer.appendChild(logElement);

                        // Pagination controls
                        const paginationControls = document.createElement('div');
                        paginationControls.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: 10px;
                        `;

                        const prevButton = document.createElement('button');
                        prevButton.textContent = 'Previous';
                        prevButton.style.cssText = `
                            background-color: #333;
                            color: #fff;
                            padding: 10px;
                            border-radius: 5px;
                            cursor: pointer;
                            margin-right: 10px;
                        `;

                        let prevInterval;
                        prevButton.addEventListener('mousedown', () => {
                            event.preventDefault();

                            if (currentPage > 0) {
                                currentPage--;
                                renderPage(currentPage);
                            }

                            prevInterval = setInterval(() => {
                                if (currentPage > 0) {
                                    currentPage--;
                                    renderPage(currentPage);
                                }
                            }, 200);
                        });

                        prevButton.addEventListener('click', () => {
                            event.preventDefault();
                        });

                        prevButton.addEventListener('mouseup', () => {
                            clearInterval(prevInterval);
                        });

                        prevButton.addEventListener('mouseleave', () => {
                            clearInterval(prevInterval);
                        });

                        const nextButton = document.createElement('button');
                        nextButton.textContent = 'Next';
                        nextButton.style.cssText = `
                            background-color: #333;
                            color: #fff;
                            padding: 10px;
                            border-radius: 5px;
                            cursor: pointer;
                            margin-left: 10px;
                        `;

                        let nextInterval;
                        nextButton.addEventListener('mousedown', () => {
                            event.preventDefault();

                            if (currentPage < totalPages - 1) {
                                currentPage++;
                                renderPage(currentPage);
                            }

                            nextInterval = setInterval(() => {
                                if (currentPage < totalPages - 1) {
                                    currentPage++;
                                    renderPage(currentPage);
                                }
                            }, 200);
                        });

                        nextButton.addEventListener('click', () => {
                            event.preventDefault();
                        });

                        nextButton.addEventListener('mouseup', () => {
                            clearInterval(nextInterval);
                        });

                        nextButton.addEventListener('mouseleave', () => {
                            clearInterval(nextInterval);
                        });

                        const pageInput = document.createElement('input');
                        pageInput.type = 'number';
                        pageInput.min = 1;
                        pageInput.max = totalPages;
                        pageInput.value = currentPage + 1;
                        pageInput.style.cssText = `
                            width: 50px;
                            text-align: center;
                            margin: 0 10px;
                            padding: 5px;
                            border-radius: 5px;
                            border: 1px solid #555;
                            background-color: #222;
                            color: #fff;
                        `;

                        pageInput.addEventListener('change', () => {
                            event.preventDefault(); // Prevent form submission junk

                            const inputPage = parseInt(pageInput.value, 10) - 1;
                            if (!isNaN(inputPage) && inputPage >= 0 && inputPage < totalPages) {
                                currentPage = inputPage;
                                renderPage(currentPage);
                            } else {
                                pageInput.value = currentPage + 1; // Reset to current page if invalid
                            }
                        });

                        paginationControls.appendChild(prevButton);
                        paginationControls.appendChild(pageInfo);
                        paginationControls.appendChild(pageInput);
                        paginationControls.appendChild(nextButton);
                        customTabContainer.appendChild(paginationControls);

                        // Add some spacing below the controls
                        const spacing = document.createElement('div');
                        spacing.style.height = '10px';
                        customTabContainer.appendChild(spacing);

                        // Add custom scrollbar styles
                        const style = document.createElement('style');
                        style.textContent = `
                            ::-webkit-scrollbar {
                                width: 8px;
                                height: 8px;
                            }
                            ::-webkit-scrollbar-track {
                                background: #333;
                                border-radius: 10px;
                            }
                            ::-webkit-scrollbar-thumb {
                                background-color: #888;
                                border-radius: 10px;
                                border: 2px solid #333;
                            }
                            ::-webkit-scrollbar-thumb:hover {
                                background-color: #555;
                            }
                        `;
                        document.head.appendChild(style);

                        function renderPage(page) {
                            let section = logSections[page].trim();

                            // If any errors tabs exist, remove them
                            const errorTabs = document.querySelectorAll('.error-tab');
                            errorTabs.forEach(tab => {
                                tab.remove();
                            });

                            // Clean up
                            section = section.trim();
                            section = cleanErrors(section);

                            // Set the log text to the current page
                            logElement.textContent = `${section}`;
                            pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
                            pageInput.value = currentPage + 1;
                            prevButton.disabled = currentPage === 0;
                            nextButton.disabled = currentPage === totalPages - 1;

                            orignalLogText = section;

                            // Set to bottom of log
                            logElement.scrollTop = logElement.scrollHeight;

                            // Run error scan logic
                            const errorsFound = runErrorScanLogic(section);
                            if (errorsFound.length > 0) {
                                // Create the error tabs
                                const infoTab = createErrorTab("Info", errorsFound.filter(error => error.type === "Info"), true);
                                const mainTab = createErrorTab("Main Errors", errorsFound.filter(error => error.type === "Main"), true);
                                const otherTab = createErrorTab("Other Errors", errorsFound.filter(error => error.type === "Other"));

                                // Scroll to show new tabs
                                if(mainTab) {mainTab.scrollIntoView({ behavior: 'auto', block: 'end' });}
                                if(otherTab) {otherTab.scrollIntoView({ behavior: 'auto', block: 'end' });}
                            }

                        }

                        renderPage(currentPage);
                    } else {
                        // Create a sleek log element
                        const logElement = document.createElement('div');
                        logElement.id = 'logElement';
                        logElement.style.cssText = `
                            background-color: #18181b;
                            color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            max-height: 400px;
                            overflow-y: auto;
                            overflow-x: auto;
                            font-family: 'Courier New', Courier, monospace;
                            white-space: pre;
                            width: 100%;
                            scrollbar-width: thin;
                            scrollbar-color: #888 #333;
                        `;

                        if (!fullLog) {
                            responseText = cutOffPreviousLog(responseText); // Cut off first before error clean up so we don't mash all the other instances of those errors into the log
                        }

                        responseText = responseText.trim();
                        responseText = cleanErrors(responseText);
                        

                        orignalLogText = responseText;
                        logElement.textContent = orignalLogText;
                        customTabContainer.appendChild(logElement);

                        // Add custom scrollbar styles
                        const style = document.createElement('style');
                        style.textContent = `
                            ::-webkit-scrollbar {
                                width: 8px;
                                height: 8px;
                            }
                            ::-webkit-scrollbar-track {
                                background: #333;
                                border-radius: 10px;
                            }
                            ::-webkit-scrollbar-thumb {
                                background-color: #888;
                                border-radius: 10px;
                                border: 2px solid #333;
                            }
                            ::-webkit-scrollbar-thumb:hover {
                                background-color: #555;
                            }
                        `;
                        document.head.appendChild(style);

                        // Scroll to bottom of log
                        logElement.scrollTop = logElement.scrollHeight;
                    }

                    if(!isHistoryLog) {
                        let logElement = document.querySelector('#logElement');
                        let logText = logElement.innerText;

                        // Create the error tabs
                        var errorsFound = runErrorScanLogic(logText);
                        if(errorsFound.length === 0) {
                            return;
                        }
                        
                        logElement.scrollIntoView({ behavior: 'auto', block: 'end' });
                        
                        const infoTab = createErrorTab("Info", errorsFound.filter(error => error.type === "Info"), true);
                        const mainTab = createErrorTab("Main Errors", errorsFound.filter(error => error.type === "Main"), true);
                        const otherTab = createErrorTab("Other Errors", errorsFound.filter(error => error.type === "Other"));

                        // Scroll to show new tabs
                        if(mainTab) {mainTab.scrollIntoView({ behavior: 'auto', block: 'end' });}
                        if(otherTab) {otherTab.scrollIntoView({ behavior: 'auto', block: 'end' });}
                    } 
                }

                createCustomTab('quickIPGrabTab', 'Current Log', (customTabContainer, loadingText, loadingSpinner) => {
                    // Get IP Address from m-link is-size-xs href
                    const waitForIpElement = setInterval(() => {
                        const ipElement = document.querySelector('.m-link.is-size-xs');
                        if (ipElement && ipElement.href && ipElement.href.includes('http')) {
                            clearInterval(waitForIpElement);

                            // Get status from the miner
                            const status = getMinerDetails()[1].status;
                            
                            if(status !== "Online") {
                                // Remove the loading text and spinner
                                customTabContainer.removeChild(loadingText);
                                customTabContainer.removeChild(loadingSpinner);

                                // Add a clean nice message saying the miner is offline
                                const offlineMessage = document.createElement('div');
                                offlineMessage.textContent = 'Miner is currently offline.';
                                customTabContainer.appendChild(offlineMessage);
                                return;
                            }
                            
                            // firmwareInfoElement
                            const firmwareInfoElement = document.querySelector('#firmwareInfo');
                            const firmwareInfo = firmwareInfoElement ? firmwareInfoElement.innerText : "Unknown";
                            const ipHref = ipElement.href.replace('root:root@', '') + '/cgi-bin/log.cgi';
                            if(isFoundryFirmware(firmwareInfo)) {
                                const ip = new URL(ipHref).hostname;
                                const responseText = fetchAndCombineLogs(ip);
                                responseText.then(responseText => { 
                                    SetUpLog(customTabContainer, loadingText, loadingSpinner, responseText);
                                }).catch(error => {
                                    try {
                                        // remove the loading text and spinner and put a message saying it failed
                                        customTabContainer.removeChild(loadingText);
                                        customTabContainer.removeChild(loadingSpinner);
                                    } catch (e) {}

                                    const errorMessage = document.createElement('div');
                                    errorMessage.textContent = 'Failed to retrieve current log.\n\n' + error;
                                    customTabContainer.appendChild(errorMessage);
                                    
                                    // Log the error to the console
                                    console.error(error);
                                });
                            } else {
                                fetchGUIData(ipHref)
                                    .then(responseText => {
                                        SetUpLog(customTabContainer, loadingText, loadingSpinner, responseText);
                                    })
                                    .catch(error => {
                                        try {
                                            // remove the loading text and spinner and put a message saying it failed
                                            customTabContainer.removeChild(loadingText);
                                            customTabContainer.removeChild(loadingSpinner);
                                        } catch (e) {}

                                        const errorMessage = document.createElement('div');
                                        errorMessage.textContent = 'Failed to retrieve current log.\n\n' + error;
                                        customTabContainer.appendChild(errorMessage);
                                        
                                        // Log the error to the console
                                        console.error(error);
                                    });
                            }
                        }
                    }, 500);
                });

                if(findLog) {
                    // Get the Current Log Tab
                    const currentLogTab = document.querySelector('#quickIPGrabTab');
                    if(currentLogTab) {
                        currentLogTab.click();
                    }
                }

                createCustomTab('quickIPGrabTab', 'History Log', (customTabContainer, loadingText, loadingSpinner) => {
                    // Get IP Address from m-link is-size-xs href
                    const waitForIpElement = setInterval(() => {
                        const ipElement = document.querySelector('.m-link.is-size-xs');
                        if (ipElement && ipElement.href && ipElement.href.includes('http')) {
                            clearInterval(waitForIpElement);

                            // Get status from the miner
                            const status = getMinerDetails()[1].status;
                            
                            if(status !== "Online") {
                                // Remove the loading text and spinner
                                customTabContainer.removeChild(loadingText);
                                customTabContainer.removeChild(loadingSpinner);

                                // Add a clean nice message saying the miner is offline
                                const offlineMessage = document.createElement('div');
                                offlineMessage.textContent = 'Miner is currently offline.';
                                customTabContainer.appendChild(offlineMessage);
                                return;
                            }
                            
                            // firmwareInfoElement
                            const firmwareInfoElement = document.querySelector('#firmwareInfo');
                            const firmwareInfo = firmwareInfoElement ? firmwareInfoElement.innerText : "Unknown";
                            const ipHref = ipElement.href.replace('root:root@', '') + '/cgi-bin/hlog.cgi';
                            if(isFoundryFirmware(firmwareInfo)) {
                                const ip = new URL(ipHref).hostname;
                                const responseText = fetchAndCombineLogs(ip);
                                responseText.then(responseText => { 
                                    SetUpLog(customTabContainer, loadingText, loadingSpinner, responseText, true, true, true);
                                }).catch(error => {
                                    try {
                                        // remove the loading text and spinner and put a message saying it failed
                                        customTabContainer.removeChild(loadingText);
                                        customTabContainer.removeChild(loadingSpinner);
                                    } catch (e) {}

                                    const errorMessage = document.createElement('div');
                                    errorMessage.textContent = 'Failed to retrieve history log.\n\n' + error;
                                    customTabContainer.appendChild(errorMessage);

                                    // Log the error to the console
                                    console.error(error);
                                });
                            } else {
                                fetchGUIData(ipHref)
                                    .then(responseText => {
                                        SetUpLog(customTabContainer, loadingText, loadingSpinner, responseText, false, true);
                                    })
                                    .catch(error => {
                                        try {
                                            // remove the loading text and spinner and put a message saying it failed
                                            customTabContainer.removeChild(loadingText);
                                            customTabContainer.removeChild(loadingSpinner);
                                        } catch (e) {}

                                        const errorMessage = document.createElement('div');
                                        errorMessage.textContent = 'Failed to retrieve history log.\n\n' + error;
                                        customTabContainer.appendChild(errorMessage);
                                        
                                        // Log the error to the console
                                        console.error(error);
                                    });
                            }
                        }
                    }, 500);
                });
            }

            // Loop through all the tabs and add an extra on click event 
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function(event) {
                    // Remove the custom tab content
                    let tabContent = document.querySelectorAll('.customTabContainer');
                    tabContent.forEach(content => {
                        content.remove();
                    });

                    // find all error-divider & error-tab
                    let errorDividers = document.querySelectorAll('.error-divider');
                    errorDividers.forEach(divider => {
                        divider.remove();
                    });

                    let errorTabs = document.querySelectorAll('.error-tab');
                    errorTabs.forEach(tab => {
                        tab.remove();
                    });
                }, true);
            });
        }

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
                const gridHeader = minerGrid.querySelector('.k-grid-header');
                var columns = Array.from(gridHeader.querySelector('[role="row"]').children);
                columns.forEach((column, index) => {
                    // Get the title of the column, and store the index
                    const title = column.getAttribute('data-title');
                    columnIndexes[title] = index;
                });

                const rows = minerGrid.querySelectorAll('[role="row"]');
                // Loop through all the rows and store the data for each miner
                rows.forEach(row => {
                    const uid = row.getAttribute('data-uid');
                    let minerLinkElement = minerGrid.querySelector(`[data-uid="${uid}"] .menu-wrapper`);
              
                    // Loop through columnIndexes and get the data for each column
                    for (const [key, colIndex] of Object.entries(columnIndexes)) {
                        let colRowElement = row.querySelector('td[role="gridcell"]:nth-child(' + (parseInt(colIndex+1)) + ')');
                        if (minerLinkElement && colRowElement) {
                            // Store the data in the minersListTableLookup 
                            const minerID = minerLinkElement.getAttribute('data-miner-id');
                            minersListTableLookup[minerID] = minersListTableLookup[minerID] || {};
                            minersListTableLookup[minerID][key] = colRowElement;
                        }
                    }

                    

                    if(minerLinkElement && savedFeatures["rightClickContextMenu"]) {
                        let rightClick = false;

                        function positionContextMenu() {
                            const contextMenu = document.getElementById('issueMenu') || document.querySelector('#minerSlotMenu');
                            if (contextMenu) {
                                contextMenu.style.position = 'fixed';
                                contextMenu.style.top = event.clientY + 'px';
                                contextMenu.style.left = event.clientX + 'px';

                                // If it goes off the screen, move it back on
                                if (event.clientX + contextMenu.offsetWidth > window.innerWidth) {
                                    contextMenu.style.left = (window.innerWidth - contextMenu.offsetWidth) + 'px';
                                }
                                if (event.clientY + contextMenu.offsetHeight > window.innerHeight) {
                                    contextMenu.style.top = (window.innerHeight - contextMenu.offsetHeight) + 'px';
                                }
                            }
                        }

                        let lastClickTime = 0;
                        let allowClick = true;
                        minerLinkElement.addEventListener('click', function(event) {
                            let curTime = new Date().getTime();
                            if(curTime - lastClickTime < 500 && !allowClick) { return; }
                            allowClick = false;
                            lastClickTime = curTime;
                            if (event.isTrusted) {
                                event.isTrusted = false;
                                allowClick = true;
                                event.preventDefault();
                                event.stopPropagation();
                                minerLinkElement.click();
                                positionContextMenu();
                            }
                        });

                        row.lastContextMenuTime = 0;
                        row.addEventListener('contextmenu', (event) => {
                            // if the target is a link dont do anything
                            if(event.target.tagName === 'A') { return; }


                            let curTime = new Date().getTime();
                            if(curTime - row.lastContextMenuTime < 500) { return; }
                            row.lastContextMenuTime = curTime;
                            event.preventDefault();
                            minerLinkElement.click();
                            positionContextMenu();
                        });
                    }
                });
            }
        }

        function addBreakerNumberToSlotID() {
            const minerListCheck = setInterval(() => {
                const minerList = document.querySelector('#minerList') || document.querySelector('#minerGrid');
                if (minerList) {
                    clearInterval(minerListCheck);
                    
                    
                    let plannerCardsDataAll = {};
                    function updatePlannerLink(plannerElement) {
                        
                        let lastCollectionTime = GM_SuperValue.get('plannerCardsDataTime', 0);
                        let currentTime = new Date().getTime();
                        let timeDiff = (currentTime - lastCollectionTime) / 1000;
                        const plannerCardConfig = GM_SuperValue.get('plannerCardConfig', {autoRetrieve: false, openOnLoad: false, retrieveInterval: 60*4});
                        const retrievalInterval = plannerCardConfig.retrieveInterval*60;
                        if (timeDiff > retrievalInterval) {
                            plannerElement.textContent = '';

                            // Remove the clickable link stuff
                            plannerElement.style.cursor = 'default';
                            plannerElement.onclick = null;
                            plannerElement.style.color = 'white';
                            plannerElement.style.textDecoration = 'none';
                            return;
                        }

                        let serialNumber = plannerElement.getAttribute('data-serial-number');
                        let cardData = plannerCardsDataAll[serialNumber];
                        if (cardData) {
                            let issue = (cardData.issue || "");
                            if(issue) {
                                issue = " - (" + issue + ")";
                            }
                            let columnTitle = cardData.columnTitle;
                            plannerElement.textContent = columnTitle + issue;

                            // Make it a clickable link
                            plannerElement.style.cursor = 'pointer';
                            plannerElement.onclick = function() {
                                // Reset these so they don't screw up stuff just in case
                                GM_SuperValue.set("taskName", "");
                                GM_SuperValue.set("taskNotes", "");
                                GM_SuperValue.set("taskComment", "");
                                GM_SuperValue.set("detailsData", {});

                                GM_SuperValue.set("locatePlannerCard", {
                                    serialNumber: serialNumber,
                                    columnTitle: columnTitle
                                });

                                var url = cardData.url;
                                window.open(url, '_blank');
                            };

                            // Make it blue and underlined
                            plannerElement.style.color = '#0078d4';
                            plannerElement.style.textDecoration = 'underline';
                        } else {
                            plannerElement.textContent = 'No Card Found';

                            // Remove the clickable link stuff
                            plannerElement.style.cursor = 'default';
                            plannerElement.onclick = null;
                            plannerElement.style.color = 'white';
                            plannerElement.style.textDecoration = 'none';
                        }
                    }

                    updatePlannerCardsData = function() {
                        for(var key in urlLookupPlanner) {
                            let plannerID = getPlannerID(urlLookupPlanner[key]); //.match(/plan\/([^?]+)/)[1].split('/')[0];
                            let collectDataSuperValueID = "plannerCardsData_" + plannerID;
                            let data = GM_SuperValue.get(collectDataSuperValueID, {});
                            // combine into plannerCardsData
                            plannerCardsDataAll = {...plannerCardsDataAll, ...data};
                        }

                        // Loop through all planner-elements and update the text
                        const plannerElements = document.querySelectorAll('.planner-element');
                        for (const plannerElement of plannerElements) {
                            updatePlannerLink(plannerElement);
                        }
                    }
                    updatePlannerCardsData();
                    const updateCardList = setInterval(() => {
                        updatePlannerCardsData();
                    }, 10000);

                    let hasSetUp = false;
                    let lastSelectedPool = false;
                    function minerListSetup() {
                        if(!hasSetUp) {
                            function autoSelectIPAddress(PoolSelectionDropDown) {
                                let curPoolType = PoolSelectionDropDown.querySelector('span[role="option"].k-input').textContent;
                                let newSelection = false;
                                if(lastSelectedPool !== curPoolType) {
                                    newSelection = true;
                                }
                                if (curPoolType !== "Select Configs" && newSelection) {
                                    lastSelectedPool = curPoolType;
                                    setTimeout(() => {
                                        const ddlPool1Template = document.querySelector('#ddlPool1Template');
                                        const ddlPool2Template = document.querySelector('#ddlPool2Template');
                                        const ddlPool3Template = document.querySelector('#ddlPool3Template');
                                        const templates = [ddlPool1Template, ddlPool2Template, ddlPool3Template];

                                        templates.forEach((template, index) => {
                                            if (template) {
                                                const options = template.querySelectorAll('option');
                                                options.forEach(option => {
                                                    if (option.value === 'IP Address') {
                                                        option.selected = true;
                                                    }
                                                });
                                            }
                                        });
                                    }, 200);
                                }
                            }
                
                            function autoSelectIPAddressSetup() {
                                if(!savedFeatures["autoSelectPool"] || !siteName.includes("Minden")) { return; }
                                const PoolConfigModal = document.querySelector('#PoolConfigModal');
                                const PoolConfigModalContent = document.querySelector('#PoolConfigModalContent');
                                if (!PoolConfigModal || !PoolConfigModalContent) {
                                    setTimeout(autoSelectIPAddressSetup, 500);
                                    return;
                                }
                                const PoolSelectionDropDown = PoolConfigModalContent.querySelector('.dropdown.clickable');
                
                                // Set up observer if PoolConfigModal ever changes display to not be none
                                const observer = new MutationObserver(() => {
                                    const PoolConfigModal = document.querySelector('#PoolConfigModal');
                                    if (PoolConfigModal && PoolConfigModal.style.display !== 'none') {
                                        console.log("PoolConfigModal opened");
                                        autoSelectIPAddress(PoolSelectionDropDown);
                                    }
                                });
                                observer.observe(PoolSelectionDropDown, { attributes: true, childList: true, subtree: true });
                            }
                            autoSelectIPAddressSetup();
                        }

                        getCurrentMinerList();
                        
                        // Loop through all the Slot ID elements and add the Breaker Number and Container Temp
                        for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                            hasSetUp = true;
                            const modelCell = minerData['Model'];
                            const slotIDCell = minerData['Slot ID'];
                            const statusCell = minerData['Status'];
                            const hashCell = minerData['Hashrate'];
                            const networkCell = minerData['Network'];
                            const firmWareCell = minerData['Firmware'];

                            // Get the serial number from the model cell, second child is the serial number
                            let modelNameElement = modelCell.children[0];
                            const serialNumber = modelCell.children[1].innerText;
                            const slotID = slotIDCell.innerText;
                            const status = statusCell.innerText;
                            const ipAddress = networkCell.children[0].innerText;
                            const firmwareWare = firmWareCell.innerText;
                            const isFoundryGUI = isFoundryFirmware(firmwareWare);
                            //console.log("serialNumber", serialNumber);

                            // Set the model name to be a link to the miner page
                            if (modelNameElement && savedFeatures["minerNameLink"]) {
                                // change model name to a link if it isn't already  
                                if(modelNameElement.tagName !== 'A') {
                                    const newElement = document.createElement('a');
                                    newElement.href = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                    newElement.target = '_blank';
                                    for (const attribute of modelNameElement.attributes) {
                                        newElement.setAttribute(attribute.name, attribute.value);
                                    }
                                    newElement.innerHTML = modelNameElement.innerHTML;
                                    modelNameElement.replaceWith(newElement);
                                    modelNameElement = newElement;
                                }

                                // Make it green with a underline when hovered over
                                modelNameElement.style.color = '#17b26a';
                                modelNameElement.style.cursor = 'pointer';
                                modelNameElement.style.textDecoration = 'none'; // remove the initial underline

                                modelNameElement.onmouseover = function() {
                                    modelNameElement.style.textDecoration = 'underline';
                                };

                                modelNameElement.onmouseout = function() {
                                    modelNameElement.style.textDecoration = 'none';
                                };
                            }

                            // Check if slotID has minden in it
                            if (!slotID.includes('Minden')) {
                                continue;
                            }

                            // Gets the realtime hash rate
                            if (hashCell && savedFeatures["realtimeHashrateData"] && !hashCell.querySelector('.realtime-hashrate')) {
                                // Create a new element for the realtime hash rate
                                const realtimeHashrateElement = document.createElement('div');
                                realtimeHashrateElement.textContent = 'Realtime: Checking...';
                                realtimeHashrateElement.classList.add('realtime-hashrate');
                                realtimeHashrateElement.style.color = '#fff';
                                realtimeHashrateElement.style.fontSize = '0.9em';
                                realtimeHashrateElement.style.marginTop = '5px';
                                hashCell.appendChild(realtimeHashrateElement);

                                let minerErrors = {};
                                function fetchRealtimeHashRate(element, ip, isFoundryGUI) {
                                    if(!isFoundryGUI) {
                                        const ipHref = "http://" + ip + '/cgi-bin/stats.cgi';
                                        fetchGUIData(ipHref)
                                            .then(response => {

                                                if(response.trim() == "Socket connect failed: Connection refused") {
                                                    element.textContent = 'Rebooting...';
                                                    element.hashboardRates = 'Probably rebooting.\nOr something really wacky happened...';
                                                    element.tooltip.textContent = element.hashboardRates;
                                                    return;
                                                }
                                                //console.log("response", response)
                                                // Convert the response from json if possible
                                                if (response && !response.STATS) {
                                                    response = JSON.parse(response);
                                                }

                                                

                                                const ipHref2 = "http://" + ip + '/cgi-bin/summary.cgi';
                                                fetchGUIData(ipHref2)
                                                    .then(response2 => {

                                                    let mainErrors = minerErrors[ip] || "";
                                                    
                                                    if (response2) {
                                                        response2 = JSON.parse(response2);
                                                    }
                                                    if(response.STATS && (response.STATS.length == 0 || response.STATS[0].chain === undefined || response.STATS[0].rate_ideal === undefined || (response.STATS[0].chain[0] && response.STATS[0].chain[0].rate_ideal === 0))) {
                                                        element.textContent = 'Initializing...?';
                                                        element.tooltip.textContent = 'Possibly starting after a reboot?\nOr is stuck...' + mainErrors;
                                                        
                                                        if(response2.SUMMARY && response2.SUMMARY[0] && response2.SUMMARY[0].status) {
                                                            // Loop through the status and find the first one that is not "s" status
                                                            let status = response2.SUMMARY[0].status;
                                                            for(let i = 0; i < status.length; i++) {
                                                                if(status[i].status !== "s") {
                                                                    element.textContent = 'Issue: ' + status[i].type;
                                                                    element.tooltip.textContent += '\n\nStatus Issue: ' + status[i].type + '\n' + status[i].msg;
                                                                }
                                                            }
                                                        }

                                                        // If there is errors, get the first one and set it as the issue
                                                        let splitErrors = mainErrors.split('\n');
                                                        if(splitErrors.length > 1 && !splitErrors[3].includes("No Known Major Errors Found")) {
                                                            element.textContent = 'Error: ' + splitErrors[3];
                                                        }
                                                       
                                                        return;
                                                    }

                                                    let totalHash = 0;
                                                    let chains = [];
                                                    for (let i = 0; i < response.STATS[0].chain.length; i++) {
                                                        totalHash += response.STATS[0].chain[i].rate_real;
                                                        chains.push({
                                                            real: response.STATS[0].chain[i].rate_real,
                                                            ideal: response.STATS[0].chain[i].rate_ideal,
                                                            asics: response.STATS[0].chain[i].asic_num,
                                                            percentage: (response.STATS[0].chain[i].rate_real / response.STATS[0].chain[i].rate_ideal) * 100
                                                        });
                                                    }
                                                    let totalHashIdeal = response.STATS[0].rate_ideal;
                                                    let totalHashPercentage = (totalHash / totalHashIdeal) * 100;
                                                    totalHashPercentage = isNaN(totalHashPercentage) ? 0 : totalHashPercentage;
                                                    let [newRate, hashType] = convertHashRate(totalHash, "GH");
                                                    totalHash = newRate + " " + hashType;

                                                    let fanNumbers = response.STATS[0].fan;
                                                    //"fan": [0, 7000, 6970, 6960]
                                                    // If any fan number is 0 or just far lower than others, list that index as an issue fan
                                                    let issueFans = fanNumbers.map((fan, index) => {
                                                        if (fan === 0) {
                                                            return `[${index}]`;
                                                        } else if (Math.abs(fan - Math.max(...fanNumbers)) > 1000) {
                                                            return `[${index}]?`;
                                                        }
                                                        return null;
                                                    }).filter(index => index !== null);

                                                    let elaspedTime = response.STATS[0].elapsed;
                                                    let formattedTime = Math.floor(elaspedTime / 3600) + "h " + Math.floor((elaspedTime % 3600) / 60) + "m " + (elaspedTime % 60) + "s";
                                                    if (totalHash) { 
                                                        element.textContent = 'Realtime: ' + totalHashPercentage.toFixed(2) + '%';
                                                        element.hashboardRates = "Total: " + totalHash + " / " + totalHashPercentage.toFixed(2) + "%\n";
                                                        if(chains.length >= 1) {
                                                            element.hashboardRates += `\n`;
                                                        }
                                                        
                                                        element.hashboardRates += chains.map((chain, index) => 
                                                            `HB${index + 1}: ${chain.real.toFixed(2)} GH / ${chain.percentage.toFixed(2)}% \n(${chain.asics} ASICs)\n`
                                                        ).join('\n');

                                                        let asicDifference = false;
                                                        chains.forEach((chain, index) => {
                                                            // If the asic count is 0 or not equal to other counts, mark it as an issue
                                                            if (chain.asics === 0 || chain.asics !== chains[0].asics) {
                                                                asicDifference = true;
                                                            }
                                                        });
                                                        
                                                        let errorTextAppend = ""

                                                        if (issueFans.length > 0) {
                                                            errorTextAppend = ` | Fan`
                                                            element.hashboardRates += `\nIssue Fans: ${issueFans.join(', ')}`;
                                                        } else if(asicDifference) {
                                                            errorTextAppend = ` | 0 ASICs`
                                                        }

                                                        if(mainErrors.includes("Temperature")) {
                                                            errorTextAppend = " | Temperature";
                                                        } else if(mainErrors.includes("Voltage")) {
                                                            errorTextAppend = " | Voltage";
                                                        } else if(mainErrors.includes("Bad HB")) {
                                                            errorTextAppend = " | Bad HB";
                                                        } else if(mainErrors.includes("Fan Fail")) {
                                                            errorTextAppend = " | Fan Fail";
                                                        }

                                                        element.textContent += errorTextAppend;

                                                        element.hashboardRates += mainErrors + `\n\nUptime: ${formattedTime}`;
                                                        element.tooltip.textContent = element.hashboardRates
                                                    } else {
                                                        element.textContent = 'Realtime: N/A';
                                                        element.hashboardRates = 'Realtime Hashrate Error.' + mainErrors;
                                                        element.tooltip.textContent = element.hashboardRates;
                                                    }

                                                    // Remove any extra new lines from the tooltip text
                                                    element.hashboardRates = element.hashboardRates.replace(/\n{2,}/g, '\n\n');
                                                    element.tooltip.textContent = element.hashboardRates;
                                                })
                                            })
                                            .catch(error => {
                                                console.log("Error fetching realtime hash rate: ", error);
                                                element.textContent = 'Realtime: Error';
                                                element.hashboardRates = 'Error fetching data.\n' + error;
                                                element.tooltip.textContent = element.hashboardRates;
                                            });

                                        const ipHrefLog = "http://" + ip + '/cgi-bin/log.cgi';
                                        fetchGUIData(ipHrefLog)
                                            .then(logResponse => {
                                                
                                                logResponse = cleanErrors(logResponse);
                                                let errorsFound = runErrorScanLogic(logResponse);
                                                errorsFound = errorsFound.filter(error => error.type === 'Main');

                                                // Clear out duplicate error and keep only last
                                                for (let i = errorsFound.length - 1; i >= 0; i--) {
                                                    for (let j = i - 1; j >= 0; j--) {
                                                        if (errorsFound[i].name === errorsFound[j].name) {
                                                            errorsFound.splice(j, 1);
                                                            i--;
                                                        }
                                                    }
                                                }

                                                const errorMessages = errorsFound.map(error => error.textReturn).join("\n");
                                                let mainErrors = errorsFound.length > 0 ? errorMessages : "No Known Major Errors Found";
                                                mainErrors = "\n\nLog Errors:\n" + mainErrors;
                                                minerErrors[ip] = mainErrors;
                                            })
                                            .catch(error => {
                                                console.log("Error fetching log data: ", error);
                                                minerErrors[ip] = "\n\nError fetching log data: " + error;
                                            })
                                    } else {
                                        const ipHref = 'http://' + ip + '/cgi-bin/stats.cgi';
                                        fetchGUIData(ipHref)
                                            .then(response => {
                                                // Extract relevant data from the response
                                                if (response && !response.STATS) {
                                                    response = JSON.parse(response);
                                                }

                                                const stats = response.STATS[1];
                                                const totalHash = convertRates(stats["total rate"], "TH", "H"); // Convert to H/s
                                                const totalHashIdeal = convertRates(stats["total_rateideal"], "GH", "H"); // Convert to H/s
                                                const totalHashPercentage = (totalHash / totalHashIdeal) * 100;

                                                const chains = [];
                                                const chainRates = [
                                                    parseFloat(stats["chain_rate1"]),
                                                    parseFloat(stats["chain_rate2"]),
                                                    parseFloat(stats["chain_rate3"]),
                                                ];
                                                let [idealRatePerChain, idealRatePerChainHashType] = convertHashRate(totalHashIdeal / chainRates.length, "H");
                                                idealRatePerChain = Math.floor(idealRatePerChain)

                                                chainRates.forEach((rate, index) => {
                                                    const oCount = (stats[`chain_acs${index + 1}`].match(/o/g) || []).length;
                                                    const chainRate = convertRates(rate, "TH", idealRatePerChainHashType);
                                                    chains.push({
                                                        real: chainRate,
                                                        ideal: idealRatePerChain,
                                                        asics: oCount,
                                                        percentage: (chainRate / idealRatePerChain) * 100
                                                    });
                                                });

                                                let [newRate, hashType] = convertHashRate(totalHash, "H");
                                                const formattedHash = `${newRate} ${hashType}`;
                                                const formattedPercentage = isNaN(totalHashPercentage) ? 0 : totalHashPercentage.toFixed(2);

                                                let elaspedTime = stats.Elapsed
                                                let formattedTime = Math.floor(elaspedTime / 3600) + "h " + Math.floor((elaspedTime % 3600) / 60) + "m " + (elaspedTime % 60) + "s";

                                                if (totalHash) {
                                                    element.textContent = `Realtime: ${formattedPercentage}%`;
                                                    element.hashboardRates = `Total: ${formattedHash} / ${formattedPercentage}%\n\n`;
                                                    element.hashboardRates += chains.map((chain, index) =>
                                                        `HB${index + 1}: ${(chain.real).toFixed(0)} ${idealRatePerChainHashType} / ${chain.percentage.toFixed(2)}% \n(${chain.asics} ASICs)\n`
                                                    ).join('\n');

                                                    element.hashboardRates += `\nUptime: ${formattedTime}`;
                                                    element.tooltip.textContent = element.hashboardRates;
                                                } else {
                                                    element.textContent = 'Realtime: N/A';
                                                    element.hashboardRates = 'Realtime data not available.';
                                                    element.tooltip.textContent = element.hashboardRates;
                                                }
                                            })
                                            .catch(error => {
                                                console.log("Error fetching realtime hash rate: ", error);
                                                element.textContent = 'Realtime: Error';
                                                element.hashboardRates = 'Error fetching data.\nMiner is offline or unreachable.';
                                                element.tooltip.textContent = element.hashboardRates;
                                            });
                                    }
                                }

                                // Create a tooltip element
                                const tooltip = document.createElement('div');
                                tooltip.style.position = 'fixed';
                                tooltip.style.backgroundColor = '#333';
                                tooltip.style.color = '#fff';
                                tooltip.style.padding = '10px';
                                tooltip.style.borderRadius = '5px';
                                tooltip.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                                tooltip.style.fontSize = '0.9em';
                                tooltip.style.whiteSpace = 'pre-line';
                                tooltip.style.display = 'none';
                                tooltip.style.zIndex = '9999';
                                tooltip.textContent = 'Loading...';
                                document.body.appendChild(tooltip);

                                realtimeHashrateElement.tooltip = tooltip;

                                // Observer to check if the element is in view
                                let lastInteraction = 0;
                                const observer = new IntersectionObserver((entries) => {
                                    let interactionStart = new Date().getTime();
                                    lastInteraction = interactionStart;
                                    entries.forEach(entry => {
                                        if (entry.isIntersecting) {
                                            realtimeHashrateElement.lastSeen = interactionStart;
                                        }
                                        setTimeout(() => {
                                            if (entry.isIntersecting && lastInteraction === interactionStart) {

                                                let timeDelay = 0;
                                                if(status !== "Online") {
                                                    timeDelay = 1;
                                                    realtimeHashrateElement.textContent = 'Skipped: ' + status;
                                                    realtimeHashrateElement.tooltip.textContent = "Skipped check because OptiFleet status: " + status;
                                                    return
                                                }

                                                setTimeout(() => {
                                                    // Element is in view, start fetching realtime hash rate
                                                    fetchRealtimeHashRate(realtimeHashrateElement, ipAddress, isFoundryGUI);
                                                }, timeDelay * 800);

                                                // Start periodic updates
                                                if (!realtimeHashrateElement.fetchInterval) {
                                                    realtimeHashrateElement.fetchInterval = setInterval(() => {
                                                        setTimeout(() => {
                                                            if(realtimeHashrateElement.fetchInterval) {
                                                                fetchRealtimeHashRate(realtimeHashrateElement, ipAddress, isFoundryGUI);
                                                            }
                                                        }, timeDelay * 800);
                                                    }, 6000); // Fetch every 6 seconds
                                                }
                                            }
                                        }, 800);
                                        if (!entry.isIntersecting) {
                                            // Element is out of view, stop fetching
                                            if (realtimeHashrateElement.fetchInterval) {
                                                clearInterval(realtimeHashrateElement.fetchInterval);
                                                realtimeHashrateElement.fetchInterval = null;
                                                setTimeout(() => {
                                                    // Been 30 seconds since last seen, clear the text
                                                    if (realtimeHashrateElement.lastSeen && new Date().getTime() - realtimeHashrateElement.lastSeen > 30000) {
                                                        realtimeHashrateElement.textContent = 'Realtime: Checking...';
                                                        realtimeHashrateElement.tooltip.textContent = 'Loading...';
                                                    }
                                                }, 32000);
                                            }
                                        }
                                    });
                                });

                                // Observe the realtime hash rate element
                                observer.observe(realtimeHashrateElement);

                                // Add hover event to show tooltip
                                realtimeHashrateElement.addEventListener('mouseenter', (event) => {
                                    tooltip.style.display = 'block';
                                    tooltip.style.left = `${event.clientX + 10}px`;
                                    tooltip.style.top = `${event.clientY + 10}px`;
                                });

                                realtimeHashrateElement.addEventListener('mousemove', (event) => {
                                    const tooltipWidth = tooltip.offsetWidth;
                                    const tooltipHeight = tooltip.offsetHeight;
                                    const windowWidth = window.innerWidth;
                                    const windowHeight = window.innerHeight;

                                    let left = event.clientX + 10;
                                    let top = event.clientY + 10;

                                    // Adjust if tooltip goes outside the right edge of the window
                                    if (left + tooltipWidth > windowWidth) {
                                        left = event.clientX - tooltipWidth - 10;
                                    }

                                    // Adjust if tooltip goes outside the bottom edge of the window
                                    if (top + tooltipHeight > windowHeight) {
                                        top = event.clientY - tooltipHeight - 10;
                                    }

                                    tooltip.style.left = `${left}px`;
                                    tooltip.style.top = `${top}px`;
                                });

                                realtimeHashrateElement.addEventListener('mouseleave', () => {
                                    tooltip.style.display = 'none';
                                });
                            }

                            var splitSlotID = slotID.split('-');
                            var row = Number(splitSlotID[2]);
                            var col = Number(splitSlotID[3]);
                            var rowWidth = 4;
                            var breakerNum = (row-1)*rowWidth + col;

                            // if breakerNum isn't NAN
                            if (!isNaN(breakerNum) && savedFeatures["breakerNumber"]) {
                                var newElement = document.createElement('div');
                                newElement.textContent = 'Breaker Number: ' + breakerNum;
                                minerData['Slot ID'].appendChild(newElement);
                            }

                            // Add the Planner Link too
                            if (!statusCell.querySelector('.planner-element')) {
                                var plannerElement = document.createElement('div');
                                plannerElement.textContent = 'Planner Card: Checking...';
                                plannerElement.classList.add('planner-element');
                                plannerElement.setAttribute('data-serial-number', serialNumber);
                                statusCell.appendChild(plannerElement);

                                updatePlannerLink(plannerElement);
                            }
                        }
                    }

                    // Repeat every 100ms until the minerList is loaded
                    const minerListSetUpCheck = setInterval(() => {
                        if(hasSetUp) {
                            clearInterval(minerListSetUpCheck);
                        } else {
                            minerListSetup();
                        }
                    }, 100);

                    // Add mutation observer to the minerList
                    const observer = new MutationObserver(() => {
                        minerListSetup();
                    });
                    observer.observe(minerList, { childList: true, subtree: true });
                }
            }, 500);
        }

        //--------------------------------------------
        // Scan Logic/Auto Reboot Logic
        if(currentURL.includes("https://foundryoptifleet.com/Content/Issues/Issues")) {

            // Add the export XLSX action for only selected rows, and change current to say All
            const issuesActionsDropdown = document.querySelector('#issuesActionsDropdown .m-menu');
            if (issuesActionsDropdown && savedFeatures["exportSelectedMiners"]) {
                const exportAllItem = issuesActionsDropdown.querySelector('.m-menu-item[onclick="issues.exportToExcel()"]');
                if (exportAllItem) {
                    exportAllItem.textContent = 'Export XLSX (All)';
                }

                const exportSelectedItem = document.createElement('div');
                exportSelectedItem.classList.add('m-menu-item');
                exportSelectedItem.textContent = 'Export XLSX (Selected)';
                exportSelectedItem.style.display = 'none';
                exportSelectedItem.onclick = function() {
                    const selectedIds = Object.keys(unsafeWindow.issues.activeGrid._selectedIds);
                    const columns = unsafeWindow.issues.activeExportGrid.columns.filter(col => col.field && !col.hidden);
                    const data = unsafeWindow.issues.hashingFilterMiners.filter(miner => selectedIds.includes(miner.id.toString()));
                
                    const exportData = data.map(miner => {
                        const row = {};
                        columns.forEach(col => {
                            row[col.title] = miner[col.field];
                        });
                        return row;
                    });
                
                    const worksheet = XLSX.utils.json_to_sheet(exportData);
                
                    // Adjust column widths to fit the text
                    const columnWidths = columns.map(col => {
                        const maxLength = Math.max(...exportData.map(row => (row[col.title] || '').toString().length), col.title.length);
                        return { wch: maxLength + 2 }; // Add some padding
                    });
                    worksheet['!cols'] = columnWidths;
                
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Miners');
                    XLSX.writeFile(workbook, 'selected_miners.xlsx');
                };

                issuesActionsDropdown.insertBefore(exportSelectedItem, exportAllItem.nextSibling);

                // Observer for changes in selected IDs
                const observer = new MutationObserver(() => {
                    try {
                        if (Object.keys(unsafeWindow.issues.activeGrid._selectedIds).length > 0) {
                            exportSelectedItem.style.display = 'block';
                        } else {
                            exportSelectedItem.style.display = 'none';
                        }
                    } catch (error) {
                        console.log("Error in observer: ", error);
                    }
                });

                observer.observe(document.querySelector('#minerSelectedCount'), { childList: true, subtree: true });
            }

            // -- Add Breaker Number to Slot ID --
            addBreakerNumberToSlotID();

            // -- Scan Logic --
            var scanTimeFrameText;

            // Find the issuesActionsDropdown and add a new action
            const interval = setInterval(() => {

                // Make a second Actions button for different scan times
                const actionsDropdown = document.querySelector('.op-dropdown')
                if (actionsDropdown) {
                    clearInterval(interval);

                    if(savedFeatures["downScan"]) {
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
                    }

                    function createPopUpTable(title, cols, parent, callback) {
                        // Check if there is an existing #minerTable, if so, click the first tab (assumingly it is the extra tab tables I've made)
                        const existingTable = document.getElementById('minerTable');
                        if (existingTable) {
                            const tabs = document.querySelectorAll('.tab');
                            const firstTab = tabs[0];
                            if (firstTab) {
                                firstTab.click();
                            }
                        }

                        let popupResultElement = document.createElement('div');
                        let position = 'fixed';
                        let top = '50%';
                        let left = '50%';
                        let transform = 'translate(-50%, -50%)';
                        let width = '80%';
                        let height = '80%';
                        let display = 'flex';
                        if (parent) {
                            position = 'relative';
                            top = '0';
                            left = '0';
                            transform = '';
                            width = '100%';
                            height = '100%';
                            display = 'block';
                        }
                        popupResultElement.innerHTML = `
                            <div style="
                                position: ${position};
                                top: ${top};
                                left: ${left};
                                transform: ${transform};
                                background-color: #333;
                                color: white;
                                padding: 20px;
                                font-family: Arial, sans-serif;
                                border-radius: 5px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                                width: ${width};
                                height: ${height};
                                display: ${display};
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

                        // Set an ID on popupResultElement
                        popupResultElement.id = 'popupResultElement';

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

                        // Append popup to the body first, then assign the event listeners
                        if (parent) {
                            parent.appendChild(popupResultElement);

                            
                            // Resize and align into the parent
                            popupResultElement.style.width = '100%';
                            popupResultElement.style.height = '100%';
                            popupResultElement.style.maxWidth = '100%';
                            popupResultElement.style.maxHeight = '100%';
                            popupResultElement.style.position = 'relative';

                            // Make sure it cant expand beyond the parent
                            popupResultElement.style.overflow = 'hidden';
                            
                        } else {
                            document.body.appendChild(popupResultElement);
                        }

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
                                        rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                        rebootData[currentMiner.id].miner = currentMiner;
                                        if(!location || location === "Unassigned") {
                                            //console.error("No location for miner: " + minerID);
                                            rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                            rebootData[currentMiner.id].details = {};
                                            rebootData[currentMiner.id].details.main = "Missing Location";
                                            rebootData[currentMiner.id].details.sub = [];
                                            rebootData[currentMiner.id].details.sub.push("Miner is unassigned.");
                                            rebootData[currentMiner.id].details.color = 'red';
                                            return;
                                        }

                                        // Check if the miner is in the frozen list
                                        if(frozenMiners.includes(minerID)) { // remove 411660 later
                                            rebootData[currentMiner.id] = rebootData[currentMiner.id] || {};
                                            rebootData[currentMiner.id].details = {};
                                            rebootData[currentMiner.id].details.main = "Frozen Miner";
                                            rebootData[currentMiner.id].details.sub = [];
                                            rebootData[currentMiner.id].details.sub.push("Miner is frozen.");
                                            rebootData[currentMiner.id].details.color = 'red';
                                            return;
                                        }

                                        const min15 = 15*60;
                                        const minSoftRebootUpTime = 60*60; // 1 hour
                                        const upTime = currentMiner.uptimeValue;
                                        const container = location.split("_")[1].split("-")[0].replace(/\D/g, '').replace(/^0+/, '');
                                        const maxTemp = 78;
                                        const minTemp = 10;
                                        const containerTemp = containerTempData[container].temp;
                                        const powerMode = currentMiner.powerModeName;
                                        let hashRateEfficiency = currentMiner.hashRatePercent;
                                        if(!rebootAllMiners) {
                                            hashRateEfficiency = false;
                                        }

                                        const isOnline = currentMiner.statusName === 'Online';
                                        let moreThanOneHour = upTime > minSoftRebootUpTime;
                                        const belowMaxTemp = containerTemp <= maxTemp;
                                        const aboveMinTemp = containerTemp >= minTemp;

                                        const minerRebootTimesData = lastRebootTimes[minerID] || {};
                                        const softRebootTimes = minerRebootTimesData.softRebootsTimes || [];
                                        const lastSoftRebootTime = softRebootTimes[softRebootTimes.length-1] || false;
                                        const timeSinceLastSoftReboot = lastSoftRebootTime ? (new Date() - new Date(lastSoftRebootTime)) : false;
                                        
                                        if(timeSinceLastSoftReboot && timeSinceLastSoftReboot < 60*60*1000) { // Mainly if the page was reloaded or something and another scan was started before the miner uptime data could change so it still thinks it hasn't been rebooted IE the uptime hasn't changed
                                            moreThanOneHour = false;
                                        }

                                        rebootData[minerID] = rebootData[minerID] || {};
                                        rebootData[minerID].moreThanOneHour = moreThanOneHour;
                                        rebootData[minerID].isOnline = isOnline;
                                        rebootData[minerID].details = [];
                                        rebootData[minerID].miner = currentMiner;

                                        
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                        const manualHardReboot = lastRebootTimes[minerID].manualHardReboot || false;
                                        const hardRebootAttemptedTime = lastRebootTimes[minerID].hardRebootAttempted || false;

                                        // If the miner has a lastRebootTime and it is at or more than 15 minutes and still has a 0 hash rate, then we can flag it to be hard rebooted, or if the miner last uptime is the same as the current uptime
                                        const minTime = 15*60*1000; // 15 minutes
                                        const forgetTime = 6*60*60*1000; // 6 hours (Might maybe go back to 1 hour?)

                                        const isPastMinTime = timeSinceLastSoftReboot >= minTime;
                                        const notPastForgetTime = timeSinceLastSoftReboot < forgetTime;

                                        // Loops through the softRebootsTimes and remove any that are more than 12 hours old
                                        lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                        lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                        lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes.filter((time) => {
                                            return (new Date() - new Date(time)) < 12*60*60*1000;
                                        });

                                        const numOfSoftReboots = lastRebootTimes[minerID].softRebootsTimes.length;
                                        const moreThan3SoftReboots = numOfSoftReboots >= 3;

                                        
                                        const timeSinceHardRebootAttempted = hardRebootAttemptedTime ? (new Date() - new Date(hardRebootAttemptedTime)) : false;
                                        const hardRebootAttempted = (timeSinceHardRebootAttempted && timeSinceHardRebootAttempted < 6*60*60*1000) || hardRebootAttemptedTime === true;

                                        let hardRebootRecommended = lastRebootTimes[minerID].hardRebootRecommended || false;
                                        const timeSinceHardRebootRecommended = hardRebootRecommended ? (new Date() - new Date(hardRebootRecommended)) : false;
                                        hardRebootRecommended = timeSinceHardRebootRecommended && timeSinceHardRebootRecommended < 12*60*60*1000; // 12 hours
                                        let hardRebootRecommendedBool = !hardRebootAttempted && ((isPastMinTime && notPastForgetTime) || moreThan3SoftReboots || !isOnline || manualHardReboot);

                                        if(isOnline && !hardRebootRecommendedBool && !hardRebootAttempted) {
                                            if(moreThanOneHour && belowMaxTemp && aboveMinTemp && (!hashRateEfficiency || hashRateEfficiency > 0)) { // If the miner passed the conditions, then we can reboot it

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
                                                    lastRebootTimes[minerID].upTimeAtReboot = upTime;
                                                    lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                                    lastRebootTimes[minerID].softRebootsTimes.push(new Date().toISOString());

                                                    // Actually send the reboot request
                                                    serviceInstance.post(`/RebootMiners`, { miners: minerIdList, bypassed: false })
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

                                        // Check if the miner is at 0 uptime and is online, if so that might indicate it is stuck, but we only do it if the normal soft reboot conditions have gone through and is now skipping
                                        const stuckAtZero = upTime === 0 && isOnline && rebootData[minerID].details.main === "Soft Reboot Skipped";
                                        if(stuckAtZero) {
                                            rebootData[minerID].details.sub.push("Miner might be stuck at 0 uptime? Please wait for confirmation check...");
                                        }
                                        
                                        if( hardRebootRecommendedBool ) {
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
                                                rebootData[minerID].details.sub.push(`${numOfSoftReboots} Soft Reboots sent from this computer in the last 12 hours`);
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
                                            rebootData[minerID].details.main = "Container Too Hot (78°F)";
                                            rebootData[minerID].details.sub.push("Container is above 78°F.");
                                        }
                                        
                                        if(!aboveMinTemp) {
                                            rebootData[minerID].details.main = "Container Too Cold (25°F)";
                                            rebootData[minerID].details.sub.push("Container is below 25°F.");
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
                                                        currentMiner = currentMiner || {};
                                                        let minerID = currentMiner.id || "Missing ID";
                                                        let minerRebootData = rebootData[minerID] || {};
                                                        let model = currentMiner.modelName || "Missing Model";
                                                        let slotID = currentMiner.locationName || "Missing Slot ID";

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
                                                        minerRebootData.details = minerRebootData.details || {};
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

                                                        // Add a button before the question mark that says Send Manual Soft Reboot if details.main === "Soft Reboot Skipped"
                                                        if(minerRebootData.details.main === "Soft Reboot Skipped") {
                                                            const softRebootButton = document.createElement('button');
                                                            softRebootButton.textContent = 'Send Soft Reboot Anyway';
                                                            softRebootButton.style.cssText = `
                                                                background-color: #0078d4;
                                                                color: white;
                                                                border: none;
                                                                cursor: pointer;
                                                                border-radius: 5px;
                                                                transition: background-color 0.3s;
                                                                margin-left: 5px;
                                                            `;
                                                            row.querySelector('td:last-child').appendChild(softRebootButton);

                                                            // Add button hover effect
                                                            softRebootButton.addEventListener('mouseenter', function() {
                                                                this.style.backgroundColor = '#005a9e';
                                                            });

                                                            softRebootButton.addEventListener('mouseleave', function() {
                                                                this.style.backgroundColor = '#0078d4';
                                                            });

                                                            // Add click event to the button
                                                            softRebootButton.onclick = function() {
                                                                const minerIdList = [minerID];
                                                                const min15 = 15*60;

                                                                rebootData[minerID].details.main = "Sent Manual Soft Reboot";
                                                                rebootData[minerID].details.sub.push("Manually sent soft reboot.");

                                                                // Update the lastRebootTimes
                                                                lastRebootTimes[minerID] = lastRebootTimes[minerID] || {};
                                                                lastRebootTimes[minerID].upTimeAtReboot = currentMiner.uptimeValue;
                                                                lastRebootTimes[minerID].softRebootsTimes = lastRebootTimes[minerID].softRebootsTimes || [];
                                                                lastRebootTimes[minerID].softRebootsTimes.push(new Date().toISOString());

                                                                // Save lastRebootTimes
                                                                GM_SuperValue.set('lastRebootTimes', lastRebootTimes);

                                                                // Actually send the reboot request
                                                                serviceInstance.post(`/RebootMiners`, { miners: [minerID], bypassed: false })
                                                                    .then(() => {
                                                                        console.log("Rebooted Miner: " + minerID);
                                                                    })
                                                                    .catch((error) => {
                                                                        console.error("Failed to reboot Miner: " + minerID, error);
                                                                    });

                                                                setUpRowData(row, currentMiner);
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
                                                            
                                                            //console.log("Refreshed issue miners:", rebootMiners);

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

                                                                if (!found) {
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
                                                                $('#minerTable').DataTable().order([orderColumn, orderType]).draw();
                                                            }

                                                            // Save these back, since it weirdly gets messed up...?
                                                            $('#minerTable').attr('colIndex', orderColumn);
                                                            $('#minerTable').attr('orderType', orderType);
                                                            $('#minerTable').attr('isGrouped', grouped);
                                                        }

                                                        if(rebootAllMiners) {
                                                            updateAllMinersData(true, (allMiners) => {
                                                                //Loop through the allMiners and check their hashrate efficiency
                                                                for (let index = allMiners.length - 1; index >= 0; index--) {
                                                                    const currentMiner = allMiners[index];
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
                                                                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
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

                                                    /*
                                                    // Set the progress bar to below the table
                                                    progressBar.style.marginTop = '10px';
                                                    progressBar.style.width = '100%';
                                                    progressBar.style.height = '20px';
                                                    progressBar.style.backgroundColor = 'gray';
                                                    progressBar.style.border = '2px solid black';
                                                    var tableDiv = popupResultElement.querySelector('#minerTableDiv');
                                                    // Append after
                                                    tableDiv.parentNode.insertBefore(progressBar, tableDiv.nextSibling);
                                                    */
                                                    
                                                    // Hide the progress bar
                                                    progressBar.style.display = 'none';

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
                                                    Object.values(rebootData).forEach(data => {
                                                        const row = document.createElement('tr');
                                                        setUpRowData(row, data.miner);
                                                        popupTableBody.appendChild(row);
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
                                                            
                                                            // If the table is sorted by the "Slot ID & Breaker" column, group the rows by container
                                                            const slotIDBreakerIndex = Array.from($('#minerTable th')).findIndex(th => th.textContent.includes('Slot ID & Breaker'));
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
                                        const cols = ['IP', 'Miner', 'Offline Count', 'Total Hash Efficiency', 'Online Only Hash Efficiency', 'Slot ID', 'Serial Number'];
                                        createPopUpTable(`Offline Count List (${scanTimeFrameText})`, cols, false, (popupResultElement) => {
                                            
                                            const firstDiv = popupResultElement.querySelector('div');

                                            // Download as CSV
                                            const downloadButton = document.createElement('button');
                                            downloadButton.id = 'downloadButton';
                                            downloadButton.style.cssText = `
                                                padding: 10px 20px;
                                                background-color: #0078d4;
                                                color: white;  
                                                border: none;
                                                cursor: pointer;
                                                margin-top: 10px;
                                                border-radius: 5px;
                                                transition: background-color 0.3s;
                                                align-self: flex-end;
                                                display: block;
                                            `;
                                            downloadButton.textContent = 'Download as CSV';
                                            firstDiv.appendChild(downloadButton);
                                            
                                            const downloadCSV = popupResultElement.querySelector('#downloadButton');
                                            downloadCSV.addEventListener('mouseenter', function() {
                                                this.style.backgroundColor = '#005a9e';
                                            });

                                            downloadCSV.addEventListener('mouseleave', function() {
                                                this.style.backgroundColor = '#0078d4';
                                            });

                                            downloadCSV.onclick = function() {
                                                // Logic to convert the table data to a CSV
                                                const tableRows = popupResultElement.querySelectorAll('tbody tr');
                                                const csvData = Array.from(tableRows).map(row => {
                                                    const cells = row.querySelectorAll('td');
                                                    return Array.from(cells).map(cell => cell.textContent.trim());
                                                });

                                                const csvHeader = ['IP', 'Miner', 'Offline Count', 'Total Hash Efficiency', 'Online Only Hash Efficiency', 'Slot ID', 'Serial Number'];
                                                const csvContent = csvHeader.join(',') + '\n' + csvData.map(row => row.join(',')).join('\n');
                                                const csvBlob = new Blob([csvContent], { type: 'text/csv' });
                                                const csvURL = URL.createObjectURL(csvBlob);
                                                const downloadLink = document.createElement('a');
                                                downloadLink.href =
                                                    csvURL;
                                                downloadLink.download = `OfflineCountList_${scanTimeFrameText}.csv`;
                                                downloadLink.click();

                                                // Remove the download link
                                                downloadLink.remove();
                                            };

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

                                                $('#minerTable').DataTable().draw();
                                            });
                                        });
                                    }
                                }, 500);
                            }

                            if(rebootAllMiners) {
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
                                        issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
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
                    if(savedFeatures["errorScan"]) {
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
                                    <div class="m-menu-item">
                                        <input type="checkbox" id="includeOtherErrors" style="margin-right: 10px;">
                                        <label for="includeOtherErrors">Include 'Other' Errors</label>
                                    </div>
                                    <div class="m-menu-item">
                                        <input type="checkbox" id="excludeFoundryFirmware" style="margin-right: 10px;">
                                        <label for="excludeFoundryFirmware">Exclude Foundry Firmware</label>
                                    </div>
                                </div>
                            </div>
                        `;
                        // If includeOtherErrors data is saved, set the checkbox to checked
                        if (GM_SuperValue.get('includeOtherErrors', false)) {
                            errorScanDropdown.querySelector('#includeOtherErrors').checked = true;
                        }

                        // Add event listener for the includeOtherErrors m-menu-item
                        let includeOtherMenu = errorScanDropdown.querySelector('.m-menu-item:nth-child(3)');
                        includeOtherMenu.addEventListener('click', function(event) {
                            const checkbox = errorScanDropdown.querySelector('#includeOtherErrors');
                            if (event.target === includeOtherMenu) {
                                checkbox.checked = !checkbox.checked;
                            }
                            GM_SuperValue.set('includeOtherErrors', checkbox.checked);
                        });

                        // If excludeFoundryFirmware data is saved, set the checkbox to checked
                        if (GM_SuperValue.get('excludeFoundryFirmware', false)) {
                            errorScanDropdown.querySelector('#excludeFoundryFirmware').checked = true;
                        }

                        // Add event listener for the excludeFoundryFirmware m-menu-item
                        let excludeFoundryMenu = errorScanDropdown.querySelector('.m-menu-item:nth-child(4)');
                        excludeFoundryMenu.addEventListener('click', function(event) {
                            const checkbox = errorScanDropdown.querySelector('#excludeFoundryFirmware');
                            if (event.target === excludeFoundryMenu) {
                                checkbox.checked = !checkbox.checked;
                            }
                            GM_SuperValue.set('excludeFoundryFirmware', checkbox.checked);
                        });
                        // Add the auto reboot button to the right of the dropdown
                        actionsDropdown.before(errorScanDropdown);
                    }

                    // Introduce a queue system for managing multiple fetches
                    let activeFetches = 0;
                    function processMinerQueue(minerQueue, maxConcurrentFetches, processMiner, progressFill, percentageText) {
                        let originalLength = minerQueue.length;
                        let finishedFetches = 0;
                        function next() {
                            if (minerQueue.length === 0 && activeFetches === 0) {
                                // All miners processed
                                return;
                            }

                            while (activeFetches < maxConcurrentFetches && minerQueue.length > 0) {
                                const miner = minerQueue.shift();
                                activeFetches++;
                                processMiner(miner)
                                    .finally(() => {
                                        if(activeFetches === 0) {
                                            return;
                                        }

                                        // Decrement the active fetches count and call next
                                        activeFetches--;
                                        finishedFetches++;
                                        next();

                                        let doneNum = finishedFetches;

                                        // Update the percentage text
                                        percentageText.textContent = `${Math.round(((doneNum) / originalLength) * 100)}% (${doneNum}/${originalLength})`;
                            
                                        // Update the progress bar
                                        progressFill.style.width = `${((doneNum) / originalLength) * 100}%`;
                            
                                    });
                            }
                        }

                        next();
                    }

                    errorScan = function(allScan) {
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
                                activeFetches = 0;
                                clearInterval(currentCheckLoadedInterval);
                                clearInterval(scanningInterval);
                                scanningElement.remove();
                                progressLog.remove();
                            };
                            scanningElement.appendChild(cancelButton);

                            // Note at bottom saying that not a lot of error detection logic has been set up for Foundry firmware yet
                            const note = document.createElement('div');
                            note.style.position = 'absolute';
                            note.style.bottom = '10px';
                            note.style.left = '80px';
                            note.style.color = 'white';
                            note.style.fontSize = '0.8em';
                            note.textContent = 'Note: Not a lot of error detection logic has been set up for Foundry firmware yet.';
                            scanningElement.appendChild(note);

                            // Hover effect for the cancel button
                            cancelButton.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#ff5e57';
                            });

                            cancelButton.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = '#ff3832';
                            });

                            // Filter miners based on conditions
                            offlineMiners = issueMiners.filter(miner => miner.statusName === 'Offline');
                            if (!allScan) {
                                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
                            }

                            if (GM_SuperValue.get('excludeFoundryFirmware', false)) {
                                issueMiners = issueMiners.filter(miner => !isFoundryFirmware(miner.firmwareVersion));
                            }

                            let errorScanMiners = structuredClone(issueMiners);
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

                            let currentlyScanning = {};
                            GM_SuperValue.set('currentlyScanning', currentlyScanning);

                            let failLoadCount = 0;
                            let offlineCount = 0;
                            let noErrorCount = 0;

                            function processMiner(miner) {
                                return new Promise((resolve) => {
                                    const minerIP = miner.ipAddress;
                                    addToProgressLog(miner);

                                    if(miner.statusName === 'Offline'){
                                        setPreviousLogDone(miner.id, "✖", "Miner is Offline...");
                                        offlineCount++;
                                        resolve();
                                        return;
                                    }

                                    let ipHref = `http://${minerIP}/cgi-bin/log.cgi`;
                                    const firmware = miner.firmwareVersion;
                                    const isFoundry = isFoundryFirmware(firmware);

                                    const fetchLogs = isFoundry ? fetchAndCombineLogs : fetchGUIData;
                                    fetchLogs(ipHref)
                                        .then(responseText => {
                                            responseText = cutOffPreviousLog(responseText); // Cut off first before clean
                                            responseText = cleanErrors(responseText);
                                            let errorsFound = runErrorScanLogic(responseText);
                                            if (!GM_SuperValue.get('includeOtherErrors', false)) {
                                                errorsFound = errorsFound.filter(error => error.type === 'Main');
                                            }
                                            if (errorsFound.length > 0) {
                                                const errorsFoundObj = GM_SuperValue.get('errorsFound', {});
                                                errorsFoundObj[miner.id] = errorsFound;
                                                GM_SuperValue.set('errorsFound', errorsFoundObj);
                                                setPreviousLogDone(miner.id, "✔", errorsFound.filter(error => error.type !== 'Info').map(error => `• ${error.name}`).join('\n'));
                                            } else {
                                                setPreviousLogDone(miner.id, "✔", "No Errors Found");
                                                noErrorCount++;
                                            }
                                            resolve();
                                        })
                                        .catch(() => {
                                            setPreviousLogDone(miner.id, "✖", "Failed to load miner GUI Data...");
                                            failLoadCount++;
                                            resolve();
                                        });
                                });
                            }

                            // Process miners
                            processMinerQueue(errorScanMiners, 6, processMiner, progressFill, percentageText);

                            const checkScanDoneInterval = setInterval(() => {
                                let doneNum = errorScanMiners.length + activeFetches;
                                if (doneNum === 0) {
                                    clearInterval(scanningInterval);
                                    clearInterval(checkScanDoneInterval);
                                    cancelButton.remove();
                                    // ...existing code for displaying results...
                                    let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                                    if(Object.keys(errorsFoundSave).length === 0) {
                                        clearInterval(scanningInterval);
                                        scanningText.textContent = '[No errors found]';
                                    }

                                    clearInterval(checkScanDoneInterval);

                                    cancelButton.remove();

                                    const cols = ['Miner Errors'];
                                    createPopUpTable(`Error Log Scan Results`, cols, false, (popupResultElement) => {
                                        const firstDiv = popupResultElement.querySelector('div');

                                        function setUpRowData(row, currentMiner, error) {
                                            let minerID = currentMiner.id;
                                            row.innerHTML = `
                                                <td style="text-align: left; position: relative;">
                                                    ${error.textReturn}
                                                    <div style="display: inline-block; margin-left: 5px; cursor: pointer; position: relative; float: right;">
                                                        <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0078d4; color: white; text-align: center; line-height: 20px; font-size: 12px; border: 1px solid black; font-weight: bold; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">!</div>
                                                        <div style="display: none; position: absolute; top: 20px; right: 0; background-color: #444947; color: white; padding: 5px; border-radius: 5px; z-index: 9999; white-space: nowrap; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
                                                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                                                <div>
                                                                    [Error Log]
                                                                </div>
                                                                <div style="display: flex; gap: 5px; align-items: center;">
                                                                    <button class="copy-button" style="padding: 5px; background-color: green; color: white; border: none; cursor: pointer; border-radius: 5px;">Copy</button>
                                                                </div>
                                                            </div>
                                                            <div style="display: block; padding: 5px; background-color: #444947; color: white; border-radius: 5px; margin-top: 5px; white-space: pre-wrap;">${error.text}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            `;
                                            const copyButton = row.querySelector('.copy-button');
                                            copyButton.addEventListener('click', () => {
                                                const errorText = error.text;
                                                navigator.clipboard.writeText(errorText).then(() => {
                                                    console.log('Text copied to clipboard');
                                                }).catch(err => {
                                                    console.error('Failed to copy text: ', err);
                                                });
                                                copyButton.textContent = 'Copied!';
                                                setTimeout(() => {
                                                    copyButton.textContent = 'Copy';
                                                }, 1000);
                                            });

                                            row.minerID = minerID;
                                            row.minerDataCopy = structuredClone(currentMiner);

                                            if(!error.text) {
                                                row.innerHTML = `
                                                    <td style="text-align: left; position: relative;">
                                                        ${error.textReturn}
                                                    </td>
                                                `;
                                            } else {
                                                var questionColor = 'red';
                                                if(questionColor) {
                                                    row.querySelector('td:last-child div[style*="position: relative;"] div').style.backgroundColor = questionColor;   
                                                }
                                                const questionMark = row.querySelector('td:last-child div[style*="position: relative;"]');
                                                const tooltip = questionMark.querySelector('div[style*="display: none;"]');
                                                document.body.appendChild(tooltip);
                                                questionMark.addEventListener('mouseenter', () => {
                                                    tooltip.style.display = 'block';
                                                    const questionMarkRect = questionMark.getBoundingClientRect();
                                                    const tooltipRect = tooltip.getBoundingClientRect();
                                                    tooltip.style.left = `${questionMarkRect.left - tooltipRect.width}px`;
                                                    tooltip.style.right = 'auto';
                                                    tooltip.style.top = `${questionMarkRect.top}px`;
                                                });

                                                questionMark.addEventListener('click', () => {
                                                    const ip = currentMiner.ipAddress;
                                                    let GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${ip}/#blog`;
                                                    if(isFoundryFirmware(currentMiner.firmwareVersion)) {
                                                        GUILink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                                    }
                                                    GM_SuperValue.set('quickGoToLog', {ip: ip, errorText: error.text, category: error.category, minerID: minerID});
                                                    window.open(GUILink, '_blank');
                                                });

                                                let hideTooltipTimer;
                                                const hideTooltipWithDelay = () => {
                                                    hideTooltipTimer = setTimeout(() => {
                                                        tooltip.style.display = 'none';
                                                    }, 100);
                                                };
                                                tooltip.style.display = 'none';
                                                questionMark.addEventListener('mouseenter', () => {
                                                    clearTimeout(hideTooltipTimer);
                                                });
                                                tooltip.addEventListener('mouseenter', () => {
                                                    clearTimeout(hideTooltipTimer);
                                                });
                                                questionMark.addEventListener('mouseleave', hideTooltipWithDelay);
                                                tooltip.addEventListener('mouseleave', hideTooltipWithDelay);
                                                const observer = new MutationObserver(() => {
                                                    tooltip.remove();
                                                    observer.disconnect();
                                                });
                                                observer.observe(row, { childList: true });
                                            }
                                        }

                                        const containerDiv = document.createElement('div');
                                        containerDiv.style.cssText = `
                                            display: flex;
                                            gap: 10px;
                                            padding: 0px;
                                            background-color: #444947;
                                            border-radius: 10px;
                                            margin-top: 10px;
                                            align-self: flex-start;
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
                                            align-self: flex-start;
                                            display: block;
                                        `;
                                        finishedButton.textContent = 'Close Error Scan Results';
                                        firstDiv.appendChild(finishedButton);

                                        firstDiv.style.left = '41%'

                                        const finishedErrorScan = popupResultElement.querySelector('#finishedHardReboots');
                                        finishedErrorScan.addEventListener('mouseenter', function() {
                                            this.style.backgroundColor = '#45a049';
                                        });
                                        finishedErrorScan.addEventListener('mouseleave', function() {
                                            this.style.backgroundColor = '#4CAF50';
                                        });
                                        finishedErrorScan.onclick = function() {
                                            scanningElement.remove();
                                            progressLog.remove();
                                            clearInterval(scanningInterval);
                                            popupResultElement.remove();
                                            popupResultElement = null;
                                        };

                                        const popupTableBody = popupResultElement.querySelector('tbody');

                                        // Order the issueMiners by slotID (C18-1-1-1 [1]) Each number appearing first takes priority over the next number
                                        issueMiners.sort((a, b) => {
                                            const parseSlotID = (slotID) => {
                                                const parts = slotID.match(/C(\d+)-(\d+)-(\d+)-(\d+)/);
                                                return parts ? parts.slice(1).map(Number) : [0, 0, 0, 0];
                                            };

                                            const aSlotID = parseSlotID(a.locationName);
                                            const bSlotID = parseSlotID(b.locationName);

                                            for (let i = 0; i < aSlotID.length; i++) {
                                                if (aSlotID[i] !== bSlotID[i]) {
                                                    return aSlotID[i] - bSlotID[i];
                                                }
                                            }
                                            return 0;
                                        });

                                        issueMiners.forEach(miner => {
                                            const minerID = miner.id;
                                            const errors = errorsFoundSave[minerID] || [];
                                            errors.forEach((error, index) => {
                                                if(error.type === 'Info') { return; }
                                                const row = document.createElement('tr');
                                                let curMiner = scanMinersLookup[minerID];
                                                setUpRowData(row, curMiner, error);
                                                popupTableBody.appendChild(row);
                                            });
                                        });

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

                                                let hashboardModel = "Unknown";
                                                let iconLinks = [];
                                                if(errorData) {
                                                    errorData.forEach(error => {
                                                        if(error.textReturn && error.textReturn.includes('HB: ')) {
                                                            hashboardModel = error.textReturn.replace('HB: ', '');
                                                        }
                                                        
                                                        if(error.type !== 'Info') {
                                                            if(!iconLinks.find(icon => icon.icon === error.icon)) {
                                                                iconLinks.push({icon: error.icon, count: 1, name: error.name});
                                                            } else {
                                                                iconLinks.find(icon => icon.icon === error.icon).count++;                                                            
                                                            }
                                                        }
                                                    });
                                                }

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
                                                        white-space: nowrap; /* Prevent wrapping */
                                                    `;
                                                    iconDiv.innerHTML = `
                                                        <span style="position: relative; top: -10px; right: -10px; background-color: red; color: white; border-radius: 50%; padding: 1px 3px; font-size: 10px;">${icon.count}</span>
                                                        <img src="${icon.icon}" style="width: 18px; height: 18px; margin-right: 5px; margin-left: 0px;"/>
                                                    `;
                                                    iconSpan.appendChild(iconDiv);

                                                    if(icon.count < 2) {
                                                        iconDiv.querySelector('span').remove();

                                                        let imgElement = iconDiv.querySelector('img');

                                                        iconDiv.style.paddingLeft = '2px';
                                                        iconDiv.style.paddingRight = '2px';
                                                        iconDiv.style.marginLeft = '0px';
                                                        iconDiv.style.marginRight = '0px';
                                                        imgElement.style.marginLeft = '0px';
                                                        imgElement.style.marginRight = '0px';
                                                        imgElement.style.paddingLeft = '0px';
                                                        imgElement.style.paddingRight = '0px';

                                                        if(iconLinks.length > 1 && icon === iconLinks[0]) {
                                                            iconDiv.style.marginLeft = '1px';
                                                        }
                                                    }

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

                                                    iconDiv.addEventListener('mouseenter', () => {
                                                        tooltip.style.display = 'block';

                                                        const iconRect = iconDiv.getBoundingClientRect();
                                                        const containerRect = iconDiv.offsetParent.getBoundingClientRect();

                                                        const tooltipOffset = 5;
                                                        tooltip.style.top = `${iconRect.top}px`;
                                                        tooltip.style.left = `${iconRect.right}px`; 
                                                    });

                                                    iconDiv.addEventListener('mouseleave', () => {
                                                        tooltip.style.display = 'none';
                                                    });
                                                });

                                                let errorCountText = "Error Count: " + errorCount;
                                                if(errorCount === '?') {
                                                    errorCountText = errorData[0].short || errorData[0].textReturn || "Error Count: ?";
                                                }
                                                    
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

                                                const toggleButtonSpan = document.createElement('span');
                                                toggleButtonSpan.style.cssText = `
                                                    padding: 5px;
                                                    border-radius: 5px;
                                                    outline: 1px solid #000;
                                                    margin-left: 5px;
                                                    float: left;
                                                    left: 5px;
                                                `;

                                                const style = document.createElement('style');
                                                style.textContent = `
                                                    .unselectable {
                                                        -webkit-user-select: none;
                                                        -moz-user-select: none;
                                                        -ms-user-select: none;
                                                        user-select: none;
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

                                                newRow.querySelector('td').prepend(toggleButtonSpan);
                                                toggleButtonSpan.appendChild(toggleButton);
                                                
                                                newRow.classList.add('unselectable');

                                                toggleButton.addEventListener('mouseenter', function() {
                                                    this.style.backgroundColor = '#005a9e';
                                                });

                                                toggleButton.addEventListener('mouseleave', function() {
                                                    this.style.backgroundColor = '#0078d4';
                                                });

                                                let lastClickTime = 0;
                                                function expandCollapseRows() {
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

                                                toggleButton.addEventListener('click', function() {
                                                    expandCollapseRows();
                                                });
                                                currentRow.before(newRow);

                                                toggleButton.click();

                                                newRow.addEventListener('click', function() {
                                                    expandCollapseRows();
                                                });
                                            }
                                        }

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
                                        setMaxWidth('.error-hashboard-text');
                                    });
                                }
                            }, 100);
                        });
                    };


                    if(siteName.includes("Minden")) {
                        // Create a auto reboot button to the right of the dropdown
                        if(savedFeatures["autoReboot"]) {
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
                        }

                        // Add the full auto reboot button to the right of the dropdown
                        //actionsDropdown.before(fullAutoRebootButton);
                        
                        // Create a 'getPlannerCardData' button to the right of the dropdown
                        if(savedFeatures["plannerCardScan"]) {
                            const updatePlannerCardsDropdown = document.createElement('div');
                            updatePlannerCardsDropdown.classList.add('op-dropdown');
                            updatePlannerCardsDropdown.style.display = 'inline-block';
                            updatePlannerCardsDropdown.innerHTML = `
                                <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('updatePlannerCardsDropdown'); return false;">
                                    Planner Cards
                                    <m-icon name="chevron-down" class="button-caret-down" data-dashlane-shadowhost="true" data-dashlane-observed="true"></m-icon>
                                </button>
                                <div id="updatePlannerCardsDropdown" class="m-dropdown-menu is-position-right" aria-hidden="true">
                                    <div class="m-menu">
                                        <div class="m-menu-item" onclick="getPlannerCardData()">
                                            Retrieve Planner Cards Data
                                        </div>
                                        <div class="m-menu-item" onclick="openPlannerCardDataConfig()">
                                            Edit Config
                                        </div>
                                    </div>
                                </div>
                            `;

                            // Add the update planner cards button to the right of the dropdown
                            actionsDropdown.before(updatePlannerCardsDropdown);

                            let plannerCardRefreshInterval;
                            let firstLoad = true;
                            function setUpPlannerCardRefresh() {
                                const plannerCardConfig = GM_SuperValue.get('plannerCardConfig', {autoRetrieve: false, openOnLoad: false, retrieveInterval: 60});
                                
                                // If first load and openOnLoad is enabled, open the planner cards
                                if(firstLoad && plannerCardConfig.openOnLoad) {
                                    getPlannerCardData();
                                    firstLoad = false;
                                }

                                // Disable the refresh interval if it exists
                                if(plannerCardRefreshInterval) {
                                    clearInterval(plannerCardRefreshInterval);
                                }
                                
                                // If the autoRetrieve is enabled, set the interval to refresh the planner cards
                                if(plannerCardConfig.autoRetrieve) {
                                    plannerCardRefreshInterval = setInterval(() => {
                                        getPlannerCardData();
                                    }, plannerCardConfig.retrieveInterval * 60 * 1000);
                                }
                            }

                            openPlannerCardDataConfig = function() {
                                // Open a small overlay menu for editing if the user wants auto retrieval of planner data and how often
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
                                popupTitle.textContent = 'Planner Card Data Config';
                                popupTitle.style.color = 'white';
                                popupTitle.style.marginBottom = '10px';
                                popupContent.appendChild(popupTitle);

                                const plannerCardConfig = GM_SuperValue.get('plannerCardConfig', {autoRetrieve: false, openOnLoad: false, retrieveInterval: 60});
                                
                                // Auto retrieve checkbox
                                const autoRetrieveContainer = document.createElement('div');
                                autoRetrieveContainer.style.display = 'flex';
                                autoRetrieveContainer.style.alignItems = 'center';

                                const autoRetrieveCheckbox = document.createElement('input');
                                autoRetrieveCheckbox.type = 'checkbox';
                                autoRetrieveCheckbox.checked = plannerCardConfig.autoRetrieve;
                                autoRetrieveCheckbox.style.marginBottom = '10px';
                                autoRetrieveCheckbox.style.width = '20px'; // Set the width smaller
                                autoRetrieveCheckbox.style.height = '20px'; // Set the height smaller
                                autoRetrieveCheckbox.style.marginRight = '10px'; // Add some space to the right

                                const autoRetrieveLabelText = document.createElement('span');
                                autoRetrieveLabelText.innerText = 'Auto Retrieve';
                                autoRetrieveLabelText.style.color = '#fff'; // Set text color to white for better contrast
                                autoRetrieveLabelText.style.marginBottom = '10px';

                                autoRetrieveContainer.appendChild(autoRetrieveCheckbox);
                                autoRetrieveContainer.appendChild(autoRetrieveLabelText);
                                popupContent.appendChild(autoRetrieveContainer);

                                // Open on load checkbox
                                const openOnLoadContainer = document.createElement('div');
                                openOnLoadContainer.style.display = 'flex';
                                openOnLoadContainer.style.alignItems = 'center';

                                const openOnLoadCheckbox = document.createElement('input');
                                openOnLoadCheckbox.type = 'checkbox';
                                openOnLoadCheckbox.checked = plannerCardConfig.openOnLoad;
                                openOnLoadCheckbox.style.marginBottom = '10px';
                                openOnLoadCheckbox.style.width = '20px'; // Set the width smaller
                                openOnLoadCheckbox.style.height = '20px'; // Set the height smaller
                                openOnLoadCheckbox.style.marginRight = '10px'; // Add some space to the right

                                const openOnLoadLabelText = document.createElement('span');
                                openOnLoadLabelText.innerText = 'Open on Load';
                                openOnLoadLabelText.style.color = '#fff'; // Set text color to white for better contrast
                                openOnLoadLabelText.style.marginBottom = '10px';

                                openOnLoadContainer.appendChild(openOnLoadCheckbox);
                                openOnLoadContainer.appendChild(openOnLoadLabelText);
                                popupContent.appendChild(openOnLoadContainer);

                                // Retrieve interval input
                                const retrieveIntervalLabel = document.createElement('label');
                                retrieveIntervalLabel.textContent = 'Retrieve Interval (minutes)';
                                retrieveIntervalLabel.style.color = 'white';
                                retrieveIntervalLabel.style.marginBottom = '10px';
                                popupContent.appendChild(retrieveIntervalLabel);
                                
                                const retrieveIntervalInput = document.createElement('input');
                                retrieveIntervalInput.type = 'number';
                                retrieveIntervalInput.min = 1;
                                retrieveIntervalInput.value = plannerCardConfig.retrieveInterval;
                                retrieveIntervalInput.style.width = '100%';
                                retrieveIntervalInput.style.padding = '10px';
                                retrieveIntervalInput.style.marginBottom = '10px';
                                retrieveIntervalInput.style.color = 'white';
                                popupContent.appendChild(retrieveIntervalInput);

                                const buttonsDiv = document.createElement('div');
                                buttonsDiv.style.display = 'flex';
                                buttonsDiv.style.justifyContent = 'space-between';
                                popupContent.appendChild(buttonsDiv);
                                
                                const submitButton = document.createElement('button');
                                submitButton.textContent = 'Save';
                                submitButton.style.padding = '10px 20px';
                                submitButton.style.backgroundColor = '#4CAF50';
                                submitButton.style.color = 'white';
                                submitButton.style.border = 'none';
                                submitButton.style.cursor = 'pointer';
                                submitButton.style.borderRadius = '5px';
                                submitButton.style.transition = 'background-color 0.3s';
                                submitButton.style.display = 'block';
                                submitButton.style.marginTop = '10px';
                                buttonsDiv.appendChild(submitButton);

                                submitButton.addEventListener('mouseenter', function() {
                                    this.style.backgroundColor = '#45a049';
                                });

                                submitButton.addEventListener('mouseleave', function() {
                                    this.style.backgroundColor = '#4CAF50';
                                });

                                submitButton.onclick = function() {
                                    const autoRetrieve = autoRetrieveCheckbox.checked;
                                    const openOnLoad = openOnLoadCheckbox.checked;
                                    const retrieveInterval = retrieveIntervalInput.value;
                                    GM_SuperValue.set('plannerCardConfig', {autoRetrieve: autoRetrieve, openOnLoad: openOnLoad, retrieveInterval: retrieveInterval});
                                    popup.remove();

                                    setUpPlannerCardRefresh();
                                    updatePlannerCardsData();
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
                            }
                            
                            setUpPlannerCardRefresh();
                        }
                    }

                    function DetectFrozenMiners() {
                        if(disableFrozenMiners) { return; }
                        console.log("Checking for frozen miners...");
                        if(Object.keys(gotFrozenDataFor).length > 0) {
                            activeMiners = 0;
                            foundActiveMiners = false;
                            gotFrozenData = false;
                            gotFrozenDataFor = {};
                        }
                        updateAllMinersData(true, (data) => {
                            setTimeout(() => {
                                DetectFrozenMiners();
                            }, 15000);
                        });
                    }

                    setTimeout(function() {
                        DetectFrozenMiners();
                    }, 2500);

                    // Overide tab toggle function to add in my custom fuctionality
                    function toggleCustomTab(tab) {
                        
                        // show the miner-filters
                        const filterElement = document.querySelector(".filters-section.m-section");
                        const selectedElement = document.querySelector(".miners-selected");
                        if(filterElement) {
                            filterElement.style.display = "block";
                        }
                        if(selectedElement) {
                            selectedElement.style.display = "block";
                        }

                        // Remove popupResultElement if it exists
                        const popupResultElement = document.getElementById('popupResultElement');
                        if (popupResultElement) {
                            popupResultElement.remove();
                        }
                        
                        // Removes the normal table if it exists
                        $(tab).addClass("selected");
                        $(tab).siblings(".tab").removeClass("selected");
                        $(".all-panel, .error-panel").removeClass("active");

                        if(tab.custom) {
                            // Hide miner-filters
                            if (filterElement) {
                                filterElement.style.display = "none";
                            }
                            if (selectedElement) {
                                selectedElement.style.display = "none";
                            }
                        }

                        if(tab.id === "frozenMiners") {
                            // Create frozen miners table and add to #grid-wrapper
                            const cols = ['IP', 'Miner', 'Last Reported Uptime', 'Slot ID & Breaker', 'Serial Number'];
                            const gridWrapper = document.getElementById('grid-wrapper');
                            createPopUpTable(`Possible Frozen Miners List`, cols, gridWrapper, (popupResultElement) => {
                                const firstDiv = popupResultElement.querySelector('div');
                                const containerDiv = document.createElement('div');
                                containerDiv.style.cssText = `
                                    display: flex;
                                    gap: 10px;
                                    padding: 0px;
                                    background-color: #444947;
                                    border-radius: 10px;
                                    margin-top: 10px;
                                    align-self: flex-start;
                                `;

                                const checkedMinersText = document.createElement('div');
                                checkedMinersText.style.cssText = `
                                    padding: 5px;
                                    background-color: #444947;
                                    border-radius: 5px;
                                    font-size: 0.8em;
                                `;
                                checkedMinersText.textContent = `Miners Checked: Detecting...`;

                                // Update the checked miners text
                                setInterval(() => {
                                    if(foundActiveMiners && Object.keys(gotFrozenDataFor).length > 0) {
                                        checkedMinersText.textContent = `Miners Checked: ${Object.keys(gotFrozenDataFor).length}/${activeMiners}`;
                                    } else if(checkedMinersText.textContent !== 'Miners Checked: Detecting...') {
                                        checkedMinersText.textContent = `Miners Checked: Re-Detecting...`;
                                    }
                                }, 500);

                                const additionalNote = document.createElement('div');
                                additionalNote.style.cssText = `
                                    padding: 5px;
                                    background-color: #444947;
                                    border-radius: 5px;
                                    font-size: 0.8em;
                                `;
                                additionalNote.textContent = `Note: This list may not be 100% accurate. It can also take upwards of a few minutes to get the required data.`;

                                containerDiv.appendChild(checkedMinersText);
                                containerDiv.appendChild(additionalNote);
                                firstDiv.appendChild(containerDiv);

                                // Add the miner data to the table body
                                const popupTableBody = popupResultElement.querySelector('tbody');
                                // Loop through frozenMiners
                                frozenMiners.forEach(currentMiner => {
                                    const minerID = currentMiner.id;
                                    const minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                                    const minerIP = currentMiner.ipAddress;
                                    const row = document.createElement('tr');
                                    const model = currentMiner.modelName;
                                    const uptime = currentMiner.uptime;
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

                                    const minerSerialNumber = currentMiner.serialNumber;
                                    row.innerHTML = `
                                        <td style="text-align: left;"><a href="http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/" target="_blank" style="color: white;">${minerIP}</a></td>
                                        <td style="text-align: left;"><a href="${minerLink}" target="_blank" style="color: white;">${model}</a></td>
                                        <td style="text-align: left;">${uptime}</td>
                                        <td style="text-align: left;">${paddedSlotIDBreaker}</a></td>
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

                                    $('#minerTable').DataTable().draw();
                                });
                            });
                        }
                    }

                    // Add new tab
                    const tabsContainer = document.querySelector('.tabs');
                    if (tabsContainer && !disableFrozenMiners) {
                        const frozenMinersTab = document.createElement('div');
                        frozenMinersTab.id = 'frozenMiners';
                        frozenMinersTab.custom = true;
                        frozenMinersTab.className = 'tab';
                        frozenMinersTab.onclick = function() {
                        };
                        frozenMinersTab.innerHTML = `
                            <span>Frozen Miners</span>
                            <span class="m-chip new-tab-count">?</span>
                        `;
                        // Update the count of the new tab to the length of frozenMiners
                        let lastFreezeCount = 0;
                        setInterval(() => {
                            const count = frozenMiners.length;
                            if (!gotFrozenData && count === 0) {
                                //frozenMinersTab.querySelector('.new-tab-count').textContent = "?";
                                return;
                            }
                            frozenMinersTab.querySelector('.new-tab-count').textContent = count;
                            if (count !== lastFreezeCount && frozenMinersTab.classList.contains('selected')) {
                                lastFreezeCount = count;
                                frozenMinersTab.click();
                            }
                        }, 100);

                        // Align to right
                        /*
                        frozenMinersTab.style.cssText = `
                            margin-left: auto;
                            position: relative;
                            right: 2px;
                        `;*/
                        frozenMinersTab.style.cssText = `
                            margin-left: auto;
                            margin-right: 0px;
                        `;
                        tabsContainer.appendChild(frozenMinersTab);
                    }

                    // Loop through all the tabs and add an extra on click event 
                    const tabs = document.querySelectorAll('.tab');
                    tabs.forEach(tab => {
                        tab.onclick = function() {
                            toggleCustomTab(this);
                            if(!this.custom) {
                                issues.toggleTab(this);
                            }
                        };
                    });
                }

            }, 1000);
        }
        
        if(currentURL.includes("https://foundryoptifleet.com/Content/Dashboard/Miners/List")) {
            // -- Add Breaker Number to Slot ID --
            addBreakerNumberToSlotID();
        }

        // Individual Miner Page added data boxes
        if(currentURL.includes("https://foundryoptifleet.com/Content/Miners/IndividualMiner")) {
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

            const minerID = currentURL.match(/id=(\d+)/)[1];
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

            function createDownTimesChartDataBox(chartID, title, callback) {
                if(!savedFeatures["downCount"]) { return; }

                const chart = document.querySelector(chartID);
                if (!chart) {
                    setTimeout(() => {
                        createDownTimesChartDataBox(chartID, title, callback);
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

            createDownTimesChartDataBox('#uptimeChart', 'Times Down', (result, timeSpan) => {
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

                    if(savedFeatures["lastSoftReboot"]) {
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
                }
            }, 500);

            function createBreakerNumBox() {
                if(!savedFeatures["breakerNumberMiner"]) { return; }

                // Check if the details were loaded
                var detailsLoadedInterval = setInterval(() => {
                    var [cleanedText, minerDetails] = getMinerDetails();

                    // Make sure this is a minden miner
                    var locationID = minerDetails['locationID'];
                    if (!locationID.includes('Minden')) {
                        return;
                    }

                    var splitLocationID = locationID.split('-');
                    var row = Number(splitLocationID[2]);
                    var col = Number(splitLocationID[3]);
                    var rowWidth = 4;
                    var breakerNum = (row-1)*rowWidth + col;
                    if (row > 0 && col > 0) {
                        clearInterval(detailsLoadedInterval);
                        addDataBox("Breaker Number", breakerNum);
                    }
                }, 500);
            }
            createBreakerNumBox();

            //----------------------------------------------------------
            
            // Logic for seeing if the miner exists in a planner board
            function checkIfInPlannerBoard() {
                GM_SuperValue.set("locatePlannerCard", false);
                if(!savedFeatures["plannerCardScanMiner"]) { return; }

                var [cleanedText, minerDetails] = getMinerDetails();
                console.log(minerDetails);
                if(!minerDetails || !minerDetails['serialNumber'] || minerDetails['serialNumber'] == "--") {
                    setTimeout(checkIfInPlannerBoard, 500);
                    return;
                }

                var serialNumber = minerDetails['serialNumber'];
                
                // Cycle 3 dots
                let cycle = 0;
                let dots = "";

                // Add a data box that will be updated with the GM_SuperValue of plannerCardsData
                let plannerDataBox = addDataBox("Planner Board", "Loading...", (mBox, h3, p) => {
                    // Put h3 as a div, then add a 'refresh' button to the right of it, if we haven't already
                    if(!mBox.querySelector('.refresh-button-container')) {
                        const div = document.createElement('div');
                        div.classList.add('refresh-button-container');
                        div.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                        `;
                        h3.style.display = 'inline-block';
                        div.appendChild(h3);

                        const refreshButton = document.createElement('button');
                        refreshButton.textContent = 'Refresh';
                        refreshButton.style.padding = '5px 5px';
                        refreshButton.style.backgroundColor = '#0078d4';
                        refreshButton.style.color = 'white';
                        refreshButton.style.border = 'none';
                        refreshButton.style.cursor = 'pointer';
                        refreshButton.style.borderRadius = '5px';
                        refreshButton.style.transition = 'background-color 0.3s';
                        refreshButton.style.display = 'block';
                        refreshButton.style.marginTop = '0px';
                        refreshButton.style.marginRight = '0px';
                        div.appendChild(refreshButton);

                        refreshButton.addEventListener('mouseenter', function() {
                            this.style.backgroundColor = '#005a9e';
                        });

                        refreshButton.addEventListener('mouseleave', function() {
                            this.style.backgroundColor = '#0078d4';
                        });

                        refreshButton.onclick = function() {
                            event.preventDefault();

                            // only if user's mouse is actually over the button
                            let mouseHovered = refreshButton.matches(':hover');
                            if(mouseHovered) {
                                getPlannerCardData();
                            }
                        }

                        mBox.insertBefore(div, mBox.firstChild);
                    }

                    // Dots cycle logic
                    cycle++;
                    if(cycle > 3) {
                        cycle = 0;
                        dots = "";
                    } else {
                        dots += ".";
                    }

                    // Check if the data has been found/displays the data
                    let plannerCardsDataAll = {};
                    for(var key in urlLookupPlanner) {
                        let plannerID = getPlannerID(urlLookupPlanner[key]) //.match(/plan\/([^?]+)/)[1].split('/')[0];
                        let collectDataSuperValueID = "plannerCardsData_" + plannerID;
                        let data = GM_SuperValue.get(collectDataSuperValueID, {});
                        // combine into plannerCardsData
                        plannerCardsDataAll = {...plannerCardsDataAll, ...data};
                    }

                    let cardData = plannerCardsDataAll[serialNumber];
                    if(cardData) {
                        let issue = (cardData.issue || "");
                        if(issue) {
                            issue = " - (" + issue + ")";
                        }
                        let columnTitle = cardData.columnTitle;
                        p.textContent = columnTitle + issue;

                        // Make it a clickable link
                        p.style.cursor = 'pointer';
                        p.onclick = function() {
                            // Reset these so they don't screw up stuff just in case
                            GM_SuperValue.set("taskName", "");
                            GM_SuperValue.set("taskNotes", "");
                            GM_SuperValue.set("taskComment", "");
                            GM_SuperValue.set("detailsData", {});

                            GM_SuperValue.set("locatePlannerCard", {
                                serialNumber: serialNumber,
                                columnTitle: columnTitle
                            });

                            var url = cardData.url;
                            window.open(url, '_blank');
                        }

                        // Make it blue and underlined
                        p.style.color = '#0078d4';
                        p.style.textDecoration = 'underline';
                    } else {
                        // Make it not clickable
                        p.style.cursor = 'default';
                        p.style.color = 'white';
                        p.style.textDecoration = 'none';
                        p.textContent = "[Not Found]";

                        // Add subtext if it doesn't exist already
                        if(!mBox.querySelector('p')) {
                            const subText = document.createElement('p');
                            subText.textContent = "This isn't 100% accurate, it can take a bit to update.";
                            subText.style.color = '#70707b';
                            subText.style.fontSize = '0.8em';
                            subText.style.marginTop = '5px';
                            mBox.appendChild(subText);
                        }
                    }

                    // add sub text to tell the user that this might need refreshed if cards changed
                    if(!mBox.querySelector('.refresh-text')) {
                        const refreshText = document.createElement('p');
                        refreshText.classList.add('refresh-text');
                        refreshText.textContent = 'This might need refreshed if cards changed.';
                        refreshText.style.color = '#70707b';
                        refreshText.style.fontSize = '0.8em';
                        refreshText.style.marginTop = '5px';
                        mBox.appendChild(refreshText);
                    }
                }, 1000);
                
            }
            checkIfInPlannerBoard();
            
            function autoSelectPool() {
                const PoolConfigModalContent = document.querySelector('#PoolConfigModalContent');
                const PoolSelectionDropDown = PoolConfigModalContent.querySelector('.dropdown.clickable');
                setTimeout(() => { // Should hopefully be enough time for the dropdown to get the right type
                    let curPoolType = PoolSelectionDropDown.querySelector('span[role="option"].k-input').textContent;
                    console.log("Current Pool Type:", curPoolType);
                    if (curPoolType === "Select Configs") {
                        PoolSelectionDropDown.click();
                        const customerName = unsafeWindow.im.miner.subcustomerName;
                        
                        const waitUntilDropdown = setInterval(() => {
                            const optionPanel = document.querySelector('.k-list-optionlabel').parentElement;
                            if (optionPanel) {
                                const options = optionPanel.querySelector('.k-list.k-reset').children;
                                for (let i = 0; i < options.length; i++) {
                                    const option = options[i].textContent.toLowerCase();
                                    if (option.includes(customerName.toLowerCase())) {
                                        options[i].click();

                                        setTimeout(() => {
                                            const ddlPool1Template = document.querySelector('#ddlPool1Template');
                                            const ddlPool2Template = document.querySelector('#ddlPool2Template');
                                            const ddlPool3Template = document.querySelector('#ddlPool3Template');
                                            const templates = [ddlPool1Template, ddlPool2Template, ddlPool3Template];

                                            templates.forEach((template, index) => {
                                                if (template) {
                                                    const options = template.querySelectorAll('option');
                                                    options.forEach(option => {
                                                        if (option.value === 'IP Address') {
                                                            option.selected = true;
                                                        }
                                                    });
                                                }
                                            });
                                        }, 500);

                                        break;
                                    }
                                }
                                clearInterval(waitUntilDropdown);
                            } else {
                                console.log("Waiting for dropdown to open...");
                            }
                        }, 100);
                        console.log("Current Pool Type:", curPoolType);
                    } else {
                        console.log("Pool type not found.");
                    }
                }, 800);
            }

            function autoSelectPoolSetup() {
                if(!savedFeatures["autoSelectPool"] || !siteName.includes("Minden")) { return; }
                const PoolConfigModal = document.querySelector('#PoolConfigModal');
                if (!PoolConfigModal) {
                    setTimeout(autoSelectPoolSetup, 500);
                    return;
                }

                // Set up observer if PoolConfigModal ever changes display to not be none
                const observer = new MutationObserver(() => {
                    const PoolConfigModal = document.querySelector('#PoolConfigModal');
                    if (PoolConfigModal && PoolConfigModal.style.display !== 'none') {
                        console.log("PoolConfigModal opened");
                        autoSelectPool(PoolConfigModal);
                    }
                });
                observer.observe(PoolConfigModal, { attributes: true, attributeFilter: ['style'] });
            }
            autoSelectPoolSetup();
        }

        // Add temps for all containers if in overview page and are in minden
        if(currentURL.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview") && siteName.includes("Minden")) {
            if(!savedFeatures["avgContainerTemps"]) {
                return;
            }
           
            let lastRan = 0;
            function addTemperatureData() {
                const containers = document.querySelectorAll('.stat-panel');
                if (containers.length === 0) {
                    setTimeout(addTemperatureData, 10);
                    return;
                }

                containers.forEach(container => {
                    // Add the temperature title if it doesn't exist
                    if (!container.querySelector('.temp-text-title')) {
                        const tempTitleElement = document.createElement('div');
                        tempTitleElement.className = 'temp-text-title';
                        tempTitleElement.innerText = 'Averaged Temperature:';
                        tempTitleElement.style.marginTop = '10px';
                        // set the color to a light orange
                        tempTitleElement.style.color = '#ff7f50';
                        container.appendChild(tempTitleElement);
                    }
                });

                function setColorAndEmoji(tempValue) {
                    let color = 'white';
                    let emoji = '';
                    if (tempValue > 80) {
                        color = 'red';
                        emoji = ' 🔥';
                    } else if (tempValue > 70) {
                        color = 'yellow';
                        emoji = ' ⚠️';
                    } else if (tempValue <= 25) {
                        color = '#38a9ff';
                        emoji = ' ❄️';
                    }
                    return { color, emoji };
                }

                function getTemp() {
                    if (Date.now() - lastRan < 5000) {
                        return;
                    }
                    lastRan = Date.now();
                    retrieveContainerTempData((containerTempData) => {
                        containers.forEach(container => {

                            // Get the temp-text-title element and reset it to the default
                            const tempTitleElement = container.querySelector('.temp-text-title');
                            tempTitleElement.innerText = 'Averaged Temperature:';

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
                            const { color, emoji: mainEmoji } = setColorAndEmoji(tempValue);
                            tempElement.innerText = tempValue + '°F' + mainEmoji;
                            tempElement.style.color = color;

                            // Add a tooltip hover effect on the tempElement
                            const tempDetails = containerTempData[containerNum].temps;
                            let tooltipText = '';
                            const sortedTemps = Object.entries(tempDetails).sort((a, b) => {
                                const aRack = parseInt(a[0].match(/Rack (\d+)-/)[1]);
                                const bRack = parseInt(b[0].match(/Rack (\d+)-/)[1]);
                                return aRack - bRack;
                            });

                            let newMainTemp = tempValue;
                            let newMainColor = color;
                            let newMainEmoji = mainEmoji;
                            let titleText = "";
                            for (const [sensorName, temp] of sortedTemps) {
                                const { color, emoji } = setColorAndEmoji(temp);
                                tooltipText += `<span style="color: ${color};">${sensorName}: ${temp.toFixed(2)}°F${emoji}</span>\n`;

                                // Scuffed logic for knowing if the main temp should be updated to show the highest or lowest temp
                                if((emoji === ' 🔥' && (mainEmoji === "" || mainEmoji === " ⚠️" ) || emoji === ' ⚠️' && mainEmoji === "") && temp > newMainTemp) {
                                    newMainTemp = temp;
                                    titleText = "Highest Temperature:";
                                    newMainColor = color;
                                    newMainEmoji = emoji;
                                } else if(mainEmoji === "" && emoji === ' ❄️' && temp < newMainTemp) {
                                    newMainTemp = temp;
                                    titleText = "Lowest Temperature:";
                                    newMainColor = color;
                                    newMainEmoji = emoji;
                                }
                            }

                            if(newMainTemp !== tempValue) {
                                tempTitleElement.innerText = titleText;
                                tempElement.innerText = newMainTemp + '°F' + newMainEmoji;
                                tempElement.style.color = newMainColor;
                            }

                            // Create a tooltip element
                            let tooltip = document.querySelector('.tempDataTooltip_' + containerNum);
                            if (!tooltip) {
                                tooltip = document.createElement('div');
                                tooltip.className = 'tempDataTooltip_' + containerNum;
                                tooltip.style.position = 'absolute';
                                tooltip.style.backgroundColor = '#333';
                                tooltip.style.color = '#fff';
                                tooltip.style.padding = '5px';
                                tooltip.style.borderRadius = '5px';
                                tooltip.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                                tooltip.style.whiteSpace = 'pre-wrap';
                                tooltip.style.display = 'none';
                                tooltip.style.zIndex = '1000';
                                document.body.appendChild(tooltip);
                            }

                            // Show tooltip on hover
                            tempElement.addEventListener('mouseover', (e) => {
                                tooltip.style.display = 'block';
                                tooltip.innerHTML = tooltipText.trim();
                                const rect = tempElement.getBoundingClientRect();
                                tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
                                tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                            });

                            // Hide tooltip on mouseout
                            tempElement.addEventListener('mouseout', () => {
                                tooltip.style.display = 'none';
                            });

                            // if the mouse is hovered over it at this moment already, then show the tooltip
                            if (tempElement.matches(':hover')) {
                                // delay 1 ms (it might think a mouseout event happens when the temp updates?)
                                setTimeout(() => {
                                    tooltip.style.display = 'block';
                                    tooltip.innerHTML = tooltipText.trim();
                                    const rect = tempElement.getBoundingClientRect();
                                    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
                                    tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                                }, 1);
                            } else {
                                tooltip.style.display = 'none';
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
    if(currentURL.includes("https://foundryoptifleet.com")) {

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

    if (currentURL.includes("foundrydigitalllc.sharepoint.com/") ) {
        let taskName = GM_SuperValue.get("taskName", "");
        const detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));
        const minerType = detailsData['type'];

        if (taskName !== "") {
            // Quick popup notification saying it been formatted & copied to clipboard
            const popup = document.createElement('div');
            popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            opacity: 1;
            transition: opacity 1s ease-out;
            `;
            popup.textContent = 'Miner Data has been formatted and copied to clipboard!';
            document.body.appendChild(popup);

            setTimeout(() => {
                popup.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(popup);
                }, 1000); // Wait for the fade-out transition to complete
            }, 3000);

            // Clear data
            GM_SuperValue.set('taskName', '');
            GM_SuperValue.set('taskNotes', '');
            GM_SuperValue.set('taskComment', '');
            GM_SuperValue.set('detailsData', {});

            function locateNewestSheet() {
                // Query all inner elements directly
                const innerElements = document.querySelectorAll('div[role="row"][data-automationid^="row-"]');

                if(innerElements.length === 0) {
                    setTimeout(locateNewestSheet, 500);
                    return;
                }
        
                // Initialize an array to store elements with the required aria-label
                const matchingElements = [];
                var backUpElement = null;

                // Loop through each inner element and check the aria-label
                innerElements.forEach(element => {
                    const ariaLabel = element.getAttribute('aria-label');
                    if (ariaLabel && ariaLabel.toLowerCase().includes(minerType.toLowerCase())) {
                        // Check if a number is present in the aria-label, and get the number if it is
                        const number = parseInt(ariaLabel.match(/\d+/));
                        if (!isNaN(number)) {
                            matchingElements.push({ element, number });
                        }
                    }

                    if (ariaLabel && ariaLabel.toLowerCase().includes(minerType.toLowerCase())) {
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
                const linkButton = largestElement.querySelector('span[role="button"]');
                if (linkButton) {
                    console.log("Found the link button:", linkButton);
                    // Scroll to the element
                    linkButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Highlight the element
                    largestElement.style.backgroundColor = 'lightgrey';
                    setTimeout(() => {
                        largestElement.style.backgroundColor = '';
                    }, 15000);

                    linkButton.click();

                    // Find data-automationid="openFileCommand", click it then click "Open in Browser"
                    const interval = setInterval(() => {
                        const menuItems = document.querySelectorAll('.ms-ContextualMenu-itemText');
                        if(menuItems && menuItems.length > 0) {
                            menuItems.forEach(item => {
                                if (item.textContent.trim() === 'Open in browser') {
                                    
                                    unsafeWindow.open = function(url,windowName,parms) {
                                        // Instead set the current URL to the new URL
                                        if(url.includes("sharepoint")) {
                                            window.location.href = url;
                                        }
                                    };

                                    item.click();
                                    clearInterval(interval);
                                }
                            });
                        } else {
                            const openFileCommand = document.querySelector('button[data-automationid="openFileCommand"]');
                            if (openFileCommand) {
                                openFileCommand.click();
                            }
                        }
                    }, 10);

                }
            }
            locateNewestSheet();
        }
    }

    if (currentURL.includes("planner.cloud.microsoft") && !currentURL.includes("iframe")) {
        function PlannerCardPage() {
            // If we don't have plannerTasks data yet, then no elements are made to check yet.
            if(!plannerTasks || !plannerBuckets) {
                console.log("Planner tasks not found, trying again in 100ms.");
                setTimeout(() => {
                    PlannerCardPage();
                }, 100);
                return;
            }

            function SimTypeTextBox(box, text) {
                const currentValue = box.value;
                // Backspace the current value
                for (let i = 0; i < currentValue.length; i++) {
                    // Create and dispatch the keydown event for backspace
                    const keydownEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
                    box.dispatchEvent(keydownEvent);
                }

                box.value = "";
                const charArray = text.split('');
                box.click();
                for (const char of charArray) {
                    
                    // Create and dispatch the keydown event
                    const keydownEvent = new KeyboardEvent('keydown', { key: char });
                    box.dispatchEvent(keydownEvent);

                    // Insert the character
                    document.execCommand('insertText', false, char);

                    // Create and dispatch the keyup event
                    const keyupEvent = new KeyboardEvent('keyup', { key: char });
                    box.dispatchEvent(keyupEvent);

                }
            }

            const filterTextBox = document.querySelector('.ms-SearchBox-field');
            console.log("Current URL: ", currentURL);
            console.log("Filter Text Box: ", filterTextBox);
            if (!filterTextBox) {
                setTimeout(() => {
                    console.log("Filter text box not found, trying to click button.");
                    const searchButton = document.querySelector('button[aria-label="Filter by keyword"]');
                    if (!searchButton) {
                        setTimeout(() => {
                            console.log("Search button not found, trying again.");
                            PlannerCardPage();
                        }, 10);
                        return;
                    } else {
                        searchButton.click();
                    }
                    PlannerCardPage();
                }, 10);
                return;
            }

            // Inital reset since it weirdly will sort of half remember the last input without displaying it?
            // Also, now setting it to space since microsoft updated it so the filter doesn't appear until clicked, so this way we can more easily access it just in case the user clicks away, it will remain open.
            filterTextBox.click();
            SimTypeTextBox(filterTextBox, ' ')
            filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
            filterTextBox.blur();

            let stopChecking = false;
            let existingCard = false;
            let maxTries = 30;
            let curTry = 0;
            
            let foundCards = [];
            function FindIfCardExists(serialNumber, findCallback) {
                if (stopChecking) { 
                    console.log("Stop checking is true, exiting.");
                    return; 
                }
                
                // Get all sectionToggleButton and expand them
                const sectionToggleButtons = document.querySelectorAll('.sectionToggleButton');
                console.log("sectionToggleButtons: ", sectionToggleButtons);
                sectionToggleButtons.forEach(button => {
                    if (button.getAttribute('aria-expanded') === 'false') {
                        button.click();
                    }
                });

                if( filterTextBox.value !== serialNumber) {
                    SimTypeTextBox(filterTextBox, serialNumber)
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log("Inputting serial number into filter text box:", serialNumber);
                }

                // Set background color to the filter text box
                filterTextBox.style.transition = 'background-color 0.8s';
                filterTextBox.style.backgroundColor = '#c3b900';

                // Set horizontal scroll to a bit more each time
                if(curTry >= 4) {
                    // Scroll smoothly to last column
                    let columnTitles = document.querySelectorAll('.columnTitle');
                    let lastColumn = columnTitles[columnTitles.length - 1];
                    lastColumn.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

                    //document.querySelector('.columnsList').scrollBy({ left: 100, behavior: 'smooth' });
                }

                /*
                Scroll Left: 1859
                Client Width: 421
                Scroll Width: 2314
                */

                // Get all the cards and scroll to it if the same serial number is found
                const cards = document.querySelectorAll('.taskBoardCard');
                curTry++;
                console.log("Checking for card with serial number:", serialNumber);
                
                // At/past max tries or we at the end of the scroll of .columnsList
                let columnsList = document.querySelector('.columnsList');
                let endOfScroll = columnsList.scrollWidth - columnsList.clientWidth <= columnsList.scrollLeft+35;
                console.log("End of scroll:", endOfScroll);
                console.log("Scroll Left:", columnsList.scrollLeft);
                console.log("Scroll Width - Client Width:", columnsList.scrollWidth - columnsList.clientWidth);
                if (curTry >= maxTries || endOfScroll && curTry >= 4) {
                    console.log("Max tries reached, card not found.");

                    // Reset the search bar
                    filterTextBox.value = ' ';
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    // Set search bar color
                    filterTextBox.style.backgroundColor = 'red';
                    timeout = setTimeout(() => {
                        filterTextBox.style.backgroundColor = '';
                    }, 1000);

                    // Set our scroll back to beginning
                    document.querySelector('.columnsList').scrollTo({ left: 0, behavior: 'smooth' });
                    return;
                }

                if (cards.length === 0) {
                    setTimeout(() => {
                        FindIfCardExists(serialNumber, findCallback);
                    }, 100);
                    return;
                }

                cards.forEach(card => {
                    const taskName = card.getAttribute('aria-label');
                    const container = card.querySelector('.container');
                    if (taskName.includes(serialNumber)) {
                        if(foundCards.includes(container)) {
                            return;
                        }
                        existingCard = container;
                        foundCards.push(container);
                        let columnTitle = container.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.columnTitle h3').textContent;
                        
                        // Set search bar color
                        filterTextBox.style.backgroundColor = '#1797ff';
                        timeout = setTimeout(() => {
                            filterTextBox.style.backgroundColor = '';
                        }, 1000);

                        // Scroll to the card
                        container.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        let textContent = container.querySelector('.textContent');
                        findCallback(card, textContent, columnTitle);

                        console.log("Found the card:", card);
                    } else {
                        console.log("Card not found.");
                    }
                });

                if(foundCards.length === 0) {
                    setTimeout(() => {
                        FindIfCardExists(serialNumber, findCallback);
                    }, 100);
                }
            }

            setTimeout(() => {
                const locatePlannerCardData = GM_SuperValue.get("locatePlannerCard", false);
                let serialNumber = locatePlannerCardData.serialNumber;
                let columnTitle = locatePlannerCardData.columnTitle;
                console.log("Locate Planner Card Data: ", locatePlannerCardData);
                if (serialNumber) {
                    FindIfCardExists(serialNumber, (container, textContent, columnTitle_Card) => {
                        /* NOT SURE IF THIS IS WHAT BREAKING STUFF
                        if(columnTitle_Card !== columnTitle) {
                            return;
                        }*/
                        // Give a slightly animated border, where a glow effect pulses around the card
                        const border = document.createElement('div');
                        border.style.position = 'absolute';
                        border.style.top = '0';
                        border.style.left = '0';
                        border.style.width = '100%';
                        border.style.height = '100%';
                        border.style.border = '2px solid #0078d4';
                        border.style.borderRadius = '5px';
                        border.style.pointerEvents = 'none';
                        border.style.boxShadow = '0 0 10px #0078d4';
                        border.style.animation = 'glow 1.5s alternate';
                        container.appendChild(border);

                        // Add keyframes for the glow effect
                        const style = document.createElement('style');
                        style.textContent = `
                            @keyframes glow {
                                from {
                                    box-shadow: 0 0 5px #0078d4;
                                }
                                to {
                                    box-shadow: 0 0 20px #0078d4;
                                }
                            }
                        `;
                        document.head.appendChild(style);

                        // Fade out the border after the glow animation
                        setTimeout(() => {
                            border.style.transition = 'opacity 1s';
                            border.style.opacity = '0';
                            setTimeout(() => {
                                border.remove();
                            }, 1000);
                        }, 1500);
                        
                    });

                    // clear the locatePlannerCard data
                    GM_SuperValue.set("locatePlannerCard", false);
                }
            }, 500);

            // Logic for looping through all the planner cards, and saving the miner serial number and the category it is in, so we can use it in optifleet
            let setDate = false;
            let plannerID = getPlannerID(currentURL); //.match(/plan\/([^?]+)/)[1].split('/')[0];
            let newPlannerData = {};
            let createdOverlay = false;
            function collectPlannerCardData() {
                // Check if this window is actually one we should scan
                let pages = GM_SuperValue.get("plannerCardsData_Pages", []);
                // if the plannerID is contained in the pages, then we should scan
                let isSearching = false;
                for (let i = 0; i < pages.length; i++) {
                    if (pages[i].includes(plannerID)) {
                        isSearching = true;
                        break;
                    }
                }

                if (!isSearching) {
                    console.log("Not searching this page.");
                    return;
                }

                if(!createdOverlay) {
                    // Create a dark overlay saying we're collecting data
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    overlay.style.color = 'white';
                    overlay.style.display = 'flex';
                    overlay.style.alignItems = 'center';
                    overlay.style.justifyContent = 'center';
                    overlay.style.zIndex = '9999';
                    
                    // Add text saying we're collecting data and a spinner
                    overlay.innerHTML = `
                        <div style="text-align: center;">
                            <h1 style="margin-bottom: 20px;">Collecting Planner Card Data</h1>
                            <div class="spinner" style="margin-bottom: 20px;"></div>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    // Add spinner animation
                    const spinnerStyle = document.createElement('style');
                    spinnerStyle.innerHTML = `
                        .spinner {
                            border: 8px solid #f3f3f3;
                            border-top: 8px solid #0078d4;
                            border-radius: 50%;
                            width: 50px;
                            height: 50px;
                            animation: spin 1s linear infinite;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `;
                    document.head.appendChild(spinnerStyle);
                    createdOverlay = true;
                }
                        
 
                if (!setDate) {
                    GM_SuperValue.set("plannerPageLoaded_"+plannerID, true);
                    GM_SuperValue.set('plannerCardsDataTime', Date.now());
                    setDate = true;
                }

                //console.log("Planner Tasks: ", plannerTasks);
                //console.log("Planner Buckets: ", plannerBuckets);

                let bucketNameLookup = {};
                plannerBuckets.forEach(bucket => {
                    bucketNameLookup[bucket.id] = bucket.title;
                });

                // Loop through plannerTasks array
                plannerTasks.forEach(task => {
                    const percentComplete = task.percentComplete;
                    if (percentComplete === 100) {
                        return;
                    }
                    const taskName = task.title;
                    const taskSplit = taskName.split('_');
                    const serialNumber = taskSplit[0];
                    const issue = taskName.split('_')[taskSplit.length - 1];
                    const bucketID = task.bucketId;
                    const columnTitle = bucketNameLookup[bucketID];
                    const lastModifiedDateTime = task.lastModifiedDateTime;
                    let cardExists = newPlannerData[serialNumber];
                    if (cardExists) {
                        let createdDate = new Date(task.createdDate);
                        let createdCardDate = new Date(cardExists.createdDate);
                        // If the created date is older than our already stored date, then skip
                        if (createdDate < createdCardDate) {
                            return;
                        }
                    }
                            
                    let cardData = {
                        columnTitle: columnTitle,
                        issue: issue,
                        lastModified: lastModifiedDateTime,
                        url: window.location.href.replace('grid', 'board')
                    };
                    newPlannerData[serialNumber] = cardData;
                });

                GM_SuperValue.set("plannerCardsClosePage_"+plannerID, true);
                GM_SuperValue.set("plannerCardsData_" + plannerID, newPlannerData);
                pages.shift();
                GM_SuperValue.set("plannerCardsData_Pages", pages);
                let nextURL = pages[0];
                if (nextURL) {
                    window.location.href = nextURL;
                } else {
                    GM_SuperValue.set("plannerCardsData_Pages", false);
                    window.close();
                }
            }
            collectPlannerCardData();

            let minerSNLookup = GM_SuperValue.get("minerSNLookup_Minden", {});

            // Logic for adding button on planner card that will open the miner page
            let previousMinerID = "";
            function addOpenMinerButton() {
                // Check if taskEditor-dialog-header exists
                const taskDetailsTitleSection = document.querySelector('#taskDetailsTitleSectionId');
                if (!taskDetailsTitleSection) {
                    return;
                }

                // Logic to get the serial number of the miner and check if it exists in the lookup
                let taskNameTextField = document.querySelector('input[placeholder="Task name"]');
                let taskName = taskNameTextField.value;
                let serialNumber = taskName.split('_')[0];
                const minerData = minerSNLookup[serialNumber] || {};
                let minerID = minerData.minerID;
                
                // Check if the button already exists
                const openMinerButton = document.querySelector('#openMinerButton');
                if (openMinerButton && previousMinerID === minerID) {
                    return;
                } else if (openMinerButton) {
                    openMinerButton.remove();
                }

                // Store the minerID for future reference
                previousMinerID = minerID;

                // Don't try to add the button if the minerID is not found
                if (!minerID) {
                    // If the name does seem to be formatted with the serial number, then let the user know it is not found
                    // Check if there are _ in the taskName, and no spaces in the serial number
                    if (taskName.includes('_') && !serialNumber.includes(' ') && serialNumber.length > 5) {
                        // Create the button and add it to into the taskEditor-dialog-header on the left side
                        const button = document.createElement('button');
                        button.id = 'openMinerButton';
                        button.textContent = 'Miner Not Found';
                        button.style.backgroundColor = 'red';
                        button.style.color = 'white';
                        button.style.border = '5px';
                        button.style.padding = '8px';
                        button.style.borderRadius = '3px';
                        button.style.cursor = 'pointer';
                        button.style.paddingTop = '4px';
                        button.style.paddingBottom = '4px';
                        button.style.display = 'flex';
                        button.style.alignItems = 'center';
                        button.style.justifyContent = 'center';
                        taskDetailsTitleSection.appendChild(button);
                    }

                    return;
                }

                // Create the miner link
                let minerLink = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerID}`;
                
                // Create the button and add it to into the taskEditor-dialog-header on the left side
                const button = document.createElement('button');
                button.id = 'openMinerButton';
                button.textContent = 'Open Miner Page';
                button.style.backgroundColor = 'green';
                button.style.color = 'white';
                button.style.border = '5px';
                button.style.padding = '8px';
                button.style.borderRadius = '3px';
                button.style.cursor = 'pointer';
                button.style.paddingTop = '4px';
                button.style.paddingBottom = '4px';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                taskDetailsTitleSection.appendChild(button);

                // Add an event listener to the button
                button.addEventListener('click', () => {
                    window.open(minerLink, '_blank');
                });
            }

            // Add observe
            const dialogObserver = new MutationObserver((mutationsList, observer) => {
                addOpenMinerButton();
            });

            const dialogContainer = document.querySelector('#teamsApp');
            if (dialogContainer) {
                dialogObserver.observe(dialogContainer, { childList: true, subtree: true });
            }

            function addSlotIDToCard(card) {
                const taskName = card.getAttribute('aria-label');
                const serialNumber = taskName.split('_')[0];
                const minerData = minerSNLookup[serialNumber] || {
                    slotID : "Unknown"
                };
                const slotID = minerData.slotID;

                // Check if it already exists, if it does, check if the slotID is different, if so delete the old one
                let leaveAlone = false;
                const slotIDElement = card.querySelector('.slotID');
                if (slotIDElement) {
                    if(slotIDElement.textContent !== `Slot ID: ${slotID}`) {
                        slotIDElement.remove();
                    } else {
                        leaveAlone = true;
                    }
                }
                
                // If the name does seem to be formatted with the serial number, then add the slot ID to the card
                // Check if there are multiple _ in the taskName, and no spaces in the serial number
                if (taskName.includes('_') && !serialNumber.includes(' ') && serialNumber.length > 5 && !leaveAlone) {
                    // Add it above textContent 
                    const taskCardContent = card.querySelector('.textContent');
                    const slotIDElement = document.createElement('div');
                    slotIDElement.classList.add('slotID');
                    slotIDElement.style.fontSize = '0.8em';
                    slotIDElement.style.color = 'lightgrey';
                    if(slotID === "Unknown") {
                        slotIDElement.style.color = 'grey';
                    }
                    slotIDElement.style.marginTop = '5px';
                    slotIDElement.style.marginBottom = '0px';
                    slotIDElement.style.marginLeft = '15px';
                    slotIDElement.textContent = `Slot ID: ${slotID}`;
                    taskCardContent.prepend(slotIDElement);
                }
            }

            // Logic for displaying the Container/Location ID on the planner cards
            function addSlotIDsToPlannerCards() {
                // Loops through all taskCard elements and adds the slot ID to the card
                const taskCards = document.querySelectorAll('.taskBoardCard');
                taskCards.forEach(card => {
                    addSlotIDToCard(card);
                });
            }

            // Keep trying to add the slot ID to the cards until there are taskCards
            function wonkyEdgeCaseFixForSlotIDs() {
                const taskCards = document.querySelectorAll('.taskBoardCard');
                if (taskCards.length === 0) {
                    setTimeout(() => {
                        wonkyEdgeCaseFixForSlotIDs();
                    }, 500);
                    return;
                }
                addSlotIDsToPlannerCards();
            }
            wonkyEdgeCaseFixForSlotIDs();

            // Run wonkyedgecasefixforslotids if the url changes
            let lastURL = window.location.href;
            setInterval(() => {
                if (lastURL !== window.location.href) {
                    lastURL = window.location.href;
                    wonkyEdgeCaseFixForSlotIDs();
                }
            }, 500);
            
            // Set up only run addSlotIDToCard when either a card is changed/added
            const cardObserver = new MutationObserver((mutationsList, observer) => {
                if (window !== window.top) {
                    return;
                }
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        //console.log("Node Added: ", node);
                        if (node.classList && node.classList.contains('taskBoardCard')) {
                            let card = node.querySelector('.taskBoardCard');
                            addSlotIDToCard(card);
                        } else if(node.classList && (node.classList.contains('listboxGroup') || (node.classList.contains('scrollable') && node.getAttribute('data-can-drag-to-scroll') === 'true'))) {
                            //console.log("ListboxGroup or Scrollable with data-can-drag-to-scroll=true added, adding Slot IDs to Planner Cards");
                            //console.log(node);
                            addSlotIDsToPlannerCards();
                        }
                    });
                });
            });
            
            // Observe the any changes in the planner
            cardObserver.observe(document.body, { childList: true, subtree: true });

            //--------------------------------------------------

            // Logic for automatically adding a task to the planner

            function setUpAutoCardLogic() {
                const filterTextBox = document.querySelector('.ms-SearchBox-field');

                // find the aria-label="Filter text box" and input the serial number
                if (filterTextBox) {
                    filterTextBox.value = " ";
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    console.log("Filter text box not found.");
                    timeout = setTimeout(setUpAutoCardLogic, 500);
                    return;
                }

                let taskName = GM_SuperValue.get("taskName", "");
                if (taskName === "") {
                    console.log("No taskName found.");
                    return;
                }

                let taskNotes = GM_SuperValue.get("taskNotes", false);
                if (!taskNotes) {
                    console.log("No taskNotes found.");
                    return;
                }

                let detailsData = JSON.parse(GM_SuperValue.get("detailsData", "{}"));
                if (Object.keys(detailsData).length === 0) {
                    console.log("No detailsData found.");
                    return;
                }
                let serialNumber = detailsData['serialNumber'];
                console.log("Serial Number: ", serialNumber);

                // Add the shake animation effect
                const shakeKeyframes = `
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                `;
                const style = document.createElement('style');
                style.innerHTML = shakeKeyframes;
                document.head.appendChild(style);

                // Add pulse animation effect
                const pulseKeyframes = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.01); }
                        100% { transform: scale(1); }
                    }
                `;
                const style2 = document.createElement('style');
                style2.innerHTML = pulseKeyframes;
                document.head.appendChild(style2);

                FindIfCardExists(serialNumber, (container, textContent, columnTitle) => {

                    container.style.animation = 'shake 1s';

                    // Give a slightly animated border, where a glow effect pulses around the card
                    const border = document.createElement('div');
                    border.style.position = 'absolute';
                    border.style.top = '0';
                    border.style.left = '0';
                    border.style.width = '100%';
                    border.style.height = '100%';
                    border.style.border = '2px solid #d40000';
                    border.style.borderRadius = '5px';
                    border.style.pointerEvents = 'none';
                    border.style.boxShadow = '0 0 10px #d40000';
                    border.style.animation = 'glow 1.5s alternate';
                    container.appendChild(border);

                    // Add keyframes for the glow effect
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes glow {
                            from {
                                box-shadow: 0 0 5px #d40000;
                            }
                            to {
                                box-shadow: 0 0 20px #d40000;
                            }
                        }
                    `;
                    document.head.appendChild(style);

                    // Fade out the border after the glow animation
                    setTimeout(() => {
                        border.style.transition = 'opacity 1s';
                        border.style.opacity = '0';
                        container.style.animation = '';
                        setTimeout(() => {
                            border.remove();
                        }, 1000);
                    }, 1500);

                    // Create a notification that the card already exists
                    const notification = document.createElement('div');
                    notification.style.position = 'fixed';
                    notification.style.top = '20px';
                    notification.style.left = '20px';
                    notification.style.backgroundColor = '#ff4d4d'; // Red background
                    notification.style.padding = '10px 20px';
                    notification.style.borderRadius = '5px';
                    notification.style.color = '#fff'; // White text for readability
                    notification.style.fontSize = '14px';
                    notification.style.fontWeight = 'bold';
                    notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Add shadow for sleek look
                    notification.style.transition = 'opacity 0.5s ease'; // Fade effect
                    notification.style.opacity = '0'; // Start hidden
                    notification.innerHTML = `
                        <p>Card already exists.</p>
                        <p>Serial Number: ${serialNumber}</p>
                    `;
                    // Make sure it is always layered on top
                    notification.style.zIndex = '9999';
                    document.body.appendChild(notification);

                    // Fade in the notification
                    setTimeout(() => {
                        notification.style.opacity = '1';
                    }, 10);

                    // Fade out and remove the notification after 5 seconds
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(notification);
                        }, 500); // Wait for fade out transition
                    }, 5000);
                });
                function ResetTaskData() {
                    GM_SuperValue.set('taskName', '');
                    GM_SuperValue.set('taskNotes', '');
                    GM_SuperValue.set('taskComment', '');
                    GM_SuperValue.set('detailsData', '{}');
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
                                const findNewCard_INTERVAL = setInterval(() => {
                                    const newElement = document.querySelector(`[aria-label="${taskName}"]`);
                                    const notesEditor = document.querySelector('.notes-editor');
                                    const commentField = document.querySelector('textarea[aria-label="New comment"]');
                                    if (newElement && !notesEditor) {
                                        // Click the element
                                        newElement.click();
                                    } else {
                                        console.error('New element not found.');
                                    }

                                    // Now add the text to the notes
                                    
                                    if (notesEditor && !notesEditor.inserted) {
                                        // Click the notes editor to focus it and enter editing mode
                                        notesEditor.click();
                                        notesEditor.focus();

                                        // Insert the text into the notes editor
                                        document.execCommand('insertText', false, taskNotes);

                                        notesEditor.inserted = true; // Mark as inserted
                                    } else {
                                        console.error('Notes editor not found.');
                                    }
                                    
                                    // Now lets add the comment to the task for the log
                                    if (commentField && !commentField.inserted) {
                                        commentField.scrollIntoView({ behavior: 'auto', block: 'center' });
                                        commentField.click();
                                        commentField.focus();
                                        commentField.click();

                                        commentField.click();
                                        console.log("Inputting:", GM_SuperValue.get("taskComment", ""));
                                        document.execCommand('insertText', false, GM_SuperValue.get("taskComment", ""));
                                        commentField.inserted = true; // Mark as inserted

                                        // Now find the send button and click it
                                        const sendButton = document.querySelector('.sendCommentButton');
                                        if (sendButton) {
                                            sendButton.click();
                                            clearInterval(findNewCard_INTERVAL);

                                            // We'll now reset the taskName and taskNotes values
                                            GM_SuperValue.set("taskName", "");
                                            GM_SuperValue.set("taskNotes", "");
                                            GM_SuperValue.set("taskComment", "");
                                            GM_SuperValue.set("detailsData", {});

                                        } else {
                                            console.error('Notes editor not found.');
                                        }
                                    }

                                }, 600);
                            } else {
                                console.error('Add task button not found.');
                            }
                        }
                    }
                    typeCharacter();
                }

                let createCardButtons = [];
                function addAutoCardButtons() {

                    let taskName = GM_SuperValue.get("taskName", "");
                    if (taskName === "") {
                        console.log("No taskName found.");
                        return;
                    }

                    // See if we're on a repair page
                    const tooltipHosts = document.querySelectorAll('.ms-TooltipHost');
                    let foundRepair = false;
                    for (const tooltipHost of tooltipHosts) {
                        if (tooltipHost.textContent.includes('Repair')) {
                            foundRepair = true;
                            //console.log('Found tooltipHost with "Repair":', tooltipHost);
                            break;
                        }
                    }
                    if (!foundRepair) {
                        setTimeout(addAutoCardButtons, 1000);
                        return;
                    }

                    const columnsList = document.querySelector('ul.columnsList');
                    if (columnsList) {
                        const columnItems = columnsList.querySelectorAll('li');
                        columnItems.forEach(columnItem => {
                            const columnTitle = columnItem.querySelector('.columnTitle');
                            if (!columnTitle) { return; }

                            const newBucketColumn = columnTitle.getAttribute('title') === 'Add a new bucket';

                            // Column title exists and there is no button already
                            if (!newBucketColumn && columnTitle && !createCardButtons.some(button => button.previousElementSibling === columnTitle)) {
                                const newButton = document.createElement('button');
                                createCardButtons.push(newButton);
                                newButton.textContent = 'Auto-Create Card';
                                newButton.style.marginTop = '6px';
                                newButton.style.marginBottom = '6px';
                                newButton.style.backgroundColor = 'green';
                                newButton.style.color = 'white';
                                newButton.style.border = 'none';
                                newButton.style.padding = '5px 10px';
                                newButton.style.borderRadius = '3px';
                                newButton.style.cursor = 'pointer';
                                newButton.style.textAlign = 'center';
                                newButton.style.display = 'flex';
                                newButton.style.alignItems = 'center';
                                newButton.style.justifyContent = 'center';
                                columnTitle.after(newButton);
                                console.log('Added auto-create card button.');

                                newButton.addEventListener('click', () => {
                                    clickAddTaskButton(columnTitle);
                                });
                            }

                        });
                    }
                    setTimeout(addAutoCardButtons, 500);
                }

                var hasClicked = false;
                function clickAddTaskButton(header) {
                    if(hasClicked) { return; }

                    stopChecking = true;

                    // Remove all the buttons
                    createCardButtons.forEach(button => {
                        button.remove();
                    });

                    // Remove the popup
                    const popup = document.getElementById('autoCreateCardPopup');
                    if (popup) {
                        document.body.removeChild(popup);
                    }
                    
                    //const headers = document.querySelectorAll('.columnTitle');
                    //const header = Array.from(headers).find(el => el.textContent.trim() === 'Diagnosed');
                    
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

                                // Set the value of the text field to the task name
                                textField = container.querySelector('input[placeholder="Enter a task name * (required)"]');
                                if (textField) {
                                    GM_SuperValue.set("taskName", "");
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
                    }

                    return false; // Keep observing for further mutations
                }

                function createAutoCreateCardButton() {
                    const popup = document.createElement('div');
                    popup.id = 'autoCreateCardPopup';
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
                        <p>Slot ID: ${detailsData['locationID']}</p>
                        <button id="cancelButton" style="background-color: red; color: #fff; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
                            Cancel
                        </button>
                    `;

                    // Make sure it is always layered on top
                    popup.style.zIndex = '9999';
                    document.body.appendChild(popup);

                    const cancelButton = document.getElementById('cancelButton');
                    cancelButton.addEventListener('click', () => {
                        // Reset the existingCard
                        if (existingCard) {
                            existingCard.style.transition = 'background-color 1s';
                            existingCard.style.animation = '';
                            existingCard.style.backgroundColor = '';
                            existingCard.style.outline = 'none';
                        }

                        // Remove all the buttons
                        createCardButtons.forEach(button => {
                            button.remove();
                        });

                        ResetTaskData();
                        document.body.removeChild(popup);
                        //window.close();
                    });
                }

                setTimeout(createAutoCreateCardButton, 1000);
                setTimeout(addAutoCardButtons, 500);
            }
            setUpAutoCardLogic();

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
        PlannerCardPage();
    }

    // Return if the URL doesn't match the IP regex
    if (ipURLMatch) { ///cgi-bin/get_system_info.cgi
        let curIP = window.location.hostname;

        // Keep retrying until m-heading is-size-l is-text is found
        function addSlotLink() {
            if(!savedFeatures["slotIDLink"]) { return; }

            const panelSection = document.querySelector('.m-uishell-panel-section');
            let macAddressElement = document.querySelector('.m-stack.m-heading.is-size-xs.is-muted');
            if(macAddressElement) {
                macAddressElement = macAddressElement.textContent.split(': ')[1].trim();
            }

            let currentSiteNames = GM_SuperValue.get("siteNames", {});
            let minerData = null;
            const sortedSiteNames = Object.entries(currentSiteNames).sort((a, b) => b[1] - a[1]);
            
            const headingAGUI = document.querySelector('.miner-type');
            if (panelSection && macAddressElement && macAddressElement !== "") {

                // Loop through the site names and get the snlookup for each site if the timestamp is not older than a day
                for (const [key, value] of sortedSiteNames) {
                    let minerSNLookup = GM_SuperValue.get("minerSNLookup_" + key, {});
                    minerData = Object.values(minerSNLookup).find(data => data.macAddress === macAddressElement);
                    if(minerData) {
                        break;
                    }
                }

                const headingFGUI = panelSection.querySelector('.m-heading.is-size-l.is-muted');
                if (headingFGUI && minerData) {
                    console.log("Miner Data: ", minerData);
                    const slotLink = document.createElement('a');
                    slotLink.href = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerData.minerID}`;
                    slotLink.textContent = `${minerData.slotID}`;
                    slotLink.style.color = '#17b26a';
                    slotLink.style.textDecoration = 'underline';
                    slotLink.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
                    slotLink.style.fontWeight = '600';
                    slotLink.style.fontSize = '12px';
                    slotLink.style.marginLeft = '0px';
                    slotLink.target = '_blank'; // Open in a new tab
                    headingFGUI.parentNode.insertBefore(slotLink, headingFGUI.nextSibling);
                }
            } else if(headingAGUI) {
                const ipHref = 'http://' + curIP + '/cgi-bin/get_system_info.cgi';
                fetchGUIData(ipHref)
                    .then(response => {
                        let responseObject = JSON.parse(response);
                        let macAddress = responseObject.macaddr;
                        console.log("MAC Address: ", macAddress);

                        // Loop through the site names and get the snlookup for each site if the timestamp is not older than a day
                        for (const [key, value] of sortedSiteNames) {
                            let minerSNLookup = GM_SuperValue.get("minerSNLookup_" + key, {});
                            minerData = Object.values(minerSNLookup).find(data => data.macAddress === macAddress);
                            if(minerData) {
                                break;
                            }
                        }

                        if(!minerData || macAddress === undefined) { return; }
                        console.log("Miner Data: ", minerData);
                        const slotLink = document.createElement('a');
                        slotLink.href = `https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${minerData.minerID}`;
                        slotLink.textContent = `${minerData.slotID}`;
                        slotLink.style.color = '#17b26a';
                        slotLink.style.textDecoration = 'underline';
                        slotLink.style.fontFamily = 'Arial, sans-serif';
                        slotLink.style.fontSize = '12px';
                        slotLink.style.position = 'absolute';
                        slotLink.style.top = `${headingAGUI.getBoundingClientRect().bottom + window.scrollY}px`;
                        slotLink.style.left = `${headingAGUI.getBoundingClientRect().left + window.scrollX}px`;
                        slotLink.style.zIndex = '1000'; // Ensure it appears above other elements
                        slotLink.target = '_blank'; // Open in a new tab

                        document.body.appendChild(slotLink);

                        // Add observer on the headingAGUI to adjust it position if it moves
                        const observer = new MutationObserver(() => {
                            slotLink.style.top = `${headingAGUI.getBoundingClientRect().bottom + window.scrollY}px`;
                            slotLink.style.left = `${headingAGUI.getBoundingClientRect().left + window.scrollX}px`;
                        });
                        observer.observe(document, { attributes: true, childList: true, subtree: true });
                })
            } else {
                setTimeout(addSlotLink, 200); // Retry after 200ms if not found
            }
        }

        addSlotLink();

        const quickGoToLog = GM_SuperValue.get('quickGoToLog', false);
        let findLog = false;
        if(quickGoToLog && currentURL.includes(quickGoToLog.ip)) {
            findLog = quickGoToLog.errorText;
            GM_SuperValue.set('quickGoToLog', false);
        }

        // Scan Error Logs Logic
        let homePage = document.getElementById('homePage');

        let clickedAutoRefresh = false;
        let lastTextLog = "";
        function setUpErrorLog() { //(logContent, ) {
            // Locate the log content element
            const logContent = document.querySelector('.log-content') || document.querySelector('.logBox-pre');

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

            // If the log content exists, run the error tab setup
            if(logContent && logContent.textContent.includes("\n")) {
                
                // Scroll to bottom of the log content
                if(savedFeatures["startAtLogBottom"]) {
                    logContent.scrollTop = logContent.scrollHeight;
                }

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
                if (!oldErrorTab && savedFeatures["minerLogErrorsInfo"]) {
                    // Search through the log and locate errors
                    const logText = logContent.innerText;
                    var errorsFound = runErrorScanLogic(logText);

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
                                    errorItem.innerHTML = `<i class="error-detail-ico icon"></i> <span class="itm-name">${error.textReturn}</span>`;

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
                    createErrorTab("Miner Info", errorsFound.filter(error => error.type === "Info"));
                    createErrorTab("Main Errors", errorsFound.filter(error => error.type === "Main"));
                    createErrorTab("Other Errors", errorsFound.filter(error => error.type === "Other"));
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
                if (linkAlreadyExists || !savedFeatures["firmwareLinks"]) { return; }
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

            if(savedFeatures["estimatedLiveTime"]) {
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
        }

        // Call the function to start updating the estimated time
        updateEstimatedTime();

        // Run the check on mutation
        const observer = new MutationObserver((mutations) => {
            let logContent = document.querySelector('.log-content') || document.querySelector('.logBox-pre');
            if(logContent && logContent.textContent.includes("\n") && !logContent.textContent.includes("(x")) {
                let newTextLog = cleanErrors(logContent.textContent);
                if(newTextLog.includes("(x")) {
                    logContent.textContent = newTextLog;
                }
            }

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
    if (currentURL.includes("https://shop.bitmain.com/support/download")){
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

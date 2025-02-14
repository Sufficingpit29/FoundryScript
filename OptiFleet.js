// ==UserScript==
// @name         OptiFleet Additions (Dev)
// @namespace    http://tampermonkey.net/
// @version      6.3.6
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
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/HackyWorkAround.js
// @require      https://foundryoptifleet.com/scripts/axios.min.js
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
if(currentUrl.includes("OptiWatch")) {
    return;
}


const allowedSites = [
    "foundryoptifleet.com",
    "planner",
    "sharepoint",
    "planner.cloud.office",
    "bitmain",
];

console.log("Current URL:", currentUrl);

// See if the URL likly contains a IP address
const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
const ipURLMatch = currentUrl.match(ipRegex);

// Check if the current URL is allowed
const allowedSiteMatch = allowedSites.some(site => currentUrl.includes(site));

if(!ipURLMatch && !allowedSiteMatch) {
    console.log("Script not for this site, exiting...");
    return false;
}

function getPlannerID(string) {
    try {
        const plannerID = string.match(/plan\/([^?]+)/)[1].split('/')[0];
        return plannerID;
    } catch (error) {
        console.log('Error extracting planner ID:', error);
        return null;
    }
}

// Get Task board data
let plannerBuckets = false;
let plannerTasks = false;
const originalFetch = unsafeWindow.fetch;

let planID = false;
// if url has planner in it, like https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad
// extract the TbJIxx_byEKhuMp-C4tXLGUAD3Tb
if(currentUrl.includes('planner')) {
    planID = getPlannerID(currentUrl);
}

// Intercept fetch requests
unsafeWindow.fetch = async function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes(planID) && (url.includes('tasks?') || url.includes('buckets'))) {
        console.log('[Tampermonkey] Intercepting fetch request:', url);

        const response = await originalFetch(...args);
        const clone = response.clone();

        clone.json().then(data => {
            if(url.includes('tasks') && data.value) {
                plannerTasks = data.value;
            } else if(url.includes('buckets') && data.value) {
                plannerBuckets = data.value;
            }
        }).catch(err => {
        });

        return response;
    }

    return originalFetch(...args);
};

const username = 'root';
const password = 'root';
function fetchGUIData(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            user: username,
            password: password,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response.responseText);
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
    'Bad Hashboard Chain': {
        icon: "https://img.icons8.com/?size=100&id=12607&format=png&color=FFFFFF",
        start: ["get pll config err", /Chain\[0\]: find .* asic, times/], // 0
        end: ["stop_mining: soc init failed"],
        conditions: (text) => {
            return text.includes('only find');
        }
    },
    'ASIC Number Error': {
        icon: "https://img.icons8.com/?size=100&id=oirUg9VSEnSv&format=png&color=FFFFFF",
        start: ["Chain[0]: find "],
        end: ["stop_mining: asic number is not right"],
        conditions: (text) => {
            return text.includes('asic number is not right');
        }
    },
    'Fan Speed Error': {
        icon: "https://img.icons8.com/?size=100&id=t7Gbjm3OaxbM&format=png&color=FFFFFF",
        start: ["Error, fan lost,", "Exit due to FANS NOT DETECTED | FAN FAILED", /\[WARN\] FAN \d+ Fail/],
        end: ["stop_mining_and_restart: fan lost", "stop_mining: fan lost", "ERROR_FAN_LOST: fan lost", " has failed to run at expected RPM"]
    },
    'SOC INIT Fail': {
        icon: "https://img.icons8.com/?size=100&id=gUSpFL9LqIG9&format=png&color=FFFFFF",
        start: "ERROR_SOC_INIT",
        end: ["ERROR_SOC_INIT", "stop_mining: soc init failed!"],
        onlySeparate: true
    },
    'EEPROM Error': {
        icon: "https://img.icons8.com/?size=100&id=9040&format=png&color=FFFFFF",
        start: ["eeprom error crc 3rd region", "EEPROM error"],
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
        start: ["chain avg vol drop from", "ERROR_POWER_LOST", "failed to scale voltage up"],
        end: ["power voltage err", "ERROR_POWER_LOST: power voltage rise or drop", "stop_mining_and_restart: power voltage read failed", "power voltage abnormity", "stop_mining: soc init failed", "stop_mining: get power type version failed!", "stop_mining: power status err, pls check!", "stop_mining: power voltage rise or drop, pls check!", "stop_mining: pic check voltage drop"],
    },
    'Temperature Sensor Error': {
        icon: "https://img.icons8.com/?size=100&id=IN6gab7HZOis&format=png&color=FFFFFF",
        start: "Exit due to TEMPERATURE SENSORS FAILED",
    },
    'Temperature Too Low Error': {
        icon: "https://img.icons8.com/?size=100&id=0Bm1Quaegs8d&format=png&color=FFFFFF",
        start: "ERROR_TEMP_TOO_LOW",
        end: "stop_mining",
    },
    'Temp ≤ 0°C|32°F': {
        icon: "https://img.icons8.com/?size=100&id=-uAldka8Jgn4&format=png&color=FFFFFF",
        start: "temp:",
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
    },
    'TSensor Error': {
        icon: "https://img.icons8.com/?size=100&id=123900&format=png&color=FFFFFF",
        start: "fail to read tsensor by iic",
        unimportant: true
    },
    'PIC Temp Error': {
        icon: "https://img.icons8.com/?size=100&id=IN6gab7HZOis&format=png&color=FFFFFF",
        start: "fail to read pic temp",
        unimportant: true
    },
    'Nonce Buffer Full': {
        icon: "https://img.icons8.com/?size=100&id=Hd082AfY0mbD&format=png&color=FFFFFF",
        start: "nonce_read_out buffer is full!",
        unimportant: true
    },
    'Reg Buffer Full': {
        icon: "https://img.icons8.com/?size=100&id=Hd082AfY0mbD&format=png&color=FFFFFF",
        start: "reg_value_buf buffer is full!",
        unimportant: true
    },
    'Reg CRC Error': {
        icon: "https://img.icons8.com/?size=100&id=IzwgH77KrB9L&format=png&color=FFFFFF",
        start: "reg crc error",
        unimportant: true
    },
    'Nonce CRC Error': {
        icon: "https://img.icons8.com/?size=100&id=nMIFbmGDOQri&format=png&color=FFFFFF",
        start: "nonce crc error",
        unimportant: true
    },
    'Hash2_32 Error': {
        icon: "https://img.icons8.com/?size=100&id=0OqFiOxbTdXT&format=png&color=FFFFFF",
        start: "hash2_32 error",
        unimportant: true
    },
    'I2C Error': {
        icon: "https://img.icons8.com/?size=100&id=47752&format=png&color=FFFFFF",
        start: "IIC_SendData checkack",
        unimportant: true
    },
    'Read SDA Error': {
        icon: "https://img.icons8.com/?size=100&id=47752&format=png&color=FFFFFF",
        start: "error! read SDA return 0",
        end: "i2c_check_ack:290 ack error",
        unimportant: true
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
        icon: "https://img.icons8.com/?size=100&id=BqBqC9QVDQrd&format=png&color=FFFFFF",
        start: "defendkey: probe of defendkey failed with error",
        unimportant: true
    },
    'SN File Error': {
        icon: "https://img.icons8.com/?size=100&id=sMVM8zkGFw2r&format=png&color=FFFFFF",
        start: "Open miner sn file /config/sn error",
        unimportant: true
    },
    'Allocate Memory Error': {
        icon: "https://img.icons8.com/?size=100&id=ZbgOH8S7aNFB&format=png&color=FFFFFF",
        start: "failed to allocate memory for node linux",
        unimportant: true
    },
    'Modalias Failure': {
        icon: "https://img.icons8.com/?size=100&id=RdfQcH0NSwo1&format=png&color=FFFFFF",
        start: "modalias failure",
        unimportant: true
    },
    'CLKMSR Failure': {
        icon: "https://img.icons8.com/?size=100&id=T6eNtBzusujD&format=png&color=FFFFFF",
        start: "clkmsr ffd18004.meson_clk_msr: failed to get msr",
        unimportant: true
    },
    'Unpack Failure': {
        icon: "https://img.icons8.com/?size=100&id=4nmZphA6KAL2&format=png&color=FFFFFF",
        start: "Initramfs unpacking failed",
        unimportant: true
    },
    'I2C Device': {
        icon: "https://img.icons8.com/?size=100&id=9078&format=png&color=FFFFFF",
        start: "Failed to create I2C device",
        unimportant: true
    },
    'No Ports': {
        icon: "https://img.icons8.com/?size=100&id=91076&format=png&color=FFFFFF",
        start: "hub doesn't have any ports",
        unimportant: true
    },
    'Thermal Binding': {
        icon: "https://img.icons8.com/?size=100&id=8bhyzQ0ncJqR&format=png&color=FFFFFF",
        start: "binding zone soc_thermal with cdev thermal",
        unimportant: true
    },
    'PTP Init Failure': {
        icon: "https://img.icons8.com/?size=100&id=mtsC9dJebzYW&format=png&color=FFFFFF",
        start: "fail to init PTP",
        unimportant: true
    },
    'Ram Error': {
        icon: "https://img.icons8.com/?size=100&id=2lS2aIm5uhCG&format=png&color=FFFFFF",
        start: "persistent_ram: uncorrectable error in header",
        unimportant: true
    },
    'Pins Error': {
        icon: "https://img.icons8.com/?size=100&id=110969&format=png&color=FFFFFF",
        start: "did not get pins for",
        unimportant: true
    },
    'Bone Capemgr': {
        icon: "https://img.icons8.com/?size=100&id=7WuWQLicqKdy&format=png&color=FFFFFF",
        start: "bone-capemgr bone_capemgr",
        unimportant: true
    },
    'OMAP HSMMC Error': {
        icon: "https://img.icons8.com/?size=100&id=5k62AODVrDXf&format=png&color=FFFFFF",
        start: "omap_hsmmc mmc",
        unimportant: true
    },
    'Dummy Regulator': {
        icon: "https://img.icons8.com/?size=100&id=byEdLu15HrqW&format=png&color=FFFFFF",
        start: "using dummy regulator",
        unimportant: true
    },
}

function runErrorScanLogic(logText) {
    console.log('Running error scan logic');
    console.log('Log text:', logText);
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
                        errorsFound.push({
                            name: error,
                            icon: errorData.icon || "https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF",
                            text: errorText.trimEnd(),
                            start: startIndex,
                            end: endIndex,
                            unimportant: errorData.unimportant || false
                        });
                        setEndIndexAfter = endIndex;

                        // So we know the previous error to remove it if it's found again
                        if (errorData.showOnce) {
                            showOnceErrors[error] = errorsFound.length;
                        }
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

            // Add the error to the list of errors
            errorsFound.push({
                name: 'Unknown Error',
                icon: "https://img.icons8.com/?size=100&id=51Tr6obvkPgA&format=png&color=FFFFFF",
                text: errorText.trimEnd(),
                start: start,
                end: end,
                unimportant: true
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
    'fail to read pic temp for chain'
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

window.addEventListener('load', function () {
    var urlLookupExcel = {};
    const defaultExcelLink = "https://foundrydigitalllc.sharepoint.com/sites/SiteOps/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120008E92A0115CE81A4697B69C652EF13609&id=%2Fsites%2FSiteOps%2FShared%20Documents%2F01%20Site%20Operations%2F01%20Documents%2F01%20Sites%2F05%20Minden%20NE&viewid=dae422b9%2D818b%2D4018%2Dabea%2D051873d09aa3";

    urlLookupExcel["Bitmain"] = GM_SuperValue.get("bitmainLink", defaultExcelLink);
    urlLookupExcel["Fortitude"] = GM_SuperValue.get("fortitudeLink", defaultExcelLink);;
    urlLookupExcel["RAMM"] = GM_SuperValue.get("rammLink", defaultExcelLink);

    const urlLookupPlanner = {
        "Bitmain": "https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/board?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "Fortitude": "https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/board?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "RAMM": "https://planner.cloud.microsoft/webui/plan/FHYUYbYUfkqd2-oSKLk7xGUAHvRz?tid=6681433f-a30d-43cd-8881-8e964fa723ad"
    };

    const urlLookupPlannerGrid = {
        "Fortitude": "https://planner.cloud.microsoft/webui/plan/TbJIxx_byEKhuMp-C4tXLGUAD3Tb/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "RAMM": "https://planner.cloud.microsoft/webui/plan/FHYUYbYUfkqd2-oSKLk7xGUAHvRz/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
        "Bitmain": "https://planner.cloud.microsoft/webui/plan/wkeUw2vf1kqEkw6-XXaSR2UABn4T/view/grid?tid=6681433f-a30d-43cd-8881-8e964fa723ad",
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
                const majorAlertEnable = GM_SuperValue.get("majorAlertEnable", "false") === "true";

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
                            slotID: miner.locationName.replace("Minden_", "")
                        };
                        allMinersLookup[miner.id] = miner;


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

        let updatePlannerCardsData = function() {}; // Placeholder function for the actual function that will be created later

        getPlannerCardData = function() { 
            // Create the iframes for the planner boards
            let plannerKeys = [`Bitmain`, `Fortitude`, `RAMM`];
            let plannerPages = [];
            for (const key of plannerKeys) {
                const url = urlLookupPlannerGrid[key];
                plannerPages.push(url);
            }
            let key = plannerKeys[0];
            const plannerID = getPlannerID(urlLookupPlanner[key]);
            GM_SuperValue.set("plannerPageLoaded_"+plannerID, false);
            GM_SuperValue.set("plannerCardsClosePage_"+plannerID, "searching");
            GM_SuperValue.set("plannerCardsData_Pages", plannerPages);

            const newWindow = window.open(urlLookupPlannerGrid[key], '_blank', 'width=800,height=600');
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
        
        setInterval(function() {
            // Constantly checks if there siteId or companyId changes
            if(getSelectedSiteId() !== siteId || getSelectedCompanyId() !== companyId) {
                //updateAllMinersData(true);
                console.log("Site ID or Company ID has changed.");

                // Reload the page (Just far easier than trying to update the data and handle all the edge cases)
                window.location.reload();
            }
        }, 500);

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
        }

        // SN Scanner Logic
        if(currentUrl.includes("https://foundryoptifleet.com/")) {

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
                console.log('Paste event detected!');
                
                let clipboardData = event.clipboardData || window.clipboardData || unsafeWindow.clipboardData;
                let pastedData = clipboardData.getData('text');
                
                console.log('Pasted data:', `[${pastedData}]`);
                // If that wasn't pasted in an actual input, then we open the miner page
                let hasSpaces = pastedData.includes(' ');
                let activeElement = document.activeElement;
                if(activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && !hasSpaces) {
                    // If the pasted data is a serial number, open the miner page
                    let lookUpMiner = minerSNLookup[pastedData];
                    if(lookUpMiner) {
                        window.open(`https://foundryoptifleet.com/Content/Miners/IndividualMiner?id=${lookUpMiner.minerID}`).focus();
                    } else if(pastedData.length === 17) {
                        createNotification("Miner with serial number " + pastedData + " not found.");
                    }
                }    
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
                const hashRate = modelLiteSplit[1].replace(')', '');
                let modelWithoutParens = model.replace('(', '').replace(')', '');

                minerDetails['type'] = type;
                minerDetails['issue'] = issue;
                minerDetails['log'] = log;
                minerDetails['hashRate'] = hashRate;

                console.log(`${modelLite}_${hashRate}_${serialNumber}_${issue}`);
                console.log(cleanedText);

                console.log("Task Comment:", log);

                // reset this just in case
                GM_SuperValue.set("locatePlannerCard", false);

                GM_SuperValue.set("taskName", `${serialNumber}_${modelLite}_${hashRate}_${issue}`);
                GM_SuperValue.set("taskNotes", cleanedText);
                GM_SuperValue.set("taskComment", log);
                GM_SuperValue.set("detailsData", JSON.stringify(minerDetails));

                const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
                let textToCopy = `${serialNumber}\t${modelLite}\t${hashRate}\t${issue}\t${status}\t${currentDate}`;

                if(type === "Fortitude") {
                    textToCopy = `${serialNumber}\t${modelWithoutParens}\t${hbSerialNumber}\t${hbModel}\t${hbVersion}\t${chainIssue}\t${binNumber}`;
                    GM_SuperValue.set("taskName", `${serialNumber}_${modelLite}_${hashRate}_${issue}_${skuID}`);
                }

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
                    const skuIDContainer = popupElement.querySelector('#skuIDContainer');

                    const normalIssueContainer = popupElement.querySelector('#normalIssueContainer');

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
                    }
                });

                // Hide the Edit Links button for the meantime
                popupElement.querySelector('#linksBtn').style.display = 'none';

                // Function to submit Issue and Log
                function submitIssueLog(onlyPlanner) {
                    const issue = document.getElementById("issue").value;
                    const log = document.getElementById("log").value;
                    const type = document.getElementById("type").value;

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
                document.getElementById('submitBtn1').addEventListener('click', function() {
                    submitIssueLog(false);
                });
                document.getElementById('submitBtn2').addEventListener('click', function() {
                    submitIssueLog(true);
                });
                document.getElementById('cancelBtn').addEventListener('click', cancelIssueLog);
                document.getElementById('linksBtn').addEventListener('click', editLinks);
            }

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
                        console.log("Secondary Text:", secondaryText);
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

                if (!container.querySelector('.copyAllBtn')) {
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

                if (!container.querySelector('.sharepointPasteBtn') && siteName.includes("Minden")) {
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
            
            function addMutationObserver() {
                const observer = new MutationObserver(() => {
                    //fixAccountWorkerFormatting();
                    addCopyButtonsToElements();
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }

            //addCopyButtonsToElements();
            addMutationObserver();
            
            // Add "Log" Tab
            const tabsContainer = document.querySelector('.tabs');
            const quickIPGrabTab = document.createElement('div');
            quickIPGrabTab.id = 'quickIPGrabTab';
            quickIPGrabTab.className = 'tab';
            quickIPGrabTab.custom = true;
            quickIPGrabTab.innerText = 'Current Log';
            quickIPGrabTab.style.float = 'right';
            quickIPGrabTab.style.cssText = `
                margin-left: auto;
                margin-right: 0px;
            `;
            quickIPGrabTab.onclick = function() {
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
                        
                        const ipHref = ipElement.href.replace('root:root@', '') + '/cgi-bin/log.cgi';
                        fetchGUIData(ipHref)
                            .then(responseText => {
                                // Remove the loading text and spinner
                                customTabContainer.removeChild(loadingText);
                                customTabContainer.removeChild(loadingSpinner);

                                // Create a sleek log element
                                const logElement = document.createElement('div');
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
                                responseText = cleanErrors(responseText);
                                let orignalLogText = responseText;
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

                                // Create the error tabs
                                const logText = logElement.innerText;
                                var errorsFound = runErrorScanLogic(logText);
                                if(errorsFound.length === 0) {
                                    return;
                                }

                                // Add divider to m-nav
                                const mnav = document.querySelector('.m-nav');
                                const divider = document.createElement('div');
                                divider.className = 'm-divider has-space-m';
                                divider.classList.add('error-divider');
                                mnav.appendChild(divider);
            
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
                                            <a href="#" class="m-nav-item" data-error-index="${index}">${error.name}</a>
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
                                    errorItems.forEach(item => {
                                        item.addEventListener('click', (event) => {
                                            event.preventDefault();
                                            const errorIndex = event.target.getAttribute('data-error-index');
                                            const error = errors[errorIndex];
                                            handleErrorClick(error, orignalLogText);
                                        });
                                    });
                                
                                    mnav.appendChild(errorTab);
                                    return errorTab;
                                }
                                
                                function handleErrorClick(error, orignalLogText) {
                                    // Reset log text
                                    while (logElement.firstChild) {
                                        logElement.removeChild(logElement.firstChild);
                                    }
                                    logElement.textContent = orignalLogText;
                                
                                    // Create a new element to highlight the error
                                    const errorElement = document.createElement('span');
                                    errorElement.style.backgroundColor = '#FF2323';
                                    
                                    const errorTextNode = document.createElement('span');
                                    errorTextNode.style.fontWeight = 'bolder';
                                    errorTextNode.style.textShadow = '1px 1px 2px black';
                                    errorTextNode.style.color = 'white';
                                    errorTextNode.textContent = error.text;
                                    errorElement.appendChild(errorTextNode);
                                    errorElement.style.width = logElement.scrollWidth + 'px';
                                    errorElement.style.display = 'block';
                                
                                    // Create a copy button
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
                                
                                    copyButton.addEventListener('mouseover', () => {
                                        copyButton.style.color = 'green';
                                    });
                                
                                    copyButton.addEventListener('mouseout', () => {
                                        copyButton.style.color = 'black';
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
                                

                                const mainTab = createErrorTab("Main Errors", errorsFound.filter(error => !error.unimportant), true);
                                const otherTab = createErrorTab("Other Errors", errorsFound.filter(error => error.unimportant));

                                // Scroll to show new tabs
                                otherTab.scrollIntoView({ behavior: 'smooth', block: 'end' });

                                // Scroll to show console log
                                logElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }, 500);


                /*
                // Get id from url
                const urlParams = new URLSearchParams(window.location.search);
                const minerID = urlParams.get('id').toString();
                console.log("Miner ID:", minerID);

                let waitForMinerData = setInterval(() => {
                    // Make sure allMinersData is loaded
                    if (Object.keys(allMinersLookup).length > 0) {
                        clearInterval(waitForMinerData);
                    } else {
                        return;
                    }

                    // Get the miner data
                    const currentMiner = allMinersLookup[minerID];
                    console.log(currentMiner);
                    const minerIP = currentMiner.ipAddress;

                    // Start scan logic
                    GM_SuperValue.set('errorsFound', {});
                    let guiLink = `http://root:root@${minerIP}/#blog`;
                    if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                        guiLink = `http://root:root@${minerIP}/#/logs`;
                    }
                    GM_SuperValue.set('currentlyScanning', {[minerIP]: currentMiner});
                    let logWindow = window.open(guiLink, '_blank', 'width=1,height=1,left=0,top=' + (window.innerHeight - 400));

                    // Wait for the miner gui to load
                    let loaded = false;
                    let currentCheckLoadedInterval = setInterval(() => {
                        const errorsFound = GM_SuperValue.get('errorsFound', false);
                        if(errorsFound && errorsFound[currentMiner.id]) {
                            loaded = true;
                            const minerErrors = errorsFound[currentMiner.id] || [];
                            clearInterval(currentCheckLoadedInterval);
                            
                            GM_SuperValue.set('currentlyScanning', {});

                            // Close the log window
                            logWindow.close();

                            // Remove the loading spinner and text
                            customTabContainer.removeChild(loadingText);
                            customTabContainer.removeChild(loadingSpinner);

                            // Create a list of errors
                            const errorList = document.createElement('div');
                            errorList.style.width = '100%';
                            errorList.style.maxHeight = 'calc(100% - 50px)';
                            errorList.style.overflowY = 'auto';
                            errorList.style.padding = '20px';
                            errorList.style.border = '1px solid #444';
                            errorList.style.borderRadius = '10px';
                            errorList.style.marginTop = '20px';
                            errorList.style.backgroundColor = '#222';
                            errorList.style.display = 'flex';
                            errorList.style.flexDirection = 'column';
                            errorList.style.alignItems = 'center';

                            const errorTitle = document.createElement('h2');
                            errorTitle.textContent = 'Errors Found';
                            errorTitle.style.marginBottom = '20px';
                            errorTitle.style.color = '#fff';
                            errorList.appendChild(errorTitle);

                            minerErrors.forEach(error => {
                                const errorContainer = document.createElement('div');
                                errorContainer.style.display = 'flex';
                                errorContainer.style.alignItems = 'center';
                                errorContainer.style.width = '100%';
                                errorContainer.style.padding = '10px';
                                errorContainer.style.marginBottom = '10px';
                                errorContainer.style.borderBottom = '1px solid #444';

                                const errorIcon = document.createElement('img');
                                errorIcon.src = error.icon;
                                errorIcon.style.width = '40px';
                                errorIcon.style.height = '40px';
                                errorIcon.style.marginRight = '20px';
                                errorContainer.appendChild(errorIcon);

                                const errorText = document.createElement('div');
                                errorText.style.display = 'flex';
                                errorText.style.flexDirection = 'column';
                                errorText.style.width = '100%';

                                const errorName = document.createElement('h3');
                                errorName.textContent = error.name;
                                errorName.style.marginBottom = '5px';
                                errorName.style.color = '#fff';
                                errorText.appendChild(errorName);

                                const errorShort = document.createElement('p');
                                errorShort.textContent = error.short;
                                errorShort.style.marginBottom = '5px';
                                errorShort.style.color = '#bbb';
                                errorText.appendChild(errorShort);

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
                                    GM_SuperValue.set('quickGoToLog', {ip: ip, errorText: error.text, category: error.category});
                                    window.open(guiLink, '_blank');
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

                                errorContainer.appendChild(errorText);
                                errorList.appendChild(errorContainer);
                            });

                            customTabContainer.appendChild(errorList);
                        }
                    }, 10);

                    setTimeout(() => {
                        if (!loaded && currentCheckLoadedInterval) {
                            let failText = "Failed to load miner GUI.";
                            if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                failText = "Failed to load miner GUI or got stuck on Username/Password prompt.";
                            }

                            clearInterval(currentCheckLoadedInterval);

                            const errorsFound = GM_SuperValue.get('errorsFound', {});
                            errorsFound[currentMiner.id] = [{
                                name: failText,
                                short: "GUI Load Fail",
                                icon: "https://img.icons8.com/?size=100&id=111057&format=png&color=FFFFFF"
                            }];
                            GM_SuperValue.set('errorsFound', errorsFound);
                            GM_SuperValue.set('currentlyScanning', {});

                            // Close the log window
                            logWindow.close();
                        }
                    }, 16000);
                }, 200);
                
                */
            };
            
            tabsContainer.appendChild(quickIPGrabTab);

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

                                    // If it goes off the screen, move it back on
                                    if (event.clientX + contextMenu.offsetWidth > window.innerWidth) {
                                        contextMenu.style.left = (window.innerWidth - contextMenu.offsetWidth) + 'px';
                                    }
                                    if (event.clientY + contextMenu.offsetHeight > window.innerHeight) {
                                        contextMenu.style.top = (window.innerHeight - contextMenu.offsetHeight) + 'px';
                                    }
                                }
                            });
                        }

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
                    });
                }
            }

            // Wait until HTML element with #minerList is loaded
            function addBreakerNumberToSlotID() {
                const minerListCheck = setInterval(() => {
                    const minerList = document.querySelector('#minerList');
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
                            console.log("Updating Planner Cards Data");
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
                        
                        // Add mutation observer to the minerList
                        const observer = new MutationObserver(() => {
                            getCurrentMinerList();
                            
                            // Loop through all the Slot ID elements and add the Breaker Number and Container Temp
                            for (const [minerID, minerData] of Object.entries(minersListTableLookup)) {
                                const modelCell = minerData['Model'];
                                const slotIDCell = minerData['Slot ID'];
                                const statusCell = minerData['Status'];

                                // Get the serial number from the model cell, second child is the serial number
                                const serialNumber = modelCell.children[1].innerText;
                                const slotID = slotIDCell.innerText;
                                const status = statusCell.innerText;
                                //console.log("serialNumber", serialNumber);

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
                            
                            if(siteName.includes("Minden")) {
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
                                        // This is very broken and messed up now
                                        const containerTemp = containerTempData[containerNum].temp.toFixed(2);
                                        let statsElement = minerData['Stats'].querySelector('.miner-stats');
                                        if(!statsElement) {
                                            statsElement = minerData['Stats'];
                                        }
                                        let curTextContent = "";
                                        if(statsElement.children.length > 0) {
                                            curTextContent = statsElement.children[0].textContent;
                                        }
                                        // random test number between 0 and 100
                                        if (containerTemp && !curTextContent.includes('C')) { // doesn't contain added text already
                                        
                                            //statsElement.children[0].textContent = "Boards: " + curTextContent;

                                            var newElement = document.createElement('div');
                                            newElement.innerHTML = `<span>C${containerText}:</span> <span>${containerTemp}F</span>`;
                                            statsElement.prepend(newElement);

                                            // Set the text color of the temp based on the container temp
                                            const tempSpans = newElement.querySelectorAll('span');
                                            const tempSpan1 = tempSpans[0];
                                            const tempSpan2 = tempSpans[1];
                                            tempSpan1.style.color = '#B2B2B8';
                                            if (containerTemp > 80) {
                                                tempSpan2.style.color = 'red';
                                                tempSpan2.textContent += ' 🔥';
                                            } else if (containerTemp > 70) {
                                                tempSpan2.style.color = 'yellow';
                                                tempSpan2.textContent += ' ⚠️';
                                            } else if (containerTemp <= 25) {
                                                tempSpan2.style.color = '#38a9ff';
                                                tempSpan2.textContent += ' ❄️';
                                            } else {
                                                tempSpan2.style.color = 'white';
                                            }
                                        }
                                    }
                                }); 
                            }
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
                                        const minTemp = 25;
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
                                        const cols = ['IP', 'Miner', 'Offline Count', 'Overall Hash Efficiency', 'Online Hash Efficiency', 'Slot ID', 'Serial Number'];
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

                                                const csvHeader = ['IP', 'Miner', 'Offline Count', 'Overall Hash Efficiency', 'Online Hash Efficiency', 'Slot ID', 'Serial Number'];
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
                                    <input type="checkbox" id="fastScan" style="margin-right: 10px;">
                                    <label for="fastScan">Fast Scan</label>
                                </div>
                            </div>
                        </div>
                    `;

                    // If includeOtherErrors data is saved, set the checkbox to checked
                    if (GM_SuperValue.get('includeOtherErrors', false)) {
                        errorScanDropdown.querySelector('#includeOtherErrors').checked = true;
                    }

                    // If fastScan data is saved, set the checkbox to checked
                    if (GM_SuperValue.get('fastScan', false)) {
                        errorScanDropdown.querySelector('#fastScan').checked = true;
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

                    // Add event listener for the fastScan m-menu-item
                    let fastScanMenu = errorScanDropdown.querySelector('.m-menu-item:nth-child(4)');
                    fastScanMenu.addEventListener('click', function(event) {
                        const checkbox = errorScanDropdown.querySelector('#fastScan');
                        if (event.target === fastScanMenu) {
                            checkbox.checked = !checkbox.checked;
                        }
                        GM_SuperValue.set('fastScan', checkbox.checked);
                    });


                    // Add the auto reboot button to the right of the dropdown
                    actionsDropdown.before(errorScanDropdown);

                    errorScan = function(allScan) {
                        let fastScan = GM_SuperValue.get('fastScan', false);
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
                            offlineMiners = issueMiners.filter(miner => miner.statusName === 'Offline');
                            if(!allScan) {
                                issueMiners = issueMiners.filter(miner => miner.hashrate === 0 || miner.issueType === 'Non Hashing');
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
                                if (fastScan) {
                                    addToProgressLog(currentMiner);
                                    //console.log(`Fast scanning miner: ${minerIP}`);
                                    let ipHref = `http://${minerIP}/cgi-bin/log.cgi`;
                                    fetchGUIData(ipHref)
                                        .then(responseText => {
                                            responseText = cleanErrors(responseText);
                                            //console.log(`Received response for miner: ${minerIP}`);
                                            let errorsFound = runErrorScanLogic(responseText);
                                            if(!GM_SuperValue.get('includeOtherErrors', false)) {
                                                errorsFound = errorsFound.filter(error => !error.unimportant);
                                            }
                                            //console.log("Errors Found:", errorsFound);
                                            if(errorsFound.length > 0) {
                                                const errorsFoundObj = GM_SuperValue.get('errorsFound', {});
                                                errorsFoundObj[currentMiner.id] = errorsFound;
                                                GM_SuperValue.set('errorsFound', errorsFoundObj);
                                                setPreviousLogDone(currentMiner.id, "✔", errorsFound.map(error => `• ${error.name}`).join('\n'));
                                            } else {
                                                setPreviousLogDone(currentMiner.id, "✔", "No Errors Found");
                                                noErrorCount++;
                                            }

                                            // Clear the responseText to free up memory
                                            responseText = null;

                                            errorScanMiners.shift();
                                            openMinerGUILog();
                                        })
                                        .catch(error => {
                                            //console.log(`Error fetching data for miner: ${minerIP}`, error);
                                            setPreviousLogDone(currentMiner.id, "✖", "Failed to load miner GUI.");
                                            failLoadCount++;
                                            errorScanMiners.shift();
                                            openMinerGUILog();
                                        });
                                } else {
                                    let guiLink = `http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/#blog`;
                                    if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                        guiLink = `http://${currentMiner.username}:${currentMiner.passwd}@${minerIP}/#/logs`;
                                    }
                    
                                    //console.log("Opening miner GUI for:", currentMiner);
                                    //console.log("GUI Link:", guiLink);
                    
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
                                        const errorsFound = GM_SuperValue.get('errorsFound', false);
                                        if(errorsFound && errorsFound[currentMiner.id]) {
                                            loaded = true;
                                            const minerErrors = errorsFound[currentMiner.id] || [];
                                            let errorNames = "";
                                            minerErrors.forEach(error => {
                                                errorNames += `• ${error.name}\n`;
                                            });
                                            if(errorNames === "") {
                                                errorNames = "No Errors Found";
                                                noErrorCount++;
                                            }
                                            setPreviousLogDone(currentMiner.id, "✔", errorNames);
                                            clearInterval(currentCheckLoadedInterval);
                                            delete currentlyScanning[minerIP];
                                            GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                            openedWindows[currentWindowIndex].nextReady = true;
                                            errorScanMiners.shift();
                                            openMinerGUILog();
                                        }
                                    }, 10);
                    
                                    setTimeout(() => {
                                        if (!loaded && currentCheckLoadedInterval) {
                                            openedWindows[currentWindowIndex].window.location.reload();
                                        }
                                    }, 6000);
                    
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
                    
                                            delete currentlyScanning[minerIP];
                                            GM_SuperValue.set('currentlyScanning', currentlyScanning);
                                            openedWindows[currentWindowIndex].nextReady = true;
                                            errorScanMiners.shift();
                                            openMinerGUILog();
                                        }
                                    }, 16000);
                                }
                            }
                            
                            for (let i = 0; i < maxScan; i++) {
                                openMinerGUILog();
                            }
                    
                            const checkScanDoneInterval = setInterval(() => {
                                let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                                if(errorScanMiners.length === 0 && Object.keys(currentlyScanning).length === 0) {
                                    if(Object.keys(errorsFoundSave).length === 0) {
                                        clearInterval(scanningInterval);
                                        scanningText.textContent = '[No errors found]';
                                    }
                    
                                    clearInterval(checkScanDoneInterval);
                    
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
                                                        ${error.name}
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
                                                    if(currentMiner.firmwareVersion.includes('BCFMiner')) {
                                                        GUILink = `http://${currentMiner.username}:${currentMiner.passwd}@${ip}/#/logs`;
                                                    }
                                                    GM_SuperValue.set('quickGoToLog', {ip: ip, errorText: error.text, category: error.category});
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
                    
                                                let iconLinks = [];
                                                if(errorData) {
                                                    errorData.forEach(error => {
                                                        if(!iconLinks.find(icon => icon.icon === error.icon)) {
                                                            iconLinks.push({icon: error.icon, count: 1, name: error.name});
                                                        } else {
                                                            iconLinks.find(icon => icon.icon === error.icon).count++;                                                            
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
                                                    errorCountText = errorData[0].short || errorData[0].name || "Error Count: ?";
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
                        //actionsDropdown.before(fullAutoRebootButton);
                        
                        // Create a 'getPlannerCardData' button to the right of the dropdown
                        const updatePlannerCardsDropdown = document.createElement('div');
                        updatePlannerCardsDropdown.classList.add('op-dropdown');
                        updatePlannerCardsDropdown.style.display = 'inline-block';
                        updatePlannerCardsDropdown.innerHTML = `
                            <button id="btnNewAction" type="button" class="m-button" onclick="issues.toggleDropdownMenu('updatePlannerCardsDropdown'); return false;">
                                Refresh Planner Cards
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
                            getPlannerCardData();
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
                h3.style.color = '#70707b';
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

            let lastContainer = "";
            let currentTempBox = null;
            function CreateTemperatureDataBox() {
                currentTempBox = addDataBox("Temperature", "Loading...", (mBox, h3, p) => {
                    if (mBox) {
                        retrieveContainerTempData((containerTempData) => {
                            var containerElement = document.querySelector('#zoneList');
                            if (containerElement) {
                                const shadowRoot = containerElement.shadowRoot;
                                const selectedOption = shadowRoot.querySelector('option[selected]');
                                const containerText = selectedOption.textContent.trim();
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

            // Add observer to detect when the container changes via #zoneList
            const observer = new MutationObserver((mutationsList, observer) => {
                var containerElement = document.querySelector('#zoneList');
                if (containerElement) {
                    const shadowRoot = containerElement.shadowRoot;
                    const selectedOption = shadowRoot.querySelector('option[selected]');
                    const containerText = selectedOption.textContent.trim();
                    if (containerText !== lastContainer) {
                        lastContainer = containerText;
                        if(currentTempBox) {
                            currentTempBox.remove();
                        }
                        CreateTemperatureDataBox();
                    }
                }
            });

            // Start observing the container
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // Add temps for all containers if in overview page and are in minden
        if(currentUrl.includes("https://foundryoptifleet.com/Content/Dashboard/SiteOverview") && siteName.includes("Minden")) {
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
                        const tempElement = document.createElement('div');
                        tempElement.className = 'temp-text-title';
                        tempElement.innerText = 'Temperature:';
                        tempElement.style.marginTop = '10px';
                        // set the color to a light orange
                        tempElement.style.color = '#ff7f50';
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
                                tempElement.textContent += ' 🔥';
                            } else if (tempValue > 70) {
                                tempElement.style.color = 'yellow';
                                tempElement.textContent += ' ⚠️';
                            } else if (tempValue <= 25) {
                                tempElement.style.color = '#38a9ff';
                                tempElement.textContent += ' ❄️';
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
                    <p>Slot ID: ${detailsData['locationID']}</p>
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
                                GM_SuperValue.set('taskName', '');
                                GM_SuperValue.set('taskNotes', '');
                                GM_SuperValue.set('taskComment', '');
                                GM_SuperValue.set('detailsData', {});
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

    } else if (currentUrl.includes("planner.cloud.microsoft")) {

        function PlannerCardPage() {
            const filterTextBox = document.querySelector('input[aria-label="Filter text box"]');
            if (!filterTextBox) {
                setTimeout(() => {
                    PlannerCardPage();
                }, 100);
                return;
            }

            // Inital reset since it weirdly will sort of half remember the last input without displaying it?
            filterTextBox.value = '';
            filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));

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
                    filterTextBox.value = serialNumber;
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log("Inputting serial number into filter text box:", serialNumber);
                }

                // Set background color to the filter text box
                filterTextBox.style.transition = 'background-color 0.8s';
                filterTextBox.style.backgroundColor = '#c3b900';

                // Set horizontal scroll to a bit more each time
                if(curTry >= 4) {
                    document.querySelector('.columnsList').scrollBy({ left: 100, behavior: 'smooth' });
                }

                // Get all the cards and scroll to it if the same serial number is found
                const cards = document.querySelectorAll('.taskCard');
                curTry++;
                console.log("Checking for card with serial number:", serialNumber);
                
                if (curTry >= maxTries) {
                    console.log("Max tries reached, card not found.");

                    // Reset the search bar
                    filterTextBox.value = '';
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    // Set search bar color
                    filterTextBox.style.backgroundColor = 'red';
                    timeout = setTimeout(() => {
                        filterTextBox.style.backgroundColor = '';
                    }, 1000);
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
                        if(columnTitle_Card !== columnTitle) {
                            return;
                        }
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
            let plannerID = getPlannerID(currentUrl); //.match(/plan\/([^?]+)/)[1].split('/')[0];
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
                    return;
                }

                if(!plannerTasks || !plannerBuckets) {
                    setTimeout(collectPlannerCardData, 100);
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
                    bucketNameLookup[bucket.id] = bucket.name;
                });

                // Loop through plannerTasks array
                plannerTasks.forEach(task => {
                    const completedDateTime = task.completedDateTime;
                    if (completedDateTime) {
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
                        let lastModified = new Date(lastModifiedDateTime);
                        let lastModifiedCard = new Date(cardExists.lastModified);
                        // If the last modified date is older than our already stored date, then skip
                        if (lastModified < lastModifiedCard) {
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
                const taskCards = document.querySelectorAll('.taskCard');
                taskCards.forEach(card => {
                    addSlotIDToCard(card);
                });
            }

            // Keep trying to add the slot ID to the cards until there are taskCards
            function wonkyEdgeCaseFixForSlotIDs() {
                const taskCards = document.querySelectorAll('.taskCard');
                if (taskCards.length === 0) {
                    setTimeout(() => {
                        wonkyEdgeCaseFixForSlotIDs();
                    }, 500);
                    return;
                }

                addSlotIDsToPlannerCards();
            }
            wonkyEdgeCaseFixForSlotIDs();
            
            // Set up only run addSlotIDToCard when either a card is changed/added
            const cardObserver = new MutationObserver((mutationsList, observer) => {
                if (window !== window.top) {
                    return;
                }
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        //console.log("Node Added: ", node);
                        if (node.classList && node.classList.contains('taskBoardCard')) {
                            let card = node.querySelector('.taskCard');
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
                const filterTextBox = document.querySelector('input[aria-label="Filter text box"]');

                // find the aria-label="Filter text box" and input the serial number
                if (filterTextBox) {
                    filterTextBox.value = "";
                    filterTextBox.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    console.log("Filter text box not found.");
                    timeout = setTimeout(setUpAutoCardLogic, 500);
                    return;
                }

                console.log("Setting up Auto Card Logic");
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
                                    if (newElement) {
                                        clearInterval(findNewCard_INTERVAL);
                                        // Click the element
                                        newElement.click();

                                        // Now add the text to the notes
                                        const findNotesEditor_INTERVAL = setInterval(() => {
                                            const notesEditor = document.querySelector('.notes-editor');
                                            if (notesEditor) {
                                                clearInterval(findNotesEditor_INTERVAL);

                                                // Click the notes editor to focus it and enter editing mode
                                                notesEditor.click();
                                                notesEditor.focus();

                                                // Change the notes editor's background color to red for testing
                                                //notesEditor.style.backgroundColor = 'red';

                                                // Insert the text into the notes editor
                                                document.execCommand('insertText', false, taskNotes);

                                                const findAddCommentButton_INTERVAL = setInterval(() => {
                                                    // Now lets add the comment to the task for the log
                                                    const commentField = document.querySelector('textarea[aria-label="New comment"]');
                                                    if (commentField) {
                                                        clearInterval(findAddCommentButton_INTERVAL);

                                                        commentField.scrollIntoView({ behavior: 'auto', block: 'center' });
                                                        commentField.click();
                                                        commentField.focus();
                                                        commentField.click();
                                                        setTimeout(() => {
                                                            commentField.click();
                                                            console.log("Inputting:", GM_SuperValue.get("taskComment", ""));
                                                            document.execCommand('insertText', false, GM_SuperValue.get("taskComment", ""));

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
                                                        }, 400);
                                                    }

                                                    
                                                }, 400);

                                            } else {
                                                console.error('Notes editor not found.');
                                            }
                                        }, 600);
                                    } else {
                                        console.error('New element not found.');
                                    }
                                }, 600); // Add a 500ms delay before locating the new element
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
                
                if(!isFoundry) {
                    // 12 second timeout to refresh the page
                    setTimeout(() => {
                        window.location.reload();
                    }, 7000);
                }
             }
         }
 
        let loadedFoundryGUI = false;
        if (isFoundry) {
            function clickCategory() {
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
                logContent.scrollTop = logContent.scrollHeight;

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

                    createErrorTab("Main Errors", errorsFound.filter(error => !error.unimportant));
                    createErrorTab("Other Errors", errorsFound.filter(error => error.unimportant));
                    if(isScanning && logContent && logContent.textContent.includes("\n")) {
                        const minerID = foundMiner.id;
                        let errorsFoundSave = GM_SuperValue.get('errorsFound', {});
                        if(GM_SuperValue.get('includeOtherErrors', false)) {
                            errorsFoundSave[minerID] = errorsFound;
                        } else {
                            errorsFoundSave[minerID] = errorsFound.filter(error => !error.unimportant) || [];
                        }
                        

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
                        //GM_SuperValue.set('minerGUILoaded_' + foundMiner.id, true);
                        console.log('Errors found and saved');
                    }
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

// ==UserScript==
// @name         Opti-Report
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  Adds an Opti-Report panel to the page with auto screenshot capabilities.
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/Content/*
// @icon         https://foundryoptifleet.com/img/favicon-32x32.png
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/refs/heads/main/OptiReport.js
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/refs/heads/main/OptiReport.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==


window.addEventListener('load', function () {

    const imageSeparatorHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAC8gAAAATCAYAAAD2gMU2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGpSURBVHhe7dyxTcNQEAbge3bBBIyBRCZgBSpKUqdDiIo9oKFBVAlbsEV2QBnASM7jTGxFSJQRBOn7pF++e+95g9MFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcDCr8zJWX/bNcraIUh/Hro+omdJmPb3ZZoa6yXxkTjIAAAAAAAAAAAAAAPDb6vgtUetzdN1dzNebEquzy4j2Ji8udvff7H8CAAAAAAAAAAAAAIDj9B5Rb5uI9iqbn4bjB8NgvOF4AAAAAAAAAAAAAACO2WlEuW4i+tds3nZnAAAAAAAAAAAAAADw7wwb5F/22+GXs0WU+pDVdFYztscDAAAAAAAAAAAAAPCXtpkm02eGGfehntSo9Sm67j7m6814BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxaxCeiVSoY99t7uwAAAABJRU5ErkJggg==" alt="" style="display:block; margin: 5px 2.5% 15px 2.5%; width: 100%; height:auto;">`;
    const workAroundLineBreakHTML = `<p style="margin: 0; padding: 0; line-height: 0;">&nbsp;</p>`;

    // Pre-parse the workAroundLineBreakHTML to an element for efficient reuse
    const workAroundLineBreakElement = (() => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = workAroundLineBreakHTML;
        return tempDiv.firstChild;
    })();

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
        fromType = fromType || 'H'; // Default to 'H' if fromType is not provided
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

    const userID = localStorage.getItem("OptiFleetID");
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    async function getMinerData(callback) {
        let sleepCount = 0;
        let siteId = localStorage.getItem("selectedSite");
        let siteName = localStorage.getItem("selectedSiteName");
        let companyId = localStorage.getItem("selectedCompany");
        try {
            if (!userID || !siteId || !companyId) {
                console.error('Missing userID or site details for getMinerData for site:', siteName);
                return 0; // Return 0 if essential details are missing
            }
            const url = `https://foundryoptifleet.com/api/MinerInfo?siteId=${siteId}&zoneId=-1&zoneName=All%20Zones&userId=${userID}&companyFilter=${companyId}`;
            console.log('Fetching Miner Data URL:', url);
            const resp = await fetchData(url);
            if (!resp) {
                console.error('No response from fetchData for miner data.');
                return 0; // Return 0 if no response
            } else if(callback) {
                callback(resp);
            }
        } catch (error) {
            console.error(`Error fetching miner data for site ${siteName}:`, error);
        }
        return sleepCount;
    }

    const PANEL_ID = 'opti-report-panel-overlay';
    const PROGRESS_OVERLAY_ID = 'opti-report-progress-overlay';
    let metricsReportWindow = null;
    let cancelMetricsFetchFlag = false;

    // --- Function to disable mouse inputs in a given window ---
    function disableMouseInputsInWindow(targetWindow) {
        if (targetWindow && targetWindow.document && targetWindow.document.head) {
            const styleId = 'opti-report-pointer-blocker';
            // Check if the style element already exists
            if (targetWindow.document.getElementById(styleId)) {
                // console.log('[Opti-Report] Pointer blocker style already present in target window.');
                return;
            }
            const style = targetWindow.document.createElement('style');
            style.id = styleId;
            style.textContent = 'html, body { pointer-events: none !important; }';
            targetWindow.document.head.appendChild(style);
            console.log('[Opti-Report] Applied CSS to disable pointer events in target window.');
        } else {
            console.warn('[Opti-Report] Could not disable mouse inputs: target window or its document/head is not available.');
        }
    }

    // Function to get the selected site name from localStorage
    function getSelectedSiteName() {
        return localStorage.getItem("selectedSiteName");
    }

    // Function to create and inject the new button
    function createOptiReportButton() {
        let newButton = document.createElement('a');
        newButton.href = '#';
        newButton.className = 'm-nav-item'; // Use existing class for styling consistency
        newButton.innerHTML = '<m-icon name="file-pie-chart" size="l"></m-icon> Opti-Report';

        // Find the Site Map element to insert the button after
        let siteMapElement = document.querySelector('a[href="/Content/Dashboard/Miners/Map"]');

        if (siteMapElement && siteMapElement.parentNode) {
            siteMapElement.parentNode.insertBefore(newButton, siteMapElement.nextSibling);
        } else {
            // Fallback: attempt to append to a general nav container if specific element isn't found
            const navContainer = document.querySelector('.m-nav-bar .m-nav-items');
            if (navContainer) {
                navContainer.appendChild(newButton);
            } else {
                console.warn('Opti-Report: Could not find a suitable place to insert the button.');
            }
        }

        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            openOptiReportPanel();
        });
    }

    // --- Progress UI Functions ---
    function showProgressOverlay(message) {
        let overlay = document.getElementById(PROGRESS_OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = PROGRESS_OVERLAY_ID;
            GM_addStyle(`
                #${PROGRESS_OVERLAY_ID} {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: #333;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    z-index: 20000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }
                #${PROGRESS_OVERLAY_ID} p { margin: 0 0 10px 0; }
                #${PROGRESS_OVERLAY_ID} button {
                    background-color: #f44336; color: white; border: none;
                    padding: 8px 12px; border-radius: 3px; cursor: pointer;
                }
            `);
            const messageElement = document.createElement('p');
            messageElement.id = 'opti-report-progress-message';
            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.onclick = () => {
                cancelMetricsFetchFlag = true;
                if (metricsReportWindow && !metricsReportWindow.closed) {
                    metricsReportWindow.close();
                }
                hideProgressOverlay();
            };
            overlay.appendChild(messageElement);
            overlay.appendChild(cancelButton);
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'block';
        document.getElementById('opti-report-progress-message').innerText = message;
    }

    function updateProgressMessage(message) {
        const msgElement = document.getElementById('opti-report-progress-message');
        if (msgElement) {
            msgElement.innerText = message;
        }
    }

    function hideProgressOverlay() {
        const overlay = document.getElementById(PROGRESS_OVERLAY_ID);
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // --- Helper function to wait for an element ---
    function waitForElement(selector, contextDocument, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (cancelMetricsFetchFlag) {
                    clearInterval(interval);
                    reject(new Error('Operation cancelled by user.'));
                    return;
                }
                const element = contextDocument.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Element ${selector} not found within ${timeout}ms.`));
                }
            }, 100);
        });
    }

    // Helper function to parse date strings like "MM-DD-YYYY HH:MM"
    function parseReportDate(dateString) {
        if (!dateString) return null;
        // Example: "05-03-2025 23:00"
        const parts = dateString.match(/(\d{2})-(\d{2})-(\d{4})\s(\d{2}):(\d{2})/);
        if (!parts) {
            console.warn(`[Opti-Report] Could not parse date string: ${dateString}`);
            return null;
        }
        // parts[1]=MM, parts[2]=DD, parts[3]=YYYY, parts[4]=HH, parts[5]=MM
        // JavaScript Date month is 0-indexed, so subtract 1 from month.
        return new Date(parts[3], parseInt(parts[1], 10) - 1, parts[2], parts[4], parts[5]);
    }

    // Helper function to calculate difference between two dates in hours
    function getDateDifferenceInHours(date1, date2) {
        if (!date1 || !date2) return null;
        const diffMillis = Math.abs(date1.getTime() - date2.getTime());
        return diffMillis / (1000 * 60 * 60);
    }

    async function captureSingleReport(reportWindow, dateRangeKey, desiredRangeTextInSpan, emailBody, updateProgress, selectFortitude) {
        if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
        updateProgress(`Verifying/setting date range to "${desiredRangeTextInSpan}"...`);
        console.log(`[Opti-Report] Starting captureSingleReport for: ${desiredRangeTextInSpan}`);

        let customSelect = "-1";
        if(selectFortitude) {
            customSelect = "353";
        }

        // Ensure screen-busy is cleared before proceeding
        const screenBusyElement = reportWindow.document.querySelector('.screen-busy');
        if (screenBusyElement && screenBusyElement.classList.contains('active')) {
            while (screenBusyElement.classList.contains('active')) {
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                console.log('[Opti-Report] Waiting for screen-busy to clear...');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Select "Fortitude" in the subcustomer dropdown if present
        const subCustomerSelect = await waitForElement('#ddlSubCustomer', reportWindow.document, 5000);
        if (subCustomerSelect) {
            // Try to access shadowRoot and set Fortitude (value="353")
            try {
                const shadowRoot = subCustomerSelect.shadowRoot;
                if (shadowRoot) {
                    const ddlSubCustomer = shadowRoot.querySelector('.op-large-select');
                    if (ddlSubCustomer) {
                        let selectElement = ddlSubCustomer.querySelector('select');
                        if (selectElement) {
                            // Set the value to "Fortitude" (value="353")
                            selectElement.value = customSelect;
                            // Dispatch a change event
                            const changeEvent = new Event('change', {
                                bubbles: true,
                                cancelable: true
                            });
                            selectElement.dispatchEvent(changeEvent);
                            console.log("Set select element value to '353' (Fortitude) and dispatched change event.");
                        } else {
                            console.log('Select element not found inside .op-large-select');
                        }
                    } else {
                        console.log('.op-large-select not found in shadowRoot');
                    }
                } else {
                    console.log('shadowRoot not found on #ddlSubCustomer');
                }
            } catch (e) {
                console.warn('Error setting Fortitude in subcustomer dropdown:', e);
            }
        } else {
            console.warn('[Opti-Report] Subcustomer dropdown not found for Fortitude selection.');
        }

        const reportRangeDiv = await waitForElement('#reportrange', reportWindow.document);
        console.log('[Opti-Report] Found #reportrange div.');
        let currentRangeSpan;

        let dateRangeTextConfirmed = false;
        currentRangeSpan = reportRangeDiv.querySelector('span.text');
        if (currentRangeSpan && currentRangeSpan.textContent) {
            console.log(`[Opti-Report] Initial check - currentRangeSpan text: "${currentRangeSpan.textContent}"`);
            if (currentRangeSpan.textContent.includes(desiredRangeTextInSpan)) {
                updateProgress(`Date range text already "${desiredRangeTextInSpan}".`);
                console.log(`[Opti-Report] Date range text already "${desiredRangeTextInSpan}".`);
                dateRangeTextConfirmed = true;
            }
        } else {
            console.log('[Opti-Report] Initial check - currentRangeSpan or its textContent is null/empty.');
        }

        if (!dateRangeTextConfirmed) {
            const maxTotalWaitTime = 20000;
            const attemptInterval = 1000;
            let elapsedTime = 0;
            let attemptCount = 0;

            updateProgress(`Attempting to set date range to "${desiredRangeTextInSpan}"...`);
            console.log(`[Opti-Report] Needs date update. Starting attempts to set to "${desiredRangeTextInSpan}".`);

            // Only wait for busy indicator if it exists and is active
            const screenBusyElement = reportWindow.document.querySelector('.screen-busy');
            if (screenBusyElement && screenBusyElement.classList.contains('active')) {
                while (screenBusyElement.classList.contains('active')) {
                    if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                    console.log('[Opti-Report] Waiting for screen-busy to clear...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            while (elapsedTime < maxTotalWaitTime && !dateRangeTextConfirmed) {
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                attemptCount++;
                console.log(`[Opti-Report] Attempt ${attemptCount} to set date range text.`);

                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log('[Opti-Report] Clicking #reportrange to open dropdown.');
                    reportRangeDiv.click();
                    const dateOption = await waitForElement(`li[data-range-key="${dateRangeKey}"]`, reportWindow.document, 2000);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    console.log(`[Opti-Report] Found date option li[data-range-key="${dateRangeKey}"]. Clicking it.`);
                    dateOption.click();
                    updateProgress(`Clicked "${desiredRangeTextInSpan}" (Attempt ${attemptCount}). Verifying text update...`);
                    console.log(`[Opti-Report] Clicked "${desiredRangeTextInSpan}" (Attempt ${attemptCount}).`);

                    await new Promise(resolve => setTimeout(resolve, 500));

                    currentRangeSpan = reportRangeDiv.querySelector('span.text');
                    if (currentRangeSpan && currentRangeSpan.textContent) {
                        const currentText = currentRangeSpan.textContent;
                        console.log(`[Opti-Report] Verification (Attempt ${attemptCount}): currentRangeSpan text is "${currentText}"`);
                        if (currentText.includes(desiredRangeTextInSpan)) {
                            dateRangeTextConfirmed = true;
                            updateProgress(`Date range text confirmed: "${desiredRangeTextInSpan}".`);
                            console.log(`[Opti-Report] Date range text successfully set and verified to "${desiredRangeTextInSpan}".`);
                            // No break here, loop condition will handle it.
                        } else {
                            updateProgress(`Text not yet updated (Attempt ${attemptCount}). Current: "${currentText}". Expected: "${desiredRangeTextInSpan}". Retrying...`);
                            console.log(`[Opti-Report] Text not yet "${desiredRangeTextInSpan}". Current: "${currentText}". Retrying...`);
                        }
                    } else {
                        console.log(`[Opti-Report] Verification (Attempt ${attemptCount}): currentRangeSpan or its textContent is null/empty.`);
                        updateProgress(`Could not read current date text (Attempt ${attemptCount}). Retrying...`);
                    }
                } catch (e) {
                    console.error(`[Opti-Report] Error during date option click/find on attempt ${attemptCount}: ${e.message}`, e);
                    updateProgress(`Error clicking option (Attempt ${attemptCount}), retrying in ${attemptInterval / 1000}s...`);
                }

                if (!dateRangeTextConfirmed) { // Only wait if not yet confirmed
                    await new Promise(resolve => setTimeout(resolve, attemptInterval));
                    elapsedTime += (attemptInterval + 500); // Consider the operation time + interval
                }
            }

            if (!dateRangeTextConfirmed) {
                console.error(`[Opti-Report] Failed to set and verify date range text to "${desiredRangeTextInSpan}" after ${attemptCount} attempts.`);
                throw new Error(`Failed to set and verify date range text to "${desiredRangeTextInSpan}" after ${attemptCount} attempts.`);
            }
        }

        // Now, verify chart labels if date range text is confirmed
        if (dateRangeTextConfirmed) {
            updateProgress(`Verifying chart X-axis for "${desiredRangeTextInSpan}"...`);
            console.log(`[Opti-Report] Date range text confirmed. Verifying chart X-axis for "${desiredRangeTextInSpan}".`);

            const maxWaitTimeForChart = 15000; // 15 seconds for chart to update
            const chartCheckInterval = 1000; // Check every 1 second
            let chartElapsedTime = 0;
            let chartVerified = false;

            let expectedMinHours, expectedMaxHours;
            if (desiredRangeTextInSpan === "Last 7 Days") {
                expectedMinHours = 7 * 24 - 4; // 164 hours
                expectedMaxHours = 7 * 24 + 4; // 172 hours
            } else if (desiredRangeTextInSpan === "Last 24 Hours") {
                expectedMinHours = 24 - 4; // 22 hours (increased tolerance slightly)
                expectedMaxHours = 24 + 4; // 26 hours
            } else if (desiredRangeTextInSpan === "Last 30 Days") {
                expectedMinHours = 30 * 24 - 4; // 716 hours
                expectedMaxHours = 30 * 24 + 4; // 724 hours
            } else {
                console.warn(`[Opti-Report] Unknown desiredRangeTextInSpan for chart verification: ${desiredRangeTextInSpan}. Skipping chart check.`);
                chartVerified = true; // Skip if unknown range for chart check
            }

            if (!chartVerified) { // Only proceed if we have expectations and haven't skipped
                while (chartElapsedTime < maxWaitTimeForChart && !chartVerified) {
                    if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                    try {
                        const labelsDiv = reportWindow.document.querySelector('div#Labels6');
                        if (labelsDiv) {
                            const startLabelEl = labelsDiv.querySelector('div#chart6StartLabel');
                            const endLabelEl = labelsDiv.querySelector('div#chart6EndLabel');

                            if (startLabelEl && startLabelEl.textContent && endLabelEl && endLabelEl.textContent) {
                                const startDateText = startLabelEl.textContent.trim();
                                const endDateText = endLabelEl.textContent.trim();
                                console.log(`[Opti-Report] Chart labels found: Start="${startDateText}", End="${endDateText}"`);

                                const startDate = parseReportDate(startDateText);
                                const endDate = parseReportDate(endDateText);

                                if (startDate && endDate) {
                                    const diffHours = getDateDifferenceInHours(startDate, endDate);
                                    console.log(`[Opti-Report] Calculated chart date difference: ${diffHours} hours.`);
                                    if (diffHours !== null && diffHours >= expectedMinHours && diffHours <= expectedMaxHours) {
                                        chartVerified = true;
                                        updateProgress(`Chart X-axis for "${desiredRangeTextInSpan}" verified.`);
                                        console.log(`[Opti-Report] Chart X-axis for "${desiredRangeTextInSpan}" verified (Diff: ${diffHours} hrs).`);
                                        // No break here, loop condition handles it
                                    } else {
                                        console.log(`[Opti-Report] Chart date difference ${diffHours} hrs not within expected range [${expectedMinHours}-${expectedMaxHours}]. Waiting...`);
                                    }
                                } else {
                                    console.log('[Opti-Report] Could not parse chart dates. Waiting...');
                                }
                            } else {
                                console.log('[Opti-Report] Chart start/end labels not found or empty. Waiting...');
                            }
                        } else {
                            console.log('[Opti-Report] div#Labels6 not found. Waiting...');
                        }
                    } catch (e) {
                        console.error('[Opti-Report] Error during chart label verification:', e);
                    }

                    if (!chartVerified) { // Only wait if not yet verified
                        await new Promise(resolve => setTimeout(resolve, chartCheckInterval));
                        chartElapsedTime += chartCheckInterval;
                        updateProgress(`Verifying chart X-axis... (${Math.round(chartElapsedTime / 1000)}s)`);
                    }
                }
            }

            if (!chartVerified) {
                console.error(`[Opti-Report] Chart X-axis for "${desiredRangeTextInSpan}" did not update as expected within ${maxWaitTimeForChart / 1000}s.`);
                throw new Error(`Chart X-axis for "${desiredRangeTextInSpan}" did not update as expected.`);
            }

            console.log('[Opti-Report] Chart verification complete. Pausing briefly.');
            await new Promise(resolve => setTimeout(resolve, 500)); // Short final pause
        }
        // If dateRangeTextConfirmed was false from the start and not updated, the error above would have thrown.

        if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
        updateProgress(`Preparing "${desiredRangeTextInSpan}" report section for capture...`);
        console.log(`[Opti-Report] Preparing "${desiredRangeTextInSpan}" report section for capture.`);

        const reportElementSelector = '#mainContent';
        const elementToCapture = await waitForElement(reportElementSelector, reportWindow.document);
        if (!elementToCapture) {
            throw new Error(`Could not find element "${reportElementSelector}" to capture for ${desiredRangeTextInSpan}.`);
        }

        const docEl = reportWindow.document.documentElement;
        const bodyEl = reportWindow.document.body;

        bodyEl.innerHTML = '';
        bodyEl.appendChild(elementToCapture);

        const originalElementCSSText = elementToCapture.style.cssText;
        elementToCapture.style.cssText += `
            position: static !important; width: auto !important; height: auto !important;
            margin: 0 !important; padding: 0 !important; border: none !important;
            transform: none !important; display: block !important; overflow: visible !important;
            box-sizing: border-box !important;
        `;
        elementToCapture.offsetHeight; // Force reflow

        const captureWidth = elementToCapture.scrollWidth;
        const captureHeight = elementToCapture.scrollHeight;
        elementToCapture.style.cssText = originalElementCSSText;

        const bodyOriginalBgStyle = reportWindow.getComputedStyle(reportWindow.document.body);
        const docElOriginalBgStyle = reportWindow.getComputedStyle(reportWindow.document.documentElement);
        const fallbackBg = 'white';
        let pageBgColor = fallbackBg;
        if (bodyOriginalBgStyle.backgroundColor && bodyOriginalBgStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && bodyOriginalBgStyle.backgroundColor !== 'transparent') {
            pageBgColor = bodyOriginalBgStyle.backgroundColor;
        } else if (docElOriginalBgStyle.backgroundColor && docElOriginalBgStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && docElOriginalBgStyle.backgroundColor !== 'transparent') {
            pageBgColor = docElOriginalBgStyle.backgroundColor;
        }

        docEl.style.cssText = 'margin:0!important; padding:0!important; overflow:hidden!important;';
        bodyEl.style.cssText = `
            margin:0!important; padding:0!important; overflow:hidden!important;
            width: ${captureWidth}px !important; height: ${captureHeight}px !important;
            background-color: ${pageBgColor} !important; position: relative !important;
        `;
        elementToCapture.style.cssText += `
            position: absolute !important; top: 0 !important; left: 0 !important;
            width: ${captureWidth}px !important; height: ${captureHeight}px !important;
            margin: 0 !important; transform: none !important; box-sizing: border-box !important;
        `;

        await new Promise(resolve => setTimeout(resolve, 350));
        updateProgress(`Rendering "${desiredRangeTextInSpan}" screenshot...`);

        const canvas = await html2canvas(bodyEl, {
            logging: true, useCORS: true, scale: 2.0,
            width: captureWidth, height: captureHeight,
            windowWidth: captureWidth, windowHeight: captureHeight,
            x: 0, y: 0, backgroundColor: null,
        });

        const imgDataUrl = canvas.toDataURL('image/png');
        let emailBodiesArray = [emailBody];
        emailBodiesArray.forEach(emailBodyToAppendTo => {
            const imgElement = document.createElement('img');
            imgElement.src = imgDataUrl;
            imgElement.style.maxWidth = '100%'; imgElement.style.height = 'auto';
            imgElement.style.marginTop = '15px'; imgElement.style.marginBottom = '15px';
            imgElement.style.border = '1px solid #555';

            //emailBodyToAppendTo.appendChild(workAroundLineBreakElement.cloneNode(true));
            emailBodyToAppendTo.appendChild(imgElement);
            emailBodyToAppendTo.appendChild(workAroundLineBreakElement.cloneNode(true));
            emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
        });
        updateProgress(`"${desiredRangeTextInSpan}" screenshot added.`);
    }


    async function fetchKeyMetricsReportScreenshot(fullReportEmailBody, fortitudeReportEmailBody) {
        cancelMetricsFetchFlag = false;
        showProgressOverlay('Initiating Key Metrics report captures...');

        metricsReportWindow = window.open('https://foundryoptifleet.com/Content/Reports/KeyMetricsReport?OptiReport', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes,left=0');
        if (!metricsReportWindow) {
            updateProgressMessage('Failed to open report window. Popup blocker?');
            setTimeout(hideProgressOverlay, 3000);
            return;
        }

        metricsReportWindow.onload = async () => {
            try {
                disableMouseInputsInWindow(metricsReportWindow);

                if (cancelMetricsFetchFlag) {
                    if (metricsReportWindow && !metricsReportWindow.closed) metricsReportWindow.close();
                    hideProgressOverlay();
                    return;
                }

                // Get '.screen-busy' and see if it is "screen-busy active"
                updateProgressMessage('Waiting for report page to load...');
                const screenBusyElement = metricsReportWindow.document.querySelector('.screen-busy');
                if (screenBusyElement) {
                    while(screenBusyElement.classList.contains('active')) {
                        if (cancelMetricsFetchFlag) {
                            if (metricsReportWindow && !metricsReportWindow.closed) metricsReportWindow.close();
                            hideProgressOverlay();
                            return;
                        }
                        console.log('[Opti-Report] Waiting for screen-busy to clear...');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                updateProgressMessage('Report page loaded. Preparing for "Last 7 Days" report...');

                // Add title and separator for the 7-day report to all email bodies
                let emailBodiesArray = [fullReportEmailBody, fortitudeReportEmailBody];
                const title7DayHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">7 Day Average</p>`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDiv7Day = document.createElement('div');
                    tempDiv7Day.innerHTML = title7DayHTML + imageSeparatorHTML;
                    while(tempDiv7Day.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDiv7Day.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 7 Days" report...');
                await captureSingleReport(metricsReportWindow, "Last 7 Days", "Last 7 Days", fullReportEmailBody, updateProgressMessage);
                await captureSingleReport(metricsReportWindow, "Last 7 Days", "Last 7 Days", fortitudeReportEmailBody, updateProgressMessage, true);

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for the 24-hour report
                const title24hrHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">24 Hour Average</p>`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDiv24hr = document.createElement('div');
                    tempDiv24hr.innerHTML = title24hrHTML + imageSeparatorHTML;
                    while(tempDiv24hr.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDiv24hr.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Selecting for 24-hour capture...');
                //metricsReportWindow.location.reload(true); // Force reload
                //await new Promise(resolve => setTimeout(resolve, 500));

                await waitForElement('#reportrange', metricsReportWindow.document, 15000);
                //disableMouseInputsInWindow(metricsReportWindow); // Re-apply after reload

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 24 Hours" report...');
                await captureSingleReport(metricsReportWindow, "Last 24 Hours", "Last 24 Hours", fullReportEmailBody, updateProgressMessage);
                await captureSingleReport(metricsReportWindow, "Last 24 Hours", "Last 24 Hours", fortitudeReportEmailBody, updateProgressMessage, true);
                

                // --- Scrape Uptime 24hr Average ---
                try {
                    const uptimeStatElement = metricsReportWindow.document.querySelector('#uptimeStat');
                    let uptime24hrValue = "N/A";
                    if (uptimeStatElement && uptimeStatElement.textContent) {
                        uptime24hrValue = uptimeStatElement.textContent.trim();
                    }

                    emailBodiesArray.forEach((emailBodyToUpdate, index) => {
                        const tables = emailBodyToUpdate.getElementsByTagName('table');
                        if (tables.length > 0) {
                            const targetTable = tables[0];
                            const rows = targetTable.getElementsByTagName('tr');
                            for (let i = 0; i < rows.length; i++) {
                                const cells = rows[i].getElementsByTagName('td');
                                if (cells.length > 1 && cells[0].textContent === "Uptime 24hr Average") {
                                    cells[1].textContent = uptime24hrValue;
                                    break;
                                }
                            }
                        }
                    });
                    console.log('[Opti-Report] Updated Uptime 24hr Average in email bodies:', uptime24hrValue);
                } catch (e) {
                    console.error('[Opti-Report] Error scraping or updating Uptime 24hr Average:', e);
                }
                // --- End of Uptime 24hr Average scraping ---

                // Add title and separator for the 30-day report
                const title30DayHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">30 Day Average</p>`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDiv30Day = document.createElement('div');
                    tempDiv30Day.innerHTML = title30DayHTML + imageSeparatorHTML;
                    while(tempDiv30Day.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDiv30Day.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Selecting for 30-day capture...');
                //metricsReportWindow.location.reload(true); // Force reload
                //await new Promise(resolve => setTimeout(resolve, 1500));

                await waitForElement('#reportrange', metricsReportWindow.document, 15000); // Increased timeout for page reload
                //disableMouseInputsInWindow(metricsReportWindow); // Re-apply after reload

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 30 Days" report...');
                await captureSingleReport(metricsReportWindow, "Last 30 Days", "Last 30 Days", fullReportEmailBody, updateProgressMessage);
                await captureSingleReport(metricsReportWindow, "Last 30 Days", "Last 30 Days", fortitudeReportEmailBody, updateProgressMessage, true);

                // --- Scrape Uptime Monthly Average ---
                try {
                    const uptimeStatElement = metricsReportWindow.document.querySelector('#uptimeStat');
                    let uptimeMonthlyValue = "N/A";
                    if (uptimeStatElement && uptimeStatElement.textContent) {
                        uptimeMonthlyValue = uptimeStatElement.textContent.trim();
                    }
                    emailBodiesArray.forEach((emailBodyToUpdate, index) => {
                        const tables = emailBodyToUpdate.getElementsByTagName('table');
                        if (tables.length > 0) {
                            const targetTable = tables[0];
                            const rows = targetTable.getElementsByTagName('tr');
                            for (let i = 0; i < rows.length; i++) {
                                const cells = rows[i].getElementsByTagName('td');
                                if (cells.length > 1 && cells[0].textContent === "Uptime Monthly Average") {
                                    cells[1].textContent = uptimeMonthlyValue;
                                    break;
                                }
                            }
                        }
                    });
                    console.log('[Opti-Report] Updated Uptime Monthly Average in email bodies:', uptimeMonthlyValue);
                } catch (e) {
                    console.error('[Opti-Report] Error scraping or updating Uptime Monthly Average:', e);
                }
                // --- End of Uptime Monthly Average scraping ---

                // Add title and separator for the Site Overview
                const titleSiteOverviewHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Site Overview</p>`;
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const tempDivSiteOverview = document.createElement('div');
                    tempDivSiteOverview.innerHTML = titleSiteOverviewHTML + imageSeparatorHTML;
                    while(tempDivSiteOverview.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDivSiteOverview.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                }
                console.log('[Opti-Report] Added title and separator for Site Overview (if applicable).');

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                updateProgressMessage('Capturing "Site Overview" section...');

                updateProgressMessage('Navigating to Site Overview page...');
                metricsReportWindow.location.href = 'https://foundryoptifleet.com/Content/Dashboard/SiteOverview?OptiReport';

                await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for navigation

                const siteOverviewElementSelector = 'div.m-section.has-space-xl';
                const elementToCaptureSO = await waitForElement(siteOverviewElementSelector, metricsReportWindow.document);
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after navigation

                if (!elementToCaptureSO) {
                    throw new Error(`Could not find element "${siteOverviewElementSelector}" to capture for Site Overview.`);
                }

                const siteUtilization = await waitForElement('#siteUtilizationAssignedMinersPercent', metricsReportWindow.document, 10000);
                if (!siteUtilization) {
                    console.error('[Opti-Report] Site Utilization element not found. Defaulting to "N/A".');
                }

                let siteUtilizationValue = siteUtilization.textContent;
                while (!siteUtilizationValue.match(/^\d+(\.\d+)?%$/)) {
                    console.log('[Opti-Report] Site Utilization element not found or invalid. Waiting...');
                    await new Promise(resolve => setTimeout(resolve, 100));
                    siteUtilizationValue = siteUtilization.textContent;
                }

                const hashRateBar = await waitForElement('#hashRateBarVal', metricsReportWindow.document, 10000);
                let hashRateFullSite = hashRateBar.textContent || "N/A";
                while (hashRateFullSite === "N/A" || hashRateFullSite === "-- H/s") {
                    console.log('[Opti-Report] Hashrate Full Site element not found or invalid. Waiting...');
                    await new Promise(resolve => setTimeout(resolve, 100));
                    hashRateFullSite = hashRateBar.textContent || "N/A";
                }


                // --- Scrape data for General Site Stats Table ---
                try {
                    
                    const siteEfficiency = metricsReportWindow.document.querySelector('#hashRateEfficiency');

                    emailBodiesArray.forEach((emailBodyToUpdate, index) => {
                        const tables = emailBodyToUpdate.getElementsByTagName('table');
                        if (tables.length > 0) {
                            const targetTable = tables[0];
                            const rows = targetTable.getElementsByTagName('tr');
                            if (index === 0) {
                                for (let i = 0; i < rows.length; i++) {
                                    const cells = rows[i].getElementsByTagName('td');
                                    if(cells[0].textContent === "Hashrate") {
                                        cells[1].textContent = hashRateFullSite;
                                    }
                                    if (cells[0].textContent === "Site Utilization") {
                                        const siteUtilizationValue = siteUtilization ? siteUtilization.textContent : 'N/A';
                                        cells[1].textContent = siteUtilizationValue;
                                    }
                                    if (cells[0].textContent === "Efficiency") {
                                        const siteEfficiencyValue = siteEfficiency ? siteEfficiency.textContent : 'N/A';
                                        cells[1].textContent = siteEfficiencyValue;
                                    }
                                }
                            } else if (index === 1) {
                                /* Need to set to the actual grabbed data for only fortitude, not this which is overall for whole site
                                for (let i = 0; i < rows.length; i++) {
                                    const cells = rows[i].getElementsByTagName('td');
                                    if(cells[0].textContent === "Hashrate") {
                                        cells[1].textContent = hashRateFullSite;
                                    }
                                    if (cells[0].textContent === "Efficiency") {
                                        const siteEfficiencyValue = siteEfficiency ? siteEfficiency.textContent : 'N/A';
                                        cells[1].textContent = siteEfficiencyValue;
                                    }
                                }*/
                            }
                        }
                    });
                    console.log('[Opti-Report] Updated site stats in email body tables.');
                } catch (e) {
                    console.error('[Opti-Report] Error scraping or updating miner stats for email body:', e);
                }
                // --- End of data scraping ---

                const docElSO = metricsReportWindow.document.documentElement;
                const bodyElSO = metricsReportWindow.document.body;

                bodyElSO.innerHTML = '';
                bodyElSO.appendChild(elementToCaptureSO);

                const originalElementCSSTextSO = elementToCaptureSO.style.cssText;
                elementToCaptureSO.style.cssText += `
                    position: static !important; width: auto !important; height: auto !important;
                    margin: 0 !important;
                    padding: 0px 20px 70px 20px !important;
                    border: none !important;
                    transform: none !important; display: block !important; overflow: visible !important;
                    box-sizing: border-box !important;
                `;
                elementToCaptureSO.offsetHeight;

                const captureWidthSO = elementToCaptureSO.scrollWidth;
                const captureHeightSO = elementToCaptureSO.scrollHeight;
                elementToCaptureSO.style.cssText = originalElementCSSTextSO;

                const bodyOriginalBgStyleSO = metricsReportWindow.getComputedStyle(bodyElSO);
                const docElOriginalBgStyleSO = metricsReportWindow.getComputedStyle(docElSO);
                const fallbackBgSO = 'white';
                let pageBgColorSO = fallbackBgSO;
                if (bodyOriginalBgStyleSO.backgroundColor && bodyOriginalBgStyleSO.backgroundColor !== 'rgba(0, 0, 0, 0)' && bodyOriginalBgStyleSO.backgroundColor !== 'transparent') {
                    pageBgColorSO = bodyOriginalBgStyleSO.backgroundColor;
                } else if (docElOriginalBgStyleSO.backgroundColor && docElOriginalBgStyleSO.backgroundColor !== 'rgba(0, 0, 0, 0)' && docElOriginalBgStyleSO.backgroundColor !== 'transparent') {
                    pageBgColorSO = docElOriginalBgStyleSO.backgroundColor;
                }

                docElSO.style.cssText = 'margin:0!important; padding:0!important; overflow:hidden!important;';
                bodyElSO.style.cssText = `
                    margin:0!important; padding:0!important; overflow:hidden!important;
                    width: ${captureWidthSO}px !important; height: ${captureHeightSO}px !important;
                    background-color: ${pageBgColorSO} !important; position: relative !important;
                `;
                elementToCaptureSO.style.cssText += `
                    position: absolute !important; top: 0 !important; left: 0 !important;
                    width: ${captureWidthSO}px !important; height: ${captureHeightSO}px !important;
                    margin: 0 !important; transform: none !important; box-sizing: border-box !important;
                `;

                await new Promise(resolve => setTimeout(resolve, 350));
                updateProgressMessage('Rendering "Site Overview" screenshot...');

                const canvasSO = await html2canvas(bodyElSO, {
                    logging: true, useCORS: true, scale: 2.0,
                    width: captureWidthSO, height: captureHeightSO,
                    windowWidth: captureWidthSO, windowHeight: captureHeightSO,
                    x: 0, y: 0, backgroundColor: null,
                });

                const imgDataUrlSO = canvasSO.toDataURL('image/png');
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const imgElementSO = document.createElement('img');
                    imgElementSO.src = imgDataUrlSO;
                    imgElementSO.style.maxWidth = '100%'; imgElementSO.style.height = 'auto';
                    imgElementSO.style.marginTop = '15px'; imgElementSO.style.marginBottom = '15px';
                    imgElementSO.style.border = '1px solid #555';

                    emailBodyToAppendTo.appendChild(document.createElement('p'));
                    emailBodyToAppendTo.appendChild(imgElementSO);
                    emailBodyToAppendTo.appendChild(document.createElement('p'));
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                }
                updateProgressMessage('"Site Overview" screenshot added (if applicable).');

                updateProgressMessage('Reloading page for "Hashrate Efficiency" capture...');
                metricsReportWindow.location.reload(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                // Initial disable after reload, more specific one follows after waitForElement
                disableMouseInputsInWindow(metricsReportWindow);


                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                const titleHashrateEfficiencyHTML = `<p><br></p>` + `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Hashrate Efficiency</p>`;
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const tempDivHE = document.createElement('div');
                    tempDivHE.innerHTML = titleHashrateEfficiencyHTML + imageSeparatorHTML;
                    while(tempDivHE.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDivHE.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                }

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Hashrate Efficiency" section (zone-stats-panel)...');
                const zoneStatsPanelSelector = 'div.zone-stats-panel';
                await waitForElement('div.m-section.has-space-xl', metricsReportWindow.document, 10000);
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after main section appears

                const elementToCaptureHE = await waitForElement(zoneStatsPanelSelector, metricsReportWindow.document, 15000);
                if (!elementToCaptureHE) {
                    throw new Error(`Could not find element "${zoneStatsPanelSelector}" to capture for Hashrate Efficiency.`);
                }

                updateProgressMessage('Reloading Site Overview for Hashrate Efficiency capture...');
                metricsReportWindow.location.href = 'https://foundryoptifleet.com/Content/Dashboard/SiteOverview?OptiReport';
                const gridID = '#zoneStatsGrid';
                await waitForElement('div.m-section.has-space-xl', metricsReportWindow.document, 20000);
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after navigation and main section appears

                await waitForElement(gridID, metricsReportWindow.document, 15000);
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after grid appears

                const statPanelClass = 'stat-panel';
                let statPanelCheckInterval = 1000;
                let statPanelCheckTimeout = 15000;
                let statPanelCheckElapsed = 0;
                let statPanelCheckPassed = false;
                while (statPanelCheckElapsed < statPanelCheckTimeout && !statPanelCheckPassed) {
                    if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                    const statPanelElements = metricsReportWindow.document.querySelectorAll(`.${statPanelClass}`);
                    if (statPanelElements.length > 0) {
                        statPanelCheckPassed = true;
                        updateProgressMessage(`Found ${statPanelElements.length} elements with class "${statPanelClass}".`);
                        console.log(`[Opti-Report] Found ${statPanelElements.length} elements with class "${statPanelClass}".`);
                    } else {
                        console.log(`[Opti-Report] Waiting for elements with class "${statPanelClass}"...`);
                        await new Promise(resolve => setTimeout(resolve, statPanelCheckInterval));
                        statPanelCheckElapsed += statPanelCheckInterval;
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 500));

                const freshElementToCaptureHE = await waitForElement(zoneStatsPanelSelector, metricsReportWindow.document, 15000);
                 if (!freshElementToCaptureHE) {
                    throw new Error(`Could not find element "${zoneStatsPanelSelector}" (after reload) to capture for Hashrate Efficiency.`);
                }

                const docElHE = metricsReportWindow.document.documentElement;
                const bodyElHE = metricsReportWindow.document.body;

                bodyElHE.innerHTML = '';
                bodyElHE.appendChild(freshElementToCaptureHE);

                const originalElementCSSTextHE = freshElementToCaptureHE.style.cssText;
                freshElementToCaptureHE.style.cssText += `
                    position: static !important; width: auto !important; height: auto !important;
                    margin: 0 !important;
                    padding: 20px 20px 20px 20px !important;
                    border: none !important;
                    transform: none !important; display: block !important; overflow: visible !important;
                    box-sizing: border-box !important;
                `;
                freshElementToCaptureHE.offsetHeight;

                const captureWidthHE = freshElementToCaptureHE.scrollWidth;
                const captureHeightHE = freshElementToCaptureHE.scrollHeight;
                freshElementToCaptureHE.style.cssText = originalElementCSSTextHE;

                const bodyOriginalBgStyleHE = metricsReportWindow.getComputedStyle(bodyElHE);
                const docElOriginalBgStyleHE = metricsReportWindow.getComputedStyle(docElHE);
                let pageBgColorHE = 'white';
                 if (bodyOriginalBgStyleHE.backgroundColor && bodyOriginalBgStyleHE.backgroundColor !== 'rgba(0, 0, 0, 0)' && bodyOriginalBgStyleHE.backgroundColor !== 'transparent') {
                    pageBgColorHE = bodyOriginalBgStyleHE.backgroundColor;
                } else if (docElOriginalBgStyleHE.backgroundColor && docElOriginalBgStyleHE.backgroundColor !== 'rgba(0, 0, 0, 0)' && docElOriginalBgStyleHE.backgroundColor !== 'transparent') {
                    pageBgColorHE = docElOriginalBgStyleHE.backgroundColor;
                }

                docElHE.style.cssText = 'margin:0!important; padding:0!important; overflow:hidden!important;';
                bodyElHE.style.cssText = `
                    margin:0!important; padding:0!important; overflow:hidden!important;
                    width: ${captureWidthHE}px !important; height: ${captureHeightHE}px !important;
                    background-color: ${pageBgColorHE} !important; position: relative !important;
                `;
                freshElementToCaptureHE.style.cssText += `
                    position: absolute !important; top: 0 !important; left: 0 !important;
                    width: ${captureWidthHE}px !important; height: ${captureHeightHE}px !important;
                    margin: 0 !important; transform: none !important; box-sizing: border-box !important;
                `;

                await new Promise(resolve => setTimeout(resolve, 350));
                updateProgressMessage('Rendering "Hashrate Efficiency" screenshot...');

                const canvasHE = await html2canvas(bodyElHE, {
                    logging: true, useCORS: true, scale: 2.0,
                    width: captureWidthHE, height: captureHeightHE,
                    windowWidth: captureWidthHE, windowHeight: captureHeightHE,
                    x: 0, y: 0, backgroundColor: null,
                });

                const imgDataUrlHE = canvasHE.toDataURL('image/png');
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const imgElementHE = document.createElement('img');
                    imgElementHE.src = imgDataUrlHE;
                    imgElementHE.style.maxWidth = '100%'; imgElementHE.style.height = 'auto';
                    imgElementHE.style.marginTop = '15px'; imgElementHE.style.marginBottom = '15px';
                    imgElementHE.style.border = '1px solid #555';

                    emailBodyToAppendTo.appendChild(document.createElement('p'));
                    emailBodyToAppendTo.appendChild(imgElementHE);
                    emailBodyToAppendTo.appendChild(document.createElement('p'));
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                }
                updateProgressMessage('"Hashrate Efficiency" screenshot added (if applicable).');
                // --- End of Hashrate Efficiency capture ---

                // --- START: New code for Filtered Hashrate Efficiency (C18 & C19) for Fortitude Report ---
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                if (emailBodiesArray[1]) { // Only for Fortitude Report (index 1)
                    updateProgressMessage('Preparing filtered Hashrate Efficiency for Fortitude Report...');
                    const titleFilteredHE_HTML = `<p><br></p>` + `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Hashrate Efficiency</p>`; // Corrected Title
                    const fortitudeEmailBody = emailBodiesArray[1];
                    const tempDivFilteredHE = document.createElement('div');
                    tempDivFilteredHE.innerHTML = titleFilteredHE_HTML + imageSeparatorHTML;
                    while(tempDivFilteredHE.firstChild) {
                        fortitudeEmailBody.appendChild(tempDivFilteredHE.firstChild);
                    }
                    fortitudeEmailBody.scrollTop = fortitudeEmailBody.scrollHeight;

                    // Filter the stat panels within freshElementToCaptureHE
                    // freshElementToCaptureHE is already isolated in bodyElHE and styled with position:absolute etc.
                    const zoneStatsGridInPanel = freshElementToCaptureHE.querySelector('#zoneStatsGrid');
                    if (zoneStatsGridInPanel) {
                        const statPanels = zoneStatsGridInPanel.querySelectorAll('a.stat-panel');
                        updateProgressMessage(`Filtering ${statPanels.length} stat panels for C18/C19...`);
                        let removedCount = 0;
                        statPanels.forEach(panel => {
                            if (cancelMetricsFetchFlag) return;
                            const headingElement = panel.querySelector('p.m-heading.is-size-m');
                            if (headingElement) {
                                const headingText = headingElement.textContent || "";
                                if (!headingText.includes('Minden_C18') && !headingText.includes('Minden_C19')) {
                                    panel.remove();
                                    removedCount++;
                                }
                            }
                        });
                        console.log(`[Opti-Report] Filtered out ${removedCount} stat panels. Kept C18/C19.`);
                        updateProgressMessage(`Filtered out ${removedCount} panels. Preparing screenshot...`);
                    } else {
                        console.warn('[Opti-Report] #zoneStatsGrid not found within the captured HE panel for filtering.');
                    }

                    await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause for DOM update

                    // Save current style of freshElementToCaptureHE (includes original + absolute positioning + W/H from first capture)
                    const currentFRElementStyle = freshElementToCaptureHE.style.cssText;

                    // Temporarily set auto width/height to get new scroll dimensions
                    freshElementToCaptureHE.style.width = 'auto';
                    freshElementToCaptureHE.style.height = 'auto';
                    freshElementToCaptureHE.offsetHeight; // Force reflow

                    const captureWidthHE_filtered = freshElementToCaptureHE.scrollWidth;
                    const captureHeightHE_filtered = freshElementToCaptureHE.scrollHeight;

                    // Restore previous styles and apply new dimensions
                    freshElementToCaptureHE.style.cssText = currentFRElementStyle;
                    freshElementToCaptureHE.style.width = `${captureWidthHE_filtered}px`;
                    freshElementToCaptureHE.style.height = `${captureHeightHE_filtered}px`;

                    // Update bodyElHE (which contains freshElementToCaptureHE) styles for the new dimensions
                    bodyElHE.style.width = `${captureWidthHE_filtered}px`;
                    bodyElHE.style.height = `${captureHeightHE_filtered}px`;

                    await new Promise(resolve => setTimeout(resolve, 350));
                    updateProgressMessage('Rendering "Filtered Hashrate Efficiency (C18 & C19)" screenshot...');

                    const canvasHE_filtered = await html2canvas(bodyElHE, {
                        logging: true, useCORS: true, scale: 2.0,
                        width: captureWidthHE_filtered, height: captureHeightHE_filtered,
                        windowWidth: captureWidthHE_filtered, windowHeight: captureHeightHE_filtered,
                        x: 0, y: 0, backgroundColor: null,
                    });

                    const imgDataUrlHE_filtered = canvasHE_filtered.toDataURL('image/png');

                    const imgElementHE_filtered = document.createElement('img');
                    imgElementHE_filtered.src = imgDataUrlHE_filtered;
                    imgElementHE_filtered.style.maxWidth = '100%'; imgElementHE_filtered.style.height = 'auto';
                    imgElementHE_filtered.style.marginTop = '15px'; imgElementHE_filtered.style.marginBottom = '15px';
                    imgElementHE_filtered.style.border = '1px solid #555';

                    fortitudeEmailBody.appendChild(document.createElement('p'));
                    fortitudeEmailBody.appendChild(imgElementHE_filtered);
                    fortitudeEmailBody.appendChild(document.createElement('p'));
                    fortitudeEmailBody.scrollTop = fortitudeEmailBody.scrollHeight;

                    updateProgressMessage('"Hashrate Efficiency (C18 & C19)" screenshot added to Fortitude Report.');
                }
                // --- END: New code for Filtered Hashrate Efficiency (C18 & C19) ---


                // --- Capture Uptime Tab within Hashrate Efficiency ---
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                const titleUptimeStatsHTML = `<p><br></p>` + `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Uptime Stats</p>`;
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const tempDivUS = document.createElement('div');
                    tempDivUS.innerHTML = titleUptimeStatsHTML + imageSeparatorHTML;
                    while(tempDivUS.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDivUS.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                }

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Switching to "Uptime" tab in Site Overview...');
                const uptimeTabSelector = 'op-tab[for="zoneUptime"]';
                const uptimeTabElement = await waitForElement(uptimeTabSelector, metricsReportWindow.document, 10000);
                disableMouseInputsInWindow(metricsReportWindow); // Ensure style is present before tab interaction (should persist)
                if (!uptimeTabElement) {
                    throw new Error(`Could not find Uptime tab "${uptimeTabSelector}".`);
                }
                uptimeTabElement.click();
                updateProgressMessage('Clicked "Uptime" tab. Waiting for content to load...');

                const uptimeGridSelector = 'div#zoneUptimeGrid';
                await waitForElement(uptimeGridSelector, metricsReportWindow.document, 15000);
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after tab content (grid) appears
                await new Promise(resolve => setTimeout(resolve, 1000));
                updateProgressMessage('Uptime content loaded. Capturing "Uptime Stats"...');

                const zoneStatsPanelForUptime = await waitForElement(zoneStatsPanelSelector, metricsReportWindow.document, 5000);
                if (!zoneStatsPanelForUptime) {
                    throw new Error(`Could not re-find element "${zoneStatsPanelSelector}" for Uptime capture.`);
                }

                const docElUS = metricsReportWindow.document.documentElement;
                const bodyElUS = metricsReportWindow.document.body;

                bodyElUS.innerHTML = '';
                bodyElUS.appendChild(zoneStatsPanelForUptime);

                const originalZonePanelCSSTextUS = zoneStatsPanelForUptime.style.cssText;
                const originalBodyCSSTextUS = bodyElUS.style.cssText; // Save body's original style

                // Temporarily style body to shrink-wrap its content for accurate measurement of the panel
                bodyElUS.style.cssText = `
                    display: inline-block !important; /* Make body behave like an inline element for width calculation */
                    width: auto !important;
                    height: auto !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    overflow: visible !important;
                `;

                // Apply measurement styles to the panel itself
                zoneStatsPanelForUptime.style.cssText = `
                    position: static !important;
                    width: auto !important; /* Let its content and padding determine width */
                    height: auto !important; /* Let its content and padding determine height */
                    margin: 0 !important;
                    padding: 20px !important; /* This padding is part of the screenshot */
                    border: none !important;
                    transform: none !important;
                    display: inline-flex !important;
                    flex-wrap: wrap !important;
                    justify-content: flex-start !important;
                    align-items: flex-start !important; /* Align items if they wrap to new lines */
                    align-content: flex-start !important; /* Align wrapped lines themselves */
                    box-sizing: border-box !important;
                    overflow: visible !important; /* Important for scrollWidth/Height */
                `;

                bodyElUS.offsetHeight; // Force reflow of body and its child (the panel)

                const captureWidthUS = zoneStatsPanelForUptime.scrollWidth; // Should now be tight around content + padding
                const captureHeightUS = zoneStatsPanelForUptime.scrollHeight; // Should now be tight

                // Restore original styles before final screenshot setup
                zoneStatsPanelForUptime.style.cssText = originalZonePanelCSSTextUS;
                bodyElUS.style.cssText = originalBodyCSSTextUS; // Restore body's original style
                // Note: bodyElUS.innerHTML still contains only zoneStatsPanelForUptime at this point.

                const bodyOriginalBgStyleUS = metricsReportWindow.getComputedStyle(bodyElUS); // Get original BG after restoring style
                const docElOriginalBgStyleUS = metricsReportWindow.getComputedStyle(docElUS);
                let pageBgColorUS = 'white';
                 if (bodyOriginalBgStyleUS.backgroundColor && bodyOriginalBgStyleUS.backgroundColor !== 'rgba(0, 0, 0, 0)' && bodyOriginalBgStyleUS.backgroundColor !== 'transparent') {
                    pageBgColorUS = bodyOriginalBgStyleUS.backgroundColor;
                } else if (docElOriginalBgStyleUS.backgroundColor && docElOriginalBgStyleUS.backgroundColor !== 'rgba(0, 0, 0, 0)' && docElOriginalBgStyleUS.backgroundColor !== 'transparent') {
                    pageBgColorUS = docElOriginalBgStyleUS.backgroundColor;
                }

                docElUS.style.cssText = 'margin:0!important; padding:0!important; overflow:hidden!important;';
                bodyElUS.style.cssText = `
                    margin:0!important; padding:0!important; overflow:hidden!important;
                    width: ${captureWidthUS}px !important; height: ${captureHeightUS}px !important;
                    background-color: ${pageBgColorUS} !important; position: relative !important;
                `;
                zoneStatsPanelForUptime.style.cssText += `
                    position: absolute !important; top: 0 !important; left: 0 !important;
                    width: ${captureWidthUS}px !important; height: ${captureHeightUS}px !important;
                    margin: 0 !important; transform: none !important; box-sizing: border-box !important;
                `;

                await new Promise(resolve => setTimeout(resolve, 350));
                updateProgressMessage('Rendering "Uptime Stats" screenshot...');

                const canvasUS = await html2canvas(bodyElUS, {
                    logging: true, useCORS: true, scale: 2.0,
                    width: captureWidthUS, height: captureHeightUS,
                    windowWidth: captureWidthUS, windowHeight: captureHeightUS,
                    x: 0, y: 0, backgroundColor: null,
                });

                const imgDataUrlUS = canvasUS.toDataURL('image/png');
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const imgElementUS = document.createElement('img');
                    imgElementUS.src = imgDataUrlUS;
                    imgElementUS.style.maxWidth = '100%'; imgElementUS.style.height = 'auto';
                    imgElementUS.style.marginTop = '15px'; imgElementUS.style.marginBottom = '15px';
                    imgElementUS.style.border = '1px solid #555';

                    emailBodyToAppendTo.appendChild(document.createElement('p'));
                    emailBodyToAppendTo.appendChild(imgElementUS);
                    emailBodyToAppendTo.appendChild(document.createElement('p'));
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                }
                updateProgressMessage('"Uptime Stats" screenshot added (if applicable).');
                // --- End of Uptime Tab capture ---

                // --- START: Add Filtered Uptime Stats (C18 & C19) to Fortitude Report ---
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                if (emailBodiesArray[1]) { // Only for Fortitude Report (index 1)
                    updateProgressMessage('Preparing filtered Uptime Stats (C18 & C19) for Fortitude Report...');
                    const titleFilteredUS_Fortitude_HTML = `<p><br></p>` + `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Uptime Stats</p>`;
                    const fortitudeEmailBody = emailBodiesArray[1];

                    const tempDivFilteredUS = document.createElement('div');
                    tempDivFilteredUS.innerHTML = titleFilteredUS_Fortitude_HTML + imageSeparatorHTML;
                    while(tempDivFilteredUS.firstChild) {
                        fortitudeEmailBody.appendChild(tempDivFilteredUS.firstChild);
                    }
                    fortitudeEmailBody.scrollTop = fortitudeEmailBody.scrollHeight;

                    // zoneStatsPanelForUptime is currently in bodyElUS and contains the UNFILTERED Uptime stats.
                    // Now, filter it for C18/C19 for the Fortitude report.
                    updateProgressMessage('Filtering Uptime Stats for C18/C19 (Fortitude Report)...');
                    const zoneUptimeGridInPanel_Fortitude = zoneStatsPanelForUptime.querySelector('#zoneUptimeGrid');
                    if (zoneUptimeGridInPanel_Fortitude) {
                        const statPanelsUS_Fortitude = zoneUptimeGridInPanel_Fortitude.querySelectorAll('a.stat-panel');
                        updateProgressMessage(`Filtering ${statPanelsUS_Fortitude.length} Uptime stat panels for C18/C19 (Fortitude)...`);
                        let removedCountUS_Fortitude = 0;
                        statPanelsUS_Fortitude.forEach(panel => {
                            if (cancelMetricsFetchFlag) return;
                            const headingElement = panel.querySelector('p.m-heading.is-size-m');
                            if (headingElement) {
                                const headingText = headingElement.textContent || "";
                                if (!headingText.includes('Minden_C18') && !headingText.includes('Minden_C19')) {
                                    panel.remove();
                                    removedCountUS_Fortitude++;
                                }
                            }
                        });
                        console.log(`[Opti-Report] Filtered out ${removedCountUS_Fortitude} Uptime stat panels. Kept C18/C19 for Fortitude Report.`);
                        updateProgressMessage(`Filtered Uptime (Fortitude): ${removedCountUS_Fortitude} panels removed. Preparing screenshot...`);
                    } else {
                        console.warn('[Opti-Report] #zoneUptimeGrid not found for filtering (Fortitude Uptime).');
                    }
                    await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause for DOM update

                    // Recalculate dimensions for the filtered Uptime panel
                    const styleBeforeFilteredRecalc = zoneStatsPanelForUptime.style.cssText; // Save current style (likely absolute positioning)
                    const originalBodyCSSTextUS_filtered = bodyElUS.style.cssText; // Save body's current style (it was set up for the previous screenshot)

                    // Temporarily style body to shrink-wrap its content for accurate measurement of the panel
                    bodyElUS.style.cssText = `
                        display: inline-block !important;
                        width: auto !important;
                        height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                    `;

                    // Apply consistent measurement styles again to the panel
                    zoneStatsPanelForUptime.style.cssText = `
                        position: static !important;
                        width: auto !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 20px !important; /* This padding is part of the screenshot */
                        border: none !important;
                        transform: none !important;
                        display: inline-flex !important; /* Key for shrink-to-fit width */
                        flex-wrap: wrap !important;
                        justify-content: flex-start !important;
                        align-items: flex-start !important;
                        align-content: flex-start !important;
                        box-sizing: border-box !important;
                        overflow: visible !important;
                    `;
                    bodyElUS.offsetHeight; // Force reflow

                    const captureWidthUS_filtered_Fortitude = zoneStatsPanelForUptime.scrollWidth;
                    const captureHeightUS_filtered_Fortitude = zoneStatsPanelForUptime.scrollHeight;

                    // Restore panel's style to what it was before this specific measurement
                    zoneStatsPanelForUptime.style.cssText = styleBeforeFilteredRecalc;
                    // Restore body's style to what it was before this specific measurement
                    bodyElUS.style.cssText = originalBodyCSSTextUS_filtered;

                    // Apply new dimensions for screenshot
                    // The panel (zoneStatsPanelForUptime) is already the child of bodyElUS.
                    // We will now set bodyElUS to the new filtered dimensions and ensure the panel also matches.
                    zoneStatsPanelForUptime.style.width = `${captureWidthUS_filtered_Fortitude}px`;
                    zoneStatsPanelForUptime.style.height = `${captureHeightUS_filtered_Fortitude}px`;
                    // Ensure other absolute positioning styles are maintained or reapplied if styleBeforeFilteredRecalc wasn't complete
                    // The subsequent code already sets position:absolute, top:0, left:0, margin:0 for the screenshot.

                    // Update bodyElUS (which contains zoneStatsPanelForUptime) styles for the new dimensions
                    bodyElUS.style.width = `${captureWidthUS_filtered_Fortitude}px`;
                    bodyElUS.style.height = `${captureHeightUS_filtered_Fortitude}px`;

                    await new Promise(resolve => setTimeout(resolve, 350));
                    updateProgressMessage('Rendering "Filtered Uptime Stats (C18 & C19)" for Fortitude Report...');

                    const canvasUS_filtered_Fortitude = await html2canvas(bodyElUS, { // bodyElUS now contains the filtered and resized panel
                        logging: true, useCORS: true, scale: 2.0,
                        width: captureWidthUS_filtered_Fortitude, height: captureHeightUS_filtered_Fortitude,
                        windowWidth: captureWidthUS_filtered_Fortitude, windowHeight: captureHeightUS_filtered_Fortitude,
                        x: 0, y: 0, backgroundColor: null,
                    });

                    const imgDataUrlUS_filtered_Fortitude = canvasUS_filtered_Fortitude.toDataURL('image/png');

                    const imgElementUS_Fortitude = document.createElement('img');
                    imgElementUS_Fortitude.src = imgDataUrlUS_filtered_Fortitude;
                    imgElementUS_Fortitude.style.maxWidth = '100%';
                    imgElementUS_Fortitude.style.height = 'auto';
                    imgElementUS_Fortitude.style.marginTop = '15px';
                    imgElementUS_Fortitude.style.marginBottom = '15px';
                    imgElementUS_Fortitude.style.border = '1px solid #555';

                    fortitudeEmailBody.appendChild(document.createElement('p'));
                    fortitudeEmailBody.appendChild(imgElementUS_Fortitude);
                    fortitudeEmailBody.appendChild(document.createElement('p'));
                    fortitudeEmailBody.scrollTop = fortitudeEmailBody.scrollHeight;

                    updateProgressMessage('"Filtered Uptime Stats (C18 & C19)" screenshot added to Fortitude Report.');
                }
                // --- END: Add Filtered Uptime Stats (C18 & C19) to Fortitude Report ---

                const weatherReportsTitle = `<p><br></p>` + `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Weather Notes</p>`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDivWR = document.createElement('div');
                    tempDivWR.innerHTML = weatherReportsTitle + imageSeparatorHTML + `<p><br></p>`;
                    while(tempDivWR.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDivWR.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });


                updateProgressMessage('All reports and overview captured successfully!');
                metricsReportWindow.close();
                setTimeout(hideProgressOverlay, 2000);

            } catch (error) {
                console.error('Opti-Report: Error during Key Metrics capture sequence:', error);
                updateProgressMessage(`Error: ${error.message}`);
                if (metricsReportWindow && !metricsReportWindow.closed) {
                    metricsReportWindow.close();
                }
                if (error.message === 'Operation cancelled by user.' || cancelMetricsFetchFlag) {
                    hideProgressOverlay();
                } else {
                    setTimeout(hideProgressOverlay, 5000);
                }
            }
        };
    }


    async function openOptiReportPanel() {
        // Prevent multiple panels
        if (document.getElementById(PANEL_ID)) {
            return;
        }

        // Create overlay
        let overlay = document.createElement('div');
        overlay.id = PANEL_ID;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '10000'; // Ensure it's on top
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Create panel
        let panel = document.createElement('div');
        panel.style.backgroundColor = '#1e1e1e'; // Dark theme consistent with OptiFleet
        panel.style.padding = '25px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
        panel.style.width = '90%';
        panel.style.maxWidth = '700px'; // Max width for the panel
        panel.style.maxHeight = '90vh'; // Max height relative to viewport height
        panel.style.overflowY = 'auto'; // Scroll if content exceeds max height
        panel.style.color = '#e0e0e0'; // Light text color for dark background
        panel.style.fontFamily = 'Arial, sans-serif'; // Basic font

        // Panel Title
        let title = document.createElement('h2');
        title.innerText = 'Opti-Report';
        title.style.textAlign = 'center';
        title.style.color = '#ffffff';
        title.style.fontSize = '24px';
        title.style.marginBottom = '20px';
        title.style.borderBottom = '1px solid #444';
        title.style.paddingBottom = '15px';
        panel.appendChild(title);

        // Loading message
        let loadingMessage = document.createElement('p');
        loadingMessage.innerText = 'Generating reports, please wait...';
        loadingMessage.style.textAlign = 'center';
        loadingMessage.style.fontSize = '16px';
        loadingMessage.style.margin = '20px 0';
        panel.appendChild(loadingMessage);

        // --- Container for Full Report ---
        let fullReportContainer = document.createElement('div');
        fullReportContainer.id = 'optiFullReportContainer';
        fullReportContainer.style.marginBottom = '30px'; // Space between reports
        panel.appendChild(fullReportContainer);

        // --- Container for Fortitude Report ---
        let fortitudeReportContainer = document.createElement('div');
        fortitudeReportContainer.id = 'optiFortitudeReportContainer';
        panel.appendChild(fortitudeReportContainer);


        // --- Main Controls Container (for Close button, etc.) ---
        let mainControlsContainer = document.createElement('div');
        mainControlsContainer.style.display = 'flex';
        mainControlsContainer.style.justifyContent = 'flex-end'; // Aligns buttons to the right
        mainControlsContainer.style.marginTop = '20px'; // Add some space above the close button

        // Close Button
        let closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        // ... (styling from original closeButton)
        closeButton.style.padding = '12px 25px';
        closeButton.style.fontSize = '16px';
        closeButton.style.backgroundColor = '#f44336'; // Red color for close
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'background-color 0.3s ease';
        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#d32f2f';
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#f44336';
        closeButton.addEventListener('click', function() {
            overlay.remove();
        });
        mainControlsContainer.appendChild(closeButton);
        panel.appendChild(mainControlsContainer);

        // Add panel to overlay
        overlay.appendChild(panel);

        // Add overlay to body
        document.body.appendChild(overlay);

        // Asynchronously generate and display both reports
        (async () => {
            const fullReportEmailBody = await generateReportContent("Full Report", fullReportContainer);
            const fortitudeReportEmailBody = await generateReportContent("Fortitude Report", fortitudeReportContainer);
            loadingMessage.innerText = 'Fetching screenshots and additional data...'; // Update loading message
            await fetchKeyMetricsReportScreenshot(fullReportEmailBody, fortitudeReportEmailBody);
            loadingMessage.remove(); // Remove loading message once reports are generated
        })();
    }


    async function generateReportContent(reportType, container) {
        // Add a title for this specific report section within the container
        let reportSectionTitle = document.createElement('h3');
        reportSectionTitle.innerText = `${reportType} Details`;
        reportSectionTitle.style.textAlign = 'center';
        reportSectionTitle.style.color = '#cccccc';
        reportSectionTitle.style.fontSize = '20px';
        reportSectionTitle.style.marginTop = '10px';
        reportSectionTitle.style.marginBottom = '15px';
        reportSectionTitle.style.borderBottom = '1px solid #333';
        reportSectionTitle.style.paddingBottom = '10px';
        container.appendChild(reportSectionTitle);

        // Editable Content Area (Email Body)
        let emailBody = document.createElement('div');
        emailBody.contentEditable = 'true';
        emailBody.style.minHeight = '200px';
        emailBody.style.maxHeight = '40vh';
        emailBody.style.overflowY = 'auto';
        emailBody.style.border = '1px solid #555';
        emailBody.style.padding = '15px';
        emailBody.style.marginBottom = '20px';
        emailBody.style.backgroundColor = '#2a2a2a';
        emailBody.style.color = '#e0e0e0';
        emailBody.style.borderRadius = '4px';
        emailBody.style.lineHeight = '1.6';
        emailBody.setAttribute('aria-label', 'Email body content');

        // --- Common Styles and Placeholders ---
        const tableStyle = `border-collapse: collapse; width: 95%; margin: 15px auto; font-size: 14px;`;
        const thTdStyle = `border: 1px solid #444; text-align: left; padding: 8px;`;
        const sectionTitleStyle = `font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;`;
        const placeholderData = "---";
        const sectionSpacerHTML = `<p style="margin-bottom: 20px;">&nbsp;</p>`;


        // --- Common Header Content ---
        //const headerImageHTML = `<img src="https://media.discordapp.net/attachments/413885609686335500/1370942381297373256/Foundry-Site-Operations.png?ex=6827ec96&is=68269b16&hm=4b90dcc1bf09b7124fc99b1f2efcaa282e271c7b4bcdff7ede5e04b2cd28eaf6&=&format=webp&quality=lossless&width=1444&height=313" alt="Foundry Site Operations Logo" style="display:block; margin:0 auto 15px auto; max-width:300px; height:auto;">`;
        const headerImageHTML = `<img src="data:image/png;base64,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" alt="Foundry Site Operations Logo" style="display:block; margin:0 auto 15px auto; max-width:300px; height:auto;">`;


        const today = new Date();
        const dateHTML = `<p style="margin-bottom: 8px;">Date: ${today.toLocaleDateString()}</p>`;
        const siteName = getSelectedSiteName();
        const siteHTML = `<p style="margin-bottom: 15px;">Site: ${siteName}</p>`;
        const reportPlaceholderHTML = ""; // Kept from original, usually empty

        let currentEmailContentHTML = headerImageHTML + dateHTML + siteHTML;

        if (reportType === "Full Report") {
            const generalStatsTableHTML = `
                <table style="${tableStyle}">
                    <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Uptime 24hr Average</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Uptime Monthly Average</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Site Utilization</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Efficiency</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                </table>`;
            const fortitudeTitleHTML = `<p style="${sectionTitleStyle}">Fortitude Information</p>`;
            const fortitudeTableHTML = `
                <table style="${tableStyle}">
                    <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Offline awaiting repair</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Other Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Total Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                </table>`;
            const rammTitleHTML = `<p style="${sectionTitleStyle}">RAMM 1410 LLC Information</p>`;
            const rammTableHTML = `
                <table style="${tableStyle}">
                    <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Shipped Out for Repair</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Need Repaired</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Other Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Total Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                </table>`;
            const bitmainTitleHTML = `<p style="${sectionTitleStyle}">Bitmain Information</p>`;
            const bitmainTableHTML = `
                <table style="${tableStyle}">
                    <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Shipped out for repair</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Need repaired</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Other Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Total Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                </table>`;
            const repairNotesTitleHTML = `<p><br></p>` + `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Notes</p>`;
            const repairNotesContentHTML = `<p><br></p>`;
            const partsInvoicingTitleHTML = `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Parts Invoicing</p>`;
            const partsInvoicingContentHTML = `<p><br></p>`;

            currentEmailContentHTML += generalStatsTableHTML +
                                 sectionSpacerHTML +
                                 fortitudeTitleHTML +
                                 fortitudeTableHTML +
                                 sectionSpacerHTML +
                                 rammTitleHTML +
                                 rammTableHTML +
                                 sectionSpacerHTML +
                                 bitmainTitleHTML +
                                 bitmainTableHTML +
                                 repairNotesTitleHTML +
                                 imageSeparatorHTML +
                                 repairNotesContentHTML +
                                 partsInvoicingTitleHTML +
                                 imageSeparatorHTML +
                                 partsInvoicingContentHTML +
                                 reportPlaceholderHTML;
            emailBody.innerHTML = currentEmailContentHTML;

            getMinerData(function(minerData) {
                console.log('Miner data fetched for Full Report:', minerData);
                const subcustomerStats = {
                    Fortitude: { online: 0, offline: 0, needRepair: 0, hashrate: 0 },
                    RAMM: { online: 0, offline: 0, needRepair: 0, hashrate: 0 },
                    Bitmain: { online: 0, offline: 0, needRepair: 0, hashrate: 0 },
                };
                let totalOnline = 0;
                let totalOffline = 0;

                minerData.miners.forEach(miner => {
                    for (const subcustomer in subcustomerStats) {
                        if (miner.subcustomerName && miner.subcustomerName.includes(subcustomer)) {
                            if(miner.statusName != "Online" && miner.statusName != "Offline") { continue; }
                            if (miner.statusName === "Online" && miner.hashrate > 0) {
                                subcustomerStats[subcustomer].online++;
                                totalOnline++;
                            } else if (miner.statusName === "Offline" || miner.hashrate === 0) {
                                subcustomerStats[subcustomer].offline++;
                                totalOffline++;
                            }
                            if (miner.hashrate) {
                                subcustomerStats[subcustomer].hashrate += miner.hashrate;
                            }
                            break;
                        }
                    }
                });

                const generalStatsTable = emailBody.querySelector('table:nth-of-type(1)');
                const fortitudeTable = emailBody.querySelector('table:nth-of-type(2)');
                const rammTable = emailBody.querySelector('table:nth-of-type(3)');
                const bitmainTable = emailBody.querySelector('table:nth-of-type(4)');

                if (generalStatsTable) {
                    const rows = generalStatsTable.rows;
                    rows[1].cells[1].innerText = `${totalOnline} / ${totalOnline + totalOffline}`; // Miners Online
                }
                if (fortitudeTable) {
                    const rows = fortitudeTable.rows;
                    rows[0].cells[1].innerText = `${subcustomerStats.Fortitude.online} / ${subcustomerStats.Fortitude.online + subcustomerStats.Fortitude.offline}`;
                    let [hash, unit] = convertHashRate(subcustomerStats.Fortitude.hashrate);
                    rows[1].cells[1].innerText = `${hash} ${unit}/s`;
                    rows[2].cells[1].innerText = ``;
                    rows[3].cells[1].innerText = ``;
                    rows[4].cells[1].innerText = `${subcustomerStats.Fortitude.offline}`; // Total Offline for Fortitude
                }
                if (rammTable) {
                    const rows = rammTable.rows;
                    rows[0].cells[1].innerText = `${subcustomerStats.RAMM.online} / ${subcustomerStats.RAMM.online + subcustomerStats.RAMM.offline}`;
                    let [hash, unit] = convertHashRate(subcustomerStats.RAMM.hashrate);
                    rows[1].cells[1].innerText = `${hash} ${unit}/s`;
                    rows[2].cells[1].innerText = ``;
                    rows[3].cells[1].innerText = ``;
                    rows[4].cells[1].innerText = ``;
                    rows[5].cells[1].innerText = `${subcustomerStats.RAMM.offline}`;
                }
                if (bitmainTable) {
                    const rows = bitmainTable.rows;
                    rows[0].cells[1].innerText = `${subcustomerStats.Bitmain.online} / ${subcustomerStats.Bitmain.online + subcustomerStats.Bitmain.offline}`;
                    let [hash, unit] = convertHashRate(subcustomerStats.Bitmain.hashrate);
                    rows[1].cells[1].innerText = `${hash} ${unit}/s`;
                    rows[2].cells[1].innerText = ``;
                    rows[3].cells[1].innerText = ``;
                    rows[4].cells[1].innerText = ``;
                    rows[5].cells[1].innerText = `${subcustomerStats.Bitmain.offline}`;
                }
                console.log(subcustomerStats);
            });

        } else if (reportType === "Fortitude Report") {
            const fortitudeTitleHTML = `<p style="${sectionTitleStyle}">Fortitude Information</p>`;
            const fortitudeTableHTML = `
                <table style="${tableStyle}">
                    <tr><td style="${thTdStyle}">Fleet Utilization</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Uptime 24hr Average</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Uptime Monthly Average</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Efficiency</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Shipped Out for Repair</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Miners Need Repair</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Other Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Spare Miners</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                    <tr><td style="${thTdStyle}">Total Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                </table>`;
            const repairNotesTitleHTML = `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Notes</p>`;
            const repairNotesContentHTML = `<p><br></p>`;
            const partsInvoicingTitleHTML = `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Parts Invoicing</p>`;
            const partsInvoicingContentHTML = `<p><br></p>`;

            currentEmailContentHTML += fortitudeTitleHTML +
                                 fortitudeTableHTML +
                                 repairNotesTitleHTML +
                                 imageSeparatorHTML +
                                 repairNotesContentHTML +
                                 partsInvoicingTitleHTML +
                                 imageSeparatorHTML +
                                 partsInvoicingContentHTML;
            emailBody.innerHTML = currentEmailContentHTML;

            getMinerData(function(minerData) {
                console.log('Miner data fetched for Fortitude Report:', minerData);
                const fortitudeStats = {
                    online: 0,
                    offline: 0,
                    hashrate: 0,
                    expectedHashRate: 0,
                };

                minerData.miners.forEach(miner => {
                    if (miner.subcustomerName && miner.subcustomerName.includes("Fortitude") && (miner.statusName == "Online" || miner.statusName == "Offline")) {
                        if (miner.statusName === "Online" && miner.hashrate > 0) {
                            fortitudeStats.online++;
                        } else if (miner.statusName === "Offline" || miner.hashrate === 0) {
                            fortitudeStats.offline++;
                        }
                        if (miner.hashrate) {
                            fortitudeStats.hashrate += miner.hashrate;
                            fortitudeStats.expectedHashRate += miner.expectedHashRate;
                        }
                    }
                });

                const fortitudeTable = emailBody.querySelector('table:nth-of-type(1)');
                if (fortitudeTable) {
                    const efficiency = ((fortitudeStats.hashrate / fortitudeStats.expectedHashRate) * 100).toFixed(2);
                    const rows = fortitudeTable.rows;
                    rows[1].cells[1].innerText = `${fortitudeStats.online} / ${fortitudeStats.online + fortitudeStats.offline}`;
                    let [hash, unit] = convertHashRate(fortitudeStats.hashrate);
                    rows[2].cells[1].innerText = `${hash} ${unit}/s`;
                    rows[5].cells[1].innerText = `${efficiency}%`;
                    rows[6].cells[1].innerText = `${fortitudeStats.shippedOutForRepair}`;
                    rows[10].cells[1].innerText = `${fortitudeStats.offline}`;
                }
                console.log("Fortitude Stats:", fortitudeStats);
            });
        }

        container.appendChild(emailBody);

        // Copy to Clipboard Button
        let copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Email Body';
        copyButton.style.padding = '12px 20px';
        copyButton.style.fontSize = '15px';
        copyButton.style.backgroundColor = '#0078d4';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.transition = 'background-color 0.3s ease';
        copyButton.style.display = 'block';
        copyButton.style.margin = '20px auto 0 auto';

        copyButton.onmouseover = () => copyButton.style.backgroundColor = '#005a9e';
        copyButton.onmouseout = () => copyButton.style.backgroundColor = '#0078d4';

        copyButton.addEventListener('click', async function() {
            const htmlToCopy = emailBody.innerHTML;

            // Wrap in a basic HTML structure for better Outlook compatibility
            const outlookCompatibleHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <title>Email Content</title>
                    <style>
                        /* Basic styles for Outlook, if needed. Inline styles from emailBody.innerHTML are primary. */
                        body { font-family: Arial, sans-serif; }
                        table { border-collapse: collapse; }
                    </style>
                </head>
                <body>
                    ${htmlToCopy}
                </body>
                </html>`;

            if (navigator.clipboard && navigator.clipboard.write) {
                try {
                    const blob = new Blob([outlookCompatibleHtml], { type: 'text/html' }); // Use wrapped HTML
                    const clipboardItem = new ClipboardItem({ 'text/html': blob });
                    await navigator.clipboard.write([clipboardItem]);
                    copyButton.innerText = 'Copied!';
                    setTimeout(() => { copyButton.innerText = 'Copy Email Body'; }, 2000);
                } catch (err) {
                    console.error('Failed to copy HTML using Clipboard API: ', err);
                    fallbackCopy(outlookCompatibleHtml, copyButton); // Use wrapped HTML for fallback
                }
            } else {
                fallbackCopy(outlookCompatibleHtml, copyButton); // Use wrapped HTML for fallback
            }
        });
        container.appendChild(copyButton);
        return emailBody;
    }

    function fallbackCopy(htmlToCopy, copyButtonInstance) {
        const tempEl = document.createElement('div');
        tempEl.style.position = 'absolute';
        tempEl.style.left = '-9999px';
        tempEl.innerHTML = htmlToCopy;
        document.body.appendChild(tempEl);

        const range = document.createRange();
        range.selectNodeContents(tempEl);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            copyButtonInstance.innerText = 'Copied (fallback)!';
            setTimeout(() => { copyButtonInstance.innerText = 'Copy Email Body'; }, 2000);
        } catch (err) {
            console.error('Failed to copy HTML using execCommand: ', err);
            copyButtonInstance.innerText = 'Copy Failed';
            setTimeout(() => { copyButtonInstance.innerText = 'Copy Email Body'; }, 2000);
        }

        selection.removeAllRanges();
        document.body.removeChild(tempEl);
    }

    createOptiReportButton();
});

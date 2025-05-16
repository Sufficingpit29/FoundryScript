// ==UserScript==
// @name         Opti-Report
// @namespace    http://tampermonkey.net/
// @version      0.0.6
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
        return localStorage.getItem("selectedSiteName") || "N/A"; // Fallback if not found
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

    async function captureSingleReport(reportWindow, dateRangeKey, desiredRangeTextInSpan, emailBodiesArray, updateProgress) {
        if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
        updateProgress(`Verifying/setting date range to "${desiredRangeTextInSpan}"...`);
        console.log(`[Opti-Report] Starting captureSingleReport for: ${desiredRangeTextInSpan}`);

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

            while (elapsedTime < maxTotalWaitTime && !dateRangeTextConfirmed) {
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                attemptCount++;
                console.log(`[Opti-Report] Attempt ${attemptCount} to set date range text.`);

                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    console.log('[Opti-Report] Clicking #reportrange to open dropdown.');
                    reportRangeDiv.click();
                    const dateOption = await waitForElement(`li[data-range-key="${dateRangeKey}"]`, reportWindow.document, 2000);
                    await new Promise(resolve => setTimeout(resolve, 500));
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

        const reportElementSelector = '#mainContent m-container';
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

        emailBodiesArray.forEach(emailBodyToAppendTo => {
            const imgElement = document.createElement('img');
            imgElement.src = imgDataUrl;
            imgElement.style.maxWidth = '100%'; imgElement.style.height = 'auto';
            imgElement.style.marginTop = '15px'; imgElement.style.marginBottom = '15px';
            imgElement.style.border = '1px solid #555';

            emailBodyToAppendTo.appendChild(document.createElement('p'));
            emailBodyToAppendTo.appendChild(imgElement);
            emailBodyToAppendTo.appendChild(document.createElement('p'));
            emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
        });
        updateProgress(`"${desiredRangeTextInSpan}" screenshot added.`);
    }


    async function fetchKeyMetricsReportScreenshot(emailBodiesArray) {
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
                // --- Disable mouse inputs on the pop-out window ---
                disableMouseInputsInWindow(metricsReportWindow);
                // --- End of disabling mouse inputs ---

                if (cancelMetricsFetchFlag) {
                    if (metricsReportWindow && !metricsReportWindow.closed) metricsReportWindow.close();
                    hideProgressOverlay();
                    return;
                }
                updateProgressMessage('Report page loaded. Preparing for "Last 7 Days" report...');

                // Add title and separator for the 7-day report to all email bodies
                const title7DayHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">7 Day Average</p>`;
                const greenLineSeparatorHTML = `<hr style="border: none; border-top: 2px solid green; margin: 5px 2.5% 15px 2.5%; width: 95%;">`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDiv7Day = document.createElement('div');
                    tempDiv7Day.innerHTML = title7DayHTML + greenLineSeparatorHTML;
                    while(tempDiv7Day.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDiv7Day.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 7 Days" report...');
                await captureSingleReport(metricsReportWindow, "Last 7 Days", "Last 7 Days", emailBodiesArray, updateProgressMessage);

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for the 24-hour report
                const title24hrHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">24 Hour Average</p>`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDiv24hr = document.createElement('div');
                    tempDiv24hr.innerHTML = title24hrHTML + greenLineSeparatorHTML;
                    while(tempDiv24hr.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDiv24hr.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Reloading report page for 24-hour capture...');
                metricsReportWindow.location.reload(true); // Force reload
                await new Promise(resolve => setTimeout(resolve, 500));

                await waitForElement('#reportrange', metricsReportWindow.document, 15000); // Increased timeout for page reload
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after reload

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 24 Hours" report...');
                await captureSingleReport(metricsReportWindow, "Last 24 Hours", "Last 24 Hours", emailBodiesArray, updateProgressMessage);

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
                    tempDiv30Day.innerHTML = title30DayHTML + greenLineSeparatorHTML;
                    while(tempDiv30Day.firstChild) {
                        emailBodyToAppendTo.appendChild(tempDiv30Day.firstChild);
                    }
                    emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                });

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Reloading report page for 30-day capture...');
                metricsReportWindow.location.reload(true); // Force reload
                await new Promise(resolve => setTimeout(resolve, 1500));

                await waitForElement('#reportrange', metricsReportWindow.document, 15000); // Increased timeout for page reload
                disableMouseInputsInWindow(metricsReportWindow); // Re-apply after reload

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 30 Days" report...');
                await captureSingleReport(metricsReportWindow, "Last 30 Days", "Last 30 Days", emailBodiesArray, updateProgressMessage);

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
                    tempDivSiteOverview.innerHTML = titleSiteOverviewHTML + greenLineSeparatorHTML;
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
                    await new Promise(resolve => setTimeout(resolve, 100));
                    siteUtilizationValue = siteUtilization.textContent;
                }


                // --- Scrape data for General Site Stats Table ---
                try {
                    const hashRateFullSite = document.querySelector('#hashRateBarVal')?.textContent || 'N/A';


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
                                for (let i = 0; i < rows.length; i++) {
                                    const cells = rows[i].getElementsByTagName('td');
                                    if(cells[0].textContent === "Hashrate") {
                                        cells[1].textContent = hashRateFullSite;
                                    }
                                    if (cells[0].textContent === "Efficiency") {
                                        const siteEfficiencyValue = siteEfficiency ? siteEfficiency.textContent : 'N/A';
                                        cells[1].textContent = siteEfficiencyValue;
                                    }
                                }
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

                const titleHashrateEfficiencyHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Hashrate Efficiency</p>`;
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const tempDivHE = document.createElement('div');
                    tempDivHE.innerHTML = titleHashrateEfficiencyHTML + greenLineSeparatorHTML;
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
                    const titleFilteredHE_HTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Hashrate Efficiency (C18 &amp; C19)</p>`; // Corrected Title
                    const fortitudeEmailBody = emailBodiesArray[1];
                    const tempDivFilteredHE = document.createElement('div');
                    tempDivFilteredHE.innerHTML = titleFilteredHE_HTML + greenLineSeparatorHTML;
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

                const titleUptimeStatsHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Uptime Stats</p>`;
                if (emailBodiesArray[0]) { // Only for Full Report
                    const emailBodyToAppendTo = emailBodiesArray[0];
                    const tempDivUS = document.createElement('div');
                    tempDivUS.innerHTML = titleUptimeStatsHTML + greenLineSeparatorHTML;
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
                    const titleFilteredUS_Fortitude_HTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Uptime Stats</p>`;
                    const fortitudeEmailBody = emailBodiesArray[1];

                    const tempDivFilteredUS = document.createElement('div');
                    tempDivFilteredUS.innerHTML = titleFilteredUS_Fortitude_HTML + greenLineSeparatorHTML;
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

                const weatherReportsTitle = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Weather Notes</p>`;
                emailBodiesArray.forEach(emailBodyToAppendTo => {
                    const tempDivWR = document.createElement('div');
                    tempDivWR.innerHTML = weatherReportsTitle + greenLineSeparatorHTML;
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
            await fetchKeyMetricsReportScreenshot([fullReportEmailBody, fortitudeReportEmailBody]);
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
        const thStyle = `${thTdStyle} background-color: #333; color: #fff;`;
        const sectionTitleStyle = `font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;`;
        const placeholderData = "---";
        const sectionSpacerHTML = `<p style="margin-bottom: 20px;">&nbsp;</p>`;
        const greenLineSeparatorHTML = `<hr style="border: none; border-top: 2px solid green; margin: 5px 2.5% 15px 2.5%; width: 95%;">`;

        // --- Common Header Content ---
        const headerImageHTML = `<img src="https://media.discordapp.net/attachments/413885609686335500/1370942381297373256/Foundry-Site-Operations.png?ex=68215516&is=68200396&hm=db0eb1a9dd94a43d043bc811238026a4ffc610c5154a0c28a19b72496421b872&=&format=webp&quality=lossless&width=1011&height=219" alt="Foundry Site Operations Logo" style="display:block; margin:0 auto 15px auto; max-width:300px; height:auto;">`;
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
            const repairNotesTitleHTML = `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Notes</p>`;
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
                                 greenLineSeparatorHTML +
                                 repairNotesContentHTML +
                                 partsInvoicingTitleHTML +
                                 greenLineSeparatorHTML +
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
                                 greenLineSeparatorHTML +
                                 repairNotesContentHTML +
                                 partsInvoicingTitleHTML +
                                 greenLineSeparatorHTML +
                                 partsInvoicingContentHTML;
            emailBody.innerHTML = currentEmailContentHTML;

            getMinerData(function(minerData) {
                console.log('Miner data fetched for Fortitude Report:', minerData);
                const fortitudeStats = {
                    online: 0,
                    offline: 0,
                    hashrate: 0,
                    shippedOutForRepair: 0
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
                        }
                    }
                });

                const fortitudeTable = emailBody.querySelector('table:nth-of-type(1)');
                if (fortitudeTable) {
                    const rows = fortitudeTable.rows;
                    rows[1].cells[1].innerText = `${fortitudeStats.online} / ${fortitudeStats.online + fortitudeStats.offline}`;
                    let [hash, unit] = convertHashRate(fortitudeStats.hashrate);
                    rows[2].cells[1].innerText = `${hash} ${unit}/s`;
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
            if (navigator.clipboard && navigator.clipboard.write) {
                try {
                    const blob = new Blob([htmlToCopy], { type: 'text/html' });
                    const clipboardItem = new ClipboardItem({ 'text/html': blob });
                    await navigator.clipboard.write([clipboardItem]);
                    copyButton.innerText = 'Copied!';
                    setTimeout(() => { copyButton.innerText = 'Copy Email Body'; }, 2000);
                } catch (err) {
                    console.error('Failed to copy HTML using Clipboard API: ', err);
                    fallbackCopy(htmlToCopy, copyButton);
                }
            } else {
                fallbackCopy(htmlToCopy, copyButton);
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

// ==UserScript==
// @name         Opti-Report
// @namespace    http://tampermonkey.net/
// @version      0.0.2 // Version incremented
// @description  Adds an Opti-Report panel to the page with advanced screenshot capabilities.
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/Content/*
// @icon         https://foundryoptifleet.com/img/favicon-32x32.png
// @updateURL    https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiReport.js
// @downloadURL  https://raw.githubusercontent.com/Sufficingpit29/FoundryScript/main/OptiReport.js
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


    async function captureSingleReport(reportWindow, dateRangeKey, desiredRangeTextInSpan, emailBodyToAppendTo, updateProgress) {
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
        const imgElement = document.createElement('img');
        imgElement.src = imgDataUrl;
        imgElement.style.maxWidth = '100%'; imgElement.style.height = 'auto';
        imgElement.style.marginTop = '15px'; imgElement.style.marginBottom = '15px';
        imgElement.style.border = '1px solid #555';

        emailBodyToAppendTo.appendChild(document.createElement('p'));
        emailBodyToAppendTo.appendChild(imgElement);
        emailBodyToAppendTo.appendChild(document.createElement('p'));
        emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
        updateProgress(`"${desiredRangeTextInSpan}" screenshot added.`);
    }


    async function fetchKeyMetricsReportScreenshot(emailBodyToAppendTo) {
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
                if (cancelMetricsFetchFlag) {
                    if (metricsReportWindow && !metricsReportWindow.closed) metricsReportWindow.close();
                    hideProgressOverlay();
                    return;
                }
                updateProgressMessage('Report page loaded. Preparing for "Last 7 Days" report...');

                // Add title and separator for the 7-day report
                const title7DayHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">7 Day Average</p>`;
                const greenLineSeparatorHTML = `<hr style="border: none; border-top: 2px solid green; margin: 5px 2.5% 15px 2.5%; width: 95%;">`;
                const tempDiv7Day = document.createElement('div');
                tempDiv7Day.innerHTML = title7DayHTML + greenLineSeparatorHTML;
                while(tempDiv7Day.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDiv7Day.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 7 Days" report...');
                // Capture 1: Last 7 Days
                await captureSingleReport(metricsReportWindow, "Last 7 Days", "Last 7 Days", emailBodyToAppendTo, updateProgressMessage);

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for the 24-hour report
                const title24hrHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">24 Hour Average</p>`;
                // Re-use greenLineSeparatorHTML
                const tempDiv24hr = document.createElement('div');
                tempDiv24hr.innerHTML = title24hrHTML + greenLineSeparatorHTML;
                while(tempDiv24hr.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDiv24hr.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.'); 

                updateProgressMessage('Reloading report page for 24-hour capture...');
                metricsReportWindow.location.reload(true); // Force reload
                await new Promise(resolve => setTimeout(resolve, 500)); 

                // Wait for the page to reload and a key element to be ready
                // Using '#reportrange' as an indicator the main report UI is likely available.
                // waitForElement includes timeout and cancellation checks.
                await waitForElement('#reportrange', metricsReportWindow.document, 15000); // Increased timeout for page reload
                
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 24 Hours" report...');
                // Capture 2: Last 24 Hours
                await captureSingleReport(metricsReportWindow, "Last 24 Hours", "Last 24 Hours", emailBodyToAppendTo, updateProgressMessage);

                // --- Scrape Uptime 24hr Average ---
                try {
                    const uptimeStatElement = metricsReportWindow.document.querySelector('#uptimeStat');
                    let uptime24hrValue = "N/A";
                    if (uptimeStatElement && uptimeStatElement.textContent) {
                        uptime24hrValue = uptimeStatElement.textContent.trim();
                    }

                    const tables = emailBodyToAppendTo.getElementsByTagName('table');
                    if (tables.length > 0) {
                        const generalStatsTable = tables[0]; // Assuming it's the first table
                        const rows = generalStatsTable.getElementsByTagName('tr');
                        for (let i = 0; i < rows.length; i++) {
                            const cells = rows[i].getElementsByTagName('td');
                            if (cells.length > 1 && cells[0].textContent === "Uptime 24hr Average") {
                                cells[1].textContent = uptime24hrValue;
                                break;
                            }
                        }
                    }
                    console.log('[Opti-Report] Updated Uptime 24hr Average in email body:', uptime24hrValue);
                } catch (e) {
                    console.error('[Opti-Report] Error scraping or updating Uptime 24hr Average:', e);
                }
                // --- End of Uptime 24hr Average scraping ---

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for the 30-day report
                const title30DayHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">30 Day Average</p>`;
                // Re-use greenLineSeparatorHTML
                const tempDiv30Day = document.createElement('div');
                tempDiv30Day.innerHTML = title30DayHTML + greenLineSeparatorHTML;
                while(tempDiv30Day.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDiv30Day.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Reloading report page for 30-day capture...');
                metricsReportWindow.location.reload(true); // Force reload
                await new Promise(resolve => setTimeout(resolve, 1500)); 
                
                await waitForElement('#reportrange', metricsReportWindow.document, 15000); // Increased timeout for page reload

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Last 30 Days" report...');
                // Capture 3: Last 30 Days
                await captureSingleReport(metricsReportWindow, "Last 30 Days", "Last 30 Days", emailBodyToAppendTo, updateProgressMessage);

                // --- Scrape Uptime Monthly Average ---
                try {
                    const uptimeStatElement = metricsReportWindow.document.querySelector('#uptimeStat');
                    let uptimeMonthlyValue = "N/A";
                    if (uptimeStatElement && uptimeStatElement.textContent) {
                        uptimeMonthlyValue = uptimeStatElement.textContent.trim();
                    }

                    const tables = emailBodyToAppendTo.getElementsByTagName('table');
                    if (tables.length > 0) {
                        const generalStatsTable = tables[0]; // Assuming it's the first table
                        const rows = generalStatsTable.getElementsByTagName('tr');
                        for (let i = 0; i < rows.length; i++) {
                            const cells = rows[i].getElementsByTagName('td');
                            if (cells.length > 1 && cells[0].textContent === "Uptime Monthly Average") {
                                cells[1].textContent = uptimeMonthlyValue;
                                break;
                            }
                        }
                    }
                    console.log('[Opti-Report] Updated Uptime Monthly Average in email body:', uptimeMonthlyValue);
                } catch (e) {
                    console.error('[Opti-Report] Error scraping or updating Uptime Monthly Average:', e);
                }
                // --- End of Uptime Monthly Average scraping ---

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for the Site Overview
                const titleSiteOverviewHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Site Overview</p>`;
                // Re-use greenLineSeparatorHTML
                const tempDivSiteOverview = document.createElement('div');
                tempDivSiteOverview.innerHTML = titleSiteOverviewHTML + greenLineSeparatorHTML;
                while(tempDivSiteOverview.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDivSiteOverview.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Navigating to Site Overview page...');
                metricsReportWindow.location.href = 'https://foundryoptifleet.com/Content/Dashboard/SiteOverview?OptiReport';
                
                await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for navigation

                // Wait for the Site Overview page to load and the target element to be ready
                const siteOverviewElementSelector = 'div.m-section.has-space-xl'; // Target element for Site Overview, now more specific
                await waitForElement(siteOverviewElementSelector, metricsReportWindow.document, 20000); // Increased timeout for page navigation

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');
                updateProgressMessage('Capturing "Site Overview" section...');


                // --- Adapted screenshot logic for Site Overview ---
                const elementToCaptureSO = await waitForElement(siteOverviewElementSelector, metricsReportWindow.document);
                if (!elementToCaptureSO) {
                    throw new Error(`Could not find element "${siteOverviewElementSelector}" to capture for Site Overview.`);
                }

                const siteUtilization = await waitForElement('#siteUtilizationAssignedMinersPercent', metricsReportWindow.document, 10000);
                if (!siteUtilization) {
                    console.error('[Opti-Report] Site Utilization element not found. Defaulting to "N/A".');
                }

                // Wait until siteUtilization contains numbers
                let siteUtilizationValue = siteUtilization.textContent;
                while (!siteUtilizationValue.match(/^\d+(\.\d+)?%$/)) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 1 second
                    siteUtilizationValue = siteUtilization.textContent;
                }
                

                // --- Scrape data for General Site Stats Table ---
                try {
                    const hashRateFullSite = document.querySelector('#hashRateBarVal')?.textContent || 'N/A';
                        
                    
                    const siteEfficiency = metricsReportWindow.document.querySelector('#hashRateEfficiency');

                    // Update the table in emailBodyToAppendTo
                    const tables = emailBodyToAppendTo.getElementsByTagName('table');
                    if (tables.length > 0) {
                        const generalStatsTable = tables[0]; // Assuming it's the first table
                        const rows = generalStatsTable.getElementsByTagName('tr');
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
                    }
                    console.log('[Opti-Report] Updated Miners Online in email body:', minersOnlineTextValue);
                } catch (e) {
                    console.error('[Opti-Report] Error scraping or updating miner stats for email body:', e);
                }
                // --- End of data scraping ---


                // No longer need the explicit spacerSO div, padding will handle it.
                // const spacerSO = metricsReportWindow.document.createElement('div');
                // spacerSO.style.height = '70px'; // Adjust height as needed
                // spacerSO.style.width = '100%';
                // elementToCaptureSO.appendChild(spacerSO);

                const docElSO = metricsReportWindow.document.documentElement;
                const bodyElSO = metricsReportWindow.document.body;

                // Clear body and append only the target element
                bodyElSO.innerHTML = ''; 
                bodyElSO.appendChild(elementToCaptureSO);

                // Apply temporary styles for capture
                const originalElementCSSTextSO = elementToCaptureSO.style.cssText;
                elementToCaptureSO.style.cssText += `
                    position: static !important; width: auto !important; height: auto !important;
                    margin: 0 !important; 
                    padding: 0px 20px 70px 20px !important; /* Top, Right, Bottom, Left padding */
                    border: none !important;
                    transform: none !important; display: block !important; overflow: visible !important;
                    box-sizing: border-box !important;
                `;
                elementToCaptureSO.offsetHeight; // Force reflow

                const captureWidthSO = elementToCaptureSO.scrollWidth;
                const captureHeightSO = elementToCaptureSO.scrollHeight; // This will now include the padding
                elementToCaptureSO.style.cssText = originalElementCSSTextSO; // Restore original styles before final positioning

                // Determine page background color
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
                
                await new Promise(resolve => setTimeout(resolve, 350)); // Brief pause for rendering
                updateProgressMessage('Rendering "Site Overview" screenshot...');

                const canvasSO = await html2canvas(bodyElSO, {
                    logging: true, useCORS: true, scale: 2.0,
                    width: captureWidthSO, height: captureHeightSO,
                    windowWidth: captureWidthSO, windowHeight: captureHeightSO,
                    x: 0, y: 0, backgroundColor: null, // Use body background
                });

                const imgDataUrlSO = canvasSO.toDataURL('image/png');
                const imgElementSO = document.createElement('img');
                imgElementSO.src = imgDataUrlSO;
                imgElementSO.style.maxWidth = '100%'; imgElementSO.style.height = 'auto';
                imgElementSO.style.marginTop = '15px'; imgElementSO.style.marginBottom = '15px';
                imgElementSO.style.border = '1px solid #555';

                emailBodyToAppendTo.appendChild(document.createElement('p'));
                emailBodyToAppendTo.appendChild(imgElementSO);
                emailBodyToAppendTo.appendChild(document.createElement('p'));
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                updateProgressMessage('"Site Overview" screenshot added.');
                
                // Clean up the spacer is no longer needed as it was removed.
                // if (elementToCaptureSO.contains(spacerSO)) {
                //     elementToCaptureSO.removeChild(spacerSO);
                // }
                // --- End of adapted screenshot logic ---

                updateProgressMessage('Reloading page for "Hashrate Efficiency" capture...');
                metricsReportWindow.location.reload(true); // Force reload
                await new Promise(resolve => setTimeout(resolve, 500)); 

                // --- Capture Hashrate Efficiency (zone-stats-panel) ---
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for Hashrate Efficiency
                const titleHashrateEfficiencyHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Hashrate Efficiency</p>`;
                // Re-use greenLineSeparatorHTML
                const tempDivHE = document.createElement('div');
                tempDivHE.innerHTML = titleHashrateEfficiencyHTML + greenLineSeparatorHTML;
                while(tempDivHE.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDivHE.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Capturing "Hashrate Efficiency" section (zone-stats-panel)...');
                const zoneStatsPanelSelector = 'div.zone-stats-panel';
                // Ensure the main content of Site Overview is loaded before looking for zone-stats-panel
                await waitForElement('div.m-section.has-space-xl', metricsReportWindow.document, 10000); // Re-check main container
                
                const elementToCaptureHE = await waitForElement(zoneStatsPanelSelector, metricsReportWindow.document, 15000);
                if (!elementToCaptureHE) {
                    throw new Error(`Could not find element "${zoneStatsPanelSelector}" to capture for Hashrate Efficiency.`);
                }

                // Reload the Site Overview page to ensure a clean state for capturing zone-stats-panel
                updateProgressMessage('Reloading Site Overview for Hashrate Efficiency capture...');
                metricsReportWindow.location.href = 'https://foundryoptifleet.com/Content/Dashboard/SiteOverview?OptiReport';
                const gridID = '#zoneStatsGrid';
                await waitForElement('div.m-section.has-space-xl', metricsReportWindow.document, 20000); // Wait for main section to load\
                await waitForElement(gridID, metricsReportWindow.document, 15000); // Wait for zone-stats-panel to load
                
                // Wait until there are stat-panel classes available
                const statPanelClass = 'stat-panel';
                let statPanelCheckInterval = 1000; // Check every second
                let statPanelCheckTimeout = 15000; // 15 seconds max wait
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

                bodyElHE.innerHTML = ''; // Clear body
                bodyElHE.appendChild(freshElementToCaptureHE); // Add only the target element

                const originalElementCSSTextHE = freshElementToCaptureHE.style.cssText;
                freshElementToCaptureHE.style.cssText += `
                    position: static !important; width: auto !important; height: auto !important;
                    margin: 0 !important; 
                    padding: 20px 20px 20px 20px !important; /* Add some padding all around */
                    border: none !important;
                    transform: none !important; display: block !important; overflow: visible !important;
                    box-sizing: border-box !important;
                `;
                freshElementToCaptureHE.offsetHeight; // Force reflow

                const captureWidthHE = freshElementToCaptureHE.scrollWidth;
                const captureHeightHE = freshElementToCaptureHE.scrollHeight;
                freshElementToCaptureHE.style.cssText = originalElementCSSTextHE;

                const bodyOriginalBgStyleHE = metricsReportWindow.getComputedStyle(bodyElHE);
                const docElOriginalBgStyleHE = metricsReportWindow.getComputedStyle(docElHE);
                let pageBgColorHE = 'white'; // Fallback
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
                const imgElementHE = document.createElement('img');
                imgElementHE.src = imgDataUrlHE;
                imgElementHE.style.maxWidth = '100%'; imgElementHE.style.height = 'auto';
                imgElementHE.style.marginTop = '15px'; imgElementHE.style.marginBottom = '15px';
                imgElementHE.style.border = '1px solid #555';

                emailBodyToAppendTo.appendChild(document.createElement('p'));
                emailBodyToAppendTo.appendChild(imgElementHE);
                emailBodyToAppendTo.appendChild(document.createElement('p'));
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                updateProgressMessage('"Hashrate Efficiency" screenshot added.');
                // --- End of Hashrate Efficiency capture ---

                // --- Capture Uptime Tab within Hashrate Efficiency ---
                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                // Add title and separator for Uptime Stats
                const titleUptimeStatsHTML = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Uptime Stats</p>`;
                // Re-use greenLineSeparatorHTML
                const tempDivUS = document.createElement('div');
                tempDivUS.innerHTML = titleUptimeStatsHTML + greenLineSeparatorHTML;
                while(tempDivUS.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDivUS.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;

                if (cancelMetricsFetchFlag) throw new Error('Operation cancelled by user.');

                updateProgressMessage('Switching to "Uptime" tab in Site Overview...');
                const uptimeTabSelector = 'op-tab[for="zoneUptime"]';
                const uptimeTabElement = await waitForElement(uptimeTabSelector, metricsReportWindow.document, 10000);
                if (!uptimeTabElement) {
                    throw new Error(`Could not find Uptime tab "${uptimeTabSelector}".`);
                }
                uptimeTabElement.click();
                updateProgressMessage('Clicked "Uptime" tab. Waiting for content to load...');

                // Wait for the uptime grid to be populated or become visible
                // Assuming the grid ID follows a pattern like zoneStatsGrid -> zoneUptimeGrid
                const uptimeGridSelector = 'div#zoneUptimeGrid'; // Or a more specific selector if known
                await waitForElement(uptimeGridSelector, metricsReportWindow.document, 15000);
                // Add a small delay for rendering after the element is found
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                updateProgressMessage('Uptime content loaded. Capturing "Uptime Stats"...');

                // The element to capture is still the zone-stats-panel, but its content has changed
                const zoneStatsPanelForUptime = await waitForElement(zoneStatsPanelSelector, metricsReportWindow.document, 5000);
                if (!zoneStatsPanelForUptime) {
                    throw new Error(`Could not re-find element "${zoneStatsPanelSelector}" for Uptime capture.`);
                }

                // Re-use screenshot logic, similar to Hashrate Efficiency
                const docElUS = metricsReportWindow.document.documentElement;
                const bodyElUS = metricsReportWindow.document.body;

                bodyElUS.innerHTML = ''; // Clear body
                bodyElUS.appendChild(zoneStatsPanelForUptime); // Add only the target element

                const originalElementCSSTextUS = zoneStatsPanelForUptime.style.cssText;
                zoneStatsPanelForUptime.style.cssText += `
                    position: static !important; width: auto !important; height: auto !important;
                    margin: 0 !important; 
                    padding: 20px 20px 20px 20px !important; /* Add some padding all around */
                    border: none !important;
                    transform: none !important; display: block !important; overflow: visible !important;
                    box-sizing: border-box !important;
                `;
                zoneStatsPanelForUptime.offsetHeight; // Force reflow

                const captureWidthUS = zoneStatsPanelForUptime.scrollWidth;
                const captureHeightUS = zoneStatsPanelForUptime.scrollHeight;
                zoneStatsPanelForUptime.style.cssText = originalElementCSSTextUS;

                const bodyOriginalBgStyleUS = metricsReportWindow.getComputedStyle(bodyElUS);
                const docElOriginalBgStyleUS = metricsReportWindow.getComputedStyle(docElUS);
                let pageBgColorUS = 'white'; // Fallback
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
                const imgElementUS = document.createElement('img');
                imgElementUS.src = imgDataUrlUS;
                imgElementUS.style.maxWidth = '100%'; imgElementUS.style.height = 'auto';
                imgElementUS.style.marginTop = '15px'; imgElementUS.style.marginBottom = '15px';
                imgElementUS.style.border = '1px solid #555';

                emailBodyToAppendTo.appendChild(document.createElement('p'));
                emailBodyToAppendTo.appendChild(imgElementUS);
                emailBodyToAppendTo.appendChild(document.createElement('p'));
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;
                updateProgressMessage('"Uptime Stats" screenshot added.');
                // --- End of Uptime Tab capture ---

                // Add title and separator for Uptime Stats
                const weatherReportsTitle = `<p style="font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;">Weather Notes</p>`;
                // Re-use greenLineSeparatorHTML
                const tempDivWR = document.createElement('div');
                tempDivWR.innerHTML = weatherReportsTitle + greenLineSeparatorHTML;
                while(tempDivWR.firstChild) {
                    emailBodyToAppendTo.appendChild(tempDivWR.firstChild);
                }
                emailBodyToAppendTo.scrollTop = emailBodyToAppendTo.scrollHeight;


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


    // Function to open the overlay panel
    async function openOptiReportPanel() { // Made async for potential await later if needed
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

        // Editable Content Area (Email Body)
        let emailBody = document.createElement('div');
        emailBody.contentEditable = 'true';
        emailBody.style.minHeight = '200px'; // Minimum height for typing
        emailBody.style.maxHeight = '40vh'; // Max height before scrolling within the div
        emailBody.style.overflowY = 'auto';
        emailBody.style.border = '1px solid #555';
        emailBody.style.padding = '15px';
        emailBody.style.marginBottom = '20px';
        emailBody.style.backgroundColor = '#2a2a2a'; // Slightly lighter than panel for contrast
        emailBody.style.color = '#e0e0e0';
        emailBody.style.borderRadius = '4px';
        emailBody.style.lineHeight = '1.6';
        emailBody.setAttribute('aria-label', 'Email body content');

        // --- Table Styling ---
        const tableStyle = `border-collapse: collapse; width: 95%; margin: 15px auto; font-size: 14px;`;
        const thTdStyle = `border: 1px solid #444; text-align: left; padding: 8px;`;
        const thStyle = `${thTdStyle} background-color: #333; color: #fff;`;
        const sectionTitleStyle = `font-size: 16px; color: #fff; margin-top: 25px; margin-bottom: 10px; text-align: center; font-weight: bold;`; // Increased margin-top
        const placeholderData = "---"; // Placeholder for data points
        const sectionSpacerHTML = `<p style="margin-bottom: 20px;">&nbsp;</p>`; // Spacer paragraph

        // --- General Site Stats Table ---
        const generalStatsTableHTML = `
            <table style="${tableStyle}">
                <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr> 
                <tr><td style="${thTdStyle}">Uptime 24hr Average</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Uptime Monthly Average</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Site Utilization</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Efficiency</td><td style="${thTdStyle}">${placeholderData}</td></tr>
            </table>`;

        // --- Fortitude Information Table ---
        const fortitudeTitleHTML = `<p style="${sectionTitleStyle}">Fortitude Information</p>`;
        const fortitudeTableHTML = `
            <table style="${tableStyle}">
                <tr><td style="${thTdStyle}">Miners Online</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Hashrate</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Miners Offline awaiting repair</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Other Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
                <tr><td style="${thTdStyle}">Total Offline</td><td style="${thTdStyle}">${placeholderData}</td></tr>
            </table>`;

        // --- RAMM 1410 LLC Information Table ---
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

        // --- Bitmain Information Table ---
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

        // --- Repair and Maintenance Notes ---
        const repairNotesTitleHTML = `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Repair and Maintenance Notes</p>`; // Increased margin-top
        const greenLineSeparatorHTML = `<hr style="border: none; border-top: 2px solid green; margin: 5px 2.5% 15px 2.5%; width: 95%;">`;
        const repairNotesContentHTML = `<p><br></p>`; // Blank paragraph for user to start typing notes

        // --- Parts Invoicing ---
        const partsInvoicingTitleHTML = `<p style="${sectionTitleStyle} text-align: center; margin-top: 25px;">Parts Invoicing</p>`; // Increased margin-top
        const partsInvoicingGreenLineSeparatorHTML = `<hr style="border: none; border-top: 2px solid green; margin: 5px 2.5% 15px 2.5%; width: 95%;">`;
        const partsInvoicingContentHTML = `<p><br></p>`; // Blank paragraph for user to start typing notes

        // Header Image HTML String
        const headerImageHTML = `<img src="https://media.discordapp.net/attachments/413885609686335500/1370942381297373256/Foundry-Site-Operations.png?ex=68215516&is=68200396&hm=db0eb1a9dd94a43d043bc811238026a4ffc610c5154a0c28a19b72496421b872&=&format=webp&quality=lossless&width=1011&height=219" alt="Foundry Site Operations Logo" style="display:block; margin:0 auto 15px auto; max-width:300px; height:auto;">`; // Updated image URL and alt text, increased max-width slightly

        // Current Date HTML String
        const today = new Date();
        const dateHTML = `<p style="margin-bottom: 8px;">Date: ${today.toLocaleDateString()}</p>`;

        // Site Name HTML String
        const siteHTML = `<p style="margin-bottom: 15px;">Site: ${getSelectedSiteName()}</p>`;

        // Placeholder for report details - now blank
        const reportPlaceholderHTML = "";

        // Set initial content for the email body
        emailBody.innerHTML = headerImageHTML +
                      dateHTML +
                      siteHTML +
                      generalStatsTableHTML +
                      sectionSpacerHTML + // Added spacer
                      fortitudeTitleHTML +
                      fortitudeTableHTML +
                      sectionSpacerHTML + // Added spacer
                      rammTitleHTML +
                      rammTableHTML +
                      sectionSpacerHTML + // Added spacer
                      bitmainTitleHTML +
                      bitmainTableHTML +
                      repairNotesTitleHTML +
                      greenLineSeparatorHTML +
                      repairNotesContentHTML +
                      partsInvoicingTitleHTML +
                      partsInvoicingGreenLineSeparatorHTML +
                      partsInvoicingContentHTML +
                      reportPlaceholderHTML;

        // Get all miner data
        getMinerData(function(minerData) {
            console.log('Miner data fetched:', minerData);
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
                        if(miner.statusName === "Decommissioned") { continue; } // Skip decommissioned miners

                        if (miner.statusName === "Online") {
                            subcustomerStats[subcustomer].online++;
                            totalOnline++;
                        } else {
                            subcustomerStats[subcustomer].offline++;
                            totalOffline++;
                        }

                        if (miner.statusName === "Need Repair") {
                            subcustomerStats[subcustomer].needRepair++;
                        }

                        if (miner.hashrate) {
                            subcustomerStats[subcustomer].hashrate += miner.hashrate;
                        }
                        break; // Exit loop once matched
                    }
                }
            });

            // Update the tables with the data
            const generalStatsTable = emailBody.querySelector('table:nth-of-type(1)');
            const fortitudeTable = emailBody.querySelector('table:nth-of-type(2)');
            const rammTable = emailBody.querySelector('table:nth-of-type(3)');
            const bitmainTable = emailBody.querySelector('table:nth-of-type(4)');
            const generalStatsRows = generalStatsTable.querySelectorAll('tr');
            const fortitudeRows = fortitudeTable.querySelectorAll('tr');
            const rammRows = rammTable.querySelectorAll('tr');
            const bitmainRows = bitmainTable.querySelectorAll('tr');

            // Update General Stats
            generalStatsRows[1].cells[1].innerText = `${totalOnline} / ${totalOnline + totalOffline}`;


            // Update Fortitude Stats
            fortitudeRows[0].cells[1].innerText = `${subcustomerStats.Fortitude.online} / ${subcustomerStats.Fortitude.online + subcustomerStats.Fortitude.offline}`;
            let [fortitudeHashrate, fortitudeHashrateUnit] = convertHashRate(subcustomerStats.Fortitude.hashrate);
            fortitudeRows[1].cells[1].innerText = `${fortitudeHashrate} ${fortitudeHashrateUnit}/s`;
            fortitudeRows[2].cells[1].innerText = ``;
            fortitudeRows[3].cells[1].innerText = ``;
            fortitudeRows[4].cells[1].innerText = `${subcustomerStats.Fortitude.offline}`;

            // Update RAMM Stats
            rammRows[0].cells[1].innerText = `${subcustomerStats.RAMM.online} / ${subcustomerStats.RAMM.online + subcustomerStats.RAMM.offline}`;
            let [rammHashrate, rammHashrateUnit] = convertHashRate(subcustomerStats.RAMM.hashrate);
            rammRows[1].cells[1].innerText = `${rammHashrate} ${rammHashrateUnit}/s`;
            rammRows[2].cells[1].innerText = ``;
            rammRows[3].cells[1].innerText = ``;
            rammRows[4].cells[1].innerText = ``;
            rammRows[5].cells[1].innerText = `${subcustomerStats.RAMM.offline}`;

            // Update Bitmain Stats
            bitmainRows[0].cells[1].innerText = `${subcustomerStats.Bitmain.online} / ${subcustomerStats.Bitmain.online + subcustomerStats.Bitmain.offline}`;
            let [bitmainHashrate, bitmainHashrateUnit] = convertHashRate(subcustomerStats.Bitmain.hashrate);
            bitmainRows[1].cells[1].innerText = `${bitmainHashrate} ${bitmainHashrateUnit}/s`;
            bitmainRows[2].cells[1].innerText = ``;
            bitmainRows[3].cells[1].innerText = ``;
            bitmainRows[4].cells[1].innerText = ``;
            bitmainRows[5].cells[1].innerText = `${subcustomerStats.Bitmain.offline}`;

            console.log(subcustomerStats);
        });


        // Container for buttons
        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around'; // Keep as space-around or adjust as needed for 3 buttons
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.flexWrap = 'wrap'; // Allow buttons to wrap if not enough space

        fetchKeyMetricsReportScreenshot(emailBody);


        // Copy to Clipboard Button
        let copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Email Body';
        copyButton.style.padding = '12px 20px';
        copyButton.style.fontSize = '15px';
        copyButton.style.backgroundColor = '#0078d4'; // Blue color
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.transition = 'background-color 0.3s ease';
        copyButton.style.margin = '5px';

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
                    // Fallback to execCommand
                    fallbackCopy(htmlToCopy);
                }
            } else {
                // Fallback for older browsers
                fallbackCopy(htmlToCopy);
            }
        });

        function fallbackCopy(htmlToCopy) {
            const tempEl = document.createElement('div');
            // It's important that the temporary element is part of the DOM for execCommand to work.
            // However, it can be off-screen.
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
                copyButton.innerText = 'Copied (fallback)!';
                setTimeout(() => { copyButton.innerText = 'Copy Email Body'; }, 2000);
            } catch (err) {
                console.error('Failed to copy HTML using execCommand: ', err);
                copyButton.innerText = 'Copy Failed';
                setTimeout(() => { copyButton.innerText = 'Copy Email Body'; }, 2000);
            }

            selection.removeAllRanges();
            document.body.removeChild(tempEl);
        }

        // Close Button
        let closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.display = 'block';
        closeButton.style.margin = '5px'; // Remove auto margin as it's in a flex container
        closeButton.style.padding = '12px 25px';
        closeButton.style.fontSize = '16px';
        closeButton.style.backgroundColor = '#f44336'; // Red color for close
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'background-color 0.3s ease';

        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#d32f2f'; // Darker red on hover
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#f44336';

        closeButton.addEventListener('click', function() {
            overlay.remove();
        });

        // Assemble button container
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(closeButton);

        // Assemble panel
        panel.appendChild(title);
        panel.appendChild(emailBody); // Add editable email body
        panel.appendChild(buttonContainer); // Add button container

        // Add panel to overlay
        overlay.appendChild(panel);

        // Add overlay to body
        document.body.appendChild(overlay);
    }

    // Initialize
    createOptiReportButton();
});

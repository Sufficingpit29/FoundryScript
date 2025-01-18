// ==UserScript==
// @name         Opti-Watch
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Consolidates all the sites together into a single tab.
// @author       Matthew Axtell
// @match        https://foundryoptifleet.com/Content/*
// @match        https://foundryoptifleet.com/Content/Dashboard/SiteOverview?OptiWatch
// @icon         https://foundryoptifleet.com/img/favicon-32x32.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

//https://foundryoptifleet.com/api/ScheduledShutdowns?siteId=3&start=2025-01-11T04:50:38&end=2025-01-12T04:50:38&userId=e86d021e-b084-47f8-8e6d-182d17c48a84&companyFilter=64

let currentURL = window.location.href;
let loadingStatus;
window.addEventListener('load', async function () {

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

    async function getCompanies() {
        let companies = [];
        try {
            if (!userID) {
            throw new Error('userID is not defined');
            }

            const url = `https://foundryoptifleet.com/api/companies?filterActive=true&userId=${userID}&companyFilter=331`;
            console.log('Fetching URL:', url);
            const resp = await fetchData(url);
            if (resp && resp.companies) {
                companies = resp.companies;
            }

            loadingStatus.innerText = 'Retrived Companies!';

            console.log('Companies:', companies);
            return companies;
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    }

    async function getSites(userID, companies) {
        let allSites = {};
        try {
            if (!userID) {
                throw new Error('userID is not defined');
            }

            for (const company of companies) {
                loadingStatus.innerText = `Getting Sites for ${company.name}...`;

                const url = `https://foundryoptifleet.com/api/Agents?userId=${userID}&companyFilter=${company.id}`;
                console.log('Fetching URL:', url);
                const resp = await fetchData(url);
                console.log('Sites Response:', resp);
                if (resp && resp.agents) {
                    // Loop through resp.sites and add the company id to each site
                    for (const site of resp.agents) {
                        site.companyId = company.id;
                    }

                    allSites[company.name] = {
                        companyId: company.id,
                        sites: resp.agents
                    };
                }
            }

            loadingStatus.innerText = 'Retrieved Sites!';

            console.log('All Sites:', allSites);
            return allSites;
        } catch (error) {
            console.error('Error fetching sites:', error);
            return {};
        }
    }

    async function getHashingInventory(userID, sites) {
        try {
            if (!userID) {
                throw new Error('userID is not defined');
            }
            console.log('GettingSites:', sites);
            for (const site of sites) {

                loadingStatus.innerText = `Getting Miners/Hashing Data for ${site.siteName}...`;

                const url = `https://foundryoptifleet.com/api/HashingInventory?siteId=${site.siteId}&userId=${userID}&companyFilter=${site.companyId}`;
                console.log('Fetching URL:', url);
                const resp = await fetchData(url);
                console.log('Hashing Inventory Response:', resp);
                if (resp) {
                    site.hashingInventory = resp;
                }
            }

            loadingStatus.innerText = 'Retrieved Miners/Hashing Data!';
            console.log('Sites with Hashing Inventory:', sites);
        } catch (error) {
            console.error('Error fetching hashing inventory:', error);
        }
    }

    if(!currentURL.includes("OptiWatch")) {
        // Function to create and inject the new button
        function createOptiWatchButton() {
            // Create a new anchor element
            let newButton = document.createElement('a');
            newButton.href = '#';
            newButton.className = 'm-nav-item';
            newButton.innerHTML = '<m-icon name="eye" size="l"></m-icon> Opti-Watch';

            // Find the Site Map element
            let siteMapElement = document.querySelector('a[href="/Content/Dashboard/Miners/Map"]');

            // Insert the new button after the Site Map element
            if (siteMapElement) {
                siteMapElement.parentNode.insertBefore(newButton, siteMapElement.nextSibling);
            }

            // Add click event to the new button
            newButton.addEventListener('click', function(event) {
                event.preventDefault();
                openPopoutWindow();
            });
        }

        // Function to open the popout window
        function openPopoutWindow() {
            const popoutWindow = window.open('https://foundryoptifleet.com/Content/Dashboard/SiteOverview?OptiWatch', 'Opti-Watch', 'width=2100,height=800');
            // Overlay a black background to hide everything in the popout window
            popoutWindow.document.body.style.backgroundColor = '#000';
            let overlay = popoutWindow.document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgb(32, 32, 32)';
            overlay.id = 'optiWatchOverlay';

            popoutWindow.document.body.appendChild(overlay);

            // Set the title of the popout window
            popoutWindow.document.title = 'Opti-Watch';
        }

        createOptiWatchButton();
        
    } else if(currentURL.includes("OptiWatch")) {
        console.log('Opti-Watch popout window');

        // Create a full overlay to block the page
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(32, 32, 32, 1)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        // Create a loading spinner
        let spinner = document.createElement('m-spinner');
        spinner.size = 'xl';

        // Add spinner styles
        let style1 = document.createElement('style');
        style1.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            m-spinner {
                border: 16px solid #f3f3f3;
                border-top: 16px solid #3498db;
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
            }
        `;
        document.head.appendChild(style1);

        // Add loading text below the spinner
        let loadingText = document.createElement('h1');
        loadingText.style.color = '#fff';
        loadingText.style.fontSize = '24px';
        loadingText.innerText = 'Loading Opti-Watch...';

        // Text that displays what is currently being loaded
        loadingStatus = document.createElement('p');
        loadingStatus.style.color = '#fff';
        loadingStatus.style.fontSize = '16px';
        loadingStatus.innerText = 'Getting Companies...';

        // Append the spinner, loading text, and loading status to the overlay
        overlay.appendChild(spinner);
        overlay.appendChild(loadingText);
        overlay.appendChild(loadingStatus);

        // Append the overlay to the body
        document.body.appendChild(overlay);

        // Define SVG icons as functions
        function getOnlineIcon(color, isFlashing) {
            return `
                <svg part="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="m-icon is-size-xl ${isFlashing ? 'flashing' : ''}">
                    <path d="M12 20h.01"></path>
                    <path d="M2 8.82a15 15 0 0 1 20 0"></path>
                    <path d="M5 12.859a10 10 0 0 1 14 0"></path>
                    <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
                </svg>
            `;
        }

        const offlineIcon = `
            <svg part="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="m-icon is-size-xl is-error">
                <path d="M12 20h.01"></path>
                <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
                <path d="M5 12.859a10 10 0 0 1 5.17-2.69"></path>
                <path d="M19 12.859a10 10 0 0 0-2.007-1.523"></path>
                <path d="M2 8.82a15 15 0 0 1 4.177-2.643"></path>
                <path d="M22 8.82a15 15 0 0 0-11.288-3.764"></path>
                <path d="m2 2 20 20"></path>
            </svg>
        `;

        // Function to interpolate color between green and red
        function interpolateColor(percentage) {
            const r = Math.round(255 * (1 - percentage));
            const g = Math.round(255 * percentage);
            return `rgb(${r}, ${g}, 0)`;
        }

        // Add styles for the pulsing dot, flashing icon, and tooltip
        let style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            @keyframes flash {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            m-spinner {
                border: 16px solid #f3f3f3;
                border-top: 16px solid #3498db;
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
            }
            .pulsing-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
            }
            .flashing {
                animation: flash 1s infinite;
            }
            .tooltip {
                position: absolute;
                visibility: hidden;
                opacity: 0;
                background-color: #333;
                color: #fff;
                padding: 5px 8px;
                border-radius: 3px;
                z-index: 1;
                transition: opacity 0.3s ease-in-out;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);

        let longesttotalhashingtextWidth = 0; // Define longesttotalhashingtextWidth outside the function as a quick fix for it resizing the width to zero after refresh sometimes.
        let enabledAutoReboots = {};

        // Function to create the overlay in the popout window
        function createOverlay(doc, sites) {
            longesttotalhashingtextWidth = 0;

            // Create overlay div
            let overlay = doc.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            overlay.style.zIndex = '9999';
            overlay.id = 'optiWatchOverlay';

            // Create panel div
            let panel = doc.createElement('div');
            panel.style.position = 'absolute';
            panel.style.top = '5%';
            panel.style.left = '5%';
            panel.style.width = '90%';
            panel.style.height = '90%';
            panel.style.backgroundColor = '#1e1e1e';
            panel.style.borderRadius = '10px';
            panel.style.padding = '20px';
            panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            panel.style.overflow = 'hidden'; // Ensure the panel has a fixed size

            // Create title
            let title = doc.createElement('h1');
            title.style.display = 'flex';
            title.style.alignItems = 'center';
            title.style.color = '#fff';
            title.style.marginBottom = '20px';
            title.innerHTML = '<m-icon name="eye" size="xl" style="margin-right: 10px;"></m-icon> Opti-Watch';

            // Create inner scroll panel
            scrollPanel = doc.createElement('div'); // Update scrollPanel here
            scrollPanel.style.height = 'calc(100% - 120px)'; // Adjusted to fit between title and close button
            scrollPanel.style.overflowY = 'auto';
            scrollPanel.style.backgroundColor = '#2a2a2a';
            scrollPanel.style.borderRadius = '5px';
            scrollPanel.style.padding = '10px';

            let totalhashingtextsElements = [];

            // Loop through companies and add a pane for each
            for (const companyName in sites) {
                const company = sites[companyName];
                let totalNonHashing = 0;
                let totalMiners = 0;

                // Calculate total non-hashing and total miners for the company
                for (const site of company.sites) {
                    totalNonHashing += site.hashingInventory.notHashingCount;
                    totalMiners += site.hashingInventory.totalActiveOrUnreachableCount;
                }

                // Create company container
                let companyContainer = doc.createElement('div');
                companyContainer.style.backgroundColor = '#444';
                companyContainer.style.borderRadius = '5px';
                companyContainer.style.padding = '10px';
                companyContainer.style.marginBottom = '10px';

                // Create company title
                let companyTitle = doc.createElement('h2');
                companyTitle.style.color = '#fff';
                companyTitle.style.cursor = 'pointer';
                companyTitle.style.display = 'flex';
                companyTitle.style.justifyContent = 'space-between';

                // Calculate the hashing percentage
                let hashingPercentage = (totalMiners - totalNonHashing) / totalMiners;
                let color = `rgb(${255 * (1 - hashingPercentage)}, ${255 * hashingPercentage}, 0)`;
                let pulsingDot = `<span class="pulsing-dot ${hashingPercentage < 0.5 ? 'flashing' : ''}" style="background-color: ${color};"></span>`;

                // Create online status icons
                let onlineStatusIcons = '';
                for (const site of company.sites) {
                    let onlineStatusIcon = `
                        <span class="online-status-icon" title="${site.siteName} - Agent ${site.agentName} ${site.isOnline ? 'Online' : 'Offline'}" style="margin-right: 10px; position: relative;">
                            ${site.isOnline ? getOnlineIcon : offlineIcon}
                        </span>
                    `;
                    onlineStatusIcons += onlineStatusIcon;
                }

                companyTitle.innerHTML = `
                    <span><span class="expand-icon" style="margin-right: 10px;">+</span> ${companyName}</span>
                    <span style="display: flex; align-items: center;">
                        <span class="online-status-container" style="display: flex; margin-right: 10px;">
                        </span>
                        <span class="totalhashingtext" style="left: 0; text-align: left;">
                            ${pulsingDot}Total Non-Hashing: ${totalNonHashing}/${totalMiners}
                        </span>
                    </span>
                `;

                const onlineStatusContainer = companyTitle.querySelector('.online-status-container');
                company.sites.forEach(site => {
                    const statusIcon = doc.createElement('span');
                    statusIcon.style.marginRight = '5px';
                    const hashingPercentage = site.hashingInventory.hashingCount / site.hashingInventory.totalActiveOrUnreachableCount;
                    const color = interpolateColor(hashingPercentage);
                    const isFlashing = hashingPercentage < 0.5;
                    statusIcon.innerHTML = site.isOnline ? getOnlineIcon(color, isFlashing) : offlineIcon;
                    onlineStatusContainer.appendChild(statusIcon);

                    // Add tooltip
                    const tooltip = doc.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.style.position = 'absolute';
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                    tooltip.style.backgroundColor = '#333';
                    tooltip.style.color = '#fff';
                    tooltip.style.padding = '5px';
                    tooltip.style.borderRadius = '5px';
                    tooltip.style.zIndex = '1';

                    tooltip.innerText = `${site.siteName}:\n[${site.agentName}] ${site.isOnline ? 'Online' : 'Offline'}\nNon-Hashing: ${site.hashingInventory.notHashingCount}/${site.hashingInventory.totalActiveOrUnreachableCount}\nHashing Percentage: ${((site.hashingInventory.hashingCount / site.hashingInventory.totalActiveOrUnreachableCount) * 100).toFixed(1)}%`;
                    statusIcon.appendChild(tooltip);
                });

               

                // Add event listeners for tooltips after appending to the DOM
                setTimeout(() => {
                    console.log('Company Title:', companyTitle);
                    console.log("Setting up event listeners for tooltips");
                    const onlineStatusIconContainers = companyTitle.querySelectorAll('.online-status-container');
                    // Loop through all children of each onlineStatusIconContainers
                    onlineStatusIconContainers.forEach(onlineStatusIconContainer => {
                        let children = onlineStatusIconContainer.children;
                        children = Array.from(children);
                        children.forEach(icon => {
                            console.log('Icon:', icon);
                            icon.addEventListener('mouseover', function () {
                                console.log('Mouseover:', icon);
                                const tooltip = icon.querySelector('.tooltip');
                                tooltip.style.visibility = 'visible';
                                tooltip.style.opacity = '1';
                            });

                            icon.addEventListener('mouseout', function () {
                                const tooltip = icon.querySelector('.tooltip');
                                tooltip.style.visibility = 'hidden';
                                tooltip.style.opacity = '0';
                            });
                        });
                    });
                }, 0);

                // get the totalhashingtext element and print it
                let totalhashingtext = companyTitle.querySelector('.totalhashingtext');
                totalhashingtextsElements.push(totalhashingtext);

                // Create company sites container
                let companySitesContainer = doc.createElement('div');
                companySitesContainer.style.display = 'none'; // Initially hidden
                companySitesContainer.style.marginTop = '10px'; // Margin when expanded

                // Add click event to toggle visibility
                companyTitle.addEventListener('click', function() {
                    const isExpanded = companySitesContainer.style.display === 'block';
                    companySitesContainer.style.display = isExpanded ? 'none' : 'block';

                    // Change the + to a - when expanded
                    const expandIcon = companyTitle.querySelector('.expand-icon');
                    expandIcon.innerText = isExpanded ? '+' : '-';
                  
                });

                for (const site of company.sites) {
                    let sitePane = doc.createElement('div');
                    sitePane.style.backgroundColor = '#333';
                    sitePane.style.borderRadius = '5px';
                    sitePane.style.padding = '10px';
                    sitePane.style.marginBottom = '10px';

                    let siteTitleContainer = doc.createElement('div');
                    siteTitleContainer.style.display = 'flex';
                    siteTitleContainer.style.justifyContent = 'space-between'; // Align items to the sides

                    // Online status
                    let onlineStatus = doc.createElement('div');
                    const hashingPercentage = site.hashingInventory.hashingCount / site.hashingInventory.totalActiveOrUnreachableCount;
                    const color = interpolateColor(hashingPercentage);
                    const isFlashing = hashingPercentage < 0.5;
                    onlineStatus.innerHTML = site.isOnline ? getOnlineIcon(color, isFlashing) : offlineIcon;

                    let siteTitle = doc.createElement('h3');
                    siteTitle.style.color = '#fff';
                    siteTitle.style.marginLeft = '10px';
                    siteTitle.style.marginBottom = '5px';
                    siteTitle.innerText = site.siteName;

                    // Create "Auto-Reboot Element" button
                    let autoRebootButton = doc.createElement('button');
                    autoRebootButton.innerText = 'Enable Test';
                    autoRebootButton.style.padding = '5px 10px';
                    autoRebootButton.style.marginBottom = '10px';
                    autoRebootButton.style.fontSize = '14px';
                    autoRebootButton.style.cursor = 'pointer';
                    autoRebootButton.style.backgroundColor = '#28a745'; // Green color
                    autoRebootButton.style.color = '#fff';
                    autoRebootButton.style.border = 'none';
                    autoRebootButton.style.borderRadius = '5px';
                    autoRebootButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    autoRebootButton.style.transition = 'background-color 0.3s';
                    autoRebootButton.style.marginLeft = 'auto'; // Align to right

                    // Add hover effect
                    autoRebootButton.addEventListener('mouseover', function() {
                        autoRebootButton.style.backgroundColor = '#218838';
                    });

                    autoRebootButton.addEventListener('mouseout', function() {
                        autoRebootButton.style.backgroundColor = '#28a745';
                    });

                    // Add click event to the button
                    autoRebootButton.addEventListener('click', function() {
                        // Toggle the auto-reboot panel
                        if (autoRebootPanel.style.display === 'none') {
                            autoRebootPanel.style.display = 'block';
                            autoRebootButton.innerText = 'Disable Test';
                            enabledAutoReboots[site.siteId] = true;
                        } else {
                            autoRebootPanel.style.display = 'none';
                            autoRebootButton.innerText = 'Enable Test';
                            enabledAutoReboots[site.siteId] = false;
                        }
                    });

                    // Create new scroll panel element below the stats elements
                    let autoRebootPanel = doc.createElement('div');
                    autoRebootPanel.style.marginTop = '10px';
                    autoRebootPanel.style.padding = '10px';
                    autoRebootPanel.style.backgroundColor = '#555';
                    autoRebootPanel.style.borderRadius = '5px';
                    autoRebootPanel.innerText = 'This does not do anything yet.';
                    autoRebootPanel.style.display = 'none'; // Initially hidden

                    if (enabledAutoReboots[site.siteId]) {
                        autoRebootPanel.style.display = 'block';
                        autoRebootButton.innerText = 'Disable Auto-Reboot';
                    }

                    siteTitleContainer.appendChild(onlineStatus);
                    siteTitleContainer.appendChild(siteTitle);
                    siteTitleContainer.appendChild(autoRebootButton);

                    let siteMetricsContainer = doc.createElement('div');
                    siteMetricsContainer.className = 'm-grid-list is-size-l';
                    //siteMetricsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(480px, 1fr))';
                    siteMetricsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';

                    const minersWithLocations = site.hashingInventory.minerCountWithLocations;
                    const reservedLocationCount = site.hashingInventory.reservedLocationCount;
                    const totalAssignedSlots = minersWithLocations + reservedLocationCount;
                    const assignedPercentage = (totalAssignedSlots / site.hashingInventory.positionCount) * 100;
                    //let totalAssignedSlots = site.hashingInventory.totalCount + site.hashingInventory.reservedLocationCount;
                    let siteUtilization = doc.createElement('m-box');
                    siteUtilization.className = 'bar-chart-card';
                    siteUtilization.innerHTML = `
                        <m-stack space="m">
                            <m-heading size="l">Site Utilization</m-heading>
                            <div>
                                <h4 class="bar-chart-title m-text is-size-xs is-secondary">Assigned Slots / Total Slots</h4>
                                <div class="bar-chart-row">
                                    <div class="bar-chart-container">
                                        <div class="bar-chart" style="background-color: #4caf50; width: ${Math.min(assignedPercentage, 100)}%; color: #fff;">
                                            <h4 class="m-heading" style="white-space: nowrap;">${totalAssignedSlots} Assigned</h4>
                                        </div>
                                    </div>
                                    <div class="bar-chart-total">
                                        <span class="m-heading is-size-xs">${site.hashingInventory.positionCount}</span>
                                        <span class="m-text is-size-xs is-tertiary">Total</span>
                                    </div>
                                </div>
                            </div>
                            <div class="site-utilization-metrics">
                                <div>
                                    <span class="m-text is-size-l">${assignedPercentage.toFixed(2)}%</span>
                                    <span class="m-text is-size-s is-secondary"> Assigned</span>
                                </div>
                                <div class="metric-row">
                                    <span class="m-link">${site.hashingInventory.unassignedCount} Unassigned</span>
                                </div>
                            </div>
                        </m-stack>
                    `;

                    let uptime = doc.createElement('m-box');
                    uptime.className = 'bar-chart-card';
                    uptime.innerHTML = `
                        <m-stack space="m">
                            <m-heading size="l">Uptime</m-heading>
                            <div class="bar-chart-section">
                                <h4 class="bar-chart-title m-text is-secondary is-size-xs">Miners Hashing / Total Miners</h4>
                                <div class="bar-chart-row">
                                    <div class="bar-chart-container">
                                        <div class="bar-chart" style="background-color: #4caf50; width: ${Math.min((site.hashingInventory.hashingCount / site.hashingInventory.totalActiveOrUnreachableCount) * 100, 100)}%; color: #fff;">
                                            <h4 class="m-heading" style="white-space: nowrap;">${site.hashingInventory.hashingCount} Hashing</h4>
                                        </div>
                                    </div>
                                    <div class="bar-chart-total">
                                        <span class="m-heading is-size-xs">${site.hashingInventory.totalActiveOrUnreachableCount}</span>
                                        <span class="m-text is-size-xs is-tertiary">Total</span>
                                    </div>
                                </div>
                            </div>
                            <div class="site-utilization-metrics">
                                <div>
                                    <span class="m-text is-size-l">${((site.hashingInventory.hashingCount / site.hashingInventory.totalActiveOrUnreachableCount) * 100).toFixed(2)}%</span>
                                    <span class="m-text is-size-s is-secondary"> Uptime</span>
                                </div>
                                <div class="metric-row">
                                    <span class="m-link is-size-l">${site.hashingInventory.unreachableMinersCount} Offline</span>
                                </div>
                            </div>
                        </m-stack>
                    `;

                    let hashRate = doc.createElement('m-box');
                    hashRate.className = 'bar-chart-card';
                    hashRate.innerHTML = `
                        <m-stack space="m">
                            <div class="bar-chart-card-title">
                                <m-heading size="l">Hash Rate</m-heading>
                            </div>
                            <div class="bar-chart-section">
                                <h4 class="bar-chart-title m-text is-secondary is-size-xs">Total Hash Rate / Hash Rate Potential</h4>
                                <div class="bar-chart-row">
                                    <div class="bar-chart-container">
                                        <div class="bar-chart" style="background-color: #4caf50; width: ${Math.min((site.hashingInventory.siteHashrate / site.hashingInventory.siteExpectedHashrate) * 100, 100)}%; color: #fff;">
                                            <h4 class="m-heading" style="white-space: nowrap;">${site.hashingInventory.siteHashrate} ${site.hashingInventory.siteHashrateUnit}</h4>
                                        </div>
                                    </div>
                                    <div class="bar-chart-total">
                                        <span class="m-heading is-size-xs">${site.hashingInventory.siteExpectedHashrate}</span>
                                        <span class="m-text is-size-xs is-tertiary">${site.hashingInventory.siteExpectedHashrateUnit}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span class="m-text is-size-l">${((site.hashingInventory.siteHashrate / site.hashingInventory.siteExpectedHashrate) * 100).toFixed(2)}%</span>
                                <span class="m-text is-size-s is-secondary"> Efficiency</span>
                            </div>
                        </m-stack>
                    `;

                    let hashingImpact = doc.createElement('m-box');
                    hashingImpact.className = 'impact-card';
                    hashingImpact.innerHTML = `
                        <m-heading size="l">Hashing Impact</m-heading>
                        <div class="impact-card-row">
                            <div class="circle">
                                <m-icon name="circle-dot" size="xl" class="low-hashing-icon"></m-icon>
                            </div>
                            &nbsp;
                            <div class="impact-card-row-data">
                                <m-text as="span" size="m">${site.hashingInventory.lowHashingCount}/${site.hashingInventory.totalActiveOrUnreachableCount}</m-text>
                                <m-text variant="tertiary" size="xs">Low Hashing</m-text>
                            </div>
                            <div class="impact-card-row-data">
                                <m-text as="span" size="m">${site.hashingInventory.lowHashingImpactValue} ${site.hashingInventory.lowHashingImpactUnit}</m-text>
                                <m-text variant="tertiary" size="xs">Impact</m-text>
                            </div>
                        </div>
                        <div class="impact-card-row">
                            <div class="circle">
                                <m-icon name="circle-dot" size="xl" class="not-hashing-icon"></m-icon>
                            </div>
                            &nbsp;
                            <div class="impact-card-row-data">
                                <m-text as="span" size="m">${site.hashingInventory.notHashingCount}/${site.hashingInventory.totalActiveOrUnreachableCount}</m-text>
                                <m-text variant="tertiary" size="xs">Non Hashing</m-text>
                            </div>
                            <div class="impact-card-row-data">
                                <m-text as="span" size="m">${site.hashingInventory.notHashingImpactValue} ${site.hashingInventory.notHashingImpactUnit}</m-text>
                                <m-text variant="tertiary" size="xs">Impact</m-text>
                            </div>
                        </div>
                        <div name="3px spacer" style="height: 3px;"></div>
                    `;

                    siteMetricsContainer.appendChild(siteUtilization);
                    siteMetricsContainer.appendChild(uptime);
                    siteMetricsContainer.appendChild(hashRate);
                    siteMetricsContainer.appendChild(hashingImpact);

                    sitePane.appendChild(siteTitleContainer);
                    sitePane.appendChild(siteMetricsContainer);
                    sitePane.appendChild(autoRebootPanel); // Append the auto-reboot panel
                    companySitesContainer.appendChild(sitePane);
                }

                companyContainer.appendChild(companyTitle);
                companyContainer.appendChild(companySitesContainer);
                scrollPanel.appendChild(companyContainer);
            }

            // Loop through the totalhashingtextsElements and get the longest one
            requestAnimationFrame(() => {
                totalhashingtextsElements.forEach(totalhashingtext => {
                    const width = totalhashingtext.offsetWidth;
                    console.log('Width:', width);
                    if (width > longesttotalhashingtextWidth) {
                        longesttotalhashingtextWidth = width;
                    }
                });
                longesttotalhashingtextWidth += 20; // Add some padding

                // Set the width of all the totalhashingtextsElements to the longest one
                totalhashingtextsElements.forEach(totalhashingtext => {
                    totalhashingtext.style.width = `${longesttotalhashingtextWidth}px`;
                });
            });

            // Create close button
            let closeButton = doc.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.position = 'absolute';
            closeButton.style.bottom = '20px';
            closeButton.style.left = '20px';
            closeButton.style.padding = '10px 20px';
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            closeButton.style.transition = 'background-color 0.3s';

            // Add hover effect
            closeButton.addEventListener('mouseover', function() {
                closeButton.style.backgroundColor = '#d32f2f';
            });

            closeButton.addEventListener('mouseout', function() {
                closeButton.style.backgroundColor = '#f44336';
            });

            // Add click event to close button
            closeButton.addEventListener('click', function() {
                // Closes the window
                window.close();
            });

            // Append title to panel
            panel.appendChild(title);

            // Append scroll panel to panel
            panel.appendChild(scrollPanel);

            // Append close button to panel
            panel.appendChild(closeButton);

            // Create refresh button
            let refreshContainer = doc.createElement('div');
            refreshContainer.style.position = 'absolute';
            refreshContainer.style.top = '20px';
            refreshContainer.style.right = '20px';
            refreshContainer.style.display = 'flex';
            refreshContainer.style.alignItems = 'center';

            let refreshLoadStatusContainer = doc.createElement('div');
            refreshLoadStatusContainer.style.display = 'flex';
            refreshLoadStatusContainer.style.alignItems = 'center';
            refreshLoadStatusContainer.style.marginRight = '10px';

            // move the loading status to the refreshLoadStatusContainer
            refreshLoadStatusContainer.appendChild(loadingStatus);

            // hide the loading text
            refreshLoadStatusContainer.style.display = 'none';

            let refreshSpinner = doc.createElement('div');
            refreshSpinner.style.display = 'none';
            refreshSpinner.style.border = '4px solid #f3f3f3';
            refreshSpinner.style.borderTop = '4px solid #3498db';
            refreshSpinner.style.borderRadius = '50%';
            refreshSpinner.style.width = '24px';
            refreshSpinner.style.height = '24px';
            refreshSpinner.style.animation = 'spin 2s linear infinite';
            refreshSpinner.style.marginRight = '10px';

            let countdown = 60*5;
            let refreshButton = doc.createElement('button');
            refreshButton.innerText = `Refresh (${countdown})`;
            refreshButton.style.padding = '10px 20px';
            refreshButton.style.fontSize = '16px';
            refreshButton.style.cursor = 'pointer';
            refreshButton.style.backgroundColor = '#0078d4';
            refreshButton.style.color = '#fff';
            refreshButton.style.border = 'none';
            refreshButton.style.borderRadius = '5px';
            refreshButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            refreshButton.style.transition = 'background-color 0.3s';

            // Add hover effect
            refreshButton.addEventListener('mouseover', function() {
                refreshButton.style.backgroundColor = '#005a9e';
            });

            refreshButton.addEventListener('mouseout', function() {
                refreshButton.style.backgroundColor = '#0078d4';
            });

            refreshContainer.appendChild(refreshLoadStatusContainer);
            refreshContainer.appendChild(refreshSpinner);
            refreshContainer.appendChild(refreshButton);
            panel.appendChild(refreshContainer);

            // Countdown and refresh logic
            let countdownInterval = setInterval(async function() {
                countdown--;
                refreshButton.innerText = `Refresh (${countdown})`;
                if (countdown === 0) {
                    refreshButton.click();
                }
            }, 1000);

            // Add click event to refresh button
            refreshButton.addEventListener('click', async function() {
                // if we're already refreshing, don't do anything
                if (refreshButton.innerText === 'Refreshing...') {
                    return;
                }

                clearInterval(countdownInterval);

                // Set the button text to show we're refreshing
                refreshButton.innerText = 'Refreshing...';

                // Show loading text
                refreshLoadStatusContainer.style.display = 'flex';

                // Show loading spinner to the left of the refresh button
                refreshSpinner.style.display = 'block';

                // Fetch new data
                const companies = await getCompanies();
                const sites = await getSites(userID, companies);
                await getHashingInventory(userID, Object.values(sites).flatMap(company => company.sites));

                // Save the state of opened expandables and scroll position
                let openedExpandables = [];
                doc.querySelectorAll('h2').forEach((companyTitle, index) => {
                    if (companyTitle.nextElementSibling.style.display === 'block') {
                        openedExpandables.push(index);
                    }
                });
                let scrollPos = scrollPanel.scrollTop; // Use the updated scrollPanel

                // Remove old overlay and create new one
                doc.getElementById('optiWatchOverlay').remove();
                createOverlay(doc, sites);

                // Restore the state of opened expandables and scroll position
                openedExpandables.forEach(index => {
                    let companyTitle = doc.querySelectorAll('h2')[index];
                    companyTitle.click();
                });

                scrollPanel.scrollTop = scrollPos;
                
                // Wait a tick then set the opened expandables and scroll position
                setTimeout(() => {
                    openedExpandables.forEach(index => {
                        let companyTitle = doc.querySelectorAll('h2')[index];
                        companyTitle.click();
                    });
                    openedExpandables.forEach(index => {
                        let companyTitle = doc.querySelectorAll('h2')[index];
                        companyTitle.click();
                    });

                    scrollPanel.scrollTop = scrollPos;
                }, 0);

                // Hide loading text
                refreshLoadStatusContainer.style.display = 'none';

                // Hide loading spinner
                refreshSpinner.style.display = 'none';
            });

            // Append panel to overlay
            overlay.appendChild(panel);

            // Append overlay to body
            doc.body.appendChild(overlay);
        }

        const userID = localStorage.getItem("OptiFleetID");
        const companies = await getCompanies();
        const sites = await getSites(userID, companies);
        await getHashingInventory(userID, Object.values(sites).flatMap(company => company.sites));

        // Inject the overlay content into the popout window
        createOverlay(document, sites);
    }
});

// Listens for messages to open the options page
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openOptions") {
        chrome.runtime.openOptionsPage();
    }
});
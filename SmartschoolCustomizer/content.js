function updateProfile() {
    chrome.storage.local.get(["customName", "customImage"], (data) => {
        const nameEl = document.querySelector(".hlp-vert-box span:first-child");
        if (nameEl && data.customName) {
            nameEl.textContent = data.customName;
        }

        const imgEl = document.querySelector('img[alt="Profiel afbeelding"]');
        if (imgEl && data.customImage) {
            imgEl.src = data.customImage;
        }
    });
}

function insertCustomizerButton() {
    if (document.getElementById("smartschoolCustomizerBtn")) return;

    const topnav = document.querySelector(".topnav__spacer");
    if (!topnav) return;

    const btn = document.createElement("button");
    btn.id = "smartschoolCustomizerBtn";
    btn.textContent = "Customize Profile";
    btn.className = "topnav__btn";
    btn.style.marginLeft = "10px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "1000";

    btn.onclick = () => {
        chrome.runtime.sendMessage({ action: "openOptions" });
    };

    topnav.parentNode.insertBefore(btn, topnav.nextSibling);
}

// Observe mutations so name/image updates persist and button stays
const observer = new MutationObserver(() => {
    updateProfile();
    insertCustomizerButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
updateProfile();
insertCustomizerButton();

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "updateProfile") {
        updateProfile();
    }
});
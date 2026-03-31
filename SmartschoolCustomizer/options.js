const nameInput = document.getElementById("nameInput");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

// Load saved data
chrome.storage.local.get(["customName", "customImage"], (data) => {
    if (data.customName) nameInput.value = data.customName;
    if (data.customImage) {
        imagePreview.src = data.customImage;
        imagePreview.style.display = "block";
    }
});

// Show preview when selecting new image
imageInput.onchange = () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        imagePreview.src = reader.result;
        imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
};

// Save button: store name/image, refresh Smartschool tabs, close options tab
document.getElementById("saveBtn").onclick = () => {
    const name = nameInput.value;
    const file = imageInput.files[0];

    const saveDataAndClose = (imageData = null) => {
        const storageData = { customName: name };
        if (imageData) storageData.customImage = imageData;

        chrome.storage.local.set(storageData, () => {
            // Refresh all Smartschool tabs
            chrome.tabs.query({ url: "*://*.smartschool.be/*" }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: "updateProfile" }, () => {
                        chrome.tabs.reload(tab.id);
                    });
                });
                // Close options tab
                window.close();
            });
        });
    };

    if (!file) {
        saveDataAndClose();
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        saveDataAndClose(reader.result);
    };
    reader.readAsDataURL(file);
};
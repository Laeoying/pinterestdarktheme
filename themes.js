
const application = typeof InstallTrigger !== 'undefined' ? browser : chrome;

let themes;
function loadThemes() {
    return new Promise((resolve) => {
        if (typeof InstallTrigger !== 'undefined') {
            // Temp solution while Firefox does not have manifest.storage
            fetch(application.runtime.getURL('storage/themes.json'))
            .then(response => response.json())
            .then(data => {
                themes = data;
                resolve(themes);
            })
        } else {
            application.storage.local.get('themes', (result) => {
                themes = result.themes;
                resolve(themes)
            });
        }
    })
}

// handle events
application.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type || '') {
        case 'getThemes':
            console.log(themes);
            if (themes) {
                sendResponse(themes);
                break;
            }
            loadThemes().then(themes => {
                sendResponse(themes[key]);
            });
            break;
        case 'getThemeByKey':
            const key = request.key;
            if (themes) {
                sendResponse(themes[key]);
                break;
            }
            loadThemes().then(themes => {
                sendResponse(themes[key]);
            });
            break;
    }
    return true;
});

// load themes
if (!themes) {
    loadThemes();
}
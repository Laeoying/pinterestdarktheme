
let application = typeof InstallTrigger !== 'undefined' ? browser : chrome;

// check if current page is Pinterst
const isPinterest = (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url.split('.')[1] === 'pinterest';
if (!isPinterest) {
    let popupContent = document.getElementById('error');
    popupContent.innerHTML = 'No themes for this page!<br> Go to https://pinterest.com';
    popupContent.style.display = 'block';

    throw new Error("Popup oppened outside Pinterest");
}

// load themes
const themes = await application.runtime.sendMessage({ type: 'getThemes' });
if (!themes) {
    let popupContent = document.getElementById('error');
    popupContent.innerHTML = 'Error loading themes :(';
    popupContent.style.display = 'block';

    throw new Error("Error loading themes");
}

// generate gradient
function regularGradient(rotation, ...colors) {
    const numColors = colors.length;
    let gradient = 'linear-gradient(' + rotation + 'deg';

    for (const id in colors) {
        const color = colors[id];
        const sperc = parseFloat(Number(id) / numColors * 100 + 0.25).toFixed(2) + '%';
        const ePerc = parseFloat((Number(id) + 1) / numColors * 100 - 0.25).toFixed(2) + '%';
        gradient += ', ' + color + ' ' + sperc;
        gradient += ', ' + color + ' ' + ePerc;
    }

    gradient += ')';
    return gradient;
}

// display themes list
for (const [key, theme] of Object.entries(themes)) {

    let div = document.createElement('div');
    div.classList.add('box');
    div.textContent = key;
    div.style.background = regularGradient(100, theme.dark1, theme.dark2, theme.dark3, theme.dark4);
    div.style.color = theme.light1;

    div.addEventListener('click', () => {
        // send update to all pinterest pages
        application.tabs.query({
            url: [
                "https://*.pinterest.com/*",
                "https://*.pinterest.fr/*",
                "https://*.pinterest.de/*",
                "https://*.pinterest.co.uk/*",
                "https://*.pinterest.jp/*",
                "https://*.pinterest.ru/*",
                "https://*.pinterest.cn/*",
                "https://*.pinterest.pt/*",
                "https://*.pinterest.it/*",
                "https://*.pinterest.es/*",
                "https://*.pinterest.ca/*",
                "https://*.pinterest.com.au/*",
                "https://*.pinterest.at/*",
                "https://*.pinterest.ch/*",
                "https://*.pinterest.cl/*",
                "https://*.pinterest.co.kr/*",
                "https://*.pinterest.com.mx/*",
                "https://*.pinterest.dk/*",
                "https://*.pinterest.ie/*",
                "https://*.pinterest.net/*",
                "https://*.pinterest.nz/*",
                "https://*.pinterest.ph/*",
                "https://*.pinterest.se/*"
            ]
        }, (tabs) => {
            for (const id in tabs) {
                chrome.tabs.sendMessage(tabs[id].id, { type: 'changeTheme', key: key, theme: theme });
            }
        });
    })

    document.body.appendChild(div);
}

console.log(localStorage.pdtTheme);
/**/



let application = typeof InstallTrigger !== 'undefined' ? browser : chrome;

function applyTheme(theme) {
    if (!theme) {
        theme = {
            dark1: 'black',
            dark2: 'rgb(20, 20, 20)',
            dark3: 'rgb(30, 30, 30)',
            dark4: 'rgb(50, 50, 50)',
            light1: 'white',
            light2: 'rgb(160, 160, 160)',
            light3: 'rgb(120, 120, 120)',
            white_to_dark1: 'brightness(0)',
            white_to_dark2: 'brightness(8%)'
        };
    }
    // add style property directly to the document
    // in case the page is not loaded yet
    const path = document.documentElement;
    path.style.setProperty('--pdt-d1', theme.dark1);
    path.style.setProperty('--pdt-d2', theme.dark2);
    path.style.setProperty('--pdt-d3', theme.dark3);
    path.style.setProperty('--pdt-d4', theme.dark4);
    path.style.setProperty('--pdt-l1', theme.light1);
    path.style.setProperty('--pdt-l2', theme.light2);
    path.style.setProperty('--pdt-l3', theme.light3);
    path.style.setProperty('--pdt-f1', theme.white_to_dark1 || 'brightness(10%)');
    path.style.setProperty('--pdt-f2', theme.white_to_dark2 || 'brightness(20%)');
}

// apply current theme
const curTheme = localStorage.pdtTheme;
if (curTheme) {
    application.runtime.sendMessage({ type: 'getThemeByKey', key: localStorage.pdtTheme }, (theme) => {
        applyTheme(theme);
        localStorage.setItem('pdtPalette', JSON.stringify(theme));
    })
} else {
    applyTheme();
}

// wait for theme change
application.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type !== 'changeTheme') return;
    const key = request.key;
    const theme = request.theme;
    localStorage.setItem('pdtTheme', key);
    applyTheme(theme);
});

// theme change fade animation
const path = document.documentElement;
path.style.setProperty('transition-property', '--pdt-d1, --pdt-d2, --pdt-d3, --pdt-d4, --pdt-l1, --pdt-l2, --pdt-l3, --ftr-bg, --ftr-fg');
path.style.setProperty('transition-duration', '0.5s');
path.style.setProperty('transition-timing-function', 'ease');

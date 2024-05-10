let themes = {
    'Black': {
        dark1: 'black',
        dark2: 'rgb(20, 20, 20)',
        dark3: 'rgb(30, 30, 30)',
        dark4: 'rgb(50, 50, 50)',
        light1: 'white',
        light2: 'rgb(160, 160, 160)',
        light3: 'rgb(120, 120, 120)',
        white_to_bg: 'brightness(0)',
        white_to_fg: 'brightness(8%)'
    },
    'White': {
        dark1: 'white',
        dark2: 'rgb(240, 240, 240)',
        dark3: 'rgb(230, 230, 230)',
        dark4: 'rgb(210, 210, 210)',
        light1: 'black',
        light2: 'rgb(80, 80, 80)',
        light3: 'rgb(40, 40, 40)',
        white_to_bg: 'brightness(100%)',
        white_to_fg: 'brightness(94%)'
    },
    'Semi-dark Purple': {
        dark1: '#2c1f3e',
        dark2: '#413451',
        dark3: '#564a65',
        dark4: '#6c6279',
        light1: 'white',
        light2: '#9b93a4',
        light3: '#837a8e',
        white_to_bg: 'sepia(100%) saturate(10000%) hue-rotate(183.3deg) brightness(37.5%) contrast(205%)',
        white_to_fg: 'sepia(100%) saturate(10000%) hue-rotate(183.3deg) brightness(40%) contrast(181%)'
    },
    'Dark Purple': {
        dark1: '#1b1721',
        dark2: '#302c36',
        dark3: '#46434c',
        dark4: '#5e5b63',
        light1: 'white',
        light2: '#908e94',
        light3: '#77747b',
        white_to_bg: 'sepia(100%) saturate(10000%) hue-rotate(183deg) brightness(20%) contrast(123%)',
        white_to_fg: 'sepia(100%) saturate(10000%) hue-rotate(182.5deg) brightness(24%) contrast(110.1%)'
    },
    'Dark Grey': {
        dark1: '#181818',
        dark2: '#2d2d2d',
        dark3: '#444444',
        dark4: '#5b5b5b',
        light1: 'white',
        light2: '#8f8f8f',
        light3: '#747474',
        white_to_bg: 'brightness(9.5%)',
        white_to_fg: 'brightness(17.5%)'
    },
    'Dark Blue': {
        dark1: '#191926',
        dark2: '#2e2e3a',
        dark3: '#454450',
        dark4: '#5d5c67',
        light1: 'white',
        light2: '#908f97',
        light3: '#76757e',
        white_to_bg: 'sepia(100%) saturate(10000%) hue-rotate(180deg) brightness(24.1%) contrast(136.2%)',
        white_to_fg: 'sepia(100%) saturate(10000%) hue-rotate(180deg) brightness(28%) contrast(123%)'
    },
}

chrome.storage.local.set({themes: themes}, function () {});

function applyTheme(theme) {
    const path = document.body;
    path.style.setProperty('--pdt-d1', theme.dark1);
    path.style.setProperty('--pdt-d2', theme.dark2);
    path.style.setProperty('--pdt-d3', theme.dark3);
    path.style.setProperty('--pdt-d4', theme.dark4);
    path.style.setProperty('--pdt-l1', theme.light1);
    path.style.setProperty('--pdt-l2', theme.light2);
    path.style.setProperty('--pdt-l3', theme.light3);
    path.style.setProperty('--ftr-bg', theme.white_to_bg || 'brightness(10%)');
    path.style.setProperty('--ftr-fg', theme.white_to_fg || 'brightness(20%)');
}

window.onload = function () {
    if (localStorage.pdtTheme) {
        applyTheme(themes[localStorage.pdtTheme]);
    } else {
        localStorage.setItem('pdtTheme', 'Black');
        applyTheme(themes.Black);
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        localStorage.setItem('pdtTheme', request.theme);
        applyTheme(themes[request.theme]);
    });

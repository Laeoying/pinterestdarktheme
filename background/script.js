const application = typeof InstallTrigger !== 'undefined' ? browser : chrome;
const DEBUG = true;

/*
    This is a script that will run in the background of the extension
    Its responsible for handling the extension's life cycle
    It will handle:
        - the extension instalation and update
        - the theme interactions
        - the storage interactions
        - the messages from other scripts
*/

// constants
const THEME = {
    // list os possible themes
    WHITE: 'White',
    BLACK: 'Black',
    SEMI_DARK_PURPLE: 'Semi-dark Purple',
    DARK_PURPLE: 'Dark Purple',
    DARK_GREY: 'Dark Grey',
    DARK_BLUE: 'Dark Blue',
};

const themesData = {
    // data about each theme
    [THEME.WHITE]: {
        "dark1": "white",
        "dark2": "rgb(240, 240, 240)",
        "dark3": "rgb(230, 230, 230)",
        "dark4": "rgb(210, 210, 210)",
        "light1": "black",
        "light2": "rgb(80, 80, 80)",
        "light3": "rgb(40, 40, 40)",
        "white_to_dark1": "brightness(100%)",
        "white_to_dark2": "brightness(94%)"
    },
    [THEME.BLACK]: {
        "dark1": "black",
        "dark2": "rgb(20, 20, 20)",
        "dark3": "rgb(30, 30, 30)",
        "dark4": "rgb(50, 50, 50)",
        "light1": "white",
        "light2": "rgb(160, 160, 160)",
        "light3": "rgb(120, 120, 120)",
        "white_to_dark1": "brightness(0)",
        "white_to_dark2": "brightness(8%)"
    },
    [THEME.SEMI_DARK_PURPLE]: {
        "dark1": "#2c1f3e",
        "dark2": "#413451",
        "dark3": "#564a65",
        "dark4": "#6c6279",
        "light1": "white",
        "light2": "#9b93a4",
        "light3": "#837a8e",
        "white_to_dark1": "sepia(100%) saturate(10000%) hue-rotate(183.3deg) brightness(37.5%) contrast(205%)",
        "white_to_dark2": "sepia(100%) saturate(10000%) hue-rotate(183.3deg) brightness(40%) contrast(181%)"
    },
    [THEME.DARK_PURPLE]: {
        "dark1": "#1b1721",
        "dark2": "#302c36",
        "dark3": "#46434c",
        "dark4": "#5e5b63",
        "light1": "white",
        "light2": "#908e94",
        "light3": "#77747b",
        "white_to_dark1": "sepia(100%) saturate(10000%) hue-rotate(183deg) brightness(20%) contrast(123%)",
        "white_to_dark2": "sepia(100%) saturate(10000%) hue-rotate(182.5deg) brightness(24%) contrast(110.1%)"
    },
    [THEME.DARK_GREY]: {
        "dark1": "#181818",
        "dark2": "#2d2d2d",
        "dark3": "#444444",
        "dark4": "#5b5b5b",
        "light1": "white",
        "light2": "#8f8f8f",
        "light3": "#747474",
        "white_to_dark1": "brightness(9.5%)",
        "white_to_dark2": "brightness(17.5%)"
    },
    [THEME.DARK_BLUE]: {
        "dark1": "#191926",
        "dark2": "#2e2e3a",
        "dark3": "#454450",
        "dark4": "#5d5c67",
        "light1": "white",
        "light2": "#908f97",
        "light3": "#76757e",
        "white_to_dark1": "sepia(100%) saturate(10000%) hue-rotate(180deg) brightness(24.1%) contrast(136.2%)",
        "white_to_dark2": "sepia(100%) saturate(10000%) hue-rotate(180deg) brightness(28%) contrast(123%)"
    }
};

// variables
let currentTheme = THEME.BLACK;

// get functions
const getThemes = () => [THEME.WHITE, THEME.BLACK, THEME.SEMI_DARK_PURPLE, THEME.DARK_PURPLE, THEME.DARK_GREY, THEME.DARK_BLUE]; // an ordered list of themes
const getThemeData = (theme) => themesData[theme];
const getCurrentThemeName = () => currentTheme;
const getCurrentThemeData = () => themesData[currentTheme];

// set functions
const setTheme = (newTheme) => {
    if (currentTheme === newTheme || !themesData[newTheme]) return false;
    currentTheme = newTheme;
    onThemeChange(newTheme, themesData[newTheme]);
    return true;
};

// handler functions
function onExtensionInstall() {
    // this function will run once when the extension is installed
    // it will save the default theme to the storage
    DEBUG && console.log('onExtensionInstall');

    application.storage.local.set({
        theme: getCurrentThemeName()
    });
}

function onExtensionUpdate() {
    // this function will run every time the extension is updated
    // it will check if the saved theme is valid
    // if it's not, it will set the theme to the default theme
    DEBUG && console.log('onExtensionUpdate');

    const storedTheme = application.storage.local.get('theme');
    if (!storedTheme) onExtensionInstall();
    else if (storedTheme !== currentTheme) {
        onThemeChange(
            getCurrentThemeName(),
            getCurrentThemeData());
    }
}

function onExtensionMessage({ type, value }, sender, sendResponse) {
    // this function will handle messages from other scripts
    // it will check the message type and run the appropriate function to handle it
    DEBUG && console.groupCollapsed('onExtensionMessage');
    DEBUG && console.log('type', type);
    DEBUG && typeof value !== 'undefined' && console.log('value', value);

    let response = undefined;
    switch (type) {
        case 'getThemes':
            response = getThemes();
            break;
        case 'getThemeData':
            response = getThemeData(value);
            break;
        case 'getCurrentThemeName':
            response = getCurrentThemeName();
            break;
        case 'getCurrentThemeData':
            response = getCurrentThemeData();
            break;
        case 'setTheme':
            response = setTheme(value);
            break;
        default:
            DEBUG && console.warn('Unknown message type', type);
            break;
    }
    
    DEBUG && typeof response !== 'undefined' && console.log('sendResponse', response);
    DEBUG && console.groupEnd();

    sendResponse(response);
}

function onThemeChange(theme, data) {
    // this function will handle the theme change
    // it will notify the main script in every pinterest page that the theme has changed
    // it will also save the new theme to the storage
    DEBUG && console.groupCollapsed('onThemeChange');
    DEBUG && console.log('theme', theme);
    DEBUG && console.log('data', data);
    DEBUG && console.groupEnd();

    application.storage.local.set({
        theme: theme
    });
    application.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (!tab || !tab.url) return;
            // tab.url is only present in allowerd urls (aka pinterest pages)
            // an message will be sent to all pinterest pages
            application.tabs.sendMessage(tab.id, {
                type: 'themeChange',
                value: {
                    data: data
                }
            });
        });
    });
}

// message & events handler
application.storage.local.get(['theme'], ({ theme }) => {
    setTheme(theme);
});
application.runtime.onMessage.addListener(onExtensionMessage);
application.runtime.onInstalled.addListener((details) => {
    if (!details.reason) return;
    else if (details.reason === 'install') onExtensionInstall();
    else if (details.reason === 'update') onExtensionUpdate();
});
const application = typeof InstallTrigger !== 'undefined' ? browser : chrome;
const DEBUG = true;

function onExtensionMessage({type, value}, sender, sendResponse) {
    // this function will handle messages from other scripts
    // it will check the message type and run the appropriate function to handle it
    DEBUG && console.groupCollapsed('onExtensionMessage');
    DEBUG && console.log('type', type);
    DEBUG && typeof value !== 'undefined' && console.log('value', value);

    switch (type) {
        case 'themeChange':
            loadTheme(value.data);
            break;
        default:
            DEBUG && console.warn('Unknown message type', type);
    }

    DEBUG && console.groupEnd();
}

async function loadTheme(data) {
    // this function will load the theme to the current page
    // it will apply the theme to the page
    DEBUG && console.groupCollapsed('loadTheme');
    DEBUG && console.log('data', data);

    const style = document.documentElement.style;
    
    style.setProperty('--pdt-d1', data.dark1);
    style.setProperty('--pdt-d2', data.dark2);
    style.setProperty('--pdt-d3', data.dark3);
    style.setProperty('--pdt-d4', data.dark4);

    style.setProperty('--pdt-l1', data.light1);
    style.setProperty('--pdt-l2', data.light2);
    style.setProperty('--pdt-l3', data.light3);

    style.setProperty('--pdt-f1', data.white_to_dark1 ?? 'brightness(10%)');
    style.setProperty('--pdt-f2', data.white_to_dark2 ?? 'brightness(20%)');

    DEBUG && console.groupEnd();
}

// waits for messages from the extension
application.runtime.onMessage.addListener(onExtensionMessage);

// loads current theme by sending a message to the extension
(async () => loadTheme(await application.runtime.sendMessage({type: 'getCurrentThemeData'})))();
const application = typeof InstallTrigger !== 'undefined' ? browser : chrome;
/*
    This script is responsible to handle the extension popup.
    It is executed every time the popup is opened.
*/

function regularGradient(rotation, ...colors) {
    // this function will create a gradient with the given colors and rotation

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

(async () => {
    // check if current page is Pinterest
    const isPinterest = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!isPinterest || !isPinterest[0] ||  !isPinterest[0].url) {
        // show an error message on the popup if the current page is not Pinterest

        let popupContent = document.getElementById('error');
        popupContent.innerHTML = 'No themes for this page!<br> Go to https://pinterest.com';
        popupContent.style.display = 'block';

        throw new Error("Popup oppened outside Pinterest");
    }

    // get the themes from the extension
    const themesListElement = document.getElementById('themes-list');
    const themes = await application.runtime.sendMessage({ type: 'getThemes' });
    let currentTheme = await application.runtime.sendMessage({ type: 'getCurrentThemeName' });

    if (themes.length === 0) {
    }

    for (let i = 0; i < themes.length; i++) {
        // get current theme name and data
        const theme = themes[i];
        const themeData = await application.runtime.sendMessage({ type: 'getThemeData', value: theme });


        // create a container for the theme element
        const container = document.createElement('div');
        container.classList.add('theme-container');
        container.style.background = regularGradient(100, themeData.dark1, themeData.dark2, themeData.dark3, themeData.dark4);

        const name = document.createElement('span');
        name.classList.add('theme-name');
        name.innerText = theme;
        name.style.color = themeData.light1;

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'theme';
        input.checked = theme === currentTheme;

        container.appendChild(name);
        container.appendChild(input);
        themesListElement.appendChild(container);

        // add an event listener to the input
        input.addEventListener('change', async () => {
            // when the input changes, set a new theme
            await application.runtime.sendMessage({
                type: 'setTheme',
                value: theme
            });
        });
    }
})();
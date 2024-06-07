let application = typeof InstallTrigger !== 'undefined' ? browser : chrome;

function genStr(c1, c2, c3, c4) {
    return `linear-gradient(100deg, ${c1} 0%, ${c1} 25%, ${c2} 25%, ${c2} 50%, ${c3} 50%, ${c3} 75%, ${c4} 75%, ${c4} 100%)`;
}

application.storage.local.get(['themes'], function(result) {
    const themes = result.themes;
    for (const color in themes) {
        let path = themes[color];
        let div = document.createElement('div');
        div.classList.add('box');
        div.textContent = color;
        div.style.background = genStr(path.dark1, path.dark2, path.dark3, path.dark4);
        div.style.color = path.light1;
        div.addEventListener('click', function () {
            application.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                application.tabs.sendMessage(tabs[0].id, { theme: color });
            });
        });
        document.body.appendChild(div);
    }
});
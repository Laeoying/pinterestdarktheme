
let currentTheme = {
	"d1": "black",
	"d2": "rgb(20, 20, 20)",
	"d3": "rgb(30, 30, 30)",
	"d4": "rgb(50, 50, 50)",
	"l1": "white",
	"l2": "rgb(160, 160, 160)",
	"l3": "rgb(120, 120, 120)"
};

function setTheme(theme) {
	if (document.getElementById('pdt-style')) {
		document.getElementById('pdt-style').remove();
	}
	const styleEl = document.createElement('style');
	styleEl.id = 'pdt-style';
	const cssVars = Object.entries(theme)
		.map(([key, value]) => `--pdt-${key}: ${value};`)
		.join('');

	styleEl.textContent = `
    body {
      ${cssVars}
    }
  `;
	document.head.appendChild(styleEl);
	chrome.runtime.sendMessage({
		theme: theme
	})
}

function setup() {
	console.log('%cPL&DT injected.', 'color: red;');

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		console.log(request.value, request.name)
		if (request.name == 'all') {
			currentTheme = request.value;
		}
		else if (request.name == 'update') {
			chrome.storage.local.set({ theme: currentTheme }, () => {
				setTheme(currentTheme);
			});
		}
		else if (request.name == 'get-theme') {
			sendResponse({
				theme: currentTheme
			})
		}
		else {
			currentTheme[request.name] = request.value;
		}
		setTheme(currentTheme);
	});

	chrome.storage.local.get('theme', (res) => {
		console.log(res)
		if (!res.theme) { 
			chrome.storage.local.set({ theme: currentTheme }, () => {
				setTheme(currentTheme);
			});
		} else {
			currentTheme = res.theme;
			setTheme(currentTheme);
			const interval = setInterval(() => {
				if (!document.getElementById('pdt-style')) {
					setTheme(currentTheme);
					clearInterval(interval);
				}
			}, 50);
		}
	});
}

setup();
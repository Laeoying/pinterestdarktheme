
function setTheme(theme) { // Update colors on page
	if (document.getElementById('pdt-style')) {
		document.getElementById('pdt-style').remove();
	}
	const styleEl = document.createElement('style');
	styleEl.id = 'pdt-style';
	const cssVars = Object.entries(theme)
		.map(([key, value]) => `--pdt-${key}: ${value};`)
		.join('');

	styleEl.textContent = `
    :root {
      ${cssVars}
    }
  `;
	document.head.appendChild(styleEl);
}

function setup() {
	console.log('%cPinterest DARK THEME injected.', 'color: red;'); // why not

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { // Event listener that change theme colors
		setTheme(request.theme);
	});

	chrome.storage.local.get('theme', (res) => { // Get from the storage the saved theme
		console.log(res)
		if (!res.theme) { // Set default theme to pitch black
			const defaultTheme = {
				"d1": "black",
				"d2": "rgb(20, 20, 20)",
				"d3": "rgb(30, 30, 30)",
				"d4": "rgb(50, 50, 50)",
				"l1": "white",
				"l2": "rgb(160, 160, 160)",
				"l3": "rgb(120, 120, 120)",
				"white_to_d1": "brightness(0)",
				"white_to_d2": "brightness(8%)"
			};
			chrome.storage.local.set({ theme: defaultTheme }, () => {
				setTheme(defaultTheme);
			});
		} else { // Set the saved theme if it exists
			setTheme(res.theme);
			const interval = setInterval(() => { // On loading, Pinterest remove my <style> in a weird way, that's the only working solution I found
				if (!document.getElementById('pdt-style')) {
					setTheme(res.theme);
					clearInterval(interval);
				}
			}, 50);
		}
	});
}

setup();
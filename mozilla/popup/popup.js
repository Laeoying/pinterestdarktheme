
const themes = {
	"Black": {
		"d1": "black",
		"d2": "rgb(20, 20, 20)",
		"d3": "rgb(30, 30, 30)",
		"d4": "rgb(50, 50, 50)",
		"l1": "white",
		"l2": "rgb(160, 160, 160)",
		"l3": "rgb(120, 120, 120)",
		"white_to_d1": "brightness(0)",
		"white_to_d2": "brightness(8%)"
	},
	"White": {
		"d1": "white",
		"d2": "rgb(240, 240, 240)",
		"d3": "rgb(230, 230, 230)",
		"d4": "rgb(210, 210, 210)",
		"l1": "black",
		"l2": "rgb(80, 80, 80)",
		"l3": "rgb(40, 40, 40)",
		"white_to_d1": "brightness(100%)",
		"white_to_d2": "brightness(94%)"
	},
	"Semi-dark Purple": {
		"d1": "#2c1f3e",
		"d2": "#413451",
		"d3": "#564a65",
		"d4": "#6c6279",
		"l1": "white",
		"l2": "#9b93a4",
		"l3": "#837a8e",
		"white_to_d1": "sepia(100%) saturate(10000%) hue-rotate(183.3deg) brightness(37.5%) contrast(205%)",
		"white_to_d2": "sepia(100%) saturate(10000%) hue-rotate(183.3deg) brightness(40%) contrast(181%)"
	},
	"Dark Purple": {
		"d1": "#1b1721",
		"d2": "#302c36",
		"d3": "#46434c",
		"d4": "#5e5b63",
		"l1": "white",
		"l2": "#908e94",
		"l3": "#77747b",
		"white_to_d1": "sepia(100%) saturate(10000%) hue-rotate(183deg) brightness(20%) contrast(123%)",
		"white_to_d2": "sepia(100%) saturate(10000%) hue-rotate(182.5deg) brightness(24%) contrast(110.1%)"
	},
	"Dark Grey": {
		"d1": "#181818",
		"d2": "#2d2d2d",
		"d3": "#444444",
		"d4": "#5b5b5b",
		"l1": "white",
		"l2": "#8f8f8f",
		"l3": "#747474",
		"white_to_d1": "brightness(9.5%)",
		"white_to_d2": "brightness(17.5%)"
	},
	"Dark Blue": {
		"d1": "#191926",
		"d2": "#2e2e3a",
		"d3": "#454450",
		"d4": "#5d5c67",
		"l1": "white",
		"l2": "#908f97",
		"l3": "#76757e",
		"white_to_d1": "sepia(100%) saturate(10000%) hue-rotate(180deg) brightness(24.1%) contrast(136.2%)",
		"white_to_d2": "sepia(100%) saturate(10000%) hue-rotate(180deg) brightness(28%) contrast(123%)"
	}
}

function regularGradient(rotation, ...colors) { // Generate gradient CSS string
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

function sendTheme(theme) { // Send a message to the active tab to change theme
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { theme: themes[theme] });
	});
}

function setup() {
	document.querySelector('p').remove(); // Remove the message that says enable JavaScript

	for (const [key, theme] of Object.entries(themes)) { // Create the theme list

		const div = document.createElement('div');
		div.classList.add('box');
		div.textContent = key;
		div.style.background = regularGradient(100, theme.d1, theme.d2, theme.d3, theme.d4);
		div.style.color = theme.l1;

		div.addEventListener('click', () => {
			chrome.storage.local.set({ theme: theme }, () => {
				sendTheme(key);
			});
		})

		document.body.appendChild(div);
	}
}

setup();


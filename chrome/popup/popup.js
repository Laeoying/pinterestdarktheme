
const themes = {
	"Black": {
		"d1": "#000000",
		"d2": "#141414",
		"d3": "#1e1e1e",
		"d4": "#323232",
		"l1": "#ffffff",
		"l2": "#a0a0a0",
		"l3": "#787878",
		"white-to-d1": "brightness(0) saturate(100%) invert(100%) sepia(81%) saturate(7390%) hue-rotate(163deg) brightness(122%) contrast(89%)",
		"black-to-l1": "brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2%) hue-rotate(323deg) brightness(102%) contrast(101%)",
	},
	"White": {
		"d1": "#ffffff",
		"d2": "#f0f0f0",
		"d3": "#e6e6e6",
		"d4": "#d2d2d2",
		"l1": "#000000",
		"l2": "#505050",
		"l3": "#282828",
		"white-to-d1": "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)",
		"black-to-l1": "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7469%) hue-rotate(217deg) brightness(96%) contrast(108%)"
	},
	"Semi-dark Purple": {
		"d1": "#2c1f3e",
		"d2": "#413451",
		"d3": "#564a65",
		"d4": "#6c6279",
		"l1": "#ffffff",
		"l2": "#9b93a4",
		"l3": "#837a8e",
		"white-to-d1": "brightness(0) saturate(100%) invert(89%) sepia(19%) saturate(2015%) hue-rotate(224deg) brightness(94%) contrast(91%)",
		"black-to-l1": "brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2%) hue-rotate(323deg) brightness(102%) contrast(101%)",
	},
	"Dark Purple": {
		"d1": "#1b1721",
		"d2": "#302c36",
		"d3": "#46434c",
		"d4": "#5e5b63",
		"l1": "#ffffff",
		"l2": "#908e94",
		"l3": "#77747b",
		"white-to-d1": "brightness(0) saturate(100%) invert(93%) sepia(17%) saturate(1065%) hue-rotate(222deg) brightness(95%) contrast(93%)",
		"black-to-l1": "brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2%) hue-rotate(323deg) brightness(102%) contrast(101%)",
	},
	"Dark Grey": {
		"d1": "#181818",
		"d2": "#2d2d2d",
		"d3": "#444444",
		"d4": "#5b5b5b",
		"l1": "#ffffff",
		"l2": "#8f8f8f",
		"l3": "#747474",
		"white-to-d1": "brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(2554%) hue-rotate(4deg) brightness(106%) contrast(81%)",
		"black-to-l1": "brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2%) hue-rotate(323deg) brightness(102%) contrast(101%)",
	},
	"Dark Blue": {
		"d1": "#191926",
		"d2": "#2e2e3a",
		"d3": "#454450",
		"d4": "#5d5c67",
		"l1": "#ffffff",
		"l2": "#908f97",
		"l3": "#76757e",
		"white-to-d1": "brightness(0) saturate(100%) invert(94%) sepia(4%) saturate(7499%) hue-rotate(201deg) brightness(97%) contrast(91%)",
		"black-to-l1": "brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(2%) hue-rotate(323deg) brightness(102%) contrast(101%)",
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


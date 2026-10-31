
const themes = {
	"Black": {
		"d1": "black",
		"d2": "rgb(20, 20, 20)",
		"d3": "rgb(30, 30, 30)",
		"d4": "rgb(50, 50, 50)",
		"l1": "white",
		"l2": "rgb(160, 160, 160)",
		"l3": "rgb(120, 120, 120)"
	},
	"Dark Purple": {
		"d1": "#1b1721",
		"d2": "#302c36",
		"d3": "#46434c",
		"d4": "#5e5b63",
		"l1": "white",
		"l2": "#908e94",
		"l3": "#77747b"
	},
	"Dark Grey": {
		"d1": "#181818",
		"d2": "#2d2d2d",
		"d3": "#444444",
		"d4": "#5b5b5b",
		"l1": "white",
		"l2": "#8f8f8f",
		"l3": "#747474"
	},
	"Dark Blue": {
		"d1": "#191926",
		"d2": "#2e2e3a",
		"d3": "#454450",
		"d4": "#5d5c67",
		"l1": "white",
		"l2": "#908f97",
		"l3": "#76757e"
	},
	"Dark Cherry": {
		"d1": "#2e0712",
		"d2": "#590D22",
		"d3": "#800F2F",
		"d4": "#A4133C",
		"l1": "#FFF0F3",
		"l2": "#FFB3C1",
		"l3": "#FF8FA3"
	},
	"Dark Lavender": {
		"d1": "#332c39",
		"d2": "#3f3649",
		"d3": "#42365d",
		"d4": "#573d7f",
		"l1": "#ebe0ff",
		"l2": "#dac7ff",
		"l3": "#c7adff"
	},
	"White": {
		"d1": "white",
		"d2": "rgb(240, 240, 240)",
		"d3": "rgb(230, 230, 230)",
		"d4": "rgb(210, 210, 210)",
		"l1": "black",
		"l2": "rgb(80, 80, 80)",
		"l3": "rgb(40, 40, 40)"
	},
	"Autumn": {
		"d1": "#ede0d4",
		"d2": "#e6ccb2",
		"d3": "#ddb892",
		"d4": "#b08968",
		"l1": "#402B1D",
		"l2": "#7f5539",
		"l3": "#9c6644"
	},
	"Light Green": {
		"d1": "#B7EFC5",
		"d2": "#92E6A7",
		"d3": "#6EDE8A",
		"d4": "#4AD66D",
		"l1": "#10451D",
		"l2": "#155D27",
		"l3": "#1A7431"
	},
	"Light Cherry": {
		"d1": "#FFF0F3",
		"d2": "#FFCCD5",
		"d3": "#FFB3C1",
		"d4": "#FF8FA3",
		"l1": "#590D22",
		"l2": "#800F2F",
		"l3": "#A4133C"
	},
	"Light Lavender": {
		"d1": "#ebe0ff",
		"d2": "#dac7ff",
		"d3": "#c7adff",
		"d4": "#ac8bee",
		"l1": "#3f3649",
		"l2": "#42365d",
		"l3": "#573d7f"
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


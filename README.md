# Pinterest DARK THEME
If you want to add changes, change only Chrome or Firefox and I'll change the other one.

## Differences between Chrome and Firefox

- Firefox `manifest.json` contains a unique ID which is required to publish on Firefox
- Firefox version create `style` tag in the body instead of the root to override root rules (default colors to avoid flash at start)
- Chrome version set a `setInterval` at loading to make again the `style` tag that gets deleted (issue)
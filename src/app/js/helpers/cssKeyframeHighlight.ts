export function cssKeyframeHighlight(css: string): string {
	return css
		.replace(
			/@keyframes (.*) {/i,
			"<span class='u-color-brand'>@keyframes</span> <span class='u-color-second'>$1</span> {",
		)
		.replace(
			/(\d+%|from|to)/ig,
			"<span class='u-color-brand'>$1</span>",
		);
}

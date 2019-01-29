import { forNodeList } from "../helpers/forNodeList";

const casesList: NodeList = document.querySelectorAll('.js-case');

forNodeList(casesList, _case => {
	const button: HTMLElement = _case.querySelector('.js-case-button');
	const imageList: NodeList = _case.querySelectorAll('.js-case-image');

	button.addEventListener('click', () => {
		forNodeList(imageList, (item) => {
			const className: string = _case.getAttribute('data-class');

			item.classList.toggle(className);
		});
	});
});

export function setCases(cssFunc: string): void {
	const funcPlace: NodeList = document.querySelectorAll('.js-case-func');

	forNodeList(funcPlace, item => {
		const svgPlace: HTMLElement = item.querySelector('.js-case-place');
		const path: SVGElement = svgPlace.querySelector('path');
		const viewBox: string = svgPlace.getAttribute('viewBox');
		const viewBoxAttr: RegExpMatchArray = viewBox.match(/([-.\d]+)/g);
		const width: number = parseFloat(viewBoxAttr[2]);
		const height: number = parseFloat(viewBoxAttr[3]);

		const points: RegExpMatchArray = cssFunc.match(/(-*[.\d]+)/g);
		const x1: string = (parseFloat(points[0]) * width).toFixed(3);
		const y1: string = ((1 - parseFloat(points[1])) * height).toFixed(3);
		const x2: string = (parseFloat(points[2]) * width).toFixed(3);
		const y2: string = ((1 - parseFloat(points[3])) * height).toFixed(3);

		item.style.transitionTimingFunction = cssFunc;

		path.setAttribute(
			'd',
			`M0 ${height}C${x1} ${y1} ${x2} ${y2} ${width} 0`
		);
	});
}

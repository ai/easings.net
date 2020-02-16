import { getElement } from "../helpers/getElement";

export interface OverlaySize {
	top: number;
	left: number;
	height: number;
	width: number;
}

const overlay = getElement(".overlay");

export function setTransitionDurationOverlay(timeAtMs: number): void {
	overlay.style.transitionDuration = `${timeAtMs}ms`;
}

export function resetOverlay(): void {
	overlay.removeAttribute("style");
	overlay.hidden = true;
}

export function showOverlay(): void {
	overlay.hidden = false;
}

export function setSizeOverlay(size: OverlaySize): void {
	overlay.style.height = `${size.height}px`;
	overlay.style.width = `${size.width}px`;
	overlay.style.top = `${size.top}px`;
	overlay.style.left = `${size.left}px`;
}

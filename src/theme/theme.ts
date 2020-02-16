import { getElement } from "../helpers/getElement";

const selectorThemeSelect = ".footer__theme";
const themeSelect = getElement<HTMLSelectElement>(selectorThemeSelect);

const classLightTheme = "is-light";
const classDarkTheme = "is-dark";

const storageThemeKey = "theme";

if (typeof localStorage.getItem(storageThemeKey) === "string") {
	const theme = localStorage.getItem(storageThemeKey);
	themeSelect.value = theme;
	changeTheme(theme);
}

themeSelect.addEventListener("change", () => {
	localStorage.setItem(storageThemeKey, themeSelect.value);
	changeTheme(themeSelect.value);
});

function changeTheme(value: string): void {
	switch (value) {
		case "light":
			document.documentElement.classList.remove(classDarkTheme);
			document.documentElement.classList.add(classLightTheme);
			break;

		case "dark":
			document.documentElement.classList.remove(classLightTheme);
			document.documentElement.classList.add(classDarkTheme);
			break;

		default:
			document.documentElement.classList.remove(
				classLightTheme,
				classDarkTheme
			);
	}
}

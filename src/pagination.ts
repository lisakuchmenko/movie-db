import { renderMovies } from '.';
let page = 1;

export function pagination() {
	page += 1;
	const radioButtons: NodeListOf<HTMLInputElement> = document.querySelectorAll(
		'input[type="radio"]:checked'
	);
	renderMovies(radioButtons[0].id, page);
}

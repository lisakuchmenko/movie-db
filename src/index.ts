import { searchMovie } from './search';
import { pagination } from './pagination';
import { randomMovieBanner } from './randomMovie';
import { favoriteMovies } from './favoriteMovies';

const API_KEY = '65903e1f32428d81ed3f6fd64266ef6e';
export { API_KEY };

let favorites: string[] = []; //array of favorite movies that will be added to local storage
const filmContainer = document.getElementById('film-container') as HTMLElement; //main container for movies

//radio buttons for switching between categories
const radioButtons: NodeListOf<HTMLInputElement> =
	document.querySelectorAll('input[type=radio]');

Array.from(radioButtons).map((button) =>
	button.addEventListener('click', (e) => {
		filmContainer.innerHTML = '';
		renderMovies((e.target as HTMLInputElement).id, 1);
		button.checked = true;
		search.value = '';
	})
);

//
function pick<Type, Key extends keyof Type>(
	obj: Type,
	...keys: Key[]
): Pick<Type, Key> {
	const copy = {} as Pick<Type, Key>;
	keys.forEach((key) => (copy[key] = obj[key]));
	return copy;
}

interface Movie {
	poster_path: string;
	id: number;
	overview: string;
	release_date: string;
}

async function fetchMovies(category: string, page: number): Promise<Movie[]> {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=en-US&page=${page}`
	);
	return await response.json();
}

export async function fetchFavoriteMovies(id: string): Promise<Movie[]> {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
	);
	return await response.json();
}

export function renderData(results: Movie[]) {
	//check if local storage has some favorite movies, if yes, then add add them as starting elements of favorites array
	const inStorageMovies = JSON.parse(window.localStorage.getItem('movies'));
	if (inStorageMovies) {
		favoriteMovies();
		favorites = inStorageMovies;
	}

	//create a html template of films collection and render movies
	let html = '';

	results.map((el: Movie) => {
		const htmlSegment = `<div class="col-lg-3 col-md-4 col-12 p-2">
                            <div class="card shadow-sm" >
                                <img src="https://image.tmdb.org/t/p/w500${
																	el.poster_path
																}" />
																<svg
									xmlns="http://www.w3.org/2000/svg"
									id=${el.id}
									stroke="red"
									fill=${
										inStorageMovies &&
										inStorageMovies.includes(el.id.toString())
											? 'red'
											: '#ff000078'
									}
									width="50"
									height="50"
									class="bi bi-heart-fill position-absolute p-2"
									viewBox="0 -2 18 22"

								>
									<path
										fill-rule="evenodd"
										d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
									/>
								</svg>
                                <div class="card-body">
                                    <p class="card-text truncate">${
																			el.overview
																		}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">${
																					el.release_date
																				}</small>
                                    </div>
                                </div>
                            </div>
                        </div> `;
		html += htmlSegment;
	});
	filmContainer.innerHTML += html;

	//add eventListener to hearts svg elements which allows us to add and remove movies from favorites list
	const svg: HTMLCollectionOf<SVGSVGElement> =
		document.getElementsByTagName('svg');
	Array.from(svg).map((el) => {
		el.addEventListener('click', (event: Event) => {
			if (el.style.fill === 'red') {
				el.style.fill = '#ff000078';
				const id: string = (<HTMLElement>(<HTMLElement>event.target).parentNode)
					.id;
				const storedMovies: string[] = JSON.parse(
					window.localStorage.getItem('movies') || '{}'
				);
				favorites = storedMovies.filter((el) => el !== id);
				window.localStorage.setItem('movies', JSON.stringify(favorites));
				favoriteMovies();
			} else {
				el.style.fill = 'red';
				const id: string = (<HTMLElement>(<HTMLElement>event.target).parentNode)
					.id;
				favorites.includes(id)
					? id
					: favorites.push(
							(<HTMLElement>(<HTMLElement>event.target).parentNode).id
					  );
				window.localStorage.setItem('movies', JSON.stringify(favorites));
				favoriteMovies();
			}
		});
	});
}

//render movies and a random banner movie
export async function renderMovies(category: string, page: number) {
	const { results } = await fetchMovies(category, page);
	const randNum: number = Math.floor(Math.random() * 20);
	const objShortened = pick(
		results[randNum],
		'backdrop_path',
		'title',
		'overview'
	);
	renderData(results);
	randomMovieBanner(objShortened);
}

const search = document.getElementById('search') as HTMLInputElement;
const submit = document.getElementById('submit') as HTMLInputElement;
submit.addEventListener('click', searchMovie);

const loadMore = document.getElementById('load-more') as HTMLElement;
loadMore.addEventListener('click', pagination);

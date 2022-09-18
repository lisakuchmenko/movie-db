const filmContainer = document.getElementById('film-container') as HTMLElement;
const search = document.getElementById('search') as HTMLInputElement;
import { API_KEY } from '.';

export function searchMovie() {
	const inputValue: string = search.value;
	const searchedMovieName: string[] = inputValue.trim().split(' ');
	const query: string =
		searchedMovieName.length === 1
			? searchedMovieName[0]
			: searchedMovieName.join('+');
	const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=${API_KEY}&query=${query}`;
	renderSearch(url);
}

async function renderSearch(url: string) {
	const response = await fetch(url);
	const movie = await response.json();
	let html = '';
	interface Movie {
		poster_path: string;
		overview: string;
		release_date: string;
	}
	movie.results.map((el: Movie) => {
		const htmlSegment = `<div class="col-lg-3 col-md-4 col-12 p-2">
                            <div class="card shadow-sm" >
                                <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" />
																
                                <div class="card-body">
                                    <p class="card-text truncate">${el.overview}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">${el.release_date}</small>
                                    </div>
                                </div>
                            </div>
                        </div> `;
		html += htmlSegment;
	});
	filmContainer.innerHTML = html;
}

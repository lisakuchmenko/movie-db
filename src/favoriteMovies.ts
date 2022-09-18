import { fetchFavoriteMovies } from '.';

interface Movie {
	poster_path: string;
	overview: string;
	release_date: string;
}

export async function favoriteMovies() {
	const inStorageMovies = JSON.parse(
		window.localStorage.getItem('movies') || '{}'
	);

	const promises = inStorageMovies.map(async (id: string) => {
		const response = await fetchFavoriteMovies(id);
		return response;
	});

	const selectedMovies = await Promise.all(promises);
	const favoriteMoviesContainer = document.getElementById(
		'favorite-movies'
	) as HTMLElement;
	favoriteMoviesContainer.innerHTML = '';
	selectedMovies.map((el: Movie) => {
		favoriteMoviesContainer.innerHTML += `<div class="col-12 p-2">
			<div class="card shadow-sm">
			<img src="https://image.tmdb.org/t/p/w500${el.poster_path}" />
				<svg
					xmlns="http://www.w3.org/2000/svg"
					stroke="red"
					fill="red"
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
					<p class="card-text truncate">
						${el.overview}
					</p>
					<div class="d-flex justify-content-between align-items-center">
						<small class="text-muted">${el.release_date}</small>
					</div>
				</div>
			</div>
		</div>`;
	});
}

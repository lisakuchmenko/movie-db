interface Movie {
	backdrop_path: string;
	title: string;
	overview: string;
}

export function randomMovieBanner(randMovie: Movie) {
	const htmlSegment = ` <div class="row py-lg-5">
		<div
			class="col-lg-6 col-md-8 mx-auto"
			style="background-image: url('https://image.tmdb.org/t/p/w500${randMovie.backdrop_path}');  background-size: cover;"
		>
			<h1 id="random-movie-name" class="fw-light text-light">${randMovie.title}</h1>
			<p id="random-movie-description" class="lead text-white">
				${randMovie.overview}
			</p>
		</div>
	</div>`;

	const randomMovieContainer = document.getElementById(
		'random-movie'
	) as HTMLElement;
	randomMovieContainer.innerHTML = htmlSegment;
}

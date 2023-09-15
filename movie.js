const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=66b303b4c38e3570cc295ebc9a44bb24&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=66b303b4c38e3570cc295ebc9a44bb24&query=";

const form = document.querySelector("#form");
const search = document.querySelector("#query");
const cardSection = document.querySelector(".row");
const notif = document.querySelector(".notifications");

returnMovies(APILINK);

async function returnMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        notif.innerHTML = "";

        const displayCards = data.results.map(element => {
            if (element.backdrop_path) {
                return `<div class="card">
                            <div class="card-img"><img src="${IMG_PATH + element.poster_path}" alt="poster-image" class="thumbnail"></div>
                                <div class="movie-desc">
                                        <div>Title: ${element.title.length > 27 ? element.title.slice(0, 27) + "..." : element.title}</div>
                                        <div>Rating: ⭐${element.vote_average}</div>
                                    <div class="desc-2">Release Date: ${element.release_date}</div>
                                </div>
                        </div> 
                        `;
            }
        }).join("")

        cardSection.innerHTML = displayCards;

        if (!data.results.length > 0) {
            notif.innerHTML = "No search results...";
        }
    }
    catch (err) {
        console.log("MOVIE_FETCH_ERROR", err);
    }
}

form.addEventListener("submit", (searchEvent) => {
    searchEvent.preventDefault();
    cardSection.innerHTML = "";
    const searchString = search.value;
    returnMovies(SEARCHAPI + searchString);
})


const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=66b303b4c38e3570cc295ebc9a44bb24&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=66b303b4c38e3570cc295ebc9a44bb24&query=";
const LOGO_PATH = "https://image.tmdb.org/t/p/original";

const form = document.querySelector("#form");
const search = document.querySelector("#query");
const cardSection = document.querySelector(".row");
const notif = document.querySelector(".notifications");
const popup = document.querySelector(".popup-overlay");

returnMovies(APILINK);

async function returnMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        notif.innerHTML = "";

        const displayCards = data.results.map(element => {
            if (element.backdrop_path) {
                return `<div data-id="${element.id}" class="card">
                            <div class="card-img"><img src="${IMG_PATH + element.poster_path}" alt="poster-image" class="thumbnail"></div>
                                <div class="movie-desc">
                                        <div>Title: ${element.title.length > 27 ? element.title.slice(0, 27) + "..." : element.title}</div>
                                        <div>Rating: ⭐${element.vote_average}</div>
                                    <div class="desc-2">Release Date: ${element.release_date}</div>
                                </div>
                        </div> 
                        `;
            }
        }).join("");

        cardSection.innerHTML = displayCards;

        if (!data.results.length > 0) {
            notif.innerHTML = "No search results...";
        }
    }
    catch (err) {
        console.log("MOVIE_FETCH_ERROR", err);
        notif.innerHTML = "We've encountered an error fetching your movies, try again!"
    }
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => showMovie(card));
}


function showMovie(card) {
    card.addEventListener("click", async function () {
        popup.style.display = "block";
        let idNo = card.getAttribute("data-id");

        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${idNo}?api_key=66b303b4c38e3570cc295ebc9a44bb24&append_to_response=videos`);
            const data = await response.json();

            popup.innerHTML = `
            <div data-clear="popup" class="popup">
                <div class="close">&times;</div>
                <div class="popup-img"><img src="${IMG_PATH + data.poster_path}" alt="poster-img"></div>

                <div class="popup-details">
                    <div class="popup-title"><h1>${data.original_title}</h1><i>Tagline: ${data.tagline}</i></div>

                    <div class="popup-item"><h4>Genres:</h4> ${data.genres.map(genre => genre.name).join(" | ")}</div>

                    <div class="popup-website"><h4>Website:</h4> ${data.homepage}</div>

                    <div class="popup-date"><h4>Release Date: ${data.release_date}</h4><span><h4>Rating: </h4>⭐${data.vote_average}</span></div>

                    <div class="popup-item"><h4>Budget:</h4> $ ${data.budget} USD</div>

                    <div class="popup-item"><h4>Revenue:</h4> $ ${data.revenue} USD</div>

                    <div class="popup-description">${data.overview}</div>

                    <div class="popup-bottom">
                        <div class="movie-companies">
                        <h4>Production Companies:</h4>
                            ${data.production_companies.map(el => {
                return `<span>* ${el.name}</span>`
            }).join("")}
                        </div>
                        <div class="video">
                        <h4>Watch Trailer</h4>
                        <iframe id="ytplayer"  type="video" 
                            src="https://www.youtube.com/embed/${data.videos.results[0].key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe></div> 
                    </div>

                </div>

                </div>
        `
        } catch (err) {
            console.log("SHOW_MOVIE_ERROR", err);
        }
        const closeModal = popup.children[0].children[0];
        closeModal.addEventListener("click", () => {
            popup.style.display = "none";
        })
    })
}

form.addEventListener("submit", (searchEvent) => {
    notif.innerHTML = "Loading..."
    searchEvent.preventDefault();
    cardSection.innerHTML = "";
    const searchString = search.value;
    returnMovies(SEARCHAPI + searchString);
})
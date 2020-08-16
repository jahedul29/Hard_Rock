const apiUrl = "https://api.lyrics.ovh/";

//Input field and search buttons
const songInput = document.getElementById("songInput");
const searchButton = document.getElementById("searchButton");
const fancyResult = document.getElementById("fancy-result");
const singleLyrics = document.getElementById("single-lyrics");
const lyricsContainer = document.getElementById("lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");

//Load data by song title
async function loadSongByTitle(title) {
  const res = await fetch(`${apiUrl}/suggest/${title}`);
  const data = await res.json();
  return data;
}

//Render data to HTML
function fetchMusic(title) {
  const musics = loadSongByTitle(title);
  musics.then((musics) => {
    const musicList = musics.data;
    for (let i = 0; i < musicList.length; i++) {
      const music = musicList[i];
      const albumName = music.album.title;
      const artistName = music.artist.name;
      const title = music.title;

      fancyResult.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                                <div class="col-md-9">
                                    <h3 class="lyrics-name">${title}</h3>
                                    <p class="author lead">Album by <span>${artistName}</span></p>
                                </div>
                                <div class="col-md-3 text-md-right text-center">
                                    <button onclick="getLyrics('${artistName}','${title}')" class="btn btn-success">Get Lyrics</button>
                                </div>
                                </div>`;
      if (i === 9) {
        break;
      }
    }
  });
}

//Load lyrics
async function loadLyrics(artistName, title) {
  const res = await fetch(`${apiUrl}/v1/${artistName}/${title}`);
  const data = await res.json();
  return data;
}

//SearchButton functionality
searchButton.addEventListener("click", function () {
  fancyResult.innerHTML = "";
  fetchMusic(songInput.value);
  toggleElement(singleLyrics, fancyResult);
});

//getLyrics by trackId
function getLyrics(artistName, title) {
  toggleElement(fancyResult, singleLyrics);
  const lyrics = loadLyrics(artistName, title);
  lyrics.then((lyric) => {
    if (lyric.lyrics) {
      lyricsContainer.innerHTML = lyric.lyrics;
    } else {
      lyricsContainer.innerHTML = "Sorry! Lyrics not available.";
    }
    const goToButton = document.querySelector(".btn.go-back");
    goToButton.onclick = function () {
      fancyResult.innerHTML = "";
      fetchMusic(songInput.value);
      toggleElement(singleLyrics, fancyResult);
    };

    lyricsTitle.innerHTML = title + " - " + artistName;
  });
}

//remove search result
function toggleElement(hideElement, displayElement) {
  hideElement.style.display = "none";
  displayElement.style.display = "block";
}

import axios from "axios"

const tokens = {
    access_token: import.meta.VITE_MAL_ACCESS_TOKEN,
    refresh_token: import.meta.VITE_MAL_REFRESH_TOKEN
}

const api = axios.create({
    baseURL: 'https://api.myanimelist.net/v2/'
})

const genreNames = ['action', 'adventure', 'ai', 'arts', 'cars', 'comedy', 'dementia',
    'demons', 'drama', 'ecchi', 'fantasy', 'sci-fi', 'game', 'harem',
    'hentai', 'historical', 'horror', 'josei', 'kids', 'life', 'magic',
    'martial', 'mecha', 'military', 'music', 'mystery', 'parody',
    'police', 'power', 'psychological', 'romance', 'samurai', 'school',
    'seinen', 'shoujo', 'shounen', 'slice', 'space', 'sports',
    'super', 'supernatural', 'thriller', 'vampire', 'yaoi', 'yuri'];


async function handleGetAnime(animeId) {
    try {
        const response = await api.get(`anime/${animeId}?fields=id,title,synopsis,main_picture,mean,genres`, {
            headers: {
                'Authorization': 'Bearer '+ tokens['access_token']
            }
        })

        if (response.status === 200) {
            const data = await response.data;

            return data;
        }
    } catch (error) {
        if (error['response']['status'] === 404) {
            alert(`Anime ID does not exist or you didn't enter MyAnimeList ID.`)
            return error['response']['status'];
        }
    }
}

async function hanldeGetAnimes(animeIds) {
    var animesArr = [];
    for (let id of animeIds) {
        var anime = await handleGetAnime(id);
        animesArr.push(anime);
    }
    console.log(animesArr)
    return animesArr;
}

async function handleMakeProfile(profile) {
  var profileAnimes = await hanldeGetAnimes(profile);
  var genresArr = profileAnimes.map(anime => {
      var g = anime['genres'];
      var genres = [];
      for (let genre of g) {
          if (genreNames.includes(genre['name'].toLowerCase())) {
              genres.push(genre['name'].toLowerCase());
          }
      }

      return genres.join(' ');
  });
  console.log(genresArr)
  return genresArr;
}


export {handleGetAnime, hanldeGetAnimes, handleMakeProfile};
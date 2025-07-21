import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/anime-r.css';

import Loading from './components/Loading';
import DisplayMovieRecommendations from './components/DisplayMovieRecommendations';

import axios from 'axios';

function MovieRecommendation() {
  const [recommendations, setRecommendations] = useState(null);
  const [state, setState] = useState('pending'); // pending | loading | error
  const [currentProfile, setCurrentProfile] = useState();

  const sampleProfiles = {
    'action': {
      "seen": [
        "tt7068946", "tt31193180", "tt9603208", "tt2140479", "tt9150192", "tt0103064"
      ],
      "ratings": [
        7.2, 8.0, 8.4, 7.0, 6.0, 9.0
      ]
    },
    'romance': {
      "seen": [
        "tt7335184", "tt30826447", "tt0108778", "tt1442437", "tt0460649"
      ],
      "ratings": [
        7.5, 7.6, 8.5, 8.8, 8.2
      ]
    },
    'sci-fi': {
      "seen": [
        "tt1375666", "tt0289043", "tt1483013", "tt1856101", "tt0133093"
      ],
      "ratings": [
        8.5, 8.0, 7.5, 7.5, 8.2
      ]
    },
    'thriller': {
      "seen": [
        "tt27444205", "tt0119488", "tt2140479", "tt27995114", "tt0137523", "tt2085059", "tt0102926"
      ],
      "ratings": [
        7.8, 8.0, 7.5, 8.0, 8.3, 9.1, 8.5
      ]
    }
  };

  async function handleRecommend(profile) {
    try {
          const response = await axios.post(import.meta.env.VITE_MOVIE_RECOMMEND_URL, {
              seen: profile['seen'],
              ratings: profile['ratings']
          })
  
          if (response.status === 200) {
              const data = await response.data;
              console.log(data);
              setRecommendations(data['recommendations']);
              return;
          }
  
      } catch (error) {
        console.log(error);
        setState('error');
      }
  }

  async function handleGetMovie(movieId) {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_ROOT_URL}get-imdb/${movieId}/`)
        console.log(response)
        if (response.status === 200) {
            const data = await response.data;

            return data;
        }
    } catch (error) {
      console.log(error)
        const response = error['response']
        if (response) {
            // if (response['status'] === 400) {
            //     return `Material does not exist or you entered invalid IMDB id`
            // }

            return response['status'];
        }
        return 500;
    }
  }

  async function handleGetMovies(movieIds) {
    console.log(movieIds)
    var moviesArr = []
    for (let id of movieIds) {
      var movie = await handleGetMovie(id);
      if (typeof movie == 'number' && movie == 400) continue;
      typeof movie === 'object' ? moviesArr.push(movie) : '';

    }
    return moviesArr;
  }

  function isCurrentProfile(profile) {
    if (!currentProfile || currentProfile.length === 0) {
      return false;
    } else {
      var current = currentProfile.seen.slice().sort();
      return currentProfile.seen.length === profile.seen.length && profile.seen.slice().sort().every((val, idx) => val === current[idx]);
    }
  }
  async function handleDisplayProfile(profile, targetEle) {
    var isCurrent = isCurrentProfile(profile);

    let popup = document.createElement('div');
    let profileContainer = document.createElement('div');
    let btnsContainer = document.createElement('div');
    let closeBtn = document.createElement('button');
    let setUnsetBtn = document.createElement('button');

    let errorTxt = document.createElement('h3');
    errorTxt.textContent = 'Encountered error fetching data.. try again.';

    popup.classList.add('popup');
    profileContainer.classList.add('container');
    btnsContainer.classList.add('btns-container');
    
    closeBtn.classList.add('close');
    setUnsetBtn.classList.add('set-unset');
    closeBtn.textContent = 'Close';
    
    setUnsetBtn.textContent = isCurrent ? 'Unset' : 'Set';

    popup.append(profileContainer, btnsContainer);
    btnsContainer.append(closeBtn, setUnsetBtn);

    closeBtn.onclick = () => { popup.remove(); };
    setUnsetBtn.onclick = (e) => {
      if (e.target.textContent === 'Set') {
        console.log('set profile')
        setCurrentProfile(profile);
        targetEle.classList.add('selected');
      } else {
        setCurrentProfile(null);
        targetEle.classList.remove('selected');
      }

      document.querySelectorAll('.sample-profile').forEach(s => {
        if (s !== targetEle) {
          s.classList.remove('selected');
        }
      });

      popup.remove();
    };

    document.body.appendChild(popup);

    ReactDOM.createRoot(profileContainer).render(<Loading size={45} />);
    console.log(profile)
    let movies = await handleGetMovies(profile.seen);    console.log(profile.seen);
    if (popup.querySelector('.anime-loading')) {
      popup.querySelector('.anime-loading').remove();
    }

    movies.length > 0 ? movies.forEach((movie, index) => {
      var container = document.createElement('div');
      var img = document.createElement('img');
      var h4 = document.createElement('h4');
      var rating = document.createElement('div');

      container.className = 's-a';

      img.src = movie.Poster !== "N/A" ? movie.Poster : '/movie-placeholder.jpg';
      img.alt = movie.Title;
      h4.textContent = movie.Title;
      rating.className = 'rating-input';
      rating.textContent = `Rating: ${profile.ratings[index]}/10`;

      container.append(img, h4, rating);
      profileContainer.appendChild(container);
    }) : profileContainer.appendChild(errorTxt);
  }
  function handleDisplayProfileCreate() {
    let popup = document.createElement('div');
    let inputContainer = document.createElement('div');
    let container = document.createElement('div');
    let btnsContainer = document.createElement('div');
    let input = document.createElement('input');
    let ratingInput = document.createElement('input');
    let addBtn = document.createElement('button');
    let setBtn = document.createElement('button');
    let cancelBtn = document.createElement('button');

    popup.classList.add('popup', 'popup-flex');
    container.classList.add('container');
    btnsContainer.classList.add('btns-container');
    inputContainer.classList.add('input-container');

    input.placeholder = 'Enter IMDB Movie ID (e.g., tt0111161)';
    input.type = 'text';
    ratingInput.type = 'number';
    ratingInput.min = '1';
    ratingInput.max = '10';
    ratingInput.step = '0.1';
    ratingInput.placeholder = 'Rating (1-10)';
    ratingInput.style.width = '100px';
    
    addBtn.textContent = 'Add';
    inputContainer.append(input, ratingInput, addBtn);

    let moviesArr = [];
    let ratingsArr = [];

    addBtn.onclick = async () => {
      if (input.value && ratingInput.value) {
        const rating = parseFloat(ratingInput.value);
        if (rating < 1 || rating > 10) {
          alert('Rating must be between 1 and 10');
          return;
        }

        var movie = await handleGetMovie(input.value);

        if (movie && movie !== 400 && movie !== 500) {
          var div = document.createElement('div');
          var img = document.createElement('img');
          var h4 = document.createElement('h4');
          var ratingDiv = document.createElement('div');
          
          div.className = 's-a';

          img.src = movie.Poster !== "N/A" ? movie.Poster : '/movie-placeholder.jpg';
          h4.textContent = movie.Title;
          ratingDiv.className = 'rating-input';
          ratingDiv.textContent = `Rating: ${rating}/10`;

          div.append(img, h4, ratingDiv);
          container.appendChild(div);
          
          moviesArr.push(movie.imdbID);
          ratingsArr.push(rating);
          input.value = '';
          ratingInput.value = '';
          return;
        }

        alert('Failed fetching data.');
        return;
      } 
      alert('Please enter both movie ID and rating before adding.');
      return;
    };

    setBtn.className = 'set-unset';
    setBtn.textContent = 'Set';
    cancelBtn.textContent = 'Cancel';

    setBtn.onclick = () => {
      if (moviesArr.length > 0) {
        setCurrentProfile({
          seen: moviesArr,
          ratings: ratingsArr
        });
        popup.remove();
        return;
      } 
      alert('Please add some movies.');
      return;
    };

    cancelBtn.onclick = () => {
      popup.remove();
    };

    btnsContainer.append(cancelBtn, setBtn);
    popup.append(inputContainer, container, btnsContainer);
    document.body.appendChild(popup);
  }

  useEffect(() => {
    document.querySelector('title').textContent = 'Movie Recommendation';
  }, []);

  return (
    <div className='page movie-page'>
      <a style={{color: 'black'}} href="/"><h3>Back to Home Page</h3></a>
      <h3>
        The model is integrated into the Entertainment part of <a href="https://cms.saifchan.online/" rel='noreferrer' target='_blank'>MandelbrotCMS</a>.
      </h3>
      <div>
        <div className='recommendations'>
          <button onClick={() => {
            setRecommendations(null);
            if (currentProfile && currentProfile.seen.length > 0) {
              setState('loading');
              handleRecommend(currentProfile);
            } else {
              alert('Please specify a profile or create one.')
              setState('pending');
            }
          }} className='recommend-btn'>Recommend</button>
          <div className="recommendations-list">
            {state === 'loading' ? (
              <>
                {recommendations && recommendations.length > 0 ? (
                  <DisplayMovieRecommendations recommendations={recommendations} />
                ): (<Loading size={65} />)}
              </>
            ) : state === 'error' ? (
              <>
                <h2>Encountered error fetching data.. try again.</h2>
              </>
            ) : (<></>)}
          </div>
        </div>
        <div className='profiles'>
          <div>
            <h4>Sample Profiles</h4>
            <button onClick={handleDisplayProfileCreate} className='create-profile'>Create Profile</button>
          </div>
          <div className='sample-profiles-list'>
            <div onClick={(e) => {handleDisplayProfile(sampleProfiles['action'], e.target)}} className='sample-profile'>
              <h3>Action fan</h3>
            </div>
            <div onClick={(e) => {handleDisplayProfile(sampleProfiles['romance'], e.target)}} className='sample-profile'>
              <h3>Romance fan</h3>
            </div>
            <div onClick={(e) => {handleDisplayProfile(sampleProfiles['sci-fi'], e.target)}} className='sample-profile'>
              <h3>Sci-Fi fan</h3>
            </div>
            <div onClick={(e) => {handleDisplayProfile(sampleProfiles['thriller'], e.target)}} className='sample-profile'>
              <h3>Thriller fan</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieRecommendation;
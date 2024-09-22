import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import {handleGetAnime, hanldeGetAnimes, handleMakeProfile} from '../../utils/anime';
import './styles/anime-r.css';

// import AnimeRecommendationPopup from './components/AnimeRecommendationPopup';
import Loading from './components/Loading';
import DisplayRecommendations from './components/DisplayRecommendations';


function AnimeRecommendation() {

  const [recommendations, setRecommendations] = useState(null);
  const [startLoading, setStartLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState();

  const sampleProfiles = {  

        'shounen': [20, 269, 34572, 21, 31964, 1535, 40748, 11061, 16498]
    ,
        'romance-drama': [37450, 4224, 23273, 13759, 6045, 21995, 23289, 6547, 28999]
    ,
        'suspense': [1535, 16498, 22319, 9253, 22535, 37779, 30484, 32998]
    ,
        'seinen': [30276, 34134, 37521, 31478, 19, 34542, 38003]
    
    }


  async function handleRecommend(profile) {
      try {
          const genresArr = await handleMakeProfile(profile);
          console.log('Made Profile');
          const response = await axios.post('https://api.ml.saifchan.online/recommend-anime/', {
              profile: genresArr,
              seen_animes: profile
          })
  
          if (response.status === 200) {
              const data = await response.data;
              console.log('Got Recommendations.');
              const animesArr = await hanldeGetAnimes(data['recommendations']);
              console.log('Got Animes Data.')
              setRecommendations(animesArr)
              return;
          }
  
      } catch (error) {
          console.log(error);
      }
  }

  function isCurrentProfile(profile) {
    if (!currentProfile || currentProfile.length === 0) {
        return false;
    } else {
        var current = currentProfile.slice().sort()
        return currentProfile.length === profile.length && profile.slice().sort().every((val, idx) => val === current[idx])
    }
  }

  async function handleDisplayProfile(profile, targetEle) {
    var isCurrent = isCurrentProfile(profile)

    let popup = document.createElement('div')
    let profileContainer = document.createElement('div')
    let btnsContainer = document.createElement('div');
    let closeBtn = document.createElement('button');
    let setUnsetBtn = document.createElement('button');

    popup.classList.add('popup');
    profileContainer.classList.add('container');
    btnsContainer.classList.add('btns-container');
    
    closeBtn.classList.add('close'); setUnsetBtn.classList.add('set-unset');
    closeBtn.textContent = 'Close';
    
    setUnsetBtn.textContent = isCurrent ? 'Unset' : 'Set';

    popup.append(profileContainer, btnsContainer);
    btnsContainer.append(closeBtn, setUnsetBtn);

    closeBtn.onclick = () => {popup.remove()};
    setUnsetBtn.onclick = (e) => {
        
        if (e.target.textContent === 'Set') {
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
        })

        popup.remove();
    }

    document.body.appendChild(popup);

    ReactDOM.createRoot(profileContainer).render(<Loading size={45} />);
    
    let animes = await hanldeGetAnimes(profile);

    animes.forEach(anime => {
        if (popup.querySelector('.loading')) {
            popup.querySelector('.loading').remove();
        }

        var container = document.createElement('div');
        var img = document.createElement('img');
        var h4 = document.createElement('h4');

        container.className = 's-a';

        img.src = anime['main_picture']['medium'];
        h4.textContent = anime['title'];

        container.append(img, h4);
        profileContainer.appendChild(container);
    })
  }

  function handleDisplayProfileCreate() {
    let popup = document.createElement('div');
    let inputContainer = document.createElement('div');
    let container = document.createElement('div');
    let btnsContainer = document.createElement('div');
    let input = document.createElement('input');
    let addBtn = document.createElement('button');
    let setBtn = document.createElement('button');
    let cancelBtn = document.createElement('button');

    popup.classList.add('popup', 'popup-flex');
    container.classList.add('container');
    btnsContainer.classList.add('btns-container');
    inputContainer.classList.add('input-container');

    input.placeholder = 'Enter Anime MAL Id';
    input.accept = 'number';
    addBtn.textContent = 'Add';
    inputContainer.append(input, addBtn);

    let animesArr = [];

    addBtn.onclick = async () => {
        if (input.value) {
            var anime = await handleGetAnime(input.value);

            if (anime && anime !== 404) {
                var div = document.createElement('div');
                var img = document.createElement('img');
                var h4 = document.createElement('h4');
                
                div.className = 's-a';

                img.src = anime['main_picture']['medium'];
                h4.textContent = anime['title'];

                div.append(img, h4);
                container.appendChild(div);
                
                animesArr.push(anime['id']);
                input.value = '';
            
                return;
            } else if (anime === 404) return;

            alert('Something went wrong, try again.');
            return;

        } 
        alert('Please enter anime id before adding.');
        return;
    }

    setBtn.className = 'set-unset';
    setBtn.textContent = 'Set';
    cancelBtn.textContent = 'Cancel';

    setBtn.onclick = () => {
        if (animesArr.length > 0) {
            setCurrentProfile(animesArr);
            popup.remove();
            return;
        } 
        alert('Please add some animes.');
        return;
    };

    cancelBtn.onclick = () => {
        popup.remove();
    }

    btnsContainer.append(cancelBtn, setBtn);
    popup.append(inputContainer, container, btnsContainer);
    document.body.appendChild(popup)

  }

  useEffect(() => {
    document.querySelector('title').textContent = 'Anime Recommendation';
  }, [])

  return (
    <div className='page'>
        <a style={{color: 'black'}} href="/"><h3>Back to Home Page</h3></a>
        <h3>
            The model is integrated into the Entertainment part of <a href="https://cms.saifchan.online/" rel='noreferrer' target='_blank'>MandelbrotCMS</a>.
        </h3>
        <div>
            <div className='recommendations'>
                <button onClick={() => {
                    setRecommendations(null);
                    if (currentProfile && currentProfile.length > 0) {
                        setStartLoading(true);
                        handleRecommend(currentProfile);
                    } else {
                        alert('Please specify a profile or create one.')
                        setStartLoading(false);
                    }
                }} className='recommend-btn'>Recommend</button>
                <div className="recommendations-list">
                    {startLoading && (
                        <>
                        {recommendations && recommendations.length > 0 ? (
                            <DisplayRecommendations recommendations={recommendations} />
                        ): (<Loading size={65} />)}
                        </>
                    )}
                    
                </div>
            </div>
            <div className='profiles'>
                <div>
                    <h4>Sample Profiles</h4>
                    <button onClick={handleDisplayProfileCreate} className='create-profile'>Create Profile</button>
                </div>
                <div className='sample-profiles-list'>
                    <div onClick={(e) => {handleDisplayProfile(sampleProfiles['shounen'], e.target)}} className='sample-profile'>
                        <h3>Shounen Fan</h3>
                    </div>
                    <div onClick={(e) => {handleDisplayProfile(sampleProfiles['romance-drama'], e.target)}} className='sample-profile'>
                        <h3>Romance&Drama Fan</h3>
                    </div>
                    <div onClick={(e) => {handleDisplayProfile(sampleProfiles['suspense'], e.target)}} className='sample-profile'>
                        <h3>Suspense Fan</h3>
                    </div>
                    <div onClick={(e) => {handleDisplayProfile(sampleProfiles['seinen'], e.target)}} className='sample-profile'>
                        <h3>Seinen Fan</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AnimeRecommendation;

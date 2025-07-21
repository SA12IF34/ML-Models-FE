/* eslint-disable react/prop-types */

function DisplayRecommendations({recommendations}) {
  return (
    <>
      {recommendations.map(r => 
        r && (
          <div key={r['data']['mal_id']} className='recommendation'>
              <img 
                src={r['data']['images']['jpg']['image_url']} 
                alt={r['data']['title']} 
                loading="lazy"
              />
              <div>
                  <h4>{r['data']['title']}</h4>
                  <p>{r['data']['synopsis']?.slice(0, 150)}...</p>
                  {r['data']['score'] && <span>★ {r['data']['score'].toFixed(1)}/10</span>}
                  <a 
                    target="_blank" 
                    rel="noreferrer" 
                    href={`https://myanimelist.net/anime/${r['data']['mal_id']}`}
                    title="View on MyAnimeList"
                  >
                    View on MyAnimeList
                  </a>
              </div>
          </div>
        )
      )}
    </>
  )
}

export default DisplayRecommendations;
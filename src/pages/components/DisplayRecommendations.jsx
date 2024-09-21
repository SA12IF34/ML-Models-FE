/* eslint-disable react/prop-types */

function DisplayRecommendations({recommendations}) {

  return (
    <>
        {recommendations.map(r => {
            return (<>
                {r ? (
                <div key={r['id']} className='recommendation'>
                    <img src={r['main_picture']['medium']} alt="" />
                    <div>
                        <h4>{r['title']}</h4>
                        <p>{r['synopsis'].slice(0, 100)}...</p>
                        <span>{r['mean']}/10</span>
                        <a target="_blank" rel="noreferrer" href={`https://myanimelist.net/anime/${r['id']}`}>{`https://myanimelist.net/anime/${r['id']}`}</a>
                    </div>
                </div>
                ): (<></>)}
            </>)
        })}
    </>
  )
}

export default DisplayRecommendations;
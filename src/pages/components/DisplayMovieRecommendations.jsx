/* eslint-disable react/prop-types */

function DisplayMovieRecommendations({recommendations}) {
  return (
    <>
      {recommendations.map(movie => 
        movie && (
          <div key={movie.imdbID} className='recommendation'>
              <img 
                src={movie.Poster !== "N/A" ? movie.Poster : '/movie-placeholder.jpg'} 
                alt={movie.Title} 
                loading="lazy"
              />
              <div>
                  <h4>{movie.Title} ({movie.Year})</h4>
                  <p>{movie.Plot !== "N/A" ? movie.Plot : "No plot available"}</p>
                  <div className="movie-meta">
                    {movie.Runtime !== "N/A" && <span className="runtime">{movie.Runtime}</span>}
                    {movie.Genre !== "N/A" && <span className="genre">{movie.Genre}</span>}
                  </div>
                  {movie.imdbRating !== "N/A" && (
                    <span className="rating">★ {movie.imdbRating}/10</span>
                  )}
                  <a 
                    target="_blank" 
                    rel="noreferrer" 
                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                    title="View on IMDB"
                  >
                    View on IMDB
                  </a>
              </div>
          </div>
        )
      )}
    </>
  )
}

export default DisplayMovieRecommendations;

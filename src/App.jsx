import {Routes, Route} from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import AnimeRecommendation from './pages/AnimeRecommendation';
import MovieRecommendation from './pages/MovieRecommendation';
import Agent from './pages/Agent';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/models/anime-recommender/' element={<AnimeRecommendation />} />
      <Route path='/models/imdb-recommender/' element={<MovieRecommendation />} />
      <Route path='/apps/python-agent/' element={<Agent />} />
    </Routes>
  )
}

export default App

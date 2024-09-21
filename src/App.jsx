import {Routes, Route} from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import AnimeRecommendation from './pages/AnimeRecommendation';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/models/anime-recommender/' element={<AnimeRecommendation />} />
    </Routes>
  )
}

export default App

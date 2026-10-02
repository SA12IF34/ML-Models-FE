import {useEffect, useState, useMemo} from 'react';
import {Link} from 'react-router-dom';
import Particles, {initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from "@tsparticles/slim";

function Home() {

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      });
  }, [])

  const particlesLoaded = () => {
    console.log('Particles Loaded!')
  }

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: false,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#000000",
        },
        links: {
          color: "#000000",
          distance: 160,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 4,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 60,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: ["circle", "triangle", "line"],
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );


  return (
    <div id='home-page' className="home-page">
        <main>
            <h1>Models</h1>
            <br />
            <div className="grand-container">
                <div className="models-container">
                    <h2>Recommender Systems</h2>
                    <div className="container">
                        <Link to='/models/anime-recommender/'>
                            <div className="model">
                                <h4>Anime Recommendation</h4>
                            </div>
                        </Link>
                        <Link to='/models/imdb-recommender/'>
                            <div className="model">
                                <h4>Movie Recommendation</h4>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="models-container">
                    <h2>AI Agents & Apps</h2>
                    <div className="container">
                        <Link target='_blank' to='https://agent.saifchan.online/'>
                            <div className="model">
                                <h4>Multilingual AI Voice Agent</h4>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
        {init && (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
        />
        )}
    </div>
  )
}

export default Home;

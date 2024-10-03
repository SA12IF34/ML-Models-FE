import {useState, useEffect} from 'react';
import {TiMicrophoneOutline} from 'react-icons/ti';
import {TbMicrophoneOff} from 'react-icons/tb';
import { handleCallAgent } from '../../utils/agent';
import ReactLoading from 'react-loading';

import './styles/agent.css';

function Agent() {
  
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [waiting, setWaiting]  = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    document.querySelector('title').textContent = 'AI Assistant';

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.fillStyle = "rgb(243 243 243)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "rgb(0 0 0)";
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvas.height/2);
    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

    if (window && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

        let recognitionInstance = new SpeechRecognition();
        let speechRecognitionList = new SpeechGrammarList();
        setRecognition(recognitionInstance);

        recognitionInstance.grammars = speechRecognitionList;
        recognitionInstance.continuous = false;
        recognitionInstance.lang = "en";
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;
    

        recognitionInstance.onnomatch = () => {
            setWaiting(false);
        }

        recognitionInstance.onspeechend = () => {
            setRecording(false)
            
            recognitionInstance.stop()
        }
        recognitionInstance.onend = () => {
            setRecording(false)
        };

        recognitionInstance.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            console.log(transcript);
            recognitionInstance.stop();
            
            if (!transcript || transcript === '') {
                alert('repeat');
                setWaiting(false)
                recognitionInstance.start()
            
            } else {
                setWaiting(true);
                const {urls, audioData} = await handleCallAgent(transcript);
                setWaiting(false);
                if (urls && urls.length > 0) {
                    handleCreateUrlsElement(urls);
                    recognitionInstance.start();
                    setRecording(true)
                } else {
                    const url = URL.createObjectURL(audioData['blob']);
                    const audio = new Audio(url);
                    
                    audio.onloadeddata = () => {
                        const audioCtx = new AudioContext();
                        const analyser = audioCtx.createAnalyser();
                        const source = audioCtx.createMediaStreamSource(audio.captureStream());
                        source.connect(analyser);

                        analyser.fftSize = 1024;
                        const bufferLength = analyser.frequencyBinCount;
                        const dataArray = new Uint8Array(bufferLength);

                        audio.play()
                        setIsAudioPlaying(true);
                        function draw() {
                            requestAnimationFrame(draw);
                            
                            analyser.getByteTimeDomainData(dataArray);

                            canvasCtx.fillStyle = "rgb(243 243 243)";
                            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                            canvasCtx.lineWidth = 3;
                            canvasCtx.strokeStyle = "rgb(0 0 0)";
                            canvasCtx.beginPath();

                            const sliceWidth = canvas.width / bufferLength;
                            let x = 0;

                            for (let i = 0; i < bufferLength; i++) {
                              const v = dataArray[i] / 128.0;
                              const y = v * (canvas.height / 2);
                            
                              if (i === 0) {
                                canvasCtx.moveTo(x, y);
                              } else {
                                canvasCtx.lineTo(x, y);
                              }
                            
                              x += sliceWidth;
                            }
                            canvasCtx.lineTo(canvas.width, canvas.height / 2);
                            canvasCtx.stroke();

                        }
                        draw()
                    }

                    audio.onended = () => {
                        recognitionInstance.start();
                        setRecording(true);
                        setIsAudioPlaying(false);
                    }

                    document.querySelector('button.stop-play').onclick = () => {
                        if (!audio.paused) {
                            audio.pause()
                            audio.srcObject = null;
                            audio.src = '';
                            setIsAudioPlaying(false);
                        }
                    }
                }
            }
        }
        
    }
  }, [])

  function handleToggleRecording() {
    if (recognition) {
        if (recording) {
            recognition.stop();
            setRecording(false);
        } else {
            recognition.start();
            setRecording(true);
        }
        setWaiting(false);
    }
  }
  function handleCreateUrlsElement(urls) {
    console.log(urls);
    urls = urls.length <= 4 ? urls : urls.slice(0, 3);
    console.log(urls);
    var container = document.createElement('div');
    for (var url of urls) {
        var a = document.createElement('a');
        a.textContent = url;
        a.href = url;
        a.target = '_blank';
        container.appendChild(a);
    }
    container.classList.add('urls-container');
    document.querySelector('.page > .msg-container').append(container);
  }


  return (
    <div className='page'>
        <span onClick={()=>{alert('To make it search the web start your query with "search the web for...".')}}
        style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            backgroundColor: 'silver',
            color: 'gray',
            fontSize: '1.5em',
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '50%',
            textAlign: 'center',
            alignContent: 'center',
            opacity: 0.6, 
            cursor: 'pointer'
            }}>!</span>
        <a style={{color: 'black'}} href="/"><h3>Back to Home Page</h3></a>
        <div className="container">
            <canvas id='canvas' ></canvas>
            <div className='btns'>
                <button 
                onMouseDown={(e) => {e.target.classList.add('mouse-down')}}
                onMouseUp={(e) => {e.target.classList.remove('mouse-down');}}
                onClick={handleToggleRecording} className='record'>
                    {recording ? (
                        <TbMicrophoneOff />
                    ): (
                        <TiMicrophoneOutline />
                    )}
                </button>
                <button 
                onMouseDown={(e) => {e.target.classList.add('mouse-down')}}
                onMouseUp={(e) => {e.target.classList.remove('mouse-down')}}
                className={`stop-play ${isAudioPlaying ? '': 'none-btn'}`}>
                    <span className='square'></span>
                </button>
            </div>
            {waiting && (
                <ReactLoading type={'bubbles'} color={'#6cb8e0'} />
            )}
        </div>
        <div className='msg-container'>

        </div>
    </div>
  )
}

export default Agent;
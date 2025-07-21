import {useState, useEffect} from 'react';
import {TiMicrophoneOutline} from 'react-icons/ti';
import { SlArrowDown } from "react-icons/sl";
import { handleCallAgent } from '../../utils/agent';
import ReactLoading from 'react-loading';

import './styles/agent.css';

function Agent() {
  
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

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let chunks = [];
        navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            const recorder = new MediaRecorder(stream);
            
            document.querySelector('button.record').onmousedown = () => {
                recorder.start();
                console.log('State: ', recorder.state);
                console.log("recorder started");
            }

            document.querySelector('button.record').onmouseup = () => {        
                recorder.stop();
                console.log('State: ', recorder.state);
            }

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            }

            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                chunks = [];

                if (blob.size < 10) {
                    return;
                }

                try {
                    const buffer = await blob.arrayBuffer();
                    const audioContext = new AudioContext();
                    const audioBuffer = await audioContext.decodeAudioData(buffer);
                    // Get raw audio data
                    const rawData = audioBuffer.getChannelData(0);
                    const sampleRate = audioBuffer.sampleRate;

                    setWaiting(true);
                    const data = await handleCallAgent(JSON.stringify(Array.from(rawData)), sampleRate);
                    setWaiting(false);

                    if (data === -1) {
                        return;
                    }

                    const {urls, audioData} = data;

                    if (urls && urls.length > 0) {
                        handleCreateUrlsElement(urls);                    
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


                } catch (error) {
                    
                }
            }

        }, (err) => {
            console.error(`The following getUserMedia error occurred: ${err}`);
        })
        
    }
  }, [])


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

  function handleShowNotes(e) {
    let container = document.querySelector('.notes > div:nth-child(2)');
    if (e.target.classList.contains('flip')) {
        container.style.height = ``;
    } else {
        container.style.height = `${container.firstElementChild.clientHeight+20}px`;
    }

    e.target.classList.toggle('flip');
  }


  return (
    <div className='page agent-page'>
        <a style={{color: 'black'}} href="/"><h3>Back to Home Page</h3></a>
        
        <div className="container">
            <canvas id='canvas' ></canvas>
            <div>
                <div className="notes">
                    <div>
                        <h3>Important Notes</h3>
                        <span onClick={handleShowNotes}>
                            <SlArrowDown />
                        </span>
                    </div>
                    <div>
                        <ul>
                            <li>Hold down mouse left button on the mic to speak</li>
                            <li>The Agent can search the Web</li>
                            <li>The Agent speaks english only currently</li>
                        </ul>
                    </div>
                </div>
                <div className='btns'>
                    <button 
                    onMouseDown={(e) => {e.target.classList.add('mouse-down')}}
                    onMouseUp={(e) => {e.target.classList.remove('mouse-down');}}
                    className='record'>                        
                        <TiMicrophoneOutline />
                    </button>
                    <button 
                    onMouseDown={(e) => {e.target.classList.add('mouse-down')}}
                    onMouseUp={(e) => {e.target.classList.remove('mouse-down')}}
                    className={`stop-play ${isAudioPlaying ? '': 'none-btn'}`}>
                        <span className='square'></span>
                    </button>
                </div>

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
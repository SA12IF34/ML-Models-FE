import {useState} from 'react';
import {startAudioCapture, stopAudioCapture, handleSendAudio} from '../../../utils/audio';


export default function Recorder() {

  const [recordTime, setRecordTime] = useState(5); // 5 | 10 | 15 | 20
  const [leftRecordTime, setLeftRecordTime] = useState(5);
  const [startedRecording, setStartedRecording] = useState(false); 

  const [requestResult, setRequestResult] = useState(null);

  async function handleStartRecording() {
    if (startedRecording) return;
    const result = await startAudioCapture();
    if (result) {
      setStartedRecording(true);

      let interval = setInterval(() => {
        setLeftRecordTime(left => left-1 );
      }, 1000);
      let timeout = setTimeout(async () => {
        console.log('finish')
        const result = await stopAudioCapture();
        setRequestResult(result)
        setStartedRecording(false);
        setLeftRecordTime(recordTime);
        clearInterval(interval); 
        clearTimeout(timeout);
        
      }, recordTime*1000)
    }
  }

  return (
    <main>
      <div className='record-time'>
        <strong>Set Recording time:</strong>
        <div>
          <button className={recordTime === 5 ? 'selected': ''} onClick={() => {setRecordTime(5); setLeftRecordTime(5);}}>5 Seconds</button>
          <button className={recordTime === 10 ? 'selected': ''} onClick={() => {setRecordTime(10); setLeftRecordTime(10);}}>10 Seconds</button>
          <button className={recordTime === 15 ? 'selected': ''} onClick={() => {setRecordTime(15); setLeftRecordTime(15);}}>15 Seconds</button>
          <button className={recordTime === 20 ? 'selected': ''} onClick={() => {setRecordTime(20); setLeftRecordTime(20);}}>20 Seconds</button>
        </div>
      </div>
      <div className='recorder'>
        {requestResult 
        ? (
          <div>
            <span style={{fontWeight: '500'}}><strong>Language:</strong> {requestResult.language}</span>
            <span style={{fontWeight: '500'}}><strong>Full Processing Time:</strong> {requestResult.elapsed < 1 ? `${requestResult.elapsed * 1000}`.slice(0,3)+' ms': `${requestResult.elapsed}`.slice(0,3)+' sec'}</span>
            <span style={{fontWeight: '500'}}><strong>Model Inference Time:</strong> {requestResult.inference_time < 1 ? `${requestResult.inference_time * 1000}`.slice(0,4)+' ms' : `${requestResult.inference_time}`.slice(0,3)+' sec'}</span>
          </div>
        ): (<></>)}
        <button onClick={handleStartRecording}>{startedRecording ? `${leftRecordTime} left..`: 'Start Recording'}</button>
      </div>
    </main>
  )
}
const SAMPLE_RATE = 16000;

let audioContext;
let mediaStream;
let mediaRecorder;
let processor;
let microphone;

let audioChunks = [];



export async function startAudioCapture() {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.start();
    return true;
}


export async function stopAudioCapture() {
    const recorder = mediaRecorder;
    if (!recorder) return;

    const audioBlob = await new Promise(resolve => {
        recorder.addEventListener('stop', () => {
            resolve(new Blob(audioChunks, { type: recorder.mimeType }));
        }, { once: true });

        recorder.stop();
    });

    mediaStream?.getTracks().forEach(track => track.stop());
    mediaStream = null;
    mediaRecorder = null;
    audioChunks = [];

    return handleSendAudio(audioBlob);
}

export async function handleSendAudio(audioBlob) {
    try {
        const formData = new FormData();
        const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
        formData.append('file', audioBlob, `recording.${extension}`);

        const response = await fetch('http://localhost:9000/identify-language/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();

            return data;
        }
    } catch (error) {
        console.error('Error calling identification endpoint', error);
        alert('something went wrong');
    }
}
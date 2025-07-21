import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ROOT_URL
})

async function handleCallAgent(data, rate) {
    try {
        let id = window.sessionStorage.getItem('id');

        const response = await api.post('agent/', {
            data: data,
            rate: rate,
            id: id
        });

        if (response.status === 200) {
            const data = await response.data;

            if (data['error']) {
                alert(data['error']);
                return -1;
            } else if (data['nothing']) {
                return -1;
            }

            data['id'] ? window.sessionStorage.setItem('id', data['id']) : null;
            
            const audioData = data['audio_data'] ? base64ToByteArrayAndBlob(data['audio_data'], 'audio/mpeg') : null;

            return {urls:data['urls'], audioData:audioData, aiMsg:data['ai_message']}
        }

    } catch (error) {
        alert('Encountered a problem communicating with the server.')
    }
}

// ChatGPT
function base64ToByteArrayAndBlob(base64Data, fileType) {
  // Decode the base64 string to a byte array
  const byteCharacters = atob(base64Data);
  const byteArray = new Uint8Array(Array.from(byteCharacters, char => char.charCodeAt(0)));
  
  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: fileType });

  return { byteArray, blob };
}


export {handleCallAgent, base64ToByteArrayAndBlob}
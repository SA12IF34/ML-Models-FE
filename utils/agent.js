import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ROOT_URL
})

async function handleCallAgent(arrayBuffer, rate) {
    try {
        let chatHistory = window.sessionStorage.getItem('chatHistory');
        chatHistory = chatHistory ? JSON.parse(chatHistory) : [];
        const response = await api.post('agent/', {
            message: arrayBuffer,
            // rate: rate,
            history: chatHistory
        });

        if (response.status === 200) {
            const data = await response.data;
            if (data['history'] && data['history'].length > chatHistory.length) {
                console.log('history updated')
                window.sessionStorage.setItem('chatHistory', JSON.stringify(data['history']));
            }

            const audioData = data['audio_data'] ? base64ToByteArrayAndBlob(data['audio_data'], 'audio/mpeg') : null;

            return {urls:data['urls'], audioData:audioData, aiMsg:data['ai_message']}
        }

    } catch (error) {
        console.log(error);
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
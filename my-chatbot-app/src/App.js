import React, { useState } from 'react';
import {ThreeDots} from 'react-loader-spinner'

import './App.css';

function App() {
  const [inputMessage, setInputMessage] = useState('');
  const [response, setResponse] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputMessage(''); // Ripulisce il campo di testo della richiesta
    setIsLoading(true); // Imposta isLoading su true durante il caricamento

    // Effettua una richiesta al tuo server Node.js
    const serverResponse = await sendMessage(inputMessage);

    // Controlla se la risposta contiene un URL di immagine
    if (serverResponse.startsWith('http')) {
      setImageUrl(serverResponse);
      setResponse(''); // Pulisce il testo di risposta se è presente
    } else {
      setResponse(serverResponse);
      setImageUrl(''); // Pulisce l'URL dell'immagine se è presente
    }
    setIsLoading(false); // Imposta isLoading su false dopo il caricamento
  };

  const sendMessage = async (message) => {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    const data = await response.json();
    return data.response;
  };
  
  return (
    <div className="App">
      <h1>Chatbot con React e Node.js</h1>
      <div className="chat-container">
        <div className="chat-response">
          {isLoading ? (
              <div className="loader-container">
            <ThreeDots color="#00BFFF" height={100} width={100} />
            </div>
          ) : (
            <div>
              {response && <div className="response">{response}</div>}
              {imageUrl && <img src={imageUrl} alt="Immagine generata" />}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Digita un messaggio..."
            value={inputMessage}
            class="main-field"
            onChange={handleChange}
          />
          <button type="submit">Invia</button>
        </form>
      </div>
    </div>
  );
}

export default App;
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000; // Porta del Server

// Inserisci qui la tua chiave API di OpenAI
const openaiApiKey = 'YOUR-API-KEY';

// Configura l'SDK di OpenAI
const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

// Inizializza l'endpoint per la gestione delle richieste
app.post('/chat', async (req, res) => {
  const message = req.body.message;

  try {
    const response = shouldUseChatGPT(message)
      ? await chatWithGPT(message)
      : await chatWithDALLE(message);

    res.json({ response });
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    res.status(500).json({ error: 'Si è verificato un errore' });
  }
});

// Funzione per utilizzare le API di ChatGPT
async function chatWithGPT(message) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'user' }, { role: 'user', content: message }],
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body,
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Funzione per utilizzare le API di DALL-E
async function chatWithDALLE(message) {
  const generatedImage = await generateImage(message);
  return generatedImage;
}

async function generateImage(prompt) {
  const response = await openai.createImage({
    prompt,
    size: '256x256',
  });

  return response.data.data[0].url;
}

// Funzione per determinare quale API utilizzare in base al prompt
function shouldUseChatGPT(message) {
  const keywords = ['immagine', 'genera immagine', 'crea immagine'];
  for (const keyword of keywords) {
    if (message.toLowerCase().includes(keyword)) {
      return false;
    }
  }
  return true;
}

// Avvia il server
app.listen(port, () => {
  console.log(`Il server è in esecuzione sulla porta ${port}`);
});
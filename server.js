const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, './.env');
dotenv.config({ path: envPath });

const app = express();

// Porta em que ser servidor está definido (será específicada no frontend)
const port = 3002;

app.use(cors());
app.use(bodyParser.json()); // Adiciona o body-parser ao middleware para interpretar JSON

//Realizando as chamadas de fato, neste caso, estão dinamicamente adaptadas para qualquer post ou get

app.all('/api/:endpoint', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const baseUrl = 'https://brasilbitcoin.com.br/caas/';

    const { endpoint } = req.params;
    const apiEndpoint = baseUrl + endpoint;

    let fullApiEndpoint

    const method = req.method.toLowerCase();
    const data = method === 'get' ? req.query : req.body;

    const headers = {
      Authentication: apiKey,
      'BRBTC-FROM-ACCOUNT': Number(data.document), // Obtendo 'document' do corpo da requisição
    };


    let response;
    const { body } = req;
    //Realizando a chamada e fazendo o tratamento para saber se foi método POST ou GET
    if (method === 'get') {
      const { query } = req;
      fullApiEndpoint = '?' + new URLSearchParams(query).toString();
      response = await axios.get(apiEndpoint + fullApiEndpoint, { headers });
    } else if (method === 'post') {
      response = await axios.post(apiEndpoint, body, { headers });
    } else {
      throw new Error('Método HTTP não suportado');
    }

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // O pedido foi feito e o servidor respondeu com um código de status
      // que cai fora do intervalo de 2xx
      console.log(error.response.data);
    } else if (error.request) {
      // O pedido foi feito, mas nenhuma resposta foi recebida
      console.log(error.request);
    } else {
      // Algo aconteceu na configuração do pedido que disparou um erro
      console.log('Error', error.message);
    }
    res.status(500).json({ error: 'Erro 500' });
  }
});

// Start the server and make it accessible on the local network
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor Node.js rodando em http://localhost:${port}`);
  console.log(`Servidor Node.js rodando em http://2803:9800:98c2:7fb2:f1e7:20bb:669e:5c04:${port}`); 
});

const express = require('express');
const next = require('next');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = 3000;

app.prepare().then(() => {
  const server = express();

  // Middleware to parse incoming JSON requests
  server.use(express.json());

  // Proxy route to forward the request to the external API
  server.post('/api/proxy', async (req, res) => {
    try {
      const { uber_link, ola_link } = req.body;

      // Log the incoming request body to verify it's being received
      console.log('Received body:', req.body);

      // Check if both links are provided
      if (!uber_link || !ola_link) {
        return res.status(400).json({ error: 'Please provide both uber_link and ola_link.' });
      }

      // Forward the request to the external API
      const externalResponse = await axios.post('https://nodejs-serverless-function-express-seven-jet.vercel.app/api/hello', {
        uber_link,
        ola_link,
      });

      const externalData = externalResponse.data;

      // Now we structure the response in the required format
      const formattedResponse = {
        auto: {
          ola: {
            eta: externalData.auto?.ola?.eta || '',
            name: externalData.auto?.ola?.name || '',
            price: externalData.auto?.ola?.price || '',
          },
          uber: {
            eta: externalData.auto?.uber?.eta || '',
            name: externalData.auto?.uber?.name || '',
            price: externalData.auto?.uber?.price || '',
          },
        },
        bike: {
          ola: {
            eta: externalData.bike?.ola?.eta || '',
            name: externalData.bike?.ola?.name || '',
            price: externalData.bike?.ola?.price || '',
          },
          uber: {
            eta: externalData.bike?.uber?.eta || '',
            name: externalData.bike?.uber?.name || '',
            price: externalData.bike?.uber?.price || '',
          },
        },
        mini: {
          ola: {
            eta: externalData.mini?.ola?.eta || '',
            name: externalData.mini?.ola?.name || '',
            price: externalData.mini?.ola?.price || '',
          },
          uber: {
            eta: externalData.mini?.uber?.eta || '',
            name: externalData.mini?.uber?.name || '',
            price: externalData.mini?.uber?.price || '',
          },
        },
        sedan: {
          ola: {
            eta: externalData.sedan?.ola?.eta || '',
            name: externalData.sedan?.ola?.name || '',
            price: externalData.sedan?.ola?.price || '',
          },
          uber: {
            eta: externalData.sedan?.uber?.eta || '',
            name: externalData.sedan?.uber?.name || '',
            price: externalData.sedan?.uber?.price || '',
          },
        },
        suv: {
          ola: {
            eta: externalData.suv?.ola?.eta || '',
            name: externalData.suv?.ola?.name || '',
            price: externalData.suv?.ola?.price || '',
          },
          uber: {
            eta: externalData.suv?.uber?.eta || '',
            name: externalData.suv?.uber?.name || '',
            price: externalData.suv?.uber?.price || '',
          },
        },
      };

      // Send the formatted response back to the client
      res.status(200).json(formattedResponse);
    } catch (error) {
      console.error('Error forwarding request:', error);
      res.status(500).json({ message: 'Error forwarding request to external API' });
    }
  });

  // Handle all Next.js page requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

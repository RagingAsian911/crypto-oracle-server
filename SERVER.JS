const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhooks', (req, res) => {
  const payload = req.body;

  // Validate payload
  if (!payload || !payload.event || !payload.data) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  // Route logic
  switch (payload.event) {
    case 'product_update':
      console.log('Product update received:', payload.data);
      // TODO: Update inventory, broadcast signal
      break;
    case 'payout_trigger':
      console.log('Payout triggered:', payload.data);
      // TODO: Route to PayPal, btcpay, coinbase
      break;
    case 'contributor_onboard':
      console.log('New contributor onboarded:', payload.data);
      // TODO: Inject into dashboard, overlay, audit flow
      break;
    default:
      console.log('Unknown event:', payload.event);
  }

  res.status(200).json({ status: 'Webhook processed' });
});

// Health check
app.get('/', (req, res) => {
  res.send('Sovereign server is live.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

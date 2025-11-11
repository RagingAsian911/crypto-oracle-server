const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔑 Validate Subscriber Key
app.post('/api/validate-key', (req, res) => {
  const { key, customer_id, emotion_tag, tier } = req.body;

  if (!key || !customer_id) {
    return res.status(400).json({ status: 'error', message: 'Missing key or customer_id' });
  }

  const signal_feed = tier === 'oracle'
    ? ['Buy BTC', 'Hold ETH', 'Watch SOL']
    : ['Teaser: BTC spike', 'Teaser: ETH dip'];

  res.json({
    status: 'valid',
    tier,
    emotion_tag,
    signal_feed
  });
});

// 💋 Talent Intake
app.post('/api/intake-talent', (req, res) => {
  const { name, tagline, image_url, tier, emotion_tag, location, seeking, interests } = req.body;

  if (!name || !tagline || !image_url) {
    return res.status(400).json({ status: 'error', message: 'Missing talent fields' });
  }

  res.json({
    status: 'received',
    dashboard_unlock: true,
    tier,
    emotion_tag,
    message: `Welcome ${name}, you are ${tagline}`,
    profile: { name, tagline, image_url, location, seeking, interests }
  });
});

// 📈 Affiliate Tracking
app.post('/api/track-affiliate', (req, res) => {
  const { referrer_id, event, product_id, timestamp } = req.body;

  if (!referrer_id || !event || !product_id) {
    return res.status(400).json({ status: 'error', message: 'Missing affiliate fields' });
  }

  res.json({
    status: 'logged',
    referrer_id,
    event,
    product_id,
    timestamp
  });
});

// 💘 Matchmaking Engine
const mockTalentPool = [
  { name: 'Grace', emotion_tag: 'devotion', seeking: 'sovereign' },
  { name: 'Nova', emotion_tag: 'chaos', seeking: 'devotion' },
  { name: 'Eli', emotion_tag: 'sovereign', seeking: 'devotion' }
];

app.post('/api/matchmake', (req, res) => {
  const { user_profile } = req.body;

  if (!user_profile || !user_profile.emotion_tag || !user_profile.seeking) {
    return res.status(400).json({ status: 'error', message: 'Missing profile data' });
  }

  const matches = mockTalentPool.filter(talent =>
    talent.emotion_tag === user_profile.seeking ||
    talent.seeking === user_profile.emotion_tag
  );

  res.json({
    status: 'matched',
    matches: matches.slice(0, 3)
  });
});

// 🧠 AI Moderation
app.post('/api/moderate-chat', (req, res) => {
  const { message, sender_emotion, receiver_emotion } = req.body;

  if (!message || !sender_emotion || !receiver_emotion) {
    return res.status(400).json({ status: 'error', message: 'Missing chat data' });
  }

  if (sender_emotion !== receiver_emotion) {
    return res.json({ status: 'flagged', reason: 'emotional mismatch' });
  }

  res.json({ status: 'safe' });
});

app.listen(PORT, () => {
  console.log(`🔥 Crypto Oracle Webhook running on port ${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Load asset inventory
const inventoryPath = path.join(__dirname, 'asset_inventory.csv');
let assetInventory = [];
if (fs.existsSync(inventoryPath)) {
  const raw = fs.readFileSync(inventoryPath, 'utf8');
  assetInventory = raw.split('\n').map(line => line.trim()).filter(Boolean);
}

// Webhook endpoint
app.post('/webhooks', (req, res) => {
  const { event, data } = req.body;
  if (!event || !data) return res.status(400).json({ error: 'Invalid webhook payload' });

  const log = (label, payload) => {
    const entry = `[${new Date().toISOString()}] ${label}: ${JSON.stringify(payload)}\n`;
    fs.appendFileSync('logs.txt', entry);
  };

  switch (event) {
    case 'product_update': log('Product update', data); break;
    case 'payout_trigger': log('Payout trigger', data); break;
    case 'contributor_onboard': log('Contributor onboarded', data); break;
    default: log('Unknown event', { event, data });
  }

  res.status(200).json({ status: 'Webhook processed' });
});

app.get('/', (req, res) => res.send('Sovereign server is live.'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

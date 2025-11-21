require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Crypto Oracle Server Running'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import nacl from "tweetnacl";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Discord required verification middleware
function verifyDiscordRequest(publicKey) {
  return function (req, res, next) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");
    const body = JSON.stringify(req.body);

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(publicKey, "hex")
    );

    if (!isVerified) return res.status(401).send("Invalid request signature");
    next();
  };
}

// ---------- ROUTES ----------

// healthcheck
app.get("/", (req, res) => {
  res.send("🧿 Oracle Server Online");
});

// Interactions endpoint
app.post("/api/interactions", verifyDiscordRequest(PUBLIC_KEY), (req, res) => {
  const { type, data } = req.body;

  if (type === 1) {
    return res.send({ type: 1 });
  }

  if (type === 2) {
    const cmd = data.name;
    return res.send({
      type: 4,
      data: {
        content: `🧿 Oracle executed: /${cmd}`
      }
    });
  }
});

// Linked role verification redirect
app.get("/verify", (req, res) => {
  res.sendFile(__dirname + "/public/verify.html");
});

app.get("/api/verify", (req, res) => {
  res.send("Verification complete.");
});

// Terms and Privacy static
app.get("/terms", (req, res) => {
  res.sendFile(__dirname + "/public/terms.html");
});
app.get("/privacy", (req, res) => {
  res.sendFile(__dirname + "/public/privacy.html");
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Oracle server started.")
);
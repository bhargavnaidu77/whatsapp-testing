const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Verification endpoint to validate webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"; // Replace with your verify token

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook endpoint to handle incoming messages
app.post("/webhook", (req, res) => {
  const entry = req.body.entry;
  if (entry && entry.length > 0) {
    const changes = entry[0].changes;
    if (changes && changes.length > 0) {
      const value = changes[0].value;
      const messages = value.messages;
      if (messages && messages.length > 0) {
        const message = messages[0];
        const from = message.from; // Sender's phone number
        const msgBody = message.text ? message.text.body : "";

        console.log(`Received message from ${from}: ${msgBody}`);

        // Prepare a response based on the received message
        let responseText;
        if (msgBody.toLowerCase() === "hello") {
          responseText = "Hi there! How can I help you today?";
        } else if (msgBody.toLowerCase() === "bye") {
          responseText = "Goodbye! Have a great day!";
        } else {
          responseText =
            "I'm not sure how to respond to that. Can you please rephrase?";
        }

        const responseMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: responseText,
          },
        };

        sendWhatsAppMessage(responseMessage);
      }
    }
  }

  res.sendStatus(200);
});

const sendWhatsAppMessage = async (message) => {
  const url = "https://graph.facebook.com/v14.0/363901783471434/messages";
  const token =
    "EAAXr5E4DbWoBOZB0YhFDQdF27x3BQtNXSlZBMGeLgunGa7BdniJ2SgtZCgBv095elI4BYwVwatcLxfoWCoGgdShfl1KQ868PNfwvmmXKZC2zZBT4E4CwIk5enqBbzloQl5ickHvZCNud89akkPjQMWNOZCfEt3pbMArSaZC7LluSSmzJ78GGBGQTMGpSOKbcPjvy6cvfUmjSg5IfdXRfLv8ZD";

  try {
    const response = await axios.post(url, message, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
};

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

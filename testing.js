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
        if (message.type === "text") {
          console.log(`Received message from ${from}: ${msgBody}`);
        }
        if (message.type === "interactive") {
          const interactiveMessage = message.interactive;

          if (interactiveMessage.type === "list_reply") {
            const selectedOptionId = interactiveMessage.list_reply.id;
            const selectedOptionTitle = interactiveMessage.list_reply.title;

            console.log(
              `User selected option: ${selectedOptionId} - ${selectedOptionTitle}`
            );
          }
        }
        const interactiveMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "interactive",
          interactive: {
            type: "list",
            header: {
              type: "text",
              text: "Menu Options",
            },
            body: {
              text: "Please choose an option:",
            },
            footer: {
              text: "Select an option from the list below",
            },
            action: {
              button: "Select",
              sections: [
                {
                  title: "Menu",
                  rows: [
                    {
                      id: "option1",
                      title: "General insurance",
                      description: "Description for general insurance",
                    },
                    {
                      id: "option2",
                      title: "Life insurance",
                      description: "Description for life insurance",
                    },
                  ],
                },
              ],
            },
          },
        };
        const tempMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "template",
          template: {
            name: "my_temp_1",
            language: {
              code: "en_US",
            },
            components: [
              {
                type: "header",
                parameters: [
                  {
                    type: "text",
                    text: "user", // Replace the variable in the template with actual value
                  },
                ],
              },
            ],
          },
        };
        // Prepare a response based on the received message
        let responseText;
        if (msgBody.toLowerCase() === "hello") {
          responseText = "Hi there! How can I help you today?";
        } else if (msgBody.toLowerCase() === "bye") {
          responseText = "Goodbye! Have a great day!";
        } else if (msgBody.toLowerCase() === "temp") {
          sendWhatsAppMessage(tempMessage);
        } else if (msgBody.toLowerCase() === "interactive") {
          sendWhatsAppMessage(interactiveMessage);
        } else {
          if (msgBody != "") {
            responseText =
              "I'm not sure how to respond to that. Can you please rephrase?";
          }
        }

        const responseMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: responseText,
          },
        };
        if (responseText != undefined) {
          sendWhatsAppMessage(responseMessage);
        }
      }
    }
  }

  res.sendStatus(200);
});

const sendWhatsAppMessage = async (message) => {
  const url = "https://graph.facebook.com/v14.0/397607813426011/messages";
  const token =
    "EAAXr5E4DbWoBO9r4e6MZCxMY3udwZBZBRZBprGnNj1TZAmkbxND6F1YJAv2NMmHHI6t5UEqBLZC5DbZCPGudyCzqTb1Jg5CHE4XR3mDagyI44ldhvpUmPg8uIDULquoCTBai3wuTXKS6qD3HIkszZAS2pJCgMsG10V5oLI10LLAjow6UBIOryq2LpBPg4CXiH4FK";

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

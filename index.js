const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  // const message = req.body;
  // console.log("Received message:", message);

  // // Process the incoming message and prepare a response

  const responseMessage2 = {
    messaging_product: "whatsapp",
    to: "",
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
      },
    },
  };

  const temparr = ["919133007708", "918106438172", "919494261853"];

  const sendmultiple = (temparr, responseMessage2) => {
    temparr.forEach((number) => {
      responseMessage2.to = number;
      console.log(responseMessage2.to);
      sendWhatsAppMessage(responseMessage2);
    });
  };
  sendmultiple(temparr, responseMessage2);
  // sendWhatsAppMessage(responseMessage);

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
    console.error("Error sending message:", error.response.data);
  }
};

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

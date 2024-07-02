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
    to: "919133007708",
    type: "IMAGE",
    image: {
      link: "https://pixabay.com/get/g3783501c96926d92c7cfbb37d4b6ba1e24b4e184694a8b9fc27ba470306fca2a11c0615306302835a7c346c04a643b9da5c3c1d11690a963f168b5677b4dc4a9_1280.jpg",
    },
  };
  const data = {
    messaging_product: "whatsapp",
    to: "919133007708",
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

  // const temparr = ["919133007708", "918106438172", "919494261853"];

  // const sendmultiple = (temparr, responseMessage2) => {
  //   temparr.forEach((number) => {
  //     responseMessage2.to = number;
  //     console.log(responseMessage2.to);
  //     sendWhatsAppMessage(responseMessage2);
  //   });
  // };
  // sendmultiple(temparr, responseMessage2);
  sendWhatsAppMessage(data);
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

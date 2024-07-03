const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 4000;

app.use(bodyParser.json());
let termInsuranceData = {
  Gender: "",
  DOB: "",
  Income: "",
  Smoker: "",
  ContactNo: "",
  EmailId: "",
};

const dateFormatRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
function isValidDateOfBirth(input) {
  if (!input.match(dateFormatRegex)) {
    return false;
  }
  const [, day, month, year] = input.match(dateFormatRegex);
  const date = new Date(`${year}-${month}-${day}`); // Use YYYY-MM-DD format for compatibility
  const isValid = !isNaN(date.getTime()); // Check if date is valid
  return isValid;
}
function isValidIncome(input) {
  const income = parseFloat(input);
  return /^\d+$/.test(input) && parseInt(input, 10) > 0;
}

function isValidIndianPhoneNumber(input) {
  return /^[6-9]\d{9}$/.test(input);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
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
        var msgBody = message.text ? message.text.body : "";
        if (message.type === "text") {
          console.log(`Received message from ${from}: ${msgBody}`);
        }
        if (message.type === "interactive") {
          const interactiveMessage = message.interactive;
          if (interactiveMessage.type === "list_reply") {
            var selectedOptionId = interactiveMessage.list_reply.id;
            var selectedOptionTitle = interactiveMessage.list_reply.title;
            console.log(
              `User selected option: ${selectedOptionId} - ${selectedOptionTitle}`
            );
          } else if (interactiveMessage.type === "button_reply") {
            var selectedButtonId = interactiveMessage.button_reply.id;
            var selectedButtonText = interactiveMessage.button_reply.title;
          }
        }
        const interactiveMainMessage = {
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
                      id: "Lifeoption-L1",
                      title: "Life insurance",
                      description: "Description for Life insurance",
                    },
                    {
                      id: "Genoption-L1",
                      title: "General insurance",
                      description: "Description for General insurance",
                    },
                  ],
                },
              ],
            },
          },
        };

        const interactiveLifeInsuranceMessage = {
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
                      id: "Term-insuranceoption-L2",
                      title: "Term insurance",
                      description: "Description for Term insurance",
                    },
                    {
                      id: "Endowmentoption-L2",
                      title: "Endowment",
                      description: "Description for Endowment",
                    },
                    {
                      id: "Unitlinkedoption-L2",
                      title: "Unitlinked",
                      description: "Description for Unitlinked",
                    },
                    {
                      id: "Pensionoption-L2",
                      title: "Pension",
                      description: "Description for Pension",
                    },
                  ],
                },
              ],
            },
          },
        };

        const termInsuranceGenderMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "interactive",
          interactive: {
            type: "button",
            body: {
              text: "Please choose an option:",
            },
            footer: {
              text: "Select one of the buttons below",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "Maleoption-L2",
                    title: "Male",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "Femaleoption-L2",
                    title: "Female",
                  },
                },
              ],
            },
          },
        };
        const termInsuranceDOBMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "Enter Date Of Birth (format: DD/MM/YYYY)",
          },
        };
        const termInsuranceIncomeMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "Enter Income (format: Integers only ) e.g: 40000",
          },
        };
        const termInsuranceSmokerOrDrinkerMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "interactive",
          interactive: {
            type: "button",
            body: {
              text: "Smoker/Drinker",
            },
            footer: {
              text: "Select one of the buttons below",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "SmokerYesoption-L2",
                    title: "Yes",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: "SmokerNooption-L2",
                    title: "No",
                  },
                },
              ],
            },
          },
        };
        const termInsuranceContactMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "Enter your phone number (format: +91xxxxxxxxxx)",
          },
        };
        const termInsuranceEmailMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "Enter your Email",
          },
        };

        const interactiveGeneralInsuranceMessage = {
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
                      id: "Motor-insuranceoption-L2",
                      title: "Motor insurance",
                      description: "Description for Motor insurance",
                    },
                    {
                      id: "Health-insuranceoption-L2",
                      title: "Health insurance",
                      description: "Description for Health insurance",
                    },
                    {
                      id: "Travel-insuranceoption-L2",
                      title: "Travel insurance",
                      description: "Description for Travel insurance",
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
        const FinalTestMessage = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: `Gender: ${termInsuranceData.Gender}\nDOB: ${termInsuranceData.DOB}\nIncome: ${termInsuranceData.Income}\nSmoker: ${termInsuranceData.Smoker}\nContactNo: ${termInsuranceData.ContactNo}\nEmailId: ${termInsuranceData.EmailId}`,
          },
        };
        let responseText;
        if (msgBody.toLowerCase() === "temp") {
          sendWhatsAppMessage(tempMessage);
        } else if (
          (msgBody.toLowerCase() === "hello") |
          (msgBody.toLowerCase() === "hi")
        ) {
          sendWhatsAppMessage(interactiveMainMessage);
          count = 1;
        } else if (selectedOptionId === "Lifeoption-L1") {
          sendWhatsAppMessage(interactiveLifeInsuranceMessage);
          count = 2;
        } else if (selectedOptionId === "Genoption-L1") {
          sendWhatsAppMessage(interactiveGeneralInsuranceMessage);
          count = 2;
        } else if (selectedOptionId === "Term-insuranceoption-L2") {
          sendWhatsAppMessage(termInsuranceGenderMessage);
          count = 3;
        } else if (
          (selectedButtonId === "Maleoption-L2") |
            (selectedButtonId === "Femaleoption-L2") &&
          count === 3
        ) {
          sendWhatsAppMessage(termInsuranceDOBMessage);
          termInsuranceData.Gender = selectedButtonText;
          count = 4;
        } else if (isValidDateOfBirth(msgBody) && count === 4) {
          sendWhatsAppMessage(termInsuranceIncomeMessage);
          termInsuranceData.DOB = msgBody;
          count = 5;
        } else if (isValidIncome(msgBody) && count === 5) {
          sendWhatsAppMessage(termInsuranceSmokerOrDrinkerMessage);
          termInsuranceData.Income = msgBody;
          count = 6;
        } else if (
          (selectedButtonId === "SmokerYesoption-L2") |
            (selectedButtonId === "SmokerNooption-L2") &&
          count === 6
        ) {
          sendWhatsAppMessage(termInsuranceContactMessage);
          termInsuranceData.Smoker = selectedButtonText;
          count = 7;
        } else if (isValidIndianPhoneNumber(msgBody) && count === 7) {
          sendWhatsAppMessage(termInsuranceEmailMessage);
          termInsuranceData.ContactNo = msgBody;
          count = 8;
        } else if (isValidEmail(msgBody) && count === 8) {
          termInsuranceData.EmailId = msgBody;
          sendWhatsAppMessage(FinalTestMessage);
          console.log(termInsuranceData);
          count = 0;
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

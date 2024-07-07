import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import { interactiveMainMessage } from "./templates/Main_templates/MainMesage.js";
import { interactiveLifeInsuranceMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { termInsuranceGenderMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { termInsuranceDOBMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { termInsuranceIncomeMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { termInsuranceSmokerOrDrinkerMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { termInsuranceContactMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { termInsuranceEmailMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
import { interactiveGeneralInsuranceMessage } from "./templates/General_insurance_templates/GeneralInsuranceMessages.js";
import { isValidDateOfBirth } from "./helpers/Validations.js";
import { isValidIncome } from "./helpers/Validations.js";
import { isValidIndianPhoneNumber } from "./helpers/Validations.js";
import { isValidEmail } from "./helpers/Validations.js";
import {FinalTestMessage} from './templates/Final_message/FinalMessage.js';
import {ConfirmOrEdit} from './templates/Final_message/FinalMessage.js';
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const port = 3000;
app.use(bodyParser.json());


let termInsuranceData = [];
function updateOrCreateObject(array, id, value, key) {
  const index = array.findIndex(obj => obj.id === id);
  const newObject = { id };
  newObject[key] = value;
  if (index !== -1) {
      array[index] = { ...array[index], ...newObject };
  } else {
      array.push(newObject);
  }
  return array;
}
function findIndex(array,id){
  const index = array.findIndex(obj => obj.id === id);
  if (index !== -1) {
    return array[index];
} 
}
// Verification endpoint to validate webhook
app.get("/", (req, res) => {
  res.status(200).send("server running");
});
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
app.post("/webhook", async (req, res) => {
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
        if (message.type === "image" || message.type === "document") {
          const mediaId = message.image
            ? message.image.id
            : message.document.id;
          console.log(`mediaId:- ${mediaId}`);
          const url = `https://graph.facebook.com/v20.0/${mediaId}`;
          console.log(`URL:- ${url}`);
        }
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
        let responseText;
        if (msgBody.toLowerCase() === "temp") {
          sendWhatsAppMessage(tempMessage);
        } else if (
          msgBody.toLowerCase().includes("hello") |
          msgBody.toLowerCase().includes("hi")
        ) {
          sendWhatsAppMessage(interactiveMainMessage(from));
        } else if (selectedOptionId === "LifeOption-L1") {
          sendWhatsAppMessage(interactiveLifeInsuranceMessage(from));
        } else if (selectedOptionId === "GenOption-L1") {
          sendWhatsAppMessage(interactiveGeneralInsuranceMessage(from));
        } else if (selectedOptionId === "TermInsuranceOption-L2") {
          sendWhatsAppMessage(termInsuranceGenderMessage(from));
        } else if (
          (selectedButtonId === "MaleOption-L2") |
          (selectedButtonId === "FemaleOption-L2")
        ) {
          sendWhatsAppMessage(termInsuranceDOBMessage(from));
          updateOrCreateObject(termInsuranceData,from,selectedButtonText,'Gender');
        } else if (isValidDateOfBirth(msgBody)) {
          sendWhatsAppMessage(termInsuranceIncomeMessage(from));
          updateOrCreateObject(termInsuranceData,from,msgBody,'DOB');
        } else if (isValidIndianPhoneNumber(msgBody)) {
          sendWhatsAppMessage(termInsuranceEmailMessage(from));
          updateOrCreateObject(termInsuranceData,from,msgBody,'ContactNo');
        } else if (isValidIncome(msgBody)) {
          sendWhatsAppMessage(termInsuranceSmokerOrDrinkerMessage(from));
          updateOrCreateObject(termInsuranceData,from,msgBody,'Income');
        } else if (
          (selectedButtonId === "SmokerYesOption-L2") |
          (selectedButtonId === "SmokerNoOption-L2")
        ) {
          sendWhatsAppMessage(termInsuranceContactMessage(from));
          updateOrCreateObject(termInsuranceData,from,selectedButtonText,'Smoker');
        } else if (isValidEmail(msgBody)) {
          updateOrCreateObject(termInsuranceData,from,msgBody,'Email');
          const data=findIndex(termInsuranceData,from);
          console.log(data);
          sendWhatsAppMessage(FinalTestMessage(from,data));
          sendWhatsAppMessage(ConfirmOrEdit(from));
        }
        else if (
          (selectedButtonId === "ConfirmOption-L2") |
          (selectedButtonId === "EditOption-L2")
        ){
          if(selectedButtonId === "ConfirmOption-L2"){
            responseText = 'Thank you for choosing us.....'
          }else{
          sendWhatsAppMessage(interactiveMainMessage(from));
          }
        } else {
          if (msgBody != "") {
            responseText =
              "I'm not sure how to respond to that. Can you please rephrase?";
          } else {
            responseText =
              "You Entered a wrong option. so please restart the conversation by sending Hi....";
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
  const url = "https://graph.facebook.com/v20.0/366760906524912/messages";
  const token =
    "EAAXr5E4DbWoBOz6TZCAZCGFDPMYXtGDvqtCj6szL1Jm8NrnMdN7F8fG0ZBuWeA4dCJVTkwC31ylBubjmh04m3DPLECJWXP4LiPRypPMPxGrmrkCuZBC8Onkv0iZCKCJFk58FX4MPydSrHEXlIZCkzHgqAwlG4du7xmuZCHrew1dRy1rVpw9Q7HPbTVh0xw94uAA";
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

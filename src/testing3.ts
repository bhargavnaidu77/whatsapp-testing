import express from "express";
import bodyParser from "body-parser";
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidIncome,
  isValidIndianPhoneNumber,
} from "./helpers/Validations";
import { ConfirmOrEdit } from "./templates/Final_message/FinalMessage";
import { interactiveGeneralInsuranceMessage } from "./templates/General_insurance_templates/GeneralInsuranceMessages";
import {
  interactiveLifeInsuranceMessage,
  termInsuranceContactMessage,
  termInsuranceDOBMessage,
  termInsuranceEmailMessage,
  termInsuranceGenderMessage,
  termInsuranceIncomeMessage,
  termInsuranceSmokerOrDrinkerMessage,
} from "./templates/Life_insurance_templates/LifeInsuranceMessages";
import { interactiveMainMessage } from "./templates/Main_templates/MainMesage";
import { responseMessage } from "./templates/basicMessage";
import { sendWhatsAppMessage } from "./util/sendWhatsappMessage";
import sequelize from "./util/database";
import Customer from "./models/custmerData";
import TermInsurance from "./models/termInsurance";

const app = express();
sequelize.sync();
const port = 5000;
app.use(bodyParser.json());
let termInsuranceData: any[] = [];
function updateOrCreateObject(
  array: any[],
  id: string,
  value: string,
  key: string
) {
  const index = array.findIndex((obj: any) => obj.id === id);
  const newObject: any = { id };
  newObject[key] = value;
  if (index !== -1) {
    array[index] = { ...array[index], ...newObject };
  } else {
    array.push(newObject);
  }
  return array;
}
function findIndex(array: any[], id: string) {
  const index = array.findIndex((obj) => obj.id === id);
  if (index !== -1) {
    return array[index];
  }
}

function findUser(array: any[], id: string) {
  const index = array.findIndex((obj) => obj.id === id);
  if (index !== -1) {
    return array[index];
  } else {
    return false;
  }
}
app.get("/", (req: any, res: any) => {
  res.status(200).send("server running");
});
app.get("/webhook", async (req: any, res: any) => {
  const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"; // Replace with your verify token
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhook", async (req: any, res: any) => {
  try {
    const entry = req.body.entry;
    let messages = [];
    let firstMessage: any;
    let messageBody: any;
    let from: any;
    let responseText: any;
    if (entry && entry.length > 0) {
      const changes = entry[0].changes;
      if (changes && changes.length > 0) {
        const value = changes[0].value;
        messages = value.messages;
        firstMessage = messages[0];
        if (messages && messages.length > 0) {
          messages.forEach((message: any) => {
            from = message.from;
            messageBody = message.text ? message.text.body : "";
            if (message.type === "text") {
              console.log(`Received message from ${from}: ${messageBody}`);
            }
          });
        }
      }
    }
    if (firstMessage.type === "interactive") {
      const interactiveMessage = firstMessage.interactive;
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
    const User = await Customer.findOne({
      where: {
        userId: from,
      },
    });
    if (User) {
      if (selectedOptionId === "LifeOption-L1") {
        sendWhatsAppMessage(interactiveLifeInsuranceMessage(from));
        try {
          await Customer.update(
            {
              lifeInsurance: true,
              generalInsurance: false,
            },
            {
              where: {
                userId: from,
              },
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else if (selectedOptionId === "GenOption-L1") {
        sendWhatsAppMessage(interactiveGeneralInsuranceMessage(from));
        try {
          await Customer.update(
            {
              lifeInsurance: false,
              generalInsurance: true,
            },
            {
              where: {
                userId: from,
              },
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else if (selectedOptionId === "TermInsuranceOption-L2") {
        sendWhatsAppMessage(termInsuranceGenderMessage(from));
        try {
          await Customer.update(
            {
              termInsurance: true,
            },
            {
              where: {
                userId: from,
              },
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      if (User.termInsurance) {
        try {
          await TermInsurance.findOrCreate({
            where: { userId: User.userId },
            defaults: { userId: User.userId },
          });
        } catch (error) {
          console.log(error);
        }

        const UserTermInsuranceData = await TermInsurance.findOne({
          where: {
            userId: User.userId,
          },
        });
        if (
          selectedButtonId === "MaleOption-L2" ||
          selectedButtonId === "FemaleOption-L2"
        ) {
          sendWhatsAppMessage(termInsuranceDOBMessage(from));
          try {
            await TermInsurance.update(
              {
                gender: selectedButtonText,
                currentPath: "gender_section",
              },
              {
                where: {
                  userId: User.userId,
                },
              }
            );
          } catch (error) {
            console.log(error);
          }

          // updateOrCreateObject(
          //   termInsuranceData,
          //   from,
          //   selectedButtonText,
          //   "Gender"
          // );
          // updateOrCreateObject(
          //   termInsuranceData,
          //   from,
          //   "gender_section",
          //   "CurrentPath"
          // );
        }
        switch (UserTermInsuranceData?.currentPath) {
          case "gender_section":
            if (isValidDateOfBirth(messageBody)) {
              sendWhatsAppMessage(termInsuranceIncomeMessage(from));
              try {
                await TermInsurance.update(
                  {
                    dob: messageBody,
                    currentPath: "dob_section",
                  },
                  {
                    where: {
                      userId: UserTermInsuranceData.userId,
                    },
                  }
                );
              } catch (error) {
                console.log("gender_section", error);
              }

              // updateOrCreateObject(termInsuranceData, from, messageBody, "DOB");
              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   "dob_section",
              //   "CurrentPath"
              // );
            } else {
              responseText = "Enter valid date of birth";
            }
            break;
          case "dob_section":
            if (isValidIncome(messageBody)) {
              sendWhatsAppMessage(termInsuranceSmokerOrDrinkerMessage(from));
              try {
                await TermInsurance.update(
                  {
                    income: messageBody,
                    currentPath: "income_section",
                  },
                  {
                    where: {
                      userId: UserTermInsuranceData.userId,
                    },
                  }
                );
              } catch (error) {
                console.log("dob_section error", error);
              }

              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   messageBody,
              //   "Income"
              // );
              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   "income_section",
              //   "CurrentPath"
              // );
            } else {
              responseText = "Enter valid income";
            }
            break;
          case "income_section":
            if (
              selectedButtonId === "SmokerYesOption-L2" ||
              selectedButtonId === "SmokerNoOption-L2"
            ) {
              sendWhatsAppMessage(termInsuranceContactMessage(from));
              try {
                await TermInsurance.update(
                  {
                    smoker: selectedButtonText,
                    currentPath: "smoke_section",
                  },
                  {
                    where: {
                      userId: UserTermInsuranceData.userId,
                    },
                  }
                );
              } catch (error) {
                console.log("income_section error", error);
              }

              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   selectedButtonText,
              //   "Smoker"
              // );
              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   "smoke_section",
              //   "CurrentPath"
              // );
            } else {
              responseText = "Choose one option";
            }
            break;
          case "smoke_section":
            if (isValidIndianPhoneNumber(messageBody)) {
              sendWhatsAppMessage(termInsuranceEmailMessage(from));
              try {
                await TermInsurance.update(
                  {
                    contactNo: messageBody,
                    currentPath: "contact_section",
                  },
                  {
                    where: {
                      userId: UserTermInsuranceData.userId,
                    },
                  }
                );
              } catch (error) {
                console.log("smoke_section error", error);
              }

              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   messageBody,
              //   "ContactNo"
              // );
              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   "contact_section",
              //   "CurrentPath"
              // );
            } else {
              responseText = "Enter valid phone number";
            }
            break;
          case "contact_section":
            if (isValidEmail(messageBody)) {
              try {
                await TermInsurance.update(
                  {
                    email: messageBody,
                    currentPath: "email_section",
                  },
                  {
                    where: {
                      userId: UserTermInsuranceData.userId,
                    },
                  }
                );
              } catch (error) {
                console.log("contact section error", error);
              }

              const viewDetailsMessage = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    text: "Click to view details:",
                  },
                  action: {
                    buttons: [
                      {
                        type: "reply",
                        reply: {
                          id: "ViewOption-L2",
                          title: "View details",
                        },
                      },
                    ],
                  },
                },
              };

              sendWhatsAppMessage(viewDetailsMessage);
              // updateOrCreateObject(
              //   termInsuranceData,
              //   from,
              //   "email_section",
              //   "CurrentPath"
              // );
            } else {
              responseText = "Enter valid Email";
            }
            break;
          case "email_section":
            if (selectedButtonId === "ViewOption-L2") {
              const FinalTestMessage: any = {
                messaging_product: "whatsapp",
                to: from,
                type: "text",
                text: {
                  body: `*_Gender_* : ${UserTermInsuranceData.gender}\n*_DOB_* : ${UserTermInsuranceData.dob}\n*_Income_* : ${UserTermInsuranceData.income}\n*_Smoker_* : ${UserTermInsuranceData.smoker}\n*_Contact_* : ${UserTermInsuranceData.contactNo}\n*_Email_* : ${UserTermInsuranceData.email}`,
                },
              };
              sendWhatsAppMessage(FinalTestMessage);
              setTimeout(() => {
                sendWhatsAppMessage(ConfirmOrEdit(from));
              }, 2000);
            }
            if (
              selectedButtonId === "ConfirmOption-L2" ||
              selectedButtonId === "EditOption-L2"
            ) {
              if (selectedButtonId === "ConfirmOption-L2") {
                responseText = "Thank you for choosing us.....";
                try {
                  await TermInsurance.update(
                    {
                      submit: true,
                    },
                    {
                      where: {
                        userId: UserTermInsuranceData.userId,
                      },
                    }
                  );
                  await TermInsurance.update(
                    {
                      currentPath: "completed",
                    },
                    {
                      where: {
                        userId: UserTermInsuranceData.userId,
                      },
                    }
                  );
                } catch (error) {
                  console.log("confirm option error", error);
                }
                setTimeout(() => {
                  const mainMenuMessage = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "interactive",
                    interactive: {
                      type: "button",
                      body: {
                        text: "Click to go to Main menu:",
                      },
                      action: {
                        buttons: [
                          {
                            type: "reply",
                            reply: {
                              id: "MainMenuOption-L2",
                              title: "Main Menu",
                            },
                          },
                        ],
                      },
                    },
                  };
                  sendWhatsAppMessage(mainMenuMessage);
                }, 5000);
              } else if (selectedButtonId === "EditOption-L2") {
                sendWhatsAppMessage(termInsuranceGenderMessage(from));
                try {
                  await TermInsurance.update(
                    {
                      currentPath: "",
                    },
                    {
                      where: {
                        userId: UserTermInsuranceData.userId,
                      },
                    }
                  );
                } catch (error) {
                  console.log("Edit option error", error);
                }

                // updateOrCreateObject(
                //   termInsuranceData,
                //   from,
                //   "welcome_section",
                //   "CurrentPath"
                // );
              }
            }
            break;
          case "completed":
            if (selectedButtonId === "MainMenuOption-L2") {
              try {
                await Customer.update(
                  {
                    termInsurance: false,
                  },
                  {
                    where: {
                      userId: from,
                    },
                  }
                );
              } catch (error) {
                console.log("case completed error", error);
              }
              sendWhatsAppMessage(interactiveMainMessage(from));
            }
            break;
        }
      }
    } else {
      sendWhatsAppMessage(interactiveMainMessage(from));
      // updateOrCreateObject(
      //   termInsuranceData,
      //   from,
      //   "welcome_section",
      //   "CurrentPath"
      // );
      try {
        await Customer.create({
          userId: from,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (responseText != undefined) {
      sendWhatsAppMessage(responseMessage(from, responseText));
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// import express from "express";
// import bodyParser from "body-parser";
// import axios from "axios";
// import cors from "cors";
// import { interactiveMainMessage } from "./templates/Main_templates/MainMesage.js";
// import { interactiveLifeInsuranceMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { termInsuranceGenderMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { termInsuranceDOBMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { termInsuranceIncomeMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { termInsuranceSmokerOrDrinkerMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { termInsuranceContactMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { termInsuranceEmailMessage } from "./templates/Life_insurance_templates/LifeInsuranceMessages.js";
// import { interactiveGeneralInsuranceMessage } from "./templates/General_insurance_templates/GeneralInsuranceMessages.js";
// import { isValidDateOfBirth } from "./helpers/Validations.js";
// import { isValidIncome } from "./helpers/Validations.js";
// import { isValidIndianPhoneNumber } from "./helpers/Validations.js";
// import { isValidEmail } from "./helpers/Validations.js";
// import { FinalTestMessage } from "./templates/Final_message/FinalMessage.js";
// import { ConfirmOrEdit } from "./templates/Final_message/FinalMessage.js";
// import sequelize from "./util/database.ts";
// import Customer from "./models/custmerData.ts";
// const app = express();
// sequelize.sync({ force: true });
// app.use(
//   cors({
//     origin: "*",
//   })
// );
// const port = 5000;
// app.use(bodyParser.json());

// let termInsuranceData = [];
// function updateOrCreateObject(array, id, value, key) {
//   const index = array.findIndex((obj) => obj.id === id);
//   const newObject = { id };
//   newObject[key] = value;
//   if (index !== -1) {
//     array[index] = { ...array[index], ...newObject };
//   } else {
//     array.push(newObject);
//   }
//   return array;
// }
// function findIndex(array, id) {
//   const index = array.findIndex((obj) => obj.id === id);
//   if (index !== -1) {
//     return array[index];
//   }
// }
// function findUser(array, id) {
//   const index = array.findIndex((obj) => obj.id === id);
//   if (index !== -1) {
//     return array[index];
//   } else {
//     return false;
//   }
// }

// // Verification endpoint to validate webhook
// app.get("/", (req, res) => {
//   res.status(200).send("server running");
// });
// app.get("/webhook", (req, res) => {
//   const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"; // Replace with your verify token
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];
//   if (mode && token === VERIFY_TOKEN) {
//     res.status(200).send(challenge);
//   } else {
//     res.sendStatus(403);
//   }
// });

// // Webhook endpoint to handle incoming messages
// app.post("/webhook", async (req, res) => {
//   const entry = req.body.entry;
//   if (entry && entry.length > 0) {
//     const changes = entry[0].changes;
//     if (changes && changes.length > 0) {
//       const value = changes[0].value;
//       const messages = value.messages;
//       if (messages && messages.length > 0) {
//         const message = messages[0];
//         const from = message.from; // Sender's phone number
//         var msgBody = message.text ? message.text.body : "";
//         if (message.type === "text") {
//           console.log(`Received message from ${from}: ${msgBody}`);
//         }
//         if (message.type === "interactive") {
//           const interactiveMessage = message.interactive;
//           if (interactiveMessage.type === "list_reply") {
//             var selectedOptionId = interactiveMessage.list_reply.id;
//             var selectedOptionTitle = interactiveMessage.list_reply.title;
//             console.log(
//               `User selected option: ${selectedOptionId} - ${selectedOptionTitle}`
//             );
//           } else if (interactiveMessage.type === "button_reply") {
//             var selectedButtonId = interactiveMessage.button_reply.id;
//             var selectedButtonText = interactiveMessage.button_reply.title;
//           }
//         }
//         if (message.type === "image" || message.type === "document") {
//           const mediaId = message.image
//             ? message.image.id
//             : message.document.id;
//           console.log(`mediaId:- ${mediaId}`);
//           const url = `https://graph.facebook.com/v20.0/${mediaId}`;
//           console.log(`URL:- ${url}`);
//         }
//         if (message.type === "reaction") {
//           console.log("Received a reaction:");
//           console.log(`Reaction: ${message.reaction}`);
//           console.log(`Message ID: ${message.message_id}`);
//           console.log(`Sender ID: ${message.from}`);
//         }
//         const tempMessage = {
//           messaging_product: "whatsapp",
//           to: from,
//           type: "template",
//           template: {
//             name: "my_temp_1",
//             language: {
//               code: "en_US",
//             },
//             components: [
//               {
//                 type: "header",
//                 parameters: [
//                   {
//                     type: "text",
//                     text: "user", // Replace the variable in the template with actual value
//                   },
//                 ],
//               },
//             ],
//           },
//         };
//         let responseText;
//         const existingUser = await Customer.findOne({
//           where: {
//             userId: from,
//             isActive: true,
//           },
//         });
//         console.log("existing user", existingUser);
//         console.log("existing user userid", existingUser.userId);
//         console.log("existing user userid", existingUser.lifeInsurance);

//         if (existingUser) {
//           if (selectedOptionId === "LifeOption-L1") {
//             sendWhatsAppMessage(interactiveLifeInsuranceMessage(from));
//             await Customer.update({
//               lifeInsurance: true,
//               generalInsurance: false,
//               where: {
//                 userId: from,
//               },
//             });
//           } else if (selectedOptionId === "GenOption-L1") {
//             sendWhatsAppMessage(interactiveGeneralInsuranceMessage(from));
//             await Customer.update({
//               generalInsurance: true,
//               lifeInsurance: false,
//               where: {
//                 userId: from,
//               },
//             });
//           } else if (selectedOptionId === "TermInsuranceOption-L2") {
//             sendWhatsAppMessage(termInsuranceGenderMessage(from));
//             await Customer.update({
//               termInsurance: true,
//               generalInsurance: false,
//               where: {
//                 userId: from,
//               },
//             });
//           }
//           switch (existingUser.CurrentPath) {
//             case "welcome_section":
//               if (
//                 (selectedButtonId === "MaleOption-L2") |
//                 (selectedButtonId === "FemaleOption-L2")
//               ) {
//                 sendWhatsAppMessage(termInsuranceDOBMessage(from));
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   selectedButtonText,
//                   "Gender"
//                 );
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   "gender_section",
//                   "CurrentPath"
//                 );
//               }
//               break;
//             case "gender_section":
//               if (isValidDateOfBirth(msgBody)) {
//                 sendWhatsAppMessage(termInsuranceIncomeMessage(from));
//                 updateOrCreateObject(termInsuranceData, from, msgBody, "DOB");
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   "dob_section",
//                   "CurrentPath"
//                 );
//               } else {
//                 responseText = "Enter valid date of birth";
//               }
//               break;
//             case "dob_section":
//               if (isValidIncome(msgBody)) {
//                 sendWhatsAppMessage(termInsuranceSmokerOrDrinkerMessage(from));
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   msgBody,
//                   "Income"
//                 );
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   "income_section",
//                   "CurrentPath"
//                 );
//               } else {
//                 responseText = "Enter valid income";
//               }
//               break;
//             case "income_section":
//               if (
//                 (selectedButtonId === "SmokerYesOption-L2") |
//                 (selectedButtonId === "SmokerNoOption-L2")
//               ) {
//                 sendWhatsAppMessage(termInsuranceContactMessage(from));
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   selectedButtonText,
//                   "Smoker"
//                 );
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   "smoke_section",
//                   "CurrentPath"
//                 );
//               } else {
//                 responseText = "Choose one option";
//               }
//               break;
//             case "smoke_section":
//               if (isValidIndianPhoneNumber(msgBody)) {
//                 sendWhatsAppMessage(termInsuranceEmailMessage(from));
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   msgBody,
//                   "ContactNo"
//                 );
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   "contact_section",
//                   "CurrentPath"
//                 );
//               } else {
//                 responseText = "Enter valid phone number";
//               }
//               break;
//             case "contact_section":
//               if (isValidEmail(msgBody)) {
//                 updateOrCreateObject(termInsuranceData, from, msgBody, "Email");
//                 const data = findIndex(termInsuranceData, from);
//                 console.log(data);
//                 await sendWhatsAppMessage(FinalTestMessage(from, data));
//                 sendWhatsAppMessage(ConfirmOrEdit(from));
//                 updateOrCreateObject(
//                   termInsuranceData,
//                   from,
//                   "email_section",
//                   "CurrentPath"
//                 );
//               } else {
//                 responseText = "Enter valid Email";
//               }
//               break;
//             case "email_section":
//               if (
//                 (selectedButtonId === "ConfirmOption-L2") |
//                 (selectedButtonId === "EditOption-L2")
//               ) {
//                 if (selectedButtonId === "ConfirmOption-L2") {
//                   responseText = "Thank you for choosing us.....";
//                 } else {
//                   sendWhatsAppMessage(interactiveMainMessage(from));
//                   updateOrCreateObject(
//                     termInsuranceData,
//                     from,
//                     "welcome_section",
//                     "CurrentPath"
//                   );
//                 }
//               }
//               break;
//           }
//         } else {
//           await Customer.create({
//             userId: from,
//           });
//           sendWhatsAppMessage(interactiveMainMessage(from));
//         }

//         // if (msgBody != "") {
//         //   responseText =
//         //     "I'm not sure how to respond to that. Can you please rephrase?";
//         // } else {
//         //   responseText =
//         //     "You Entered a wrong option. so please restart the conversation by sending Hi....";
//         // }

//         const responseMessage = {
//           messaging_product: "whatsapp",
//           to: from,
//           type: "text",
//           text: {
//             body: responseText,
//           },
//         };
//         if (responseText != undefined) {
//           sendWhatsAppMessage(responseMessage);
//         }
//       }
//     }
//   }
//   res.sendStatus(200);
// });
// const sendWhatsAppMessage = async (message) => {
//   const url = "https://graph.facebook.com/v20.0/366760906524912/messages";
//   const token =
//     "EAAXr5E4DbWoBOz6TZCAZCGFDPMYXtGDvqtCj6szL1Jm8NrnMdN7F8fG0ZBuWeA4dCJVTkwC31ylBubjmh04m3DPLECJWXP4LiPRypPMPxGrmrkCuZBC8Onkv0iZCKCJFk58FX4MPydSrHEXlIZCkzHgqAwlG4du7xmuZCHrew1dRy1rVpw9Q7HPbTVh0xw94uAA";
//   try {
//     const response = await axios.post(url, message, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("Message sent:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending message:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

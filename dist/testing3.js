"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Validations_1 = require("./helpers/Validations");
const FinalMessage_1 = require("./templates/Final_message/FinalMessage");
const GeneralInsuranceMessages_1 = require("./templates/General_insurance_templates/GeneralInsuranceMessages");
const LifeInsuranceMessages_1 = require("./templates/Life_insurance_templates/LifeInsuranceMessages");
const MainMesage_1 = require("./templates/Main_templates/MainMesage");
const basicMessage_1 = require("./templates/basicMessage");
const sendWhatsappMessage_1 = require("./util/sendWhatsappMessage");
const database_1 = __importDefault(require("./util/database"));
const custmerData_1 = __importDefault(require("./models/custmerData"));
const termInsurance_1 = __importDefault(require("./models/termInsurance"));
const app = (0, express_1.default)();
database_1.default.sync();
const port = 5000;
app.use(body_parser_1.default.json());
let termInsuranceData = [];
function updateOrCreateObject(array, id, value, key) {
    const index = array.findIndex((obj) => obj.id === id);
    const newObject = { id };
    newObject[key] = value;
    if (index !== -1) {
        array[index] = Object.assign(Object.assign({}, array[index]), newObject);
    }
    else {
        array.push(newObject);
    }
    return array;
}
function findIndex(array, id) {
    const index = array.findIndex((obj) => obj.id === id);
    if (index !== -1) {
        return array[index];
    }
}
function findUser(array, id) {
    const index = array.findIndex((obj) => obj.id === id);
    if (index !== -1) {
        return array[index];
    }
    else {
        return false;
    }
}
app.get("/", (req, res) => {
    res.status(200).send("server running");
});
app.get("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"; // Replace with your verify token
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    }
    else {
        res.sendStatus(400);
    }
}));
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = req.body.entry;
        let messages = [];
        let firstMessage;
        let messageBody;
        let from;
        let responseText;
        if (entry && entry.length > 0) {
            const changes = entry[0].changes;
            if (changes && changes.length > 0) {
                const value = changes[0].value;
                messages = value.messages;
                firstMessage = messages[0];
                if (messages && messages.length > 0) {
                    messages.forEach((message) => {
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
                console.log(`User selected option: ${selectedOptionId} - ${selectedOptionTitle}`);
            }
            else if (interactiveMessage.type === "button_reply") {
                var selectedButtonId = interactiveMessage.button_reply.id;
                var selectedButtonText = interactiveMessage.button_reply.title;
            }
        }
        const User = yield custmerData_1.default.findOne({
            where: {
                userId: from,
            },
        });
        if (User) {
            if (selectedOptionId === "LifeOption-L1") {
                (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.interactiveLifeInsuranceMessage)(from));
                try {
                    yield custmerData_1.default.update({
                        lifeInsurance: true,
                        generalInsurance: false,
                    }, {
                        where: {
                            userId: from,
                        },
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
            else if (selectedOptionId === "GenOption-L1") {
                (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, GeneralInsuranceMessages_1.interactiveGeneralInsuranceMessage)(from));
                try {
                    yield custmerData_1.default.update({
                        lifeInsurance: false,
                        generalInsurance: true,
                    }, {
                        where: {
                            userId: from,
                        },
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
            else if (selectedOptionId === "TermInsuranceOption-L2") {
                (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceGenderMessage)(from));
                try {
                    yield custmerData_1.default.update({
                        termInsurance: true,
                    }, {
                        where: {
                            userId: from,
                        },
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
            if (User.termInsurance) {
                try {
                    yield termInsurance_1.default.findOrCreate({
                        where: { userId: User.userId },
                        defaults: { userId: User.userId },
                    });
                }
                catch (error) {
                    console.log(error);
                }
                const UserTermInsuranceData = yield termInsurance_1.default.findOne({
                    where: {
                        userId: User.userId,
                    },
                });
                if (selectedButtonId === "MaleOption-L2" ||
                    selectedButtonId === "FemaleOption-L2") {
                    (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceDOBMessage)(from));
                    try {
                        yield termInsurance_1.default.update({
                            gender: selectedButtonText,
                            currentPath: "gender_section",
                        }, {
                            where: {
                                userId: User.userId,
                            },
                        });
                    }
                    catch (error) {
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
                switch (UserTermInsuranceData === null || UserTermInsuranceData === void 0 ? void 0 : UserTermInsuranceData.currentPath) {
                    case "gender_section":
                        if ((0, Validations_1.isValidDateOfBirth)(messageBody)) {
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceIncomeMessage)(from));
                            try {
                                yield termInsurance_1.default.update({
                                    dob: messageBody,
                                    currentPath: "dob_section",
                                }, {
                                    where: {
                                        userId: UserTermInsuranceData.userId,
                                    },
                                });
                            }
                            catch (error) {
                                console.log("gender_section", error);
                            }
                            // updateOrCreateObject(termInsuranceData, from, messageBody, "DOB");
                            // updateOrCreateObject(
                            //   termInsuranceData,
                            //   from,
                            //   "dob_section",
                            //   "CurrentPath"
                            // );
                        }
                        else {
                            responseText = "Enter valid date of birth";
                        }
                        break;
                    case "dob_section":
                        if ((0, Validations_1.isValidIncome)(messageBody)) {
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceSmokerOrDrinkerMessage)(from));
                            try {
                                yield termInsurance_1.default.update({
                                    income: messageBody,
                                    currentPath: "income_section",
                                }, {
                                    where: {
                                        userId: UserTermInsuranceData.userId,
                                    },
                                });
                            }
                            catch (error) {
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
                        }
                        else {
                            responseText = "Enter valid income";
                        }
                        break;
                    case "income_section":
                        if (selectedButtonId === "SmokerYesOption-L2" ||
                            selectedButtonId === "SmokerNoOption-L2") {
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceContactMessage)(from));
                            try {
                                yield termInsurance_1.default.update({
                                    smoker: selectedButtonText,
                                    currentPath: "smoke_section",
                                }, {
                                    where: {
                                        userId: UserTermInsuranceData.userId,
                                    },
                                });
                            }
                            catch (error) {
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
                        }
                        else {
                            responseText = "Choose one option";
                        }
                        break;
                    case "smoke_section":
                        if ((0, Validations_1.isValidIndianPhoneNumber)(messageBody)) {
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceEmailMessage)(from));
                            try {
                                yield termInsurance_1.default.update({
                                    contactNo: messageBody,
                                    currentPath: "contact_section",
                                }, {
                                    where: {
                                        userId: UserTermInsuranceData.userId,
                                    },
                                });
                            }
                            catch (error) {
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
                        }
                        else {
                            responseText = "Enter valid phone number";
                        }
                        break;
                    case "contact_section":
                        if ((0, Validations_1.isValidEmail)(messageBody)) {
                            try {
                                yield termInsurance_1.default.update({
                                    email: messageBody,
                                    currentPath: "email_section",
                                }, {
                                    where: {
                                        userId: UserTermInsuranceData.userId,
                                    },
                                });
                            }
                            catch (error) {
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
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)(viewDetailsMessage);
                            // updateOrCreateObject(
                            //   termInsuranceData,
                            //   from,
                            //   "email_section",
                            //   "CurrentPath"
                            // );
                        }
                        else {
                            responseText = "Enter valid Email";
                        }
                        break;
                    case "email_section":
                        if (selectedButtonId === "ViewOption-L2") {
                            const FinalTestMessage = {
                                messaging_product: "whatsapp",
                                to: from,
                                type: "text",
                                text: {
                                    body: `*_Gender_* : ${UserTermInsuranceData.gender}\n*_DOB_* : ${UserTermInsuranceData.dob}\n*_Income_* : ${UserTermInsuranceData.income}\n*_Smoker_* : ${UserTermInsuranceData.smoker}\n*_Contact_* : ${UserTermInsuranceData.contactNo}\n*_Email_* : ${UserTermInsuranceData.email}`,
                                },
                            };
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)(FinalTestMessage);
                            setTimeout(() => {
                                (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, FinalMessage_1.ConfirmOrEdit)(from));
                            }, 2000);
                        }
                        if (selectedButtonId === "ConfirmOption-L2" ||
                            selectedButtonId === "EditOption-L2") {
                            if (selectedButtonId === "ConfirmOption-L2") {
                                responseText = "Thank you for choosing us.....";
                                try {
                                    yield termInsurance_1.default.update({
                                        submit: true,
                                    }, {
                                        where: {
                                            userId: UserTermInsuranceData.userId,
                                        },
                                    });
                                    yield termInsurance_1.default.update({
                                        currentPath: "completed",
                                    }, {
                                        where: {
                                            userId: UserTermInsuranceData.userId,
                                        },
                                    });
                                }
                                catch (error) {
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
                                    (0, sendWhatsappMessage_1.sendWhatsAppMessage)(mainMenuMessage);
                                }, 5000);
                            }
                            else if (selectedButtonId === "EditOption-L2") {
                                (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, LifeInsuranceMessages_1.termInsuranceGenderMessage)(from));
                                try {
                                    yield termInsurance_1.default.update({
                                        currentPath: "",
                                    }, {
                                        where: {
                                            userId: UserTermInsuranceData.userId,
                                        },
                                    });
                                }
                                catch (error) {
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
                                yield custmerData_1.default.update({
                                    termInsurance: false,
                                }, {
                                    where: {
                                        userId: from,
                                    },
                                });
                            }
                            catch (error) {
                                console.log("case completed error", error);
                            }
                            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, MainMesage_1.interactiveMainMessage)(from));
                        }
                        break;
                }
            }
        }
        else {
            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, MainMesage_1.interactiveMainMessage)(from));
            // updateOrCreateObject(
            //   termInsuranceData,
            //   from,
            //   "welcome_section",
            //   "CurrentPath"
            // );
            try {
                yield custmerData_1.default.create({
                    userId: from,
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        if (responseText != undefined) {
            (0, sendWhatsappMessage_1.sendWhatsAppMessage)((0, basicMessage_1.responseMessage)(from, responseText));
        }
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(400);
    }
}));
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

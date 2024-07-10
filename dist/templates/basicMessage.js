"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = void 0;
const responseMessage = (to, message) => {
    return {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
            body: message,
        },
    };
};
exports.responseMessage = responseMessage;

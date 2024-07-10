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
exports.sendWhatsAppMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const PHONE_NUMBER_ID = "366760906524912";
// export const sendWhatsAppMessage = async (message: any) => {
//   const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
//   const token =
//     "EAAHAvvZB2TdYBO7QcClhZCFR0PMG6al4UTeHoH0jFMDDeKVItFzpZCF6MgMrnohZANs6JD7DMbFiepOEZBMP3u7jNd3NnIzfj2VGrIlLuOv9TWM5qm6MiQcQZCAbx4oZCmZA5QSeTjGoQMdqoycnM2GywZAYMpNqhWWoOgbDBOjuZC8PKWQ9JSJVCtxQBLic7mxZBJ11HmAeqpnzJlQoLvx670W3vZCYlScZD";
//   const response = await axios.post(url, message, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   console.log("Message sent:", response.data);
//   return response;
// };
const sendWhatsAppMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const token = "EAAXr5E4DbWoBOz6TZCAZCGFDPMYXtGDvqtCj6szL1Jm8NrnMdN7F8fG0ZBuWeA4dCJVTkwC31ylBubjmh04m3DPLECJWXP4LiPRypPMPxGrmrkCuZBC8Onkv0iZCKCJFk58FX4MPydSrHEXlIZCkzHgqAwlG4du7xmuZCHrew1dRy1rVpw9Q7HPbTVh0xw94uAA";
    try {
        const response = yield axios_1.default.post(url, message, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Message sent:", response.data);
    }
    catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
});
exports.sendWhatsAppMessage = sendWhatsAppMessage;

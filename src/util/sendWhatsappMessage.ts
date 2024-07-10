import axios from "axios";

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
export const sendWhatsAppMessage = async (message: any) => {
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
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
  } catch (error: any) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
};

export const responseMessage = (to: string, message: string) => {
  return {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: message,
    },
  };
};

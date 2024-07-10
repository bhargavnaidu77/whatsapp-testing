export const interactiveMainMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Menu",
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
                id: "LifeOption-L1",
                title: "Life insurance",
                description: "Description for Life insurance",
              },
              {
                id: "GenOption-L1",
                title: "General insurance",
                description: "Description for General insurance",
              },
            ],
          },
        ],
      },
    },
  };
};

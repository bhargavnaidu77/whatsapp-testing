export const interactiveGeneralInsuranceMessage = (from) => {
  return {
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
                id: "MotorInsuranceOption-L2",
                title: "Motor insurance",
                description: "Description for Motor insurance",
              },
              {
                id: "HealthInsuranceOption-L2",
                title: "Health insurance",
                description: "Description for Health insurance",
              },
              {
                id: "TravelInsuranceOption-L2",
                title: "Travel insurance",
                description: "Description for Travel insurance",
              },
            ],
          },
        ],
      },
    },
  };
};

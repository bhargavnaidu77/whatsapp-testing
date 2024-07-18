export const interactiveLifeInsuranceMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Life Insurance Options",
      },
      body: {
        text: "Please choose an life insurance option:",
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
                id: "TermInsuranceOption-L2",
                title: "Term insurance",
                description: "Description for Term insurance",
              },
              {
                id: "EndowmentOption-L2",
                title: "Endowment",
                description: "Description for Endowment",
              },
              {
                id: "UnitlinkedOption-L2",
                title: "Unitlinked",
                description: "Description for Unitlinked",
              },
              {
                id: "PensionOption-L2",
                title: "Pension",
                description: "Description for Pension",
              },
            ],
          },
        ],
      },
    },
  };
};

export const termInsuranceGenderMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Please choose gender of the person:",
      },
      footer: {
        text: "Select one of the buttons below",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "MaleOption-L2",
              title: "Male",
            },
          },
          {
            type: "reply",
            reply: {
              id: "FemaleOption-L2",
              title: "Female",
            },
          },
        ],
      },
    },
  };
};

export const termInsuranceDOBMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "text",
    text: {
      body: "Enter Date Of Birth (format: DD/MM/YYYY)",
    },
  };
};

export const termInsuranceIncomeMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "text",
    text: {
      body: "Enter Income (format: Integers only ) e.g: 40000",
    },
  };
};

export const termInsuranceSmokerOrDrinkerMessage = (from: string) => {
  return {
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
              id: "SmokerYesOption-L2",
              title: "Yes",
            },
          },
          {
            type: "reply",
            reply: {
              id: "SmokerNoOption-L2",
              title: "No",
            },
          },
        ],
      },
    },
  };
};

export const termInsuranceContactMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "text",
    text: {
      body: "Enter insurance applicant phone number",
    },
  };
};

export const termInsuranceEmailMessage = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "text",
    text: {
      body: "Enter insurance applicant email",
    },
  };
};

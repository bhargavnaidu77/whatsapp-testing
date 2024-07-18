export const FinalTestMessage = (from: string, data: any) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "text",
    text: {
      body: `Gender: ${data.Gender}\nDOB: ${data.DOB}\nIncome: ${data.Income}\nSmoker: ${data.Smoker}\nContactNo: ${data.ContactNo}\nEmailId: ${data.Email}`,
    },
  };
};

export const ConfirmOrEdit = (from: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Verify your details, if anything entered wrong click edit otherwise click confirm to submit details.",
      },
      footer: {
        text: "Select one of the buttons below",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "ConfirmOption-L2",
              title: "Confirm",
            },
          },
          {
            type: "reply",
            reply: {
              id: "EditOption-L2",
              title: "Edit",
            },
          },
        ],
      },
    },
  };
};

export const CancelMessage = (from: string, insurance_type: string) => {
  return {
    messaging_product: "whatsapp",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `Click cancel to cancel the ${insurance_type} or click continue to continue this process.`,
      },
      footer: {
        text: "Select one of the buttons below",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "CancelOption",
              title: "Cancel",
            },
          },
          {
            type: "reply",
            reply: {
              id: "ContinueOption",
              title: "Continue",
            },
          },
        ],
      },
    },
  };
};

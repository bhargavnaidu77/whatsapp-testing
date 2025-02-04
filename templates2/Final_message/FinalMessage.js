export const FinalTestMessage = (from,data)=> {
    return{
    messaging_product: "whatsapp",
    to: from,
    type: "text",
    text: {
      body: `Gender: ${data.Gender}\nDOB: ${data.DOB}\nIncome: ${data.Income}\nSmoker: ${data.Smoker}\nContactNo: ${data.ContactNo}\nEmailId: ${data.Email}`,
    },
  }
};

export const ConfirmOrEdit = (from) => {
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
  
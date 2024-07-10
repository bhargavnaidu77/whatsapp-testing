"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactiveMainMenuTemplate = void 0;
const interactiveMainMenuTemplate = (to) => {
    const interactiveOptionData = [
        {
            id: "Lifeoption-L1",
            title: "Life insurance",
            description: "Description for Life insurance",
        },
        {
            id: "Genoption-L1",
            title: "General insurance",
            description: "Description for General insurance",
        },
    ];
    return {
        messaging_product: "whatsapp",
        to: to,
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
                        rows: interactiveOptionData,
                    },
                ],
            },
        },
    };
};
exports.interactiveMainMenuTemplate = interactiveMainMenuTemplate;

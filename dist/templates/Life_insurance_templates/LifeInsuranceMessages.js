"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.termInsuranceEmailMessage = exports.termInsuranceContactMessage = exports.termInsuranceSmokerOrDrinkerMessage = exports.termInsuranceIncomeMessage = exports.termInsuranceDOBMessage = exports.termInsuranceGenderMessage = exports.interactiveLifeInsuranceMessage = void 0;
const interactiveLifeInsuranceMessage = (from) => {
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
exports.interactiveLifeInsuranceMessage = interactiveLifeInsuranceMessage;
const termInsuranceGenderMessage = (from) => {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
            type: "button",
            body: {
                text: "Please choose an option:",
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
exports.termInsuranceGenderMessage = termInsuranceGenderMessage;
const termInsuranceDOBMessage = (from) => {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
            body: "Enter Date Of Birth (format: DD/MM/YYYY)",
        },
    };
};
exports.termInsuranceDOBMessage = termInsuranceDOBMessage;
const termInsuranceIncomeMessage = (from) => {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
            body: "Enter Income (format: Integers only ) e.g: 40000",
        },
    };
};
exports.termInsuranceIncomeMessage = termInsuranceIncomeMessage;
const termInsuranceSmokerOrDrinkerMessage = (from) => {
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
exports.termInsuranceSmokerOrDrinkerMessage = termInsuranceSmokerOrDrinkerMessage;
const termInsuranceContactMessage = (from) => {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
            body: "Enter your phone number",
        },
    };
};
exports.termInsuranceContactMessage = termInsuranceContactMessage;
const termInsuranceEmailMessage = (from) => {
    return {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
            body: "Enter your Email",
        },
    };
};
exports.termInsuranceEmailMessage = termInsuranceEmailMessage;

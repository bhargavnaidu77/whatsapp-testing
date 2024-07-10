"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.isValidIndianPhoneNumber = exports.isValidIncome = exports.isValidDateOfBirth = void 0;
const isValidDateOfBirth = (input) => {
    const dateFormatRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!input.match(dateFormatRegex)) {
        return false;
    }
    const [, day, month, year] = input.match(dateFormatRegex);
    const date = new Date(`${year}-${month}-${day}`); // Use YYYY-MM-DD format for compatibility
    const isValid = !isNaN(date.getTime()); // Check if date is valid
    return isValid;
};
exports.isValidDateOfBirth = isValidDateOfBirth;
const isValidIncome = (input) => {
    const isSevenDigitsOrLess = /^\d{1,7}$/.test(input);
    const income = parseFloat(input);
    const isGreaterThanZero = income > 0;
    return isSevenDigitsOrLess && isGreaterThanZero;
};
exports.isValidIncome = isValidIncome;
const isValidIndianPhoneNumber = (input) => {
    return /^[6-9]\d{9}$/.test(input);
};
exports.isValidIndianPhoneNumber = isValidIndianPhoneNumber;
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.isValidEmail = isValidEmail;

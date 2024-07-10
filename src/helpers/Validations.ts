export const isValidDateOfBirth = (input: any) => {
  const dateFormatRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!input.match(dateFormatRegex)) {
    return false;
  }
  const [, day, month, year] = input.match(dateFormatRegex);
  const date = new Date(`${year}-${month}-${day}`); // Use YYYY-MM-DD format for compatibility
  const isValid = !isNaN(date.getTime()); // Check if date is valid
  return isValid;
};

export const isValidIncome = (input: string) => {
  const isSevenDigitsOrLess = /^\d{1,7}$/.test(input);
  const income = parseFloat(input);
  const isGreaterThanZero = income > 0;
  return isSevenDigitsOrLess && isGreaterThanZero;
};

export const isValidIndianPhoneNumber = (input: string) => {
  return /^[6-9]\d{9}$/.test(input);
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// src/utils/Validation.tsx
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9\-_]+\.)+[a-zA-Z]{2,}))$/;

const telephoneRegex = /^\+2547\d{8}$|^07\d{8}$/;

export const validateEmail = (email: string) => {
  return emailRegex.test(email);
};

export const validateTelephoneNumber = (phone: string) => {
  return telephoneRegex.test(phone);
};

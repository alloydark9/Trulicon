// Random string generator
export const randomString = (len) => {
  let randStr = "";
  while (randStr.length < len) {
    randStr = randStr + Math.random().toString(36).slice(2, 15);
  }
  return randStr.slice(0, len);
};

// OTP generator
export const otp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

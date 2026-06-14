let recoverCredentials = {
  email: "example@gmail.com",
  code: generateCode(),
};

function generateCode() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Update code every 1 minutes (60000 ms)
const recoveryInterval = setInterval(() => {
  recoverCredentials.code = generateCode();
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  console.log(
    `[${hours}:${minutes}:${seconds}] Updated Recovery Code: ${recoverCredentials.code}`,
  );
}, 60000);

// Export for use in other modules
export { recoverCredentials, recoveryInterval };

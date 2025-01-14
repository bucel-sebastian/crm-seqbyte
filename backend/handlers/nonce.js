const appApiSecret = process.env.APP_API_SECRET;

const generateNonce = async () => {
  const currentMinute = Math.floor(Date.now() / 60000);
  const encoder = new TextEncoder();

  const secretKeyData = encoder.encode(appApiSecret);
  const minuteData = encoder.encode(currentMinute.toString());

  const importedKey = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", importedKey, minuteData);

  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex.slice(0, 32);
};

const validateNonce = async (nonce) => {
  if (!nonce) return false;

  const currentNonce = await generateNonce();
  
  if (currentNonce.length !== nonce.length) return false;

  let result = 0;
  for (let i = 0; i < nonce.length; i++) {
    result |= nonce.charCodeAt(i) ^ currentNonce.charCodeAt(i);
  }

  return result === 0;
};

const checkNonce = (req, res, next) => {
  if (req.path === "/api/v1/security/nonce") {
    return next();
  }

  const nonce = req.headers["x-api-nonce"];
  if (!nonce || !validateNonce(nonce)) {
    return res.status(400).json({ error: "Invalid nonce" });
  }
  next();
};

module.exports = { generateNonce, checkNonce };

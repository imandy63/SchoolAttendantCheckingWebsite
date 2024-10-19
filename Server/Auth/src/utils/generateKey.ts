import CryptoJS from "crypto-js";
import forge from "node-forge";

export const generateKey = () => {
  const privateKey = CryptoJS.lib.WordArray.random(64).toString(
    CryptoJS.enc.Hex
  );
  const publicKey = CryptoJS.lib.WordArray.random(64).toString(
    CryptoJS.enc.Hex
  );
  return { privateKey, publicKey };
};

// Generate RSA Key Pair using `node-forge`
export const generateKeyRSA = () => {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(4096);

  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

  return {
    privateKey: privateKeyPem,
    publicKey: publicKeyPem,
  };
};

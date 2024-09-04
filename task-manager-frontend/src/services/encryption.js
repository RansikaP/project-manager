import CryptoJS from 'crypto-js';

const fixedIV = CryptoJS.enc.Utf8.parse("0000000000000000");
const secretKey = "my-secret-key";

function getKey(secretKey) {
  return CryptoJS.enc.Utf8.parse(CryptoJS.SHA256(secretKey).toString().substr(0, 32));
}

function encryptMessage(message) {
    const key = getKey(secretKey);
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      iv: fixedIV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encodeURIComponent(encrypted.toString()); // URL encode the encrypted string
  }
  
 function decryptMessage(ciphertext) {
    const key = getKey(secretKey);
    try {
      const decodedCiphertext = decodeURIComponent(ciphertext); // URL decode the ciphertext
      const decrypted = CryptoJS.AES.decrypt(decodedCiphertext, key, {
        iv: fixedIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }

export default { encryptMessage, decryptMessage };
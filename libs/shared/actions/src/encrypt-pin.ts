'use server';

const crypto = require('crypto');

const KEY = process.env.CIPHER_KEY;
const IV_LENGTH = 12;

export const encryptPin = async (pin: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);

  let ciphertext = cipher.update(pin, 'utf8');
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    pinCipher: ciphertext.toString('hex'),
    pinIv: iv.toString('hex'),
    pinAuthTag: authTag.toString('hex'),
  };
};

export const decryptPin = async (pinCipher: string, pinIv: string, pinAuthTag: string) => {
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, Buffer.from(pinIv, 'hex'));
  decipher.setAuthTag(Buffer.from(pinAuthTag, 'hex'));
  const plaintext = decipher.update(Buffer.from(pinCipher, 'hex'));
  return Buffer.concat([plaintext, decipher.final()]).toString('utf8');
};
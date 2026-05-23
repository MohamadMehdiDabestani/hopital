// types/password.ts - نسخه ساده شده

/**
 * Character sets
 */
const CHARACTERS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Cryptographically secure random number generator
 */
const getSecureRandom = (): number => {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 0xFFFFFFFF;
  }
  
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0] / 0xFFFFFFFF;
  }
  
  return Math.random(); // Fallback
};

/**
 * Get random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number): number => {
  const range = max - min + 1;
  const randomValue = getSecureRandom();
  return Math.floor(randomValue * range) + min;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate password with specified length
 * Always includes: lowercase, uppercase, numbers, and symbols
 */
export const generatePassword = (length: number = 12): string => {
  if (length < 4) {
    throw new Error('Password length must be at least 4 characters to include all required character types');
  }

  // Combine all character sets
  const allChars = Object.values(CHARACTERS).join('');
  
  // Ensure at least one character from each type
  const requiredChars = [
    CHARACTERS.lowercase[getRandomInt(0, CHARACTERS.lowercase.length - 1)],
    CHARACTERS.uppercase[getRandomInt(0, CHARACTERS.uppercase.length - 1)],
    CHARACTERS.numbers[getRandomInt(0, CHARACTERS.numbers.length - 1)],
    CHARACTERS.symbols[getRandomInt(0, CHARACTERS.symbols.length - 1)],
  ];

  // Fill remaining positions with random characters
  const password = [...requiredChars];
  for (let i = password.length; i < length; i++) {
    password.push(allChars[getRandomInt(0, allChars.length - 1)]);
  }

  // Shuffle to avoid predictable pattern
  return shuffleArray(password).join('');
};
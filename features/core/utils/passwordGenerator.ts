// types/password.ts

export interface PasswordOptions {
  length?: number;
  includeLowercase?: boolean;
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilar?: boolean;
  excludeAmbiguous?: boolean;
}

export interface PasswordStrength {
  score: number;
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
}

export type CharacterType = 'lowercase' | 'uppercase' | 'numbers' | 'symbols';

export interface PasswordGeneratorResult {
  password: string;
  strength: PasswordStrength;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
/**
 * Character sets
 */
const CHARACTERS: Record<CharacterType, string> = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Cryptographically secure random number generator
 * Works in both browser and Node.js environments
 */
const getSecureRandom = (): number => {
  // Browser environment
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 0xFFFFFFFF;
  }
  
  // Node.js/Next.js server environment
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0] / 0xFFFFFFFF;
  }
  
  // Fallback (less secure, avoid in production)
  return Math.random();
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
 * Fisher-Yates shuffle algorithm
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
 * Filter character set based on options
 */
const filterCharacterSet = (
  chars: string,
  options: Pick<PasswordOptions, 'excludeSimilar' | 'excludeAmbiguous'>
): string => {
  const { excludeSimilar = false, excludeAmbiguous = false } = options;
  let filtered = chars;
  
  if (excludeSimilar) {
    filtered = filtered.replace(/[il1Io0O]/g, '');
  }
  if (excludeAmbiguous) {
    filtered = filtered.replace(/[{}[\]()/\\"'`~,;:.<>]/g, '');
  }
  
  return filtered;
};

/**
 * Default password options
 */
const DEFAULT_OPTIONS: Required<PasswordOptions> = {
  length: 12,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
};

/**
 * Generate password with specified options
 */
export const generatePassword = (options: PasswordOptions = {}): string => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const {
    length,
    includeLowercase,
    includeUppercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    excludeAmbiguous,
  } = mergedOptions;

  let charPool = '';
  const requiredChars: string[] = [];

  // Helper to add character type to pool
  const addCharacterType = (type: CharacterType): void => {
    const filtered = filterCharacterSet(CHARACTERS[type], { 
      excludeSimilar, 
      excludeAmbiguous 
    });
    if (filtered.length > 0) {
      charPool += filtered;
      requiredChars.push(filtered[getRandomInt(0, filtered.length - 1)]);
    }
  };

  if (includeLowercase) addCharacterType('lowercase');
  if (includeUppercase) addCharacterType('uppercase');
  if (includeNumbers) addCharacterType('numbers');
  if (includeSymbols) addCharacterType('symbols');

  // Validation
  if (charPool.length === 0) {
    throw new Error('At least one character type must be selected');
  }
  if (length < requiredChars.length) {
    throw new Error(
      `Password length must be at least ${requiredChars.length} to include all required character types`
    );
  }

  // Generate password
  const password = [...requiredChars];
  for (let i = password.length; i < length; i++) {
    password.push(charPool[getRandomInt(0, charPool.length - 1)]);
  }

  return shuffleArray(password).join('');
};


/**
 * Calculate password strength score (0-100)
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: 'Weak' };
  }
  
  let score = 0;
  
  // Length criteria
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 15;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;
  
  // Complexity deductions
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
  if (/^[a-zA-Z]+$/.test(password)) score -= 10; // Only letters
  if (/^[0-9]+$/.test(password)) score -= 15; // Only numbers
  
  const finalScore = Math.max(0, Math.min(100, score));
  
  return {
    score: finalScore,
    label: getStrengthLabel(finalScore),
  };
};

/**
 * Get strength label based on score
 */
const getStrengthLabel = (score: number): PasswordStrength['label'] => {
  if (score < 30) return 'Weak';
  if (score < 60) return 'Fair';
  if (score < 80) return 'Good';
  return 'Strong';
};

/**
 * Get strength color based on score
 */


/**
 * Generate password with strength
 */
export const generatePasswordWithStrength = (
  options: PasswordOptions = {}
): { password: string; strength: PasswordStrength } => {
  const password = generatePassword(options);
  const strength = getPasswordStrength(password);
  return { password, strength };
};

/**
 * Simple one-liner password generator
 */
export const generateSimplePassword = (length: number = 12): string => {
  const allChars = Object.values(CHARACTERS).join('');
  return Array.from(
    { length },
    () => allChars[getRandomInt(0, allChars.length - 1)]
  ).join('');
};
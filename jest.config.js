// jest.config.js
module.exports = {
  // به Jest می‌گوید که از preset آماده ts-jest استفاده کند
  preset: 'ts-jest',

  // محیط تست را روی jsdom (شبیه‌ساز مرورگر) تنظیم می‌کند
  testEnvironment: 'jsdom',

  // فایلی که قبل از اجرای تمام تست‌ها یک بار اجرا می‌شود
  // برای تنظیمات اولیه مانند import کردن jest-dom
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // ماژول‌هایی که Jest باید آن‌ها را ماک کند
  // اینجا برای فایل‌های استایل و مدیا استفاده می‌شود
  moduleNameMapper: {
    // ماک کردن فایل‌های CSS/SCSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // می‌توانید برای فایل‌های دیگر مانند تصاویر هم ماک تعریف کنید
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // نادیده گرفتن پوشه‌هایی که نباید تست شوند
  testPathIgnorePatterns: ['/node_modules/', '/.next/'], // اگر از Next.js استفاده می‌کنید

  // تنظیمات مخصوص ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

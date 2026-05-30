import { render, screen } from '@testing-library/react';
import {AuthorizedLayout} from '@/features/core'; // مسیر کامپوننت را اصلاح کنید
import { useDrawerStore } from '@/features/core/store'; // مسیر هوک zustand را اصلاح کنید
import '@testing-library/jest-dom';

// ۱. ماک کردن فایل حاوی هوک Zustand
jest.mock('../store/useDrawerStore');

// ۲. کست کردن هوک برای پشتیبانی از تایپ‌های Jest
const mockedUseDrawerStore = jest.mocked(useDrawerStore);

describe('AuthorizedLayout Component', () => {
  beforeEach(() => {
    // پاک کردن دیتای ماک‌ها قبل از هر تست
    jest.clearAllMocks();
  });

  it('should render children content properly', () => {
    // ۳. تنظیم مقادیر بازگشتی هوک (mock return value)
    mockedUseDrawerStore.mockReturnValue({
      isOpen: false,
      toggleDrawer: jest.fn(),
      // هر استیت یا اکشن دیگری که در کامپوننت استفاده شده را اینجا اضافه کنید
    });

    // رندر کردن کامپوننت به همراه یک فرزند (children) آزمایشی
    render(
      <AuthorizedLayout>
        <div data-testid="test-child">محتوای تست</div>
      </AuthorizedLayout>
    );

    // بررسی اینکه آیا فرزند پاس داده شده در داک رندر شده است یا خیر
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('محتوای تست')).toBeInTheDocument();
  });

  it('should render drawer when store state is open', () => {
    // تست حالت متفاوت استیت
    mockedUseDrawerStore.mockReturnValue({
      isOpen: true,
      toggleDrawer: jest.fn(),
    });

    render(
      <AuthorizedLayout>
        <div>محتوا</div>
      </AuthorizedLayout>
    );

    // اینجا می‌توانید بررسی کنید که آیا دراور (مثلاً با نقش دکمه یا منو) رندر شده است
    // فرض کنیم دراور شما کلاسی یا متنی دارد که در حالت باز نمایش داده می‌شود
    // expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

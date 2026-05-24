// features/dashboard-admission/hooks/useVisitPrint.ts
import { useCallback } from "react";

export const useVisitPrint = () => {
  const handlePrint = useCallback((htmlContent: string) => {
    // ایجاد پنجره جدید
    const printWindow = window.open("", "_blank", "width=800,height=600");
    
    if (!printWindow) {
      alert("لطفاً اجازه نمایش پنجره جدید را بدهید");
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // وقتی محتوا لود شد، پرینت کن
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    // گوش دادن به رویداد afterprint برای بستن پنجره
    printWindow.addEventListener("afterprint", () => {
      printWindow.close();
    });

    // پشتیبان: اگر afterprint اجرا نشد
    setTimeout(() => {
      printWindow.print();
      
      // بستن پنجره بعد از 30 ثانیه (در صورت اجرا نشدن afterprint)
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 30000);
    }, 500);
  }, []);

  return { handlePrint };
};
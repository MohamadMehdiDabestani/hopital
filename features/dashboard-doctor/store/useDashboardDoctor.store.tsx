'use client'
import { create } from "zustand";
type Item = {
  id: number;
  name: string;
};


export const PARACLINIC_ITEMS: Item[] = [
  // آزمایش‌ها
  { id: 1, name: "CBC",  },
  { id: 2, name: "FBS",  },
  { id: 3, name: "HbA1c",  },
  { id: 4, name: "BUN / Cr",  },
  { id: 5, name: "LFT",  },
  { id: 6, name: "Lipid Profile",  },
  { id: 7, name: "CRP",  },
  { id: 8, name: "ESR",  },
  { id: 9, name: "TSH",  },
  { id: 10, name: "UA/UC",  },

  // تصویربرداری
  { id: 11, name: "رادیوگرافی ساده",  },
  { id: 12, name: "سونوگرافی شکم",  },
  { id: 13, name: "سونوگرافی لگن",  },
  { id: 14, name: "CT Scan",  },
  { id: 15, name: "MRI",  },

  // قلب و عروق
  { id: 16, name: "ECG" },
  { id: 17, name: "ECHO" },
  { id: 18, name: "تست ورزش" },

  // سایر
  { id: 19, name: "نوار عصب و عضله (EMG/NCV)",  },
  { id: 20, name: "تست بینایی‌سنجی",  },
];


type DashboardDoctor = {
  
};
export const useDashboardDoctorStore = create<DashboardDoctor>((set, get) => ({
 
}));

export const statusFa: Record<string, string> = {
  waiting: "در انتظار",
  treat: "داخل مطب",
  doneVisit: "اتمام ویزیت",
  reciveMedicine: "دریافت دارو",
  finish: "خروج",
  suspended: "تعلیق",
};

export const statusColor = (s: string) => {
  switch (s) {
    case "waiting":
      return "warning";
    case "treat":
      return "info";
    case "doneVisit":
      return "success";
    case "reciveMedicine":
      return "primary";
    case "done":
      return "default";
    case "suspended":
      return "error";
  }
};

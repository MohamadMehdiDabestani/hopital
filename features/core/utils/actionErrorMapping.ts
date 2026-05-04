type DbError = { code?: string; constraint_name?: string };

export function ActionErrorMapping(err: DbError) {
  switch (err.code) {
    case "23505":
      if (err.constraint_name === "users_phone_number_unique") {
        return "این شماره تلفن قبلاً ثبت شده است.";
      }
      return "اطلاعات تکراری است.";
    case "23503":
      return "این داده به رکورد دیگری وابسته است.";
    case "23502":
      return "یک مقدار ضروری ارسال نشده است.";
    case "22P02":
      return "فرمت داده نامعتبر است.";
    default:
      return "خطای ناشناخته در دیتابیس.";
  }
}

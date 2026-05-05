export const tehranTimezone = (iso : string) => {
  const dtf = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  });
  return dtf.format(new Date(iso));
};

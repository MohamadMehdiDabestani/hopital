import 'server-only'


export const jalaliToGregorian = (jalaliDateStr: string): string => {
  const jalaliMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  
  const gregorianMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  function isLeapGregorian(year: number): boolean {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
  }
  
  function isLeapJalali(year: number): boolean {
    const remainder = year % 33;
    return remainder === 1 || remainder === 5 || remainder === 9 || remainder === 13 || 
           remainder === 17 || remainder === 22 || remainder === 26 || remainder === 30;
  }
  
  const [datePart, timePart] = jalaliDateStr.split(' ');
  const [jYear, jMonth, jDay] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
  
  let jDayOfYear = 0;
  for (let i = 1; i < jMonth; i++) {
    jDayOfYear += jalaliMonthDays[i - 1];
    if (i === 12 && isLeapJalali(jYear + 1)) jDayOfYear++;
  }
  jDayOfYear += jDay;
  
  const gYear = jYear + 621;
  let gDayOfYear = jDayOfYear + 79;
  
  if (gDayOfYear > 365) {
    for (let i = gYear; ; i++) {
      const daysInYear = isLeapGregorian(i) ? 366 : 365;
      if (gDayOfYear <= daysInYear) break;
      gDayOfYear -= daysInYear;
    }
  }
  
  let gMonth = 1;
  let remainingDays = gDayOfYear;
  
  for (let i = 0; i < 12; i++) {
    const daysInMonth = gregorianMonthDays[i] + (i === 1 && isLeapGregorian(gYear) ? 1 : 0);
    if (remainingDays <= daysInMonth) break;
    remainingDays -= daysInMonth;
    gMonth++;
  }
  
  const gregorianDate = `${gYear}-${String(gMonth).padStart(2, '0')}-${String(remainingDays).padStart(2, '0')}`;
  const timeFormatted = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  
  return `${gregorianDate} ${timeFormatted}`;
}

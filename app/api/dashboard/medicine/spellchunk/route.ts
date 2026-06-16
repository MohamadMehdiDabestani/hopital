import { updateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:3001/v1",
  apiKey: "freellmapi-dee10886ad29ff88a190c27bfa9ced9d678aec9f83f46d9d",
});
export async function POST(req: NextRequest) {
  const { names, dbMedicines }: { names: string[]; dbMedicines: string[] } =
    await req.json();

  if (!names.length || !dbMedicines.length)
    return NextResponse.json({ results: [] });

  const prompt = `
تو یک متخصص دارویی فارسی‌زبان هستی.

لیست نام‌های واردشده توسط کاربر:
${names.map((n, i) => `${i + 1}. ${n}`).join("\n")}

لیست نام‌های معتبر دارویی در پایگاه داده:
${dbMedicines.join("، ")}

وظیفه: برای هر نام واردشده بررسی کن:
- اگر نام **دقیقاً** در لیست معتبر وجود دارد → suggestion: null
- اگر نام **همان دارو** است ولی **غلط املایی** دارد (مثلاً "آموکسی‌سیلیم" به جای "آموکسی‌سیلین") → نام صحیح را پیشنهاد بده
- اگر نام یک **داروی متفاوت** است که فقط اسمش شبیه است (مثلاً "پنی‌سیلین" و "آموکسی‌سیلین" دو داروی جداگانه‌اند) → suggestion: null
- اگر معادل معتبری در لیست نداری → suggestion: null

قانون مهم: فقط غلط‌های **تایپی و املایی** را تصحیح کن، نه جایگزینی دارو با داروی دیگر.

خروجی را فقط به صورت JSON array برگردان (بدون توضیح اضافه):
[
  { "index": 1, "suggestion": "نام معتبر یا null" },
  ...
]
`;

  const response = await openai.chat.completions.create({
    model: "auto",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0,
  });
  console.log(response);
  const content = response.choices[0].message.content || "{}";
  const parsed = JSON.parse(content);
  const results: { index: number; suggestion: string | null }[] =
    parsed.results ?? parsed;
  return NextResponse.json({ results });
}

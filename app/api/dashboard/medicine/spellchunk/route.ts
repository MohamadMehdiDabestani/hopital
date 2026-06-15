// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req: NextRequest) {
//   const { names, dbMedicines }: { names: string[]; dbMedicines: string[] } =
//     await req.json();

//   if (!names.length || !dbMedicines.length)
//     return NextResponse.json({ results: [] });

//   const prompt = `
// تو یک متخصص دارویی هستی. لیست زیر نام‌های واردشده توسط کاربر است:
// ${names.map((n, i) => `${i + 1}. ${n}`).join("\n")}

// لیست نام‌های معتبر دارویی در پایگاه داده:
// ${dbMedicines.join("، ")}

// وظیفه: برای هر نام واردشده، اگر دقیقاً در لیست معتبر وجود ندارد ولی احتمال غلط املایی دارد، نزدیک‌ترین نام معتبر را پیشنهاد بده.
// اگر نام صحیح است یا معادل معتبری نداری، مقدار suggestion را null بگذار.

// خروجی را فقط به صورت JSON array برگردان (بدون توضیح اضافه):
// [
//   { "index": 1, "suggestion": "نام معتبر یا null" },
//   ...
// ]
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     response_format: { type: "json_object" },
//     temperature: 0,
//   });

//   const content = response.choices[0].message.content || "{}";
//   const parsed = JSON.parse(content);
//   const results: { index: number; suggestion: string | null }[] =
//     parsed.results ?? parsed;

//   return NextResponse.json({ results });
// }

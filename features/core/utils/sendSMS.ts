import "server-only";
const smsKey = process.env.SMS_KEY!;
export const sendGetSMS = async (txt: string, receiver: string) => {
  console.log(receiver);
  try {
    const res = await fetch(
      `http://api.sms-webservice.com/api/V3/Send?ApiKey=${smsKey}&Text=${txt}&Sender=50004075015802&Recipients=${receiver}`,
    );
    const json = await res.json();
    console.log(json);
  } catch (error) {
    console.log("error", error);
  }
};
type Recivers = [
  {
    Sender: string; // always : 50004075015802
    Text: string;
    Destination: string;
  },
];
export const sendMultiple = async (recivers: Recivers) => {
  await fetch(`https://api.sms-webservice.com/api/V3/SendMultiple`, {
    method: "POST",
    body: JSON.stringify({
      ApiKey: smsKey,
      Recipients: recivers,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// No HTTP resource was found that matches the request URI

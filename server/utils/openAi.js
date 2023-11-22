const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

console.log(openai);
// async function getChatCompletion() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "gpt-3.5-turbo",
//   });

//   return completion.choices[0];
// }

// async function main() {
//   const completion = await getChatCompletion();
//   console.log(completion);
// }

// main();

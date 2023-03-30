import Router from "koa-router";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const router = new Router({
  prefix: "/summary",
});

const sliceText = (text) => {
  const chunkSize = 3000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

router.post("/", async (ctx, next) => {
  console.log(" ----------------- Request Body ----------------- ");
  console.log(ctx.request.body);
  console.log(" ----------------- Request Body ----------------- ");

  const text = ctx.request.body;

  if (text.length > 3000) {
    const chunks = sliceText(text);

    for await (const [index, chunk] of chunks.entries()) {
      console.log(" ----------- Chunk ----------- ");
      console.log(chunk);
      console.log(" ----------- Chunk ----------- ");
      const res = await sendSlicedPrompt(chunk);
      if (index === chunks.length - 1) {
        ctx.body = res;
      }
    }

    next();
    return;
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
	Generate an abstract from what the content say:
	1. content: ${text.slice(0, 3000)}
	2. Body length must be: 30 words 
	3. Language: same as the content
	4. Only show the abstract content part, don't start with words like 'abstract', 'summary', etc.
	`,
      max_tokens: 3000,
      temperature: 0.3,
    });

    // console.log(" ----------- Response Text ----------- ");
    // console.log(res);
    // console.log(" ----------- Response Text ----------- ");

    ctx.response.status = 200;

    ctx.body = response.data.choices[0].text;
  } catch (error) {
    console.log(" ----------- Error ----------- ");
    console.log(error);
    console.log(" ----------- Error ----------- ");
    ctx.response.status = 500;
    ctx.body = "Internal Server Error";
  }

  next();
});

const sendSlicedPrompt = async (textSlice) => {
  console.log(" ----------- Sending Text Slice ----------- ");
  console.log(textSlice);
  console.log(" ----------- Sending Text Slice ----------- ");
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `
	Generate an abstract from what the content say:
	1. content: ${textSlice}
	2. Body length must be: 30 words 
	3. Language: same as the content
	4. Only show the abstract content part, don't start with words like 'abstract', 'summary', etc.
	`,
    max_tokens: 3000,
    temperature: 0.3,
  });

  console.log(" ----------- Partial Response Text ----------- ");
  console.log(response.data.choices[0].text);
  console.log(" ----------- Partial Response Text ----------- ");

  return response.data.choices[0].text;
};

export default router;

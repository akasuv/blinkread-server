import Router from "koa-router";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const router = new Router({
  prefix: "/summary",
});

router.post("/", async (ctx, next) => {
  console.log(" ----------------- Reqeurst Body ----------------- ");
  console.log(ctx.request.body);
  console.log(" ----------------- Reqeurst Body ----------------- ");

  const text = ctx.request.body;
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

    const res = response.data.choices[0].text;

    console.log(" ----------- Response Text ----------- ");
    console.log(res);
    console.log(" ----------- Response Text ----------- ");

    ctx.response.status = 200;

    ctx.body = res;
  } catch (error) {
    console.log(" ----------- Error ----------- ");
    console.log(error);
    console.log(" ----------- Error ----------- ");
    ctx.response.status = 500;
    ctx.body = "Internal Server Error";
  }

  next();
});

export default router;

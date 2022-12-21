import { serve } from "https://deno.land/std@0.157.0/http/server.ts";
import { Configuration, OpenAIApi } from "npm:openai";

const configuration = new Configuration({
  organization: "org-c8whzxMfkS42DS4ZMvEy7a9n",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const handler = async (request: Request): Promise<Response> => {
  const text = await request.text();

  console.log(" ----------- Request Text ----------- ");
  console.log(text);
  console.log(" ----------- Request Text ----------- ");

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

  console.log(response);

  console.log(" ----------- Response Text ----------- ");
  console.log(res);
  console.log(" ----------- Response Text ----------- ");

  return new Response(res, {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};

console.log("Listening on http://localhost:8000");
serve(handler);

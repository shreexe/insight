
import { Configuration, OpenAIApi } from "openai";
import * as cheerio from 'cheerio';
import fetch from "node-fetch";
import handler from "./summary";

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);



const models = {
  content: 'davinci',
  summary: 'text-davinci-003',
};

export async function getSummary(html) {

  // console.log('getSummary: received HTML content', html);
  // const text = html.replace(/<[^>]*>/g, '');
  // console.log('getSummary: extracted text content', text);

  const $ = cheerio.load(html);
  const body = $('p').text();
  


  const prompt = `Summarize the text in the given ${body}`;
  const model = models.summary;
  const max_tokens = 700;

  try {

    const response = await openai.createCompletion({
      model,
      prompt,
      max_tokens,
      temperature: 0.6,
    });
    console.log('getSummary: received GPT-3 response', response);



    const summary = response.data.choices[0].text;
    console.log('returned', summary);
    return summary;


  } catch (error) {
    console.error(error);
    return 'An error occurred. Please try again later.';
  }
}

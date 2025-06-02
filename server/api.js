import {Configuration, OpenAIApi} from 'openai';
import dotenv from 'dotenv'
dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY

if (!openaiApiKey) {
  console.error('OpenAI API key is not set. Please set the OPENAI_API environment variable.');
  process.exit(1);
}

const configuration = new Configuration({
    apiKey: openaiApiKey
})
const openai = new OpenAIApi(configuration);


export default openai;

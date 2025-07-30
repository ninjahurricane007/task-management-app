/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class TaskAIService {
  model = new ChatOpenAI({
    modelName: 'llama3-70b-8192',
    apiKey: process.env.GROQ_API_KEY,
    configuration: {
      baseURL: 'https://api.groq.com/openai/v1',
    },
  });

  async generateTaskFromPrompt(
    prompt: string,
  ): Promise<{ title: string; description: string }> {
    const systemPrompt = `Extract a short title and detailed description from the following prompt.
Format strictly as:
Title: [your title] (max 35 characters)
Description: [your description]
Do not add anything else.`;

    const fullPrompt = `${systemPrompt}\n\nPrompt: ${prompt}`;
    const response = await this.model.invoke(fullPrompt);

    const content =
      typeof response.content === 'string'
        ? response.content
        : Array.isArray(response.content)
          ? response.content
            .map((part) => ('text' in part ? part.text : ''))
            .join('\n')
          : '';

    const match = content.match(/title:\s*(.*)\ndescription:\s*(.*)/i);

    if (!match) {
      return {
        title: 'Unclear Task',
        description: content.trim(),
      };
    }

    return {
      title: match[1].trim(),
      description: match[2].trim(),
    };
  }
}

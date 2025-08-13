/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CheckSimilarityDto } from './dto/check-similarity-dto';
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

  private async textToEmbeddings(text: string): Promise<number[]> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async checkSimilarity(similarityDto: CheckSimilarityDto): Promise<number> {
    const {text1, text2} = similarityDto
    const embedding1 = await this.textToEmbeddings(text1);
    const embedding2 = await this.textToEmbeddings(text2);

    return this.cosineSimilarity(embedding1, embedding2);
  }
}

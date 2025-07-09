import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses.mjs';

class OpenAIAdapter {
  private client: OpenAI;
  private readonly openAIApiKey: string;
  private readonly embeddingsModelName: string = 'text-embedding-3-small';
  private readonly embeddingsDimensions: number = 768;
  private readonly encodingFormat: 'float' | 'base64' = 'float';

  constructor() {
    this.openAIApiKey = String(process.env.OPENAI_API_KEY);

    this.client = new OpenAI({
      apiKey: this.openAIApiKey,
    });
  }

  public async embedText(text: string) {
    const embedding = await this.client.embeddings.create({
      model: this.embeddingsModelName,
      input: text,
      encoding_format: this.encodingFormat,
      dimensions: this.embeddingsDimensions,
    });

    return embedding;
  }

  public getEmbeddingFunction() {
    return new OpenAIEmbeddingFunction({
      apiKey: this.openAIApiKey,
      modelName: this.embeddingsModelName,
      dimensions: this.embeddingsDimensions,
    });
  }

  public async askAi(input: ResponseInput | string) {
    const response = await this.client.responses.create({
      model: 'gpt-4.1-nano-2025-04-14',
      instructions: `Extract the software tools and general topics from the input text.

Tools should include IDEs, text editors, or well-known software like Microsoft Excel, Word, VSCode, IntelliJ, etc.

Topics should include technologies or conceptual areas like AI, Java, JavaScript, Infrastructure, and Negotiation.

Return the result in this JSON format:

{
  "tools": [...],
  "topics": [...]
}

Respond only with the JSON object.`,
      input: input,
    });

    return response;
  }
}

export default new OpenAIAdapter();

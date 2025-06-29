import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import OpenAI from 'openai';

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
}

export default new OpenAIAdapter();

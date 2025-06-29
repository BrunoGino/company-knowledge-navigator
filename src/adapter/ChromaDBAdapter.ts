import { ChromaClient } from 'chromadb';
import openAIAdapter from './OpenAIAdapter.js';

export class ChromaDBAdapter {
  private client: ChromaClient;
  private collectionName: string;

  constructor(collectionName: string) {
    this.client = new ChromaClient({
      host: 'localhost',
      port: 8000,
      ssl: false,
    });
    this.collectionName = collectionName;
  }

  public async queryDocumentsByTexts(texts: string[]) {
    const collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
      embeddingFunction: openAIAdapter.getEmbeddingFunction(),
    });

    const documents = await collection.query({
      queryTexts: texts,
      include: ['documents', 'metadatas'],
    });

    return documents.rows().flat();
  }
}

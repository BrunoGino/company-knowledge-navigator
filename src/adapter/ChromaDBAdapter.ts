import { ChromaClient } from 'chromadb';
import openAIAdapter from './OpenAIAdapter.js';

export class ChromaDBAdapter {
  private client: ChromaClient;
  private collectionName: string;

  constructor(collectionName: string) {
    this.client = new ChromaClient({
      ssl: false,
      host: 'embeddings_db',
      port: 8000,
      tenant: 'default_tenant',
      database: 'default_database',
    });

    this.collectionName = collectionName;
  }

  public async addDocument(
    id: string,
    document: string[],
    metadatas: Record<string, string>[]
  ) {
    const collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
      embeddingFunction: openAIAdapter.getEmbeddingFunction(),
    });

    await collection.add({
      ids: [id],
      documents: document,
      metadatas: metadatas,
    });
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

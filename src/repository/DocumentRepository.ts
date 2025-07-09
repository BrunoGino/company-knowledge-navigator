import { Document } from '../model/Document.js';
import { Neo4JAdapter } from '../adapter/Neo4JAdapter.js';
import KSUID from 'ksuid';

class DocumentRepository {
  private neo4jAdapter: Neo4JAdapter;
  constructor() {
    this.neo4jAdapter = new Neo4JAdapter();
  }

  public async getDocument(document: Document): Promise<Document | undefined> {
    return await this.neo4jAdapter.readSingle<Document | undefined>(
      `//cypher
      MATCH (d:Document {title: $title, authorId: $authorId}) RETURN d
      `,
      { title: document.title, authorId: document.authorId }
    );
  }

  public async getDocumentById(
    documentId: string
  ): Promise<Document | undefined> {
    return await this.neo4jAdapter.readSingle(
      `//cypher
      MATCH (d:Document {id: $documentId}) RETURN d
      `,
      { documentId: documentId }
    );
  }

  public async saveDocument(document: Document) {
    const result = (await this.neo4jAdapter.runTransaction<Document>(
      `//cypher
       WITH $title AS title,
            $id AS id,
            $fileUrl AS fileUrl,
            $topics AS topics,
            $tools AS tools,
            $authorId AS authorId,
            date() AS today

       MERGE (d:Document {
        id: id,
        title: title,
        fileUrl: fileUrl,
        createdAt: today,
        updatedAt: today
       })

       WITH d, topics, tools, authorId
       UNWIND topics AS topicName
       MERGE (t:Topic {name: topicName})
       MERGE (d)-[:HAS_TOPIC]->(t)

       WITH d, tools, authorId
       UNWIND tools AS toolName
       MERGE (tool:Tool {name: toolName})
       MERGE (d)-[:MENTIONS]->(tool)

       WITH d, authorId
       MATCH (e:Employee {id: authorId})
       MERGE (d)-[:AUTHORED_BY]->(e)

       RETURN d
        `,
      {
        id: document.id ?? KSUID.randomSync().string,
        title: document.title,
        fileUrl: document.fileUrl,
        topics: document.topics,
        tools: document.tools,
        authorId: document.authorId,
      }
    )) as Document;
    return result;
  }
}

export default new DocumentRepository();

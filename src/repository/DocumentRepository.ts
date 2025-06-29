import { Document } from '../model/Document.js';
import { Neo4JAdapter } from '../adapter/Neo4JAdapter.js';
import KSUID from 'ksuid';

class DocumentRepository {
  private neo4jAdapter: Neo4JAdapter;
  constructor() {
    this.neo4jAdapter = new Neo4JAdapter();
  }

  public async getDocument(document: Document) {
    return await this.neo4jAdapter.readSingle<Document>(
      `//cypher
      MATCH (d:Document {title: $title, authorId: $authorId}) RETURN d
      `,
      { title: document.title, authorId: document.authorId }
    );
  }

  public async createDocument(document: Document) {
    return await this.neo4jAdapter.runTransaction<Document>(
      `//cypher
       WITH $title AS title,
            $id AS id,
            $fileUrl AS fileUrl,
            $topics AS topics,
            $tools AS tools,
            $authorId AS authorId,
            date() AS today

       MERGE (doc:Document {
        id: id,
        title: title,
        fileUrl: fileUrl,
        createdAt: today,
        updatedAt: today
       })

       WITH doc, topics, tools, authorId
       UNWIND topics AS topicName
       MERGE (t:Topic {name: topicName})
       MERGE (doc)-[:HAS_TOPIC]->(t)

       WITH doc, tools, authorId
       UNWIND tools AS toolName
       MERGE (tool:Tool {name: toolName})
       MERGE (doc)-[:MENTIONS]->(tool)

       WITH doc, authorId
       MATCH (e:Employee {id: authorId})
       MERGE (doc)-[:AUTHORED_BY]->(e)

       RETURN doc, e
        `,
      {
        id: KSUID.randomSync().string,
        title: document.title,
        fileUrl: document.fileUrl,
        topics: document.topics,
        tools: document.tools,
        authorId: document.authorId,
      }
    );
  }
}

export default new DocumentRepository();

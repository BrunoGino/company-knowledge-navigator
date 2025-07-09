import { auth, Driver, driver, QueryResult, RecordShape } from 'neo4j-driver';

interface GenericShape<T> extends RecordShape {
  d: {
    properties: T;
  };
}

export class Neo4JAdapter {
  private driver: Driver;
  private readonly databaseName: string;

  constructor() {
    this.driver = driver(
      String(process.env.NEO4J_URL),
      auth.basic(String(process.env.NEO4J_USER), String(process.env.NEO4J_PASS))
    );
    this.databaseName = String(process.env.DATABASE_NAME);
  }

  public async readSingle<T>(cypher: string, args: Record<string, unknown>) {
    const session = this.driver.session({
      database: this.databaseName,
      defaultAccessMode: 'READ',
    });

    const result = await session.executeRead((transaction) => {
      return transaction.run<GenericShape<T>>(cypher, args);
    });

    console.log('result', result);
    const parsedResult = this.mapRecordsToShape(result);

    return parsedResult[0];
  }

  public async runTransaction<T>(
    cypher: string,
    args: Record<string, unknown>
  ): Promise<T[] | T | undefined> {
    const session = this.driver.session({
      database: this.databaseName,
      defaultAccessMode: 'WRITE',
    });

    const transaction = session.beginTransaction();
    try {
      const result = await transaction.run<GenericShape<T>>(cypher, args);

      await transaction.commit();
      const parsedResult = this.mapRecordsToShape(result);

      return parsedResult[0];
    } catch (error) {
      console.error(error);
      await transaction.rollback();
    } finally {
      await session.close();
    }
  }

  private mapRecordsToShape<T>(result: QueryResult<GenericShape<T>>) {
    result.records[0].get('d');
    return result.records.map((r) => {
      return r.get('d').properties;
    });
  }
}

import { auth, Driver, driver, QueryResult, RecordShape } from 'neo4j-driver';

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

  public async readSingle<Shape extends RecordShape>(
    cypher: string,
    args: Record<string, unknown>
  ) {
    const session = this.driver.session({
      database: this.databaseName,
      defaultAccessMode: 'READ',
    });

    const result = await session.executeRead((transaction) => {
      return transaction.run<Shape>(cypher, args);
    });

    console.log('result', result);
    const parsedResult = this.mapRecordsToShape(result);

    return parsedResult[0];
  }

  public async runTransaction<Shape extends RecordShape>(
    cypher: string,
    args: Record<string, unknown>
  ): Promise<Shape[] | Shape | undefined> {
    const session = this.driver.session({
      database: this.databaseName,
      defaultAccessMode: 'WRITE',
    });

    const transaction = session.beginTransaction();
    try {
      const result = await transaction.run<Shape>(cypher, args);

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

  private mapRecordsToShape<Shape>(result: QueryResult<Shape>) {
    return result.records.map((r) => {
      return r.keys.reduce((obj, key) => {
        return Object.assign(obj, { [key]: r.get(key) });
      }, {} as Shape);
    });
  }
}

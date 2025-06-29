import KSUID from 'ksuid';
import { Neo4JAdapter } from '../adapter/Neo4JAdapter.js';
import { Company } from '../model/Company.js';

class CompanyRepository {
  private neo4jAdapter: Neo4JAdapter;

  constructor() {
    this.neo4jAdapter = new Neo4JAdapter();
  }

  public async createCompany(company: Company) {
    return await this.neo4jAdapter.runTransaction<Company>(
      `//cypher
      WITH $name AS name,
           $id AS id,
           $market AS market

      MERGE (com:Company {
        name: name,
        market: market
      })
      SET com.id = id

      RETURN com
      `,
      {
        id: KSUID.randomSync().string,
        name: company.name,
        market: company.market,
      }
    );
  }
}

export default new CompanyRepository();

import KSUID from 'ksuid';
import { Neo4JAdapter } from '../adapter/Neo4JAdapter.js';
import { Department } from '../model/Department.js';

class DepartmentRepository {
  private neo4jAdapter: Neo4JAdapter;

  constructor() {
    this.neo4jAdapter = new Neo4JAdapter();
  }

  public async createDepartment(department: Department) {
    console.log(JSON.stringify(department));
    return await this.neo4jAdapter.runTransaction(
      `//cypher
        WITH $id AS id,
             $name AS name,
             $directorId AS directorId,
             $companyId AS companyId,
             date() AS today

        MERGE (dep:Department {
          name: name,
          createdAt: today
        })
        SET dep.id = id

        WITH dep, companyId, directorId
        MATCH (c:Company {id: companyId})
        MERGE (dep)-[:IS_PART_OF]->(c)

        WITH dep, directorId
        MATCH (e:Employee {id: directorId})
        MERGE (e)-[:IS_HEAD_OF]->(dep)

        RETURN dep, e
      `,
      {
        id: KSUID.randomSync().string,
        name: department.name,
        directorId: department.directorId,
        companyId: department.companyId,
      }
    );
  }
}

export default new DepartmentRepository();

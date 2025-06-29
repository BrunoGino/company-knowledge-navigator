import KSUID from 'ksuid';
import { Neo4JAdapter } from '../adapter/Neo4JAdapter.js';
import { Team } from '../model/Team.js';

class TeamRepository {
  private neo4jAdapter: Neo4JAdapter;

  constructor() {
    this.neo4jAdapter = new Neo4JAdapter();
  }

  public async createTeam(team: Team) {
    return await this.neo4jAdapter.runTransaction(
      `//cypher
      WITH $id AS id,
           $name AS name,
           $managerId as managerId,
           $departmentId as departmentId,
           date() AS today

      MERGE (t: Team {
        name: name
        createdAt: today
      })
      SET t.id = id

      WITH t, departmentId
      MATCH (d:Department {id: departmentId})
      MERGE (t)-[:IS_PART_OF]->(d)

      WITH t, managerId
      MATCH (m:Employee {id: managerId})
      MERGE (m)-[:MANAGES]->(t)

      RETURN t, m
    `,
      {
        id: KSUID.randomSync().string,
        name: team.name,
        managerId: team.managerId,
      }
    );
  }
}

export default new TeamRepository();

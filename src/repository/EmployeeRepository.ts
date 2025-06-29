import KSUID from 'ksuid';
import { Neo4JAdapter } from '../adapter/Neo4JAdapter.js';
import { Employee } from '../model/Employee.js';

class EmployeeRepository {
  private neo4jAdapter: Neo4JAdapter;

  constructor() {
    this.neo4jAdapter = new Neo4JAdapter();
  }

  public async getEmployee(employee: Employee) {
    console.log(JSON.stringify(employee));
    return await this.neo4jAdapter.readSingle<Employee>(
      `//cypher
    WITH
      $firstName AS firstName,
      $lastName AS lastName,
      $hiredIn AS hiredIn,
      $birthDate AS birthDate,
      $role AS role,
      $genre AS genre
    MATCH (e:Employee
            {
              firstName: firstName,
              lastName: lastName,
              role: role,
              hiredIn: hiredIn,
              birthDate: birthDate,
              genre: genre
              })
    RETURN e
      `,
      {
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        hiredIn: employee.hiredIn,
        birthDate: employee.birthDate,
        genre: employee.genre,
      }
    );
  }

  public async createEmployee(employee: Employee) {
    return await this.neo4jAdapter.runTransaction<Employee>(
      `//cypher
        WITH
          $id AS id,
          $firstName AS firstName,
          $lastName AS lastName,
          $hiredIn AS hiredIn,
          $birthDate AS birthDate,
          $teams AS teams,
          $role AS role,
          $topics AS topics,
          $tools AS tools,
          $genre AS genre

        CREATE
        (emp:Employee
          {
            firstName: firstName,
            role: role,
            lastName: lastName,
            hiredIn: hiredIn,
            birthDate: birthDate,
            genre: genre
          })
        SET emp.id = id

        WITH emp, tools, topics, teams
        UNWIND tools AS toolName
        MERGE (tool:Tool {name: toolName})
        MERGE (emp)-[:USES]->(tool)

        WITH emp, topics, teams
        UNWIND topics AS topicName
        MERGE (topic:Topic {name: topicName})
        MERGE (emp)-[:KNOWS_ABOUT]->(topic)

        WITH emp, teams
        UNWIND teams AS team
        MATCH (t:Team {name: team.name, id: team.id})
        MERGE (emp)-[rel:BELONGS_TO {
          startDate: team.startDate,
          role: team.role
        }]->(t)
        FOREACH (_ IN CASE WHEN team.endDate IS NOT NULL THEN [1] ELSE [] END |
          SET rel.endDate = team.endDate
        )

        RETURN emp
      `,
      {
        id: KSUID.randomSync().string,
        firstName: employee.firstName,
        lastName: employee.lastName,
        hiredIn: employee.hiredIn,
        birthDate: employee.birthDate,
        teams: employee.teams,
        role: employee.role,
        topics: employee.topics,
        tools: employee.tools,
        genre: employee.genre,
      }
    );
  }
}

export default new EmployeeRepository();

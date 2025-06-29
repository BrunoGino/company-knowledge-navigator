import { Request, Response } from 'express';
import { Team } from '../model/Team.js';
import teamRepository from '../repository/TeamRepository.js';

interface AddTeamRequestBody {
  name: string;
  managerId: string;
  departmentId: string;
}

const addTeam = async (
  req: Request<never, never, AddTeamRequestBody, never>,
  res: Response
) => {
  const result = await teamRepository.createTeam(
    parseRequestBodyToTeam(req.body)
  );

  res.json(result);
};

const parseRequestBodyToTeam = (requestBody: AddTeamRequestBody): Team => {
  return {
    ...requestBody,
    id: undefined,
  };
};

export { addTeam };

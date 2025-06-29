import { Request, Response } from 'express';
import { Department } from '../model/Department.js';
import departmentRepository from '../repository/DepartmentRepository.js';

interface AddDepartmentRequestBody {
  name: string;
  directorId: string;
  companyId: string;
}

const addDepartment = async (
  req: Request<never, never, AddDepartmentRequestBody, never>,
  res: Response
) => {
  const result = await departmentRepository.createDepartment(
    parseRequestBodyToDepartment(req.body)
  );

  res.json(result);
};

const parseRequestBodyToDepartment = (
  requestBody: AddDepartmentRequestBody
): Department => {
  return {
    ...requestBody,
    id: undefined,
  };
};

export { addDepartment };

import { Request, Response } from 'express';
import employeeRepository from '../repository/EmployeeRepository.js';
import { Employee } from '../model/Employee.js';

interface AddEmployeeRequestBody {
  firstName: string;
  lastName: string;
  hiredIn: Date;
  birthDate: Date;
  genre: string;
  role: string;
  teams: {
    id: string;
    name: string;
    role: string;
    startDate: Date;
    endDate: Date | undefined;
  }[];
  topics: string[];
  tools: string[];
}

const addEmployee = async (
  req: Request<never, never, AddEmployeeRequestBody, never>,
  res: Response
) => {
  const employee = parseRequestBodyToEmployee(req.body);
  const existingEmployee = await employeeRepository.getEmployee(employee);
  if (existingEmployee) {
    throw new Error('Employee already exists');
  }
  const result = await employeeRepository.createEmployee(employee);

  res.json(result);
};

const parseRequestBodyToEmployee = (
  requestBody: AddEmployeeRequestBody
): Employee => {
  return {
    id: undefined,

    ...requestBody,
  };
};

export { addEmployee };

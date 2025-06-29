import { Request, Response } from 'express';
import { Company } from '../model/Company.js';
import companyRepository from '../repository/CompanyRepository.js';

interface AddCompanyRequestBody {
  name: string;
  market: string;
}

const addCompany = async (
  req: Request<never, never, AddCompanyRequestBody, never>,
  res: Response
) => {
  const result = await companyRepository.createCompany(
    parseRequestBodyToCompany(req.body)
  );

  res.json(result);
};

const parseRequestBodyToCompany = (
  requestBody: AddCompanyRequestBody
): Company => {
  return {
    id: undefined,
    ...requestBody,
  };
};

export { addCompany };

import { Request, Response } from 'express';
import documentRepository from '../repository/DocumentRepository.js';
import { Document } from '../model/Document.js';

interface AddDocumentRequestBody {
  title: string;
  fileUrl: string;
  topics: string[];
  tools: string[];
  authorId: string;
}

const addDocument = async (
  req: Request<never, never, AddDocumentRequestBody, never>,
  res: Response
) => {
  const result = await documentRepository.createDocument(
    parseRequestBodyToDocument(req.body)
  );

  res.json(result);
};

const parseRequestBodyToDocument = (
  requestBody: AddDocumentRequestBody
): Document => {
  return {
    createdAt: undefined,
    id: undefined,
    updatedAt: undefined,
    updatedBy: undefined,
    ...requestBody,
  };
};

export { addDocument };

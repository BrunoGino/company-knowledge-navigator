import { Request, Response } from 'express';
import documentRepository from '../repository/DocumentRepository.js';
import { Document } from '../model/Document.js';
import { ChromaDBAdapter } from '../adapter/ChromaDBAdapter.js';

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

  // TODO: read PDF to text -> transform text to chunks -> save chunks to ChromaDB
  // TODO: inspect document with AI to get the tools MENTIONED by the document and the TOPICS contained

  res.json(result);
};

const searchDocument = async (
  req: Request<never, never, never, { question: string }>,
  res: Response
) => {
  const questionQuery = req.query.question;

  const embeddingsDb = new ChromaDBAdapter('company-documents');
  const results = await embeddingsDb.queryDocumentsByTexts([questionQuery]);

  res.json(results);
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

export { addDocument, searchDocument };

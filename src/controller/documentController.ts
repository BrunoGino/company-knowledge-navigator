import { Request, Response } from 'express';
import documentRepository from '../repository/DocumentRepository.js';
import { Document } from '../model/Document.js';
import { ChromaDBAdapter } from '../adapter/ChromaDBAdapter.js';
import { TokenTextSplitter } from '@langchain/textsplitters';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import openAIAdapter from '../adapter/OpenAIAdapter.js';

interface AddDocumentRequestBody {
  title: string;
  topics: string[];
  tools: string[];
  authorId: string;
}

const addDocument = async (
  req: Request<never, never, AddDocumentRequestBody, never>,
  res: Response
) => {
  const incomingDoc = parseRequestBodyToDocument(req.body);
  const document = await documentRepository.getDocument(incomingDoc);

  if (document) {
    throw new Error('Document already exists');
  }

  const result = await documentRepository.saveDocument(incomingDoc);

  res.json(result);
};

const attachFileToDocument = async (
  req: Request<{ documentId: string }, never, never, never>,
  res: Response
) => {
  const documentId = req.params.documentId;
  const document = await documentRepository.getDocumentById(documentId);
  if (!document) {
    throw new Error('Document does not exist');
  }
  const loader = new PDFLoader(req.file.path);
  const docs = await loader.load();

  const splitter = new TokenTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 128,
  });
  const output = await splitter.splitText(docs[0].pageContent);
  const aiResponse = await openAIAdapter.askAi(docs[0].pageContent);
  const toolsAndTopics = JSON.parse(aiResponse.output_text) as {
    tools: string[];
    topics: string[];
  };

  const updatedDocument = {
    ...document,
    ...toolsAndTopics,
  };

  await documentRepository.saveDocument(updatedDocument);

  const embeddingsDb = new ChromaDBAdapter('company-documents');
  await embeddingsDb.addDocument(documentId, output, [{ fileType: 'pdf' }]);

  console.log(output);
  res.json();
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
    fileUrl: undefined,
    ...requestBody,
  };
};

export { addDocument, searchDocument, attachFileToDocument };

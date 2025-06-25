import { Document } from '../model/Document';
import { DocumentRepository } from '../repository/DocumentRepository';

export class QuestionService {
  private documentRepository: DocumentRepository;
  constructor() {
    this.documentRepository = new DocumentRepository();
  }

  public async createDocument(document: Document) {
    await this.documentRepository.createDocument(document);
  }
}

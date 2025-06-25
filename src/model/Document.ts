export class Document {
  constructor(
    public id: string,
    public title: string,
    public fileUrl: string,
    public topics: string[],
    public tools: string[],
    public authorId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public updatedBy: string
  ) {}
}

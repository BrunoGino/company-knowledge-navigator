export class Document {
  constructor(
    public id: string | undefined,
    public title: string,
    public fileUrl: string,
    public topics: string[],
    public tools: string[],
    public authorId: string,
    public createdAt: Date | undefined,
    public updatedAt: Date | undefined,
    public updatedBy: string | undefined
  ) {}
}

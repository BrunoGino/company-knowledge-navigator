export class Department {
  constructor(
    public id: string | undefined,
    public name: string,
    public directorId: string,
    public companyId: string
  ) {}
}

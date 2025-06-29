export class Employee {
  constructor(
    public id: string | undefined,
    public firstName: string,
    public lastName: string,
    public hiredIn: Date,
    public birthDate: Date,
    public genre: string,
    public teams: {
      id: string;
      name: string;
      startDate: Date;
      endDate: Date | undefined;
    }[],
    public role: string,
    public topics: string[],
    public tools: string[]
  ) {}
}

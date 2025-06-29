import express from 'express';
import { addDocument } from './controller/documentController.js';
import { addEmployee } from './controller/employeeController.js';
import { addCompany } from './controller/companyController.js';
import { addDepartment } from './controller/departmentController.js';
import { addTeam } from './controller/teamController.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/document', addDocument);
app.post('/employee', addEmployee);
app.post('/department', addDepartment);
app.post('/company', addCompany);
app.post('/team', addTeam);

const port = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

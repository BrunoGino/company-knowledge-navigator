import express from 'express';
import {
  addDocument,
  searchDocument,
} from './controller/documentController.js';
import { addEmployee } from './controller/employeeController.js';
import { addCompany } from './controller/companyController.js';
import { addDepartment } from './controller/departmentController.js';
import { addTeam } from './controller/teamController.js';

const app = express();

const router = app.router;
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/document', addDocument);
router.get('/document/search', searchDocument);
router.post('/employee', addEmployee);
router.post('/department', addDepartment);
router.post('/company', addCompany);
router.post('/team', addTeam);

const port = Number(process.env.PORT);

app.use('/api', router);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

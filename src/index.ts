import express from 'express';
import {
  addDocument,
  searchDocument,
  attachFileToDocument,
} from './controller/documentController.js';
import { addEmployee } from './controller/employeeController.js';
import { addCompany } from './controller/companyController.js';
import { addDepartment } from './controller/departmentController.js';
import { addTeam } from './controller/teamController.js';
import multer from 'multer';

const app = express();

const router = app.router;
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: './tmp/documents' });

router.post('/document', addDocument);
router.patch(
  '/document/:documentId',
  upload.single('doc'),
  attachFileToDocument
);
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

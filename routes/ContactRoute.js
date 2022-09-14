import express from 'express'; //mengimport module express
import { contacts, detailContact, formAddContact, createContact, updateContact, getContactByName, formEditContact, deleteContact, getName } from '../controllers/ContactController.js'; //mengimport ContactController
import { body, check } from 'express-validator'; // mengimport module express-validator
const router = express.Router();

// memuat route / dengan method get
router.get('/', (req, res) => {
  // merender index dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
  res.render('index', {
    isActive: 'home',
    layout: 'layouts/main-layout',
    title: 'WebServer EJS',
    nama: 'Iwan Plamboyan',
  });
});

// memuat route / dengan method get
router.get('/about', (req, res) => {
  // merender about dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
  res.render('about', {
    isActive: 'about',
    layout: 'layouts/main-layout',
    title: 'about page',
  });
});

router.get('/contacts', contacts);
router.get('/contacts/detail/:name', detailContact);
router.get('/contacts/add', formAddContact);

router.post(
  '/contacts',
  [
    // cek name jika duplikat
    body('name').custom(async (value) => {
      const duplikatName = await getName(value);
      if (duplikatName.rows.length > 0) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    // cek mobile phone
    check('mobile', 'No Hp tidak valid!').isMobilePhone('id-ID'),
    // cek email
    check('email', 'Email tidak valid!').isEmail(),
  ],
  createContact
);

router.get('/contacts/edit/:name', formEditContact);

router.post(
  '/contacts/update',
  [
    // cek name
    body('name').custom(async (value, { req }) => {
      const duplikatName = await getName(value);
      if (value !== req.body.oldName && duplikatName.rows.length > 0) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    // cek mobile phone
    check('mobile', 'No Hp tidak valid!').isMobilePhone('id-ID'),
    // cek email
    check('email', 'Email tidak valid!').isEmail(),
  ],
  updateContact
);

router.get('/contacts/delete/:name', deleteContact);

export default router;

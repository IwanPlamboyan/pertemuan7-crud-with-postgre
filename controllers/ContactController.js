import pool from '../db/database.js'; // mengimport connection ke database
import { validationResult } from 'express-validator'; //mengimport fungsi untuk menangkap error menggunakan express-validator

// fungsi untuk get all contact
export const contacts = async (req, res) => {
  try {
    const contacts = await pool.query('SELECT * FROM contacts'); // get all data contacts
    // merender contacts dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
    res.render('contacts', {
      isActive: 'contact',
      layout: 'layouts/main-layout',
      title: 'contact page',
      contacts: contacts.rows,
      pesan: req.flash('pesan'),
    });
  } catch (error) {
    console.error(error.message); //jika ada error munculkan ke konsol
  }
};

// fungsi untuk mendapatkan name berdasarkan parameter yang diinputkan
export const getName = (name) => {
  try {
    return pool.query(`SELECT LOWER(name) FROM contacts WHERE name = '${name.toLowerCase()}'`);
  } catch (error) {
    console.error(error.message); //jika ada error munculkan ke konsol
  }
};

// get contact contact berdasarkan name
export const getContactByName = (name) => {
  try {
    return pool.query(`SELECT * FROM contacts WHERE name = '${name}'`);
  } catch (error) {
    console.error(error.message); //jika ada error munculkan ke konsol
  }
};

// menampilkan datail contact
export const detailContact = async (req, res) => {
  try {
    const contact = await getContactByName(req.params.name);
    // merender index dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
    res.render('detail', {
      isActive: 'contact',
      layout: 'layouts/main-layout',
      title: 'Detail Contact',
      contact: contact.rows,
    });
  } catch (error) {
    console.error(error.message); //jika ada error munculkan ke konsol
  }
};

// merender add-contact dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
export const formAddContact = async (req, res) => {
  res.render('add-contact', {
    isActive: 'contact',
    layout: 'layouts/main-layout',
    title: 'Form Tambah Contact',
    contact: '',
  });
};

// fungsi untuk menambahkan contact
export const createContact = async (req, res) => {
  const errors = validationResult(req);
  // jika ada error render ulang add-contact dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      isActive: 'contact',
      layout: 'layouts/main-layout',
      title: 'Form tambah Contact',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    // jika sudah divalidasi maka masukkan datanya
    const { name, mobile, email } = req.body;
    try {
      await pool.query(`INSERT INTO contacts VALUES('${name}', '${mobile}', '${email}')`);
      req.flash('pesan', 'Data contact berhasil ditambahkan!');
      res.redirect('/contacts');
    } catch (error) {
      console.error(error.message); //jika ada error munculkan ke konsol
    }
  }
};

// merender edit-contact dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
export const formEditContact = async (req, res) => {
  try {
    const contact = await getContactByName(req.params.name);
    res.render('edit-contact', {
      isActive: 'contact',
      layout: 'layouts/main-layout',
      title: 'Form Edit Contact',
      contact: contact.rows[0],
    });
  } catch (error) {
    console.error(error.message); //jika ada error munculkan ke konsol
  }
};

// fungsi untuk mengedit contact
export const updateContact = async (req, res) => {
  const errors = validationResult(req);
  // jika ada error render ulang edit-contact dengan main-layout sebagai layoutnya sambil mengirimkan beberapa data
  if (!errors.isEmpty()) {
    res.render('edit-contact', {
      isActive: 'contact',
      layout: 'layouts/main-layout',
      title: 'Form Edit Contact',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    const { name, mobile, email, oldName } = req.body;
    try {
      await pool.query(`UPDATE contacts SET name ='${name}', mobile = '${mobile}', email = '${email}' WHERE name = '${oldName}'`);
      req.flash('pesan', 'Data contact berhasil di ubah!');
      res.redirect('/contacts');
    } catch (error) {
      console.error(error.message); //jika ada error munculkan ke konsol
    }
  }
};

// fungsi delete contact
export const deleteContact = async (req, res) => {
  try {
    await pool.query(`DELETE FROM contacts WHERE name = '${req.params.name}'`);
    req.flash('pesan', 'Data contact berhasil di hapus!');
    res.redirect('/contacts');
  } catch (error) {
    console.error(error.message); //jika ada error munculkan ke konsol
  }
};

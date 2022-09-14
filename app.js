import express from 'express'; // mengimport module express
import expressLayouts from 'express-ejs-layouts'; // mengimport module express-ejs-layouts
import cookieParser from 'cookie-parser'; // mengimport module cookie-parser
import session from 'express-session'; // mengimport module session
import flash from 'connect-flash'; // mengimport module flash
import ContactRoute from './routes/ContactRoute.js'; // mengimport route contact
import morgan from 'morgan'; // mengimport morgan

const app = express();

app.use(morgan('dev')); //menggunakan morgan untuk mencatat request log yang masuk
app.set('view engine', 'ejs'); // information using ejs
app.use(expressLayouts); // information using express-ejs-layouts
app.use(express.urlencoded({ extended: false })); // menggunakan middleware untuk mendapatkan data req.body
// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(express.static('public')); //membuat folder public static
app.use(express.json()); //request akan diterima sebagai json
app.use(ContactRoute); //memanggil middleware route contact

const port = 3000;

// memanggil server yang berjalan di port yang ditentukan
app.listen(port, () => console.log(`Server up and running in http://localhost:${port}`));

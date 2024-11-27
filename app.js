    const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const shopController = require('./controllers/shop.controller');
const auth = require('./middleware/auth.middleware');
const adminRoutes = require('./routes/admin.route');
const shopRoutes = require('./routes/shop.route');
const authRoutes = require('./routes/auth.route');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')) 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());
app.post('/create-order', auth(), shopController.postOrder);
  app.get('/reviews', (req, res) => {
    res.json([{
      orderId: "1234567",
      orderDate: "1234567",
      customerName: "23456789",
      productName: "23456789",
      customerName: "23456789",
      reviewText: "23456789",
      rating: 4
    }])
  })
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.listen(4000);

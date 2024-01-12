const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;

// Sử dụng middleware morgan để ghi log request
app.use(morgan('combined'));

// Sử dụng middleware bodyParser để xử lý dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Cấu hình sessions
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
  })
);

// Cấu hình view engine và thư mục views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// mongoose.connect('mongodb://localhost:27017/mydb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log("Mongodb is connected");
// }).catch((err) => {
//   console.error("Error connecting to MongoDB:", err);
// });
async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017/mydb1', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Mongodb is connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Gọi hàm kết nối khi ứng dụng bắt đầu
connectToMongoDB();

// Sử dụng tĩnh middleware để phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng router admin cho tất cả các tuyến đường bắt đầu bằng '/admin'
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

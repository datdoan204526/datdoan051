
const Admin = require('../models/admin');
const Worker = require('../models/workers');
const Lienhe = require('../models/lienhe');
const User = require('../models/user');
const Products = require('../models/products');
const Order = require('../models/order');
const ApprovedOrder = require('../models/approvedorder');
const ExcelJS = require('exceljs');
// const DirectMessage = require('../models/directmessage');


//get login
exports.getLogin = (req, res, next) => {

   res.render('admin/login', { user: "", msg: [], err: [] });
}
// post login

exports.postLogin = (req, res, next) => {
   const { email, password } = req.body;
   console.log(req.body.email);
 
   // Tìm admin trong cơ sở dữ liệu
   Admin.findOne({ email, password })
     .then(admin => {
       console.log(admin);
       if (admin) {
         // Đăng nhập thành công, lưu thông tin đăng nhập vào phiên
         req.session.email = email;
         req.session.userType = 'admin';
         // Gán loại người dùng vào phiên
         return res.render('admin/dashboard', { admin: req.session.email });
       } else {
         // Nếu không tìm thấy admin hoặc không kích hoạt, kiểm tra worker
         return Worker.findOne({ email, password })
         .then(worker => {
            if (worker && worker.kichhoat == '1') {
              // Đăng nhập thành công, lưu thông tin đăng nhập vào phiên
              req.session.email = email;
              req.session.userType = 'worker'; // Gán loại người dùng vào phiên
              return res.render('admin/dashboard', { worker: req.session.email });
            } else {
              // Nếu không tìm thấy user hoặc không kích hoạt, hiển thị thông báo lỗi
              return Promise.reject("Please Check Your information again");
            }
          })
       }
     })
     .catch(error => {
       console.error(error);
       res.status(500).json({ message: 'Server Error' });
     });
 };
 
 
//get bảng điều khiển
exports.getDashboard = (req, res, next) => {
   const userType = getDashboardType(req);
 
   if (req.session.userType === 'admin') {
     // Nếu là admin, render trang dashboard admin
     return res.render('admin/dashboard', { admin: req.session.email });
   } else if (req.session.userType=== 'worker') {
     // Nếu là worker, render trang dashboard worker
     return res.render('worker/dashboard', { worker: req.session.email });
   } else {
     // Nếu không phải admin hoặc worker, chuyển hướng hoặc hiển thị trang đăng nhập
     return res.render('admin/login', { user: "", msg: [], err: [] });
   }
 };
//get đơn hàng

exports.getDonHang = (req, res, next) => {
   if (req.session.email != undefined) {
     // Tìm tất cả đơn hàng và trả về trang donhang
     Order.find()
       .populate('items.product','name gia anh danhMuc')  // Thêm bước populate để nạp thông tin sản phẩm
       .exec()
       .then(orders => {
         res.render('admin/donhang', { admin: req.session.email, orders: orders });
       })
       .catch(error => {
         console.error('Lỗi khi truy vấn đơn hàng:', error);
         res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
       });
   } else {
     res.render('admin/login', { user: "", msg: [], err: [] });
   }
 }
 

// get khách hàng
exports.getKhachHang = (req, res, next) => {
   if (req.session.email !== undefined) {
      // Nếu người dùng đã đăng nhập, lấy dữ liệu User và render trang khách hàng
      User.find({})
         .then(users => {
            res.render('admin/khachhang', { admin: req.session.email, users });
         })
         .catch(error => {
            console.error('Lỗi khi lấy dữ liệu User:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
         });
   } else {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      res.render('admin/login', { user: "", msg: [], err: [] });
   }
};
// get liên hệ
exports.getLienHe = (req, res, next) => {
   if (req.session.email !== undefined) {
      // Nếu người dùng đã đăng nhập, tiếp tục xử lý và render trang
      Lienhe.find({})
         .then(data => {
            res.render('admin/lienhe', { admin: req.session.email, lienhe: data });
         })
         .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
         });
   } else {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      res.render('admin/login', { user: "", msg: [], err: [] });
   }
};
// get nhân viên
exports.getNhanVien = (req, res, next) => {
   if (req.session.email !== undefined) {
      // Nếu người dùng đã đăng nhập, lấy dữ liệu Worker và render trang nhân viên
      Worker.find({})
         .then(workers => {
            res.render('admin/nhanvien', { admin: req.session.email, workers });
         })
         .catch(error => {
            console.error('Lỗi khi lấy dữ liệu Worker:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
         });
   } else {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      res.render('admin/login', { user: "", msg: [], err: [] });
   }
};
//upate kích hoạt
 exports.postUpdateKichHoat=(req, res,next) => {
   const { id, kichhoat } = req.body;

   // Tìm và cập nhật trạng thái kích hoạt trong cơ sở dữ liệu
   Worker.findByIdAndUpdate(id, { kichhoat }, { new: true })
     .then(updatedWorker => {
       res.json({ success: true, updatedWorker });
     })
     .catch(error => {
       console.error('Lỗi khi cập nhật trạng thái kích hoạt:', error);
       res.status(500).json({ success: false, error: 'Internal server error' });
     });
 };

//update worker
exports.postUpdateWorker = (req, res, next) => {
   const { id } = req.params;
   const { email, password, chucvu, name, phone, diachi, ngaysinh, gioitinh, kichhoat } = req.body;

   const updateData = {
      email,
      password,
      chucvu,
      name,
      phone,
      diachi,
      ngaysinh,
      gioitinh,
      kichhoat,
   };

   Worker.findByIdAndUpdate(id, updateData, { new: true })
      .then(updatedWorker => {
         if (updatedWorker) {
            req.session.updatedWorkerData = updatedWorker;
            res.redirect('/admin/nhanvien');
            return;
         } else {
            res.status(404).json({ message: 'Không tìm thấy nhân viên' });
         }
      })
      .catch(err => {
         console.error('Lỗi cập nhật nhân viên:', err);
         res.status(500).json({ error: 'Lỗi cập nhật nhân viên' });
      });
};
// add worker 
exports.postAddWorker = (req, res, next) => {
   const { email, password, chucvu, name, phone, diachi, ngaysinh, gioitinh, kichhoat } = req.body;

   const newWorker = new Worker({
      email,
      password,
      chucvu,
      name,
      phone,
      diachi,
      ngaysinh,
      gioitinh,
      kichhoat,
   });

   newWorker.save()
      .then(addedWorker => {
         req.session.addedWorkerData = addedWorker;
         res.redirect('/admin/nhanvien');
      })
      .catch(err => {
         console.error('Lỗi thêm nhân viên:', err);
         res.status(500).json({ error: 'Lỗi thêm nhân viên' });
      });
};
// delete worker

exports.deleteWorker = (req, res, next) => {
   const { id } = req.params;

   Worker.findByIdAndDelete(id)
      .then(deletedWorker => {
         if (!deletedWorker) {
            return res.status(404).json({ success: false, error: 'Nhân viên không tồn tại' });
         }
         res.json({ success: true, deletedWorker });
      })
      .catch(error => {
         console.error('Lỗi khi xóa nhân viên:', error);
         res.status(500).json({ success: false, error: 'Internal server error' });
      });
};
//delete khách hàng
exports.deleteKhachHang = (req, res, next) => {
   const { id } = req.params;

   User.findByIdAndDelete(id)
      .then(deletedUser => {
         if (!deletedUser) {
            return res.status(404).json({ success: false, error: 'khách hàng không tồn tại' });
         }
         res.json({ success: true, deletedUser });
      })
      .catch(error => {
         console.error('Lỗi khi xóa khách hàng:', error);
         res.status(500).json({ success: false, error: 'Internal server error' });
      });
};
//get sản phẩm
exports.getSanPham = (req, res, next) => {

   if (req.session.email != undefined) {
  
     Products.find({})
       .then(products => {
     
         res.render('admin/sanpham', { user: req.session.email, products: products });
       })
       .catch(err => {
         console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
         res.status(500).json({ error: 'Lỗi khi lấy dữ liệu sản phẩm' });
       });
   } else {
   
     res.render('admin/login', { user: "", msg: [], err: [] });
   }
 };
 // thêm sản phẩm 

exports.postAddProduct = (req, res, next) => {
   const { name, anh, gia, danhMuc, moTa } = req.body;

   const newProduct = new Products({
      name,
      anh,
      gia,
      danhMuc,
      moTa,
   });

   newProduct.save()
      .then(addedProduct => {
         req.session.addedProductData = addedProduct;
         res.redirect('/admin/sanpham');
      })
      .catch(err => {
         console.error('Lỗi thêm sản phẩm:', err);
         res.status(500).json({ error: 'Lỗi thêm sản phẩm' });
      });
};

 // sửa sản phẩm 
 exports.postUpdateProduct = (req, res, next) => {
   const { id } = req.params;
   const { name, anh, gia, danhMuc, moTa } = req.body;

   const updateData = {
      name,
      anh,
      gia,
      danhMuc,
      moTa,
   };

   Products.findByIdAndUpdate(id, updateData, { new: true })
      .then(updatedProduct => {
         if (updatedProduct) {
            req.session.updatedProductData = updatedProduct;
            res.redirect('/admin/sanpham');
            return;
         } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
         }
      })
      .catch(err => {
         console.error('Lỗi cập nhật sản phẩm:', err);
         res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
      });
};
//xóa sản phẩm
exports.deleteProduct = (req, res, next) => {
   const { id } = req.params;

   Products.findByIdAndDelete(id)
      .then(deletedProduct => {
         if (!deletedProduct) {
            return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
         }
         res.json({ success: true, deletedProduct });
      })
      .catch(error => {
         console.error('Lỗi khi xóa sản phẩm:', error);
         res.status(500).json({ success: false, error: 'Internal server error' });
      });
};
exports.approveOrder = (req, res) => {
   const orderId = req.params.orderId;
   const status = req.body.status;
 
   // Tìm đơn hàng theo orderId
   Order.findById(orderId)
     .then((order) => {
       if (!order) {
         return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
       }
 
       // Tạo một bản sao của đơn hàng đã duyệt hoặc từ chối
       const approvedOrder = new ApprovedOrder({
         originalOrderId: order._id,
         fullName: order.fullName,
         address: order.address,
         phoneNumber: order.phoneNumber,
         items: order.items,
         totalAmount: order.totalAmount,
         orderPlacedAt: order.orderPlacedAt,
         paymentMethod: order.paymentMethod,
       });
 
       // Lưu trạng thái vào đơn hàng đã duyệt
       approvedOrder.status = status;
 
       // Lưu đơn hàng đã duyệt
       return approvedOrder.save();
     })
     .then((approvedOrder) => {
       // Xóa đơn hàng từ mô hình Order
       return Order.findByIdAndDelete(orderId);

     })
     .then(() => {
       res.json({ success: true, message: 'Xử lý đơn hàng thành công' });
     })
     .catch((error) => {
       console.error(error);
       res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
     });
 };
 
 //hóa đơn 


exports.getHoaDon = (req, res, next) => {
  if (req.session.email != undefined) {
    // Tìm tất cả đơn hàng đã duyệt và trả về trang donhang
    ApprovedOrder.find()
      .populate({
        path: 'items.product',
        select: 'name gia anh danhMuc', // Chỉ chọn các trường cần thiết của sản phẩm
      })
      .exec()
      .then((approvedOrders) => {
        res.render('admin/hoadon', { admin: req.session.email, orders: approvedOrders });
      })
      .catch((error) => {
        console.error('Lỗi khi truy vấn đơn hàng đã duyệt:', error);
        res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
      });
  } else {
    res.render('admin/login', { user: '', msg: [], err: [] });
  }
};
exports.getTotalAmountByDayMonthYear = (req, res, next) => {
   ApprovedOrder.aggregate([
     {
       $match: {
         status: 'approved',
       },
     },
     {
       $group: {
         _id: {
           date: { $dateToString: { format: '%Y-%m-%d', date: '$orderPlacedAt' } },
           month: { $month: '$orderPlacedAt' },
           year: { $year: '$orderPlacedAt' },
         },
         totalAmount: { $sum: { $toDouble: '$totalAmount' } },
       },
     },
     {
       $sort: {
         '_id.year': 1,
         '_id.month': 1,
         '_id.date': 1,
       },
     },
   ])
     .then(result => {
       res.json({ success: true, result });
     })
     .catch(error => {
       console.error('Lỗi khi tính tổng tiền theo ngày, tháng, năm:', error);
       res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
     });
 };
 exports.getChat = (req, res, next) => {
   if (req.session.email != undefined) {
      return res.render('admin/tinnhan', { admin: req.session.email });
   }
   else {

      res.render('admin/login', { user: "", msg: [], err: [] });
   }
}
exports.getexcel= (req, res) => {
   ApprovedOrder.find()
     .then(orders => {
       const workbook = new ExcelJS.Workbook();
       const worksheet = workbook.addWorksheet('ApprovedOrders');
 
       worksheet.columns = [
         { header: 'Mã đơn hàng', key: 'orderId' },
         { header: 'Họ và Tên', key: 'fullName' },
         { header: 'Địa chỉ', key: 'address' },
         { header: 'Số điện thoại', key: 'phoneNumber' },
         { header: 'Sản phẩm', key: 'products' },
         { header: 'Đơn giá', key: 'totalAmount' },
         { header: 'PT thanh toán', key: 'paymentMethod' },
         { header: 'Ngày đặt', key: 'orderPlacedAt' },
         { header: 'Trạng thái', key: 'status' },
       ];
 
       orders.forEach((order, index) => {
         const rowData = {
           orderId: index + 1,
           fullName: order.fullName,
           address: order.address,
           phoneNumber: order.phoneNumber,
           products: order.items.map(item => `${item.product.name}: ${item.quantity}`).join('\n'),
           totalAmount: `${order.totalAmount} VND`,
           paymentMethod: order.paymentMethod,
           orderPlacedAt: order.orderPlacedAt.toLocaleDateString(),
           status: order.status,
         };
         worksheet.addRow(rowData);
       });
 
       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
       res.setHeader('Content-Disposition', 'attachment; filename=approved_orders.xlsx');
 
       return workbook.xlsx.write(res);
     })
     .then(() => {
       res.end();
     })
     .catch(error => {
       console.error('Error exporting orders:', error);
       res.status(500).send('Internal Server Error');
     });
 };
 

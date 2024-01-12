const User = require('../models/user');
const Order = require('../models/order');
const Products = require('../models/products');
const Cart = require('../models/cart');
const Lienhe = require('../models/lienhe');
const ApprovedOrder = require('../models/approvedorder');
const ExcelJS = require('exceljs');


//get trang chủ
exports.getHome = (req, res, next) => {
  if (req.session.email != undefined) {
    return res.render('user/home', { user: req.session.email });
  }
  else {

    return res.render('user/home', { user: "", msg: [], err: [] });
  }
}
// get login
exports.getLogin = (req, res, next) => {

  res.render('user/login', { user: "", msg: [], err: [] });
}
//post login
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email, password })
    .then(user => {
      if (user) {
        // Lấy userId từ thông tin người dùng
        const userId = user._id;

        // Lưu userId vào session
        req.session.userId = userId;
        req.session.email = email;

        // Tiếp tục xử lý hoặc chuyển hướng người dùng đến trang chính
        res.render('user/home', { user: user.email });
      } else {
        res.render('user/login', { user: "", msg: [], err: ["Please Check Your information again"] });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    });
};
//get đăng kí
exports.getDangKi = (req, res, next) => {

  res.render('user/dangki', { user: "", msg: [], err: [] });
}
//get gioi thieu
exports.getGioiThieu = (req, res, next) => {
  if (req.session.email != undefined) {
    return res.render('user/gioithieu', { user: req.session.email });
  }
  else {

    res.render('user/gioithieu', { user: "", msg: [], err: [] });
  }
}
//get sản phẩm
exports.getSanPham = (req, res, next) => {

  if (req.session.email != undefined) {

    Products.find({})
      .then(products => {

        res.render('user/sanpham', { user: req.session.email, products: products });
      })
      .catch(err => {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu sản phẩm' });
      });
  } else {

    res.render('user/login', { user: "", msg: [], err: [] });
  }
};
//get liên hệ
exports.getLienHe = (req, res, next) => {

  if (req.session.email != undefined) {
    return res.render('user/lienhe', { user: req.session.email });
  }
  else {
    res.render('user/login', { user: "", msg: [], err: [] });
  }
}
//get hồ sơ


exports.getHoSo = (req, res, next) => {
  // Kiểm tra xem đã đăng nhập hay chưa
  if (req.session.email != undefined) {
    // Lấy userId từ session
    const userId = req.session.userId;

    // Tìm user theo userId
    User.findById(userId)
      .then(user => {
        if (!user) {
          // Nếu không tìm thấy user, xử lý tùy ý, ở đây mình chọn redirect về trang đăng nhập
          return res.redirect('/user/login');
        }

        // Nếu tìm thấy user, đưa thông tin user vào trang user/hoso
        res.render('user/hoso', { user1: user,user:req.session.email  });
      })
      .catch(error => {
        console.error('Error getting user information:', error);
        // Xử lý lỗi tùy ý, ở đây mình chọn redirect về trang đăng nhập
        res.redirect('/user/login');
      });
  } else {
    // Nếu chưa đăng nhập, redirect về trang đăng nhập
    res.redirect('/user/login');
  }
};

//get cart
exports.getCart = (req, res, next) => {
  if (req.session.email != undefined) {
    const userId = req.session.userId;

    // Tìm thông tin user bằng userId
    User.findById(userId)
      .exec()
      .then(user => {
        if (!user) {
          // Xử lý nếu không tìm thấy user
          return res.status(404).json({ success: false, error: 'Không tìm thấy thông tin người dùng' });
        }

        // Tìm giỏ hàng của user
        Cart.findOne({ user: userId })
          .populate('items.product', 'name gia anh danhMuc')
          .exec()
          .then(cart => {
            if (!cart) {
              return res.render('user/cart', { cartItems: [], user1: user, user: req.session.email });
            }

            res.render('user/cart', { cartItems: cart.items, user1: user, user: req.session.email, cart: cart });
          })
          .catch(error => {
            console.error('Lỗi khi truy vấn giỏ hàng:', error);
            res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
          });
      })
      .catch(error => {
        console.error('Lỗi khi truy vấn thông tin người dùng:', error);
        res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
      });
  } else {
    res.render('user/login', { user: "", msg: [], err: [] });
  }
}


//post đăng kí
exports.postDangKi = (req, res, next) => {
  const { name, email, phone, password, con_pass } = req.body;

  // Kiểm tra xem người dùng đã tồn tại chưa
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Tạo một đối tượng User mới
      const newUser = new User({
        name,
        email,
        phone,
        password,
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect('/user/dangki');
    })
    .catch(error => {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
};
//post liên hệ
exports.postLienHe = (req, res, next) => {
  const { name, email, danhgia } = req.body;

  const lienhe = new Lienhe({ name, email, danhgia });

  lienhe.save()
    .then(result => {
      // Chuyển hướng về trang /user/lienhe sau khi lưu thành công
      res.redirect('/user/lienhe');
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ success: false, error: 'Đã có lỗi xảy ra' });
    });
};

// post thêm vào giỏ hàng
exports.addToCart = (req, res, next) => {
  // Lấy userId từ thông tin người dùng trong phiên đăng nhập
  const userId = req.session.userId;

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Người dùng chưa đăng nhập' });
  }

  const { productId, quantity } = req.body;

  // Chuyển đổi quantity thành số
  const parsedQuantity = parseInt(quantity, 10);

  let cart;

  Cart.findOne({ user: userId })
    .then(foundCart => {
      cart = foundCart || new Cart({ user: userId });

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (existingItemIndex !== -1) {
        // Nếu đã tồn tại, tăng số lượng
        cart.items[existingItemIndex].quantity += parsedQuantity || 1;
      } else {
        // Nếu chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
        cart.items.push({ product: productId, quantity: parsedQuantity || 1 });
      }

      return cart.save();
    })
    .then(savedCart => {
      res.json({ success: true, cart: savedCart });
    })
    .catch(error => {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      res.status(500).json({ success: false, error: 'Lỗi thêm vào giỏ hàng', specificError: error.message });
    });

};

exports.getProducts = (req, res, next) => {
  Products.find()
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
};
//Oder
exports.postOder = (req, res) => {
  const { cartId } = req.params;
  const { paymentMethod, name, diachi, phone } = req.body;

  // Tìm giỏ hàng theo ID và đặt hàng
  Cart.findById(cartId)
    .populate('items.product','name gia anh danhMuc')  // Thêm bước populate để nạp dữ liệu của sản phẩm
    .exec()
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
      }

      // Tính tổng giá của các sản phẩm trong giỏ hàng
      const totalAmount = cart.items.reduce((total, item) => {
        const productGia = parseFloat(item.product.gia);
        const productName = item.product.name;
        console.log(productName);
        const productQuantity = parseFloat(item.quantity);

        // Kiểm tra giá trị sau khi chuyển đổi có phải là số hay không
        if (!isNaN(productGia) && !isNaN(productQuantity)) {
          return total + productGia * productQuantity;
        } else {
          console.error(`Giá trị không hợp lệ: gia=${item.product.gia}, quantity=${item.quantity}`);
          return total; // Nếu có giá trị không hợp lệ, trả về tổng không thay đổi
        }
      }, 0);

      console.log(totalAmount);

      // Tạo một đơn hàng mới
      const order = new Order({
        fullName: name,
        address: diachi,
        phoneNumber: phone,
        items: cart.items,
        totalAmount: totalAmount,
        orderPlacedAt: new Date(),
        paymentMethod: paymentMethod,
      });

      // Lưu đơn hàng
      return order.save();
    })
    .then((order) => {
      // Xóa các sản phẩm trong giỏ hàng sau khi đặt hàng thành công
      return Cart.findByIdAndUpdate(cartId, { $set: { items: [] } });
    })
    .then(() => {
      res.redirect('/user/cart');
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    });
};
// Trong file user.js hoặc nơi xử lý yêu cầu API của bạn
exports.getSearch=(req, res) => {
  const { productName } = req.query;

  // Sử dụng biểu thức chính quy để tìm kiếm sản phẩm theo tên, không phân biệt hoa thường
  const regex = new RegExp(productName, 'i');

  Products.find({ name: regex })
    .then(result => {
      res.json({ success: true, result });
    })
    .catch(error => {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
    });
};
//get history
exports.getLichSu = (req, res, next) => {
  if (req.session.email != undefined) {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Người dùng chưa đăng nhập' });
    }
   console.log(userId);
    // Tìm người dùng theo userId
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Lấy số điện thoại từ thông tin người dùng
        const userPhoneNumber = user.phone;

        // Truy vấn bảng ApprovedOrder
        ApprovedOrder.find({ phoneNumber: userPhoneNumber })
        .populate({
          path: 'items.product',
          select: 'name gia anh danhMuc', // Chỉ chọn các trường cần thiết của sản phẩm
        })
        .exec()
          .then((approvedOrders) => {
            res.render('user/lichsu', { orders:approvedOrders, user: req.session.email });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ 1' });
      });
  } else {
    res.render('user/login', { user: "", msg: [], err: [] });
  }
};
exports.getStatus = (req, res, next) => {
  if (req.session.email != undefined) {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Người dùng chưa đăng nhập' });
    }
   console.log(userId);
    // Tìm người dùng theo userId
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Lấy số điện thoại từ thông tin người dùng
        const userPhoneNumber = user.phone;

        // Truy vấn bảng ApprovedOrder
        Order.find({ phoneNumber: userPhoneNumber })
        .populate({
          path: 'items.product',
          select: 'name gia anh danhMuc', // Chỉ chọn các trường cần thiết của sản phẩm
        })
        .exec()
          .then((Order) => {
            res.render('user/status', { orders:Order, user: req.session.email });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ 1' });
      });
  } else {
    res.render('user/login', { user: "", msg: [], err: [] });
  }
};

// API endpoint to delete an order by ID
exports.deleteOder=(req, res) => {
  const orderId = req.params.orderId;

  // Check if the order exists
  Order.findByIdAndDelete(orderId)
    .then(deletedOrder => {
      if (!deletedOrder) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      res.json({ success: true, deletedOrder });
    })
    .catch(error => {
      console.error('Error deleting order:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
};
exports.updateOder= (req, res) => {
  const orderId = req.params.orderId;
  const { phoneNumber, address } = req.body;

  // Check if the order exists
  Order.findById(orderId)
    .then(existingOrder => {
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update phone number and address
      existingOrder.phoneNumber = phoneNumber || existingOrder.phoneNumber;
      existingOrder.address = address || existingOrder.address;

      // Save the updated order
      existingOrder.save()
        .then(updatedOrder => {
          // Return success response with the updated order
          res.redirect('/user/status');
        })
        .catch(error => {
          console.error('Error saving updated order:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
        });
    })
    .catch(error => {
      console.error('Error finding order:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
};
exports.postUpdateUser = (req, res, next) => {
  const { userId } = req.params;
  const { email, name, phone, diachi, ngaysinh, gioitinh } = req.body;

  const updateData = {
     email,
     name,
     phone,
     diachi,
     ngaysinh,
     gioitinh,
  };

  // Tìm người dùng và cập nhật thông tin
  User.findByIdAndUpdate(userId, updateData, { new: true })
     .then(updatedUser => {
        if (updatedUser) {
           req.session.updatedUserData = updatedUser;
           res.redirect('/user/hoso'); // Thay đổi '/path' thành đường dẫn mong muốn
        } else {
           res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
     })
     .catch(err => {
        console.error('Lỗi cập nhật người dùng:', err);
        res.status(500).json({ error: 'Lỗi cập nhật người dùng' });
     });
};
exports.changePassword = (req, res) => {
  const userId = req.params.userId;
  const { oldPassword, newPassword } = req.body;

  // Tìm người dùng theo ID
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      // Kiểm tra mật khẩu hiện tại
      if (user.password !== oldPassword) {
        return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      // Cập nhật mật khẩu mới trong cơ sở dữ liệu
      user.password = newPassword;
      return user.save();
    })
    .then(() => {
      res.redirect('/user/hoso');
    })
    .catch(error => {
      console.error('Lỗi thay đổi mật khẩu:', error);
      return res.status(500).json({ error: 'Lỗi thay đổi mật khẩu' });
    });
};
exports.deleteProductInCart = (req, res) => {
  const userId = req.session.userId; // Retrieve userId from the session

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const productId = req.params.productId;
  console.log(productId);
  console.log(userId);

  // Find the user's cart
  Cart.findOne({ user: userId })
    .then(cart => {
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Call the removeProduct method to remove the product from the cart
      return cart.removeProduct(productId);
    })
    .then(updatedCart => {
      // Assuming removeProduct method updates the cart in place
      return res.status(200).json({ message: 'Product removed from the cart successfully', updatedCart });
    })
    .catch(error => {
      console.error('Error removing product from cart:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};
exports.getProductByDanhMuc= (req, res) => {
  const category = req.params.category;

  // Hàm lấy danh sách sản phẩm dựa trên danh mục
  function getProductsByCategory(category) {
    let query = {};

    if (category !== 'all') {
      query = { danhMuc: category };
    }

    return Products.find(query);
  }

  getProductsByCategory(category)
    .then(products => res.json(products))
    .catch(error => {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};
const express = require('express');
const path = require('path');


const router = express.Router();

const userControler = require('../controllers/user');

router.route('/home')
      .get(userControler.getHome)
router.route('/login')
      .get(userControler.getLogin)
      .post(userControler.postLogin)
router.route('/dangki')
      .get(userControler.getDangKi)
router.route('/gioithieu')
      .get(userControler.getGioiThieu)
router.route('/sanpham')
      .get(userControler.getSanPham)
router.route('/lienhe')
      .get(userControler.getLienHe)
      .post(userControler.postLienHe)
router.route('/hoso')
      .get(userControler.getHoSo)
router.route('/cart')
      .get(userControler.getCart)
router.route('/dangki')
      .post(userControler.postDangKi)
router.route('/addCart')
      .post(userControler.addToCart)
router.route('/product')
      .get(userControler.getProducts)
router.route('/order/:cartId')
      .post(userControler.postOder)
router.route('/search')
      .get(userControler.getSearch)
router.route('/lichsu')
      .get(userControler.getLichSu)
router.route('/status')
      .get(userControler.getStatus)
router.route('/deleteoder/:orderId')
      .post(userControler.deleteOder)
router.route('/updateoder/:orderId')
      .post(userControler.updateOder)
router.route('/updatethongtin/:userId')
      .post(userControler.postUpdateUser)
router.route('/updatepassword/:userId')
      .post(userControler.changePassword)
router.route('/cart/remove/:productId')
      .post(userControler.deleteProductInCart)
router.route('/products/:category')
      .get(userControler.getProductByDanhMuc)








module.exports = router;

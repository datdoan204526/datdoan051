const express = require('express');
const path = require('path');


const router = express.Router();

const adminControler = require('../controllers/admin');

router.route('/login')
      .get(adminControler.getLogin)
      .post(adminControler.postLogin)
router.route('/dashboard')
      .get(adminControler.getDashboard) 
router.route('/donhang')
      .get(adminControler.getDonHang)
router.route('/sanpham')
      .get(adminControler.getSanPham)
router.route('/khachhang')
      .get(adminControler.getKhachHang)
router.route('/lienhe')
      .get(adminControler.getLienHe)
router.route('/nhanvien')
      .get(adminControler.getNhanVien)
router.route('/updateKichHoat')
      .post(adminControler.postUpdateKichHoat)
router.route('/updateWorker/:id')
      .post(adminControler.postUpdateWorker)
router.route('/addWorker')
      .post(adminControler.postAddWorker)
router.route('/deleteWorker/:id')
      .post(adminControler.deleteWorker)
router.route('/deleteKhachHang/:id')
      .post(adminControler.deleteKhachHang)
router.route('/addProduct')
      .post(adminControler.postAddProduct)
router.route('/deleteProduct/:id')
      .post(adminControler.deleteProduct)
router.route('/updateProduct/:id')
      .post(adminControler.postUpdateProduct)
router.route('/orders/:orderId/approve')
      .post(adminControler.approveOrder)
router.route('/hoadon')
      .get(adminControler.getHoaDon)
router.route('/tongtien')
      .get(adminControler.getTotalAmountByDayMonthYear)
router.route('/tinnhan')
      .get(adminControler.getChat)
router.route('/excel')
      .get(adminControler.getexcel)







module.exports = router;
 // Lấy tham chiếu đến liên kết "Logout" và thông báo xác nhận
 const logoutLink = document.getElementById("logoutLink");
 const logoutConfirmation = document.getElementById("logoutConfirmation");
 const confirmLogoutButton = document.getElementById("confirmLogout");
 const cancelLogoutButton = document.getElementById("cancelLogout");

 // Gán sự kiện click cho liên kết "Logout"
 logoutLink.addEventListener("click", function (event) {
     event.preventDefault();
     // Hiển thị thông báo xác nhận
     logoutConfirmation.style.display = "block";
 });

 // Gán sự kiện click cho nút "Đồng ý" và "Hủy"
 confirmLogoutButton.addEventListener("click", function () {
     // Thực hiện đăng xuất ở đây (chẳng hạn chuyển hướng đến trang đăng nhập)
     window.location.href = "/user/login";
 });

 cancelLogoutButton.addEventListener("click", function () {
     // Ẩn thông báo xác nhận
     logoutConfirmation.style.display = "none";
 });


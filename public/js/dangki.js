
  function validateForm() {
    var name = document.getElementsByName("name")[0].value;
    var email = document.getElementsByName("mail")[0].value;
    var phone = document.getElementsByName("phone")[0].value;
    var password = document.getElementsByName("pass")[0].value;
    var confirmPassword = document.getElementsByName("con_pass")[0].value;

    // Kiểm tra xem tất cả các trường có được điền đầy đủ không
    if (name.trim() === "" || email.trim() === "" || phone.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      alert("Vui lòng điền đầy đủ thông tin.");
      return false; // Ngăn chặn form gửi đi nếu thông tin không đầy đủ
    }

    // Kiểm tra định dạng email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Địa chỉ email không hợp lệ.");
      return false; // Ngăn chặn form gửi đi nếu địa chỉ email không hợp lệ
    }

    // Kiểm tra thêm các điều kiện khác nếu cần

    // Nếu tất cả kiểm tra đều thành công, cho phép form được gửi đi
    return true;
  }


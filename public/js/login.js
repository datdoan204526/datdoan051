
  function validateForm(event) {
    event.preventDefault(); // Ngăn chặn form gửi đi để kiểm tra trước

    var email = document.getElementsByName("mail")[0].value;
    var password = document.getElementsByName("pass")[0].value;

    // Kiểm tra điều kiện (có thể thêm các điều kiện khác)
    if (email.trim() === "" || password.trim() === "") {
      alert("Vui lòng nhập đủ thông tin.");
    } else if (!isValidEmail(email)) {
      alert("Địa chỉ email không hợp lệ.");
    } else {
      document.getElementById("loginForm").submit();
    }
  }

  // Hàm kiểm tra định dạng email
  function isValidEmail(email) {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


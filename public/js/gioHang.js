// Trong tệp JavaScript của bạn
function addToCart() {
    // Lấy giá trị số lượng từ trường nhập liệu
    const quantity = parseInt(document.getElementById('quantityInput').value);
  
    // Gửi yêu cầu POST đến API để thêm sản phẩm vào giỏ hàng
    fetch('/api/cart/add-to-cart/:productId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Giỏ hàng được cập nhật:', data);
        // Xử lý thêm vào giỏ hàng thành công
      })
      .catch(error => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        // Xử lý lỗi
      });
  }
  
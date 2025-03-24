document.addEventListener('DOMContentLoaded', function() {
    // Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      window.location.href = "shop.html";  // Redirect to shop if cart is empty
    }
  
    // Display selected service and total price
    const selectedService = cart.map(item => item.service).join(", ");
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  
    document.getElementById('selectedService').textContent = selectedService;
    document.getElementById('totalPrice').textContent = `$${totalPrice}`;
  
    // Handle form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Collect user input from the form
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
  
      // Prepare the data to send to the server
      const orderData = {
        user: {
          firstName,
          lastName,
          email
        },
        cart,
        totalPrice
      };
  
      // Send the order data to the server
      fetch('/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Your order has been placed successfully!');
          localStorage.removeItem('cart');  // Clear the cart after successful checkout
          window.location.href = '/';  // Redirect to home page
        } else {
          alert('There was an issue with your order. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
      });
    });
  });
  
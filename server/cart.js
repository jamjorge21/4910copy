function addToCart(service, price) {
    // Retrieve the current cart from localStorage, or initialize as an empty array if it doesn't exist
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Add the selected service to the cart
    cart.push({ service, price });
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Notify the user that the service has been added to the cart
    alert(`${service} has been added to your cart!`);
  
    // Optionally, ask the user if they want to proceed to checkout
    const proceedToCheckout = confirm("Would you like to check out now?");
    if (proceedToCheckout) {
      window.location.href = "checkout.html";  // Redirect to checkout page
    }
  }
  
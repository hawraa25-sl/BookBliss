document.addEventListener('DOMContentLoaded', () => {
    // Handle quantity input change and update subtotal dynamically
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const quantity = parseInt(e.target.value, 10); // Get quantity value
        const price = parseFloat(e.target.getAttribute('data-price')); // Get price from data attribute
        const cartItemId = e.target.closest('form').querySelector('input[name="cart_item_id"]').value;
        const subtotalElement = document.getElementById(`subtotal-${cartItemId}`);
  
        if (subtotalElement) {
          // Update the subtotal display for the specific item
          const newSubtotal = (price * quantity).toFixed(2);
          subtotalElement.textContent = `Subtotal: $${newSubtotal}`;
        }
  
        updateTotal(); // Update the total price for the cart
      });
    });
  
    // Function to update the total cost
    function updateTotal() {
      let total = 0;
      // Select all elements showing the subtotal for items
      document.querySelectorAll('.subtotal-price').forEach(subtotal => {
        const subtotalValue = parseFloat(subtotal.textContent.replace('Subtotal: $', ''));
        total += subtotalValue;
      });
  
      // Update the total display in the DOM
      const totalElement = document.querySelector('.cart-total h3');
      if (totalElement) {
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
      }
    }
  
    // Handle cart form submission to update the cart on the backend
    document.querySelectorAll('.btn-update').forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const formData = new FormData(form);
  
        try {
          const response = await fetch('/cart/update', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            // Optionally, update the cart dynamically instead of reloading the page
            const updatedCart = await response.json();
            updateCartDisplay(updatedCart);
          } else {
            alert('Failed to update the cart');
          }
        } catch (error) {
          console.error('Error updating the cart:', error);
        }
      });
    });
  
    // Function to dynamically update the cart display without page reload
    function updateCartDisplay(updatedCart) {
      updatedCart.items.forEach(item => {
        const subtotalElement = document.getElementById(`subtotal-${item.cart_item_id}`);
        if (subtotalElement) {
          subtotalElement.textContent = `Subtotal: $${(item.price * item.quantity).toFixed(2)}`;
        }
      });
  
      updateTotal(); // Update the cart total
    }
  });
  
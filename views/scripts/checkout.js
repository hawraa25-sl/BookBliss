document.addEventListener('DOMContentLoaded', function() {
  const cardFields = document.querySelector('.card-fields');
  const giftCardFields = document.querySelector('.gift-card-fields');
  const paymentInputs = document.querySelectorAll('input[name="payment_method"]');
  
  // Function to toggle payment fields visibility
  function togglePaymentFields() {
    const selectedPayment = document.querySelector('input[name="payment_method"]:checked').value;
    
    // Handle Card fields
    if (selectedPayment === 'Card') {
      cardFields.style.display = 'block';
      giftCardFields.style.display = 'none';
      cardFields.querySelectorAll('input').forEach(input => input.required = true);
      giftCardFields.querySelectorAll('input').forEach(input => input.required = false);
    } 
    // Handle Gift Card fields
    else if (selectedPayment === 'Gift Card') {
      cardFields.style.display = 'none';
      giftCardFields.style.display = 'block';
      cardFields.querySelectorAll('input').forEach(input => input.required = false);
      giftCardFields.querySelectorAll('input').forEach(input => input.required = true);
    }
    // Handle Cash option
    else {
      cardFields.style.display = 'none';
      giftCardFields.style.display = 'none';
      cardFields.querySelectorAll('input').forEach(input => input.required = false);
      giftCardFields.querySelectorAll('input').forEach(input => input.required = false);
    }
  }

  // Add event listeners to payment method radio buttons
  paymentInputs.forEach(input => {
    input.addEventListener('change', togglePaymentFields);
  });
});
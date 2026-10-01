export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TUVhZYoNCQgrZn';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay Checkout modal
 * @param {Object} options
 * @param {number} options.amount - Amount in Rupees
 * @param {string} options.orderId - Internal or Razorpay order id
 * @param {string} options.name - Customer Name
 * @param {string} options.email - Customer Email
 * @param {string} options.phone - Customer Phone
 * @param {string} options.description - Payment description
 * @returns {Promise<{success: boolean, paymentId?: string, error?: string}>}
 */
export const openRazorpayCheckout = async ({
  amount,
  orderId = '',
  name = '',
  email = '',
  phone = '',
  description = 'Ayurvedic Wellness Order'
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // in paise (e.g. 500 INR = 50000 paise)
      currency: 'INR',
      name: 'AyurVeda',
      description: description,
      image: '/vite.svg', // or logo
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      notes: {
        orderId: orderId,
        store: 'AyurVeda Wellness Store'
      },
      theme: {
        color: '#2d6a4f' // Brand dark green
      },
      modal: {
        ondismiss: function () {
          resolve({ success: false, dismissed: true, message: 'Payment window was closed' });
        }
      },
      handler: function (response) {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      resolve({
        success: false,
        error: response.error?.description || 'Payment transaction failed'
      });
    });
    rzp.open();
  });
};

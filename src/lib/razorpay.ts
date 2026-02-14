// Razorpay Helper

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: RazorpayResponse) => void;
  onFailure: (error: any) => void;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Load Razorpay script dynamically
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Open Razorpay payment modal
export async function openRazorpayCheckout({
  orderId,
  amount,
  currency = 'INR',
  name = 'Helmet',
  description = 'Helmet Purchase',
  prefill,
  onSuccess,
  onFailure,
}: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();

  if (!loaded) {
    onFailure(new Error('Failed to load Razorpay SDK'));
    return;
  }

  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!key) {
    onFailure(new Error('Payment gateway not configured'));
    return;
  }

  const options = {
    key,
    amount,
    currency,
    name,
    description,
    order_id: orderId,
    prefill: {
      name: prefill?.name || '',
      email: prefill?.email || '',
      contact: prefill?.contact || '',
    },
    theme: {
      color: '#0A0A0A',
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error('Payment cancelled by user'));
      },
      confirm_close: true,
      escape: true,
    },
    handler: (response: RazorpayResponse) => {
      onSuccess(response);
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      const err = response.error;
      onFailure(err);
    });
    rzp.open();
  } catch (err) {
    onFailure(err);
  }
}

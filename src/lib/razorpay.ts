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
    config: {
      display: {
        blocks: {
          upi: { name: 'Pay via UPI', instruments: [{ method: 'upi' }] },
          other: { name: 'Other Methods', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }] },
        },
        sequence: ['block.upi', 'block.other'],
        preferences: { show_default_blocks: true },
      },
    },
    theme: {
      color: '#f97316',
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
    console.log('Razorpay options:', { key, amount, currency, order_id: orderId });
    rzp.on('payment.failed', (response: any) => {
      const err = response.error;
      console.error('Razorpay payment.failed:', err);
      onFailure(err);
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay open error:', err);
    onFailure(err);
  }
}

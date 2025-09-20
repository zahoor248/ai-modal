"use client";
import { useEffect } from "react";

interface PaddleCheckoutButtonProps {
  productId?: string;
  planName?: string;
  priceDisplay?: string;
}

export default function CheckoutButton({
  productId,
  planName,
  priceDisplay
}: PaddleCheckoutButtonProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js"; // v2 for new checkout
    script.onload = () => {
      // @ts-ignore
      Paddle.Environment.set("sandbox");
      // @ts-ignore
      Paddle.Initialize({ token: "test_01c675cb6f87321cb49f750cd8d" }); // use your client-side token
    };
    document.body.appendChild(script);
  }, []);

  const checkout = () => {
    // @ts-ignore
    Paddle.Checkout.open({
      items: [{ priceId: "pri_01k5hza669z2a8mz8jnsmj0djh", quantity: 1 }],
      customer: {
        email: "test@example.com",
      },
      settings: {
        successUrl: "https://yourdomain.com/checkout/success",
        cancelUrl: "http://example.com/checkout/cancel", // 🚨 required
      },
      successCallback: (data: any) => {
        console.log("✅ Payment success:", data);
      },
      closeCallback: () => {
        console.log("❌ Checkout closed");
      },
    });
  };

  return (
    <button
      onClick={checkout}
      className="px-6 py-3 bg-black text-white rounded-lg"
    >
      {priceDisplay || "Buy Now"}
    </button>
  );
}

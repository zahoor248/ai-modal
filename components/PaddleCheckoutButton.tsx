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
      const environment = process.env.NODE_ENV === "production" ? "production" : "sandbox";
      Paddle.Environment.set(environment);
      // @ts-ignore
      const token = process.env.NODE_ENV === "production" 
        ? process.env.NEXT_PUBLIC_PADDLE_TOKEN 
        : "test_01c675cb6f87321cb49f750cd8d";
      Paddle.Initialize({ token });
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
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/checkout/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/checkout/cancel`,
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

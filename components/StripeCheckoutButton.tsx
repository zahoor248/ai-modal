"use client";

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useToast } from "@/lib/toast";

interface StripeCheckoutButtonProps {
  planName: string;
  priceDisplay: string;
  priceId: string;
  amount: number;
}

export default function StripeCheckoutButton({
  planName,
  priceDisplay,
  priceId,
  amount
}: StripeCheckoutButtonProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          planName,
          priceId 
        }),
      });
      
      const data = await response.json();
      
      if (data.clientSecret) {
        setShowPayment(true);
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?plan=${encodeURIComponent(planName)}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (showPayment) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-background/50 rounded-lg border border-border/50">
          <h3 className="font-semibold mb-2">{planName}</h3>
          <p className="text-sm text-foreground/70 mb-4">{priceDisplay}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <button
              type="submit"
              disabled={!stripe || isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : `Subscribe to ${planName}`}
            </button>
          </form>
        </div>
        <button
          onClick={() => setShowPayment(false)}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          ← Back to plans
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleInitiatePayment}
      disabled={isLoading}
      className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Loading...' : priceDisplay}
    </button>
  );
}
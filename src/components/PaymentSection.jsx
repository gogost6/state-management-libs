import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import {
  useCheckoutMutation,
  useDownloadCalendarMutation,
  useGetCalendarStatusQuery,
} from "../features/payment/paymentApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentSection() {
  const {
    data: statusData,
    isLoading: statusLoading,
    refetch,
  } = useGetCalendarStatusQuery();
  const [checkout, { isLoading: checkoutLoading }] = useCheckoutMutation();
  const [downloadCalendar, { isLoading: downloadLoading }] =
    useDownloadCalendarMutation();
  const [clientSecret, setClientSecret] = useState(null);
  const [buyError, setBuyError] = useState(null);

  const handleBuy = async () => {
    setBuyError(null);
    try {
      const result = await checkout().unwrap();
      setClientSecret(result.clientSecret);
    } catch (err) {
      setBuyError(err?.data?.message || "Checkout failed.");
    }
  };

  const handleDownload = async () => {
    try {
      await downloadCalendar().unwrap();
    } catch {
      // download errors handled by browser
    }
  };

  const purchased = statusData?.purchased;

  return (
    <div className="card">
      <p className="eyebrow">Calendar Shop</p>
      <h2>Cat Calendar</h2>

      {statusLoading ? (
        <p className="subtext">Checking purchase status…</p>
      ) : (
        <p className="subtext">
          Status: <strong>{purchased ? "Purchased ✓" : "Not purchased"}</strong>
        </p>
      )}

      {!purchased && !clientSecret && (
        <div style={{ marginTop: 12 }}>
          <button
            className="primary"
            onClick={handleBuy}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "Loading…" : "Buy Calendar"}
          </button>
          {buyError && <p className="status error">{buyError}</p>}
        </div>
      )}

      {clientSecret && (
        <div style={{ marginTop: 16 }}>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              clientSecret,
              onComplete: () => {
                setClientSecret(null);
                refetch();
              },
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
          <button
            style={{ marginTop: 8 }}
            onClick={() => setClientSecret(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {purchased && (
        <div style={{ marginTop: 12 }}>
          <button onClick={handleDownload} disabled={downloadLoading}>
            {downloadLoading ? "Downloading…" : "Download PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

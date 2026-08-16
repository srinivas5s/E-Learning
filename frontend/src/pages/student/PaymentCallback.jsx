import { useSearchParams, Link } from "react-router-dom";

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("razorpay_payment_id");
    const hasError = searchParams.get("error");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
            style={{ backgroundColor: "var(--color-bg)" }}>
            <span className="text-5xl">{hasError ? "⚠️" : "⏳"}</span>
            <h1 className="text-xl font-bold text-center"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
                {hasError ? "Payment didn't go through" : "Payment submitted"}
            </h1>
            <p className="text-sm text-center max-w-sm" style={{ color: "var(--color-text-muted)" }}>
                {hasError
                    ? "Something went wrong during payment. No charge was completed."
                    : "We're confirming this with our payment provider. This page does not yet reflect final payment status."}
            </p>
            {paymentId && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Reference: {paymentId}
                </p>
            )}
            <Link to="/my-courses" className="btn-primary px-6 py-2.5 text-sm rounded-xl mt-2"
                style={{ backgroundColor: "var(--color-primary)" }}>
                Go to My Courses
            </Link>
        </div>
    );
};

export default PaymentCallback;
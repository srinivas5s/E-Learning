import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetCourseBySlug } from "../../../services/useCourse.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import paymentApi from "../../../api/payment.api.js";
import { loadRazorpayScript } from "../../../utils/loadRazorpayScript.js";
import { loadRazorpayCustomScript } from "../../../utils/loadRazorpayCustomScript.js";
import { NETBANKING_BANKS } from "../../../constants/bankList.js";
import { formatPrice } from "../../../constants/courseConstants.js";

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Checkout = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { course, loading: courseLoading, fetch } = useGetCourseBySlug();

    const [orderData, setOrderData] = useState(null);
    const [orderLoading, setOrderLoading] = useState(true);
    const [orderError, setOrderError] = useState(null);

    const [method, setMethod] = useState("upi");
    const [selectedBank, setSelectedBank] = useState(NETBANKING_BANKS[0].code);
    const [processing, setProcessing] = useState(false);

    useEffect(() => { fetch(slug); }, [slug]);

    useEffect(() => {
        if (!course?._id) return;
        setOrderLoading(true);
        paymentApi.createOrder(course._id)
            .then((res) => setOrderData(res.data.data))
            .catch((err) => setOrderError(err.response?.data?.message || "Couldn't start checkout"))
            .finally(() => setOrderLoading(false));
    }, [course?._id]);

    // ── UPI — Custom Checkout, intent flow, no VPA collection ────────────────
    const handlePayUPI = async () => {
        if (processing) return;
        setProcessing(true);

        const loaded = await loadRazorpayCustomScript();
        if (!loaded) {
            toast.error("Couldn't load the payment SDK. Please try again.");
            setProcessing(false);
            return;
        }

        const razorpay = new window.Razorpay({ key: orderData.keyId });

        razorpay.createPayment({
            order_id: orderData.orderId,
            amount: orderData.amount,
            currency: orderData.currency,
            email: user?.email || "",
            contact: user?.phone || "",
            method: "upi",
            "upi.flow": "intent",
        });

        // Custom Checkout's success/failure is delivered via events on the
        // instance, not a promise — attach listeners before calling createPayment
        // in production; for this phase we surface the generic pending state
        // and rely on Phase 5D + webhook to reconcile actual outcome.
        toast("Redirecting to your UPI app…", { icon: "📱" });
        setProcessing(false);
    };

    // ── Net Banking — Custom Checkout, redirect-based via callback_url ───────
    const handlePayNetbanking = async () => {
        if (processing) return;
        setProcessing(true);

        const loaded = await loadRazorpayCustomScript();
        if (!loaded) {
            toast.error("Couldn't load the payment SDK. Please try again.");
            setProcessing(false);
            return;
        }

        const razorpay = new window.Razorpay({ key: orderData.keyId, redirect: true });

        razorpay.createPayment({
            order_id: orderData.orderId,
            amount: orderData.amount,
            currency: orderData.currency,
            email: user?.email || "",
            contact: user?.phone || "",
            method: "netbanking",
            bank: selectedBank,
            callback_url: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/payments/callback`,
            redirect: true,
        });
        // Full-page redirect follows — no further client code runs here.
    };

    // ── Card — Standard Checkout popup, card-only, opened only on explicit click
    const handlePayCard = async () => {
        if (processing) return;
        setProcessing(true);

        const loaded = await loadRazorpayScript();
        if (!loaded) {
            toast.error("Couldn't load the payment gateway. Please try again.");
            setProcessing(false);
            return;
        }

        const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.orderId,
            name: "LearnFlow",
            description: orderData.courseName,
            method: { card: true, netbanking: false, upi: false, wallet: false, emi: false, paylater: false },
            prefill: { name: user?.name || "", email: user?.email || "" },
            theme: { color: "#6366f1" },
            handler: function () {
                // Not trusted as proof of payment — Phase 5D verifies server-side.
                toast.success("Payment submitted");
                setProcessing(false);
                navigate("/payment/callback");
            },
            modal: {
                ondismiss: function () {
                    toast("Payment cancelled", { icon: "ℹ️" });
                    setProcessing(false);
                },
            },
        };

        try {
            new window.Razorpay(options).open();
        } catch {
            toast.error("Couldn't open the card payment window.");
            setProcessing(false);
        }
    };

    const handlePay = () => {
        if (method === "upi") return handlePayUPI();
        if (method === "netbanking") return handlePayNetbanking();
        if (method === "card") return handlePayCard();
    };

    if (courseLoading || orderLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <span className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }} />
            </div>
        );
    }

    if (orderError || !course) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <p className="text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
                    {orderError || "Course not found"}
                </p>
                <button onClick={() => navigate(`/courses/${slug}`)}
                    className="btn-primary px-5 py-2.5 text-sm rounded-xl mt-2"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                    Back to Course
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Payment method panel ────────────────────────────────── */}
                <div className="lg:col-span-2 rounded-2xl p-6"
                    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                    <h1 className="text-lg font-bold mb-5"
                        style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                        Checkout
                    </h1>

                    {/* Method tabs */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: "upi", label: "UPI" },
                            { id: "card", label: "Card" },
                            { id: "netbanking", label: "Net Banking" },
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMethod(m.id)}
                                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150"
                                style={{
                                    backgroundColor: method === m.id ? "var(--color-primary)" : "transparent",
                                    color: method === m.id ? "#fff" : "var(--color-text-muted)",
                                    border: `1px solid ${method === m.id ? "var(--color-primary)" : "var(--color-border)"}`,
                                }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Method-specific content */}
                    {method === "upi" && (
                        <div className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                            You'll be redirected to your UPI app to complete the payment.
                        </div>
                    )}

                    {method === "netbanking" && (
                        <div className="mb-6">
                            <label className="form-label">Select your bank</label>
                            <select
                                className="input-field"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                            >
                                {NETBANKING_BANKS.map((b) => (
                                    <option key={b.code} value={b.code}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {method === "card" && (
                        <div className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                            Card details are entered securely inside Razorpay's payment window — never on this page.
                        </div>
                    )}

                    <button
                        onClick={handlePay}
                        disabled={processing}
                        className="btn-primary w-full py-3 text-sm font-bold rounded-xl"
                        style={{ backgroundColor: "var(--color-primary)", opacity: processing ? 0.7 : 1 }}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing…
                            </span>
                        ) : (
                            `Pay ${formatPrice(orderData.amount / 100)}`
                        )}
                    </button>
                </div>

                {/* ── Order summary ───────────────────────────────────────── */}
                <div className="rounded-2xl p-6 h-fit"
                    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                        {course.thumbnail?.url ? (
                            <img src={course.thumbnail.url} alt={course.title}
                                className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        ) : (
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0"
                                style={{ backgroundColor: "rgba(99,102,241,0.08)" }}>📚</div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold line-clamp-2" style={{ color: "var(--color-text-heading)" }}>
                                {course.title}
                            </p>
                            {course.instructor && (
                                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                    by {course.instructor.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-sm"
                        style={{ borderTop: "1px solid var(--color-border)" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Total</span>
                        <span className="font-bold" style={{ color: "var(--color-text-heading)" }}>
                            {formatPrice(orderData.amount / 100)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        <CheckIcon /> Secured by Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
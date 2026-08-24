import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetCourseBySlug } from "../../services/useCourse.js";
import { useAuth } from "../../context/AuthContext.jsx";
import paymentApi from "../../api/payment.api.js";
import { loadRazorpayScript } from "../../utils/loadRazorpayScript.js";
import { formatPrice } from "../../constants/courseConstants.js";

const CheckIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Checkout = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        course,
        loading: courseLoading,
        fetch,
    } = useGetCourseBySlug();

    const [processing, setProcessing] = useState(false);
    const [payError, setPayError] = useState(null);

    useEffect(() => {
        fetch(slug);
    }, [slug]);

    const handlePayWithCard = async () => {
        if (processing) return;

        setProcessing(true);
        setPayError(null);

        try {
            // 1. Load Razorpay Standard Checkout
            const loaded = await loadRazorpayScript();

            if (!loaded) {
                throw new Error(
                    "Unable to load Razorpay. Please check your internet connection and try again."
                );
            }

            // 2. Create order from backend
            const response = await paymentApi.createOrder(course._id);
            const orderData = response.data.data;

            if (!orderData?.orderId) {
                throw new Error("Invalid payment order received from server.");
            }

            // 3. Razorpay Standard Checkout
            const options = {
                key: orderData.keyId,

                amount: orderData.amount,
                currency: orderData.currency,

                name: "Your LMS",
                description: course.title,

                order_id: orderData.orderId,

                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },

                notes: {
                    courseId: course._id,
                },

                // theme: {
                //     color: "var(--color-primary)",
                // },
                
                theme: {
                    color: "#6366f1"
                },

                method: {
                    card: true,
                    upi: false,
                    netbanking: false,
                    wallet: false,
                },

                handler: function (response) {
                    console.log(
                        "Razorpay payment response:",
                        response
                    );

                    /*
                     * IMPORTANT:
                     * Do NOT consider the payment successful here.
                     *
                     * Phase 5D will send these values to the backend
                     * for signature verification.
                     */

                    toast.success("Payment submitted — verification pending.");

                    setProcessing(false);

                    navigate("/payment/callback", {
                        state: {
                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_order_id:
                                response.razorpay_order_id,

                            razorpay_signature:
                                response.razorpay_signature,

                            courseId: course._id,
                            courseSlug: course.slug,
                        },
                    });
                },

                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                        toast("Payment cancelled", {
                            icon: "ℹ️",
                        });
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.error(
                    "Razorpay payment failed:",
                    response.error
                );

                toast.error(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );

                setProcessing(false);
            });

            razorpay.open();
        } catch (error) {
            console.error("Payment initialization error:", error);

            const message =
                error.response?.data?.message ||
                error.message ||
                "Unable to start payment.";

            setPayError(message);
            toast.error(message);

            setProcessing(false);
        }
    };

    if (courseLoading) {
        return (
            <div
                className="flex items-center justify-center py-24"
                style={{ backgroundColor: "var(--color-bg)" }}
            >
                <span
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{
                        borderColor: "var(--color-border)",
                        borderTopColor: "var(--color-primary)",
                    }}
                />
            </div>
        );
    }

    if (!course) {
        return (
            <div
                className="flex flex-col items-center justify-center py-24 text-center px-4"
                style={{ backgroundColor: "var(--color-bg)" }}
            >
                <p
                    className="text-sm font-medium mb-2"
                    style={{ color: "var(--color-text)" }}
                >
                    Course not found
                </p>

                <button
                    onClick={() => navigate("/courses")}
                    className="btn-primary px-5 py-2.5 text-sm rounded-xl mt-2"
                    style={{
                        backgroundColor: "var(--color-primary)",
                    }}
                >
                    Browse Courses
                </button>
            </div>
        );
    }

    const displayPrice =
        course.discountPrice > 0
            ? course.discountPrice
            : course.price;

    return (
        <div
            className="min-h-screen py-8 px-4 sm:px-6"
            style={{ backgroundColor: "var(--color-bg)" }}
        >
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Checkout */}
                <div
                    className="lg:col-span-2 rounded-2xl p-6"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <h1
                        className="text-lg font-bold mb-2"
                        style={{
                            color: "var(--color-text-heading)",
                            fontFamily: "var(--font-heading)",
                        }}
                    >
                        Checkout
                    </h1>

                    <p
                        className="text-sm mb-6"
                        style={{
                            color: "var(--color-text-muted)",
                        }}
                    >
                        Complete your payment securely using Razorpay.
                    </p>

                    {/* Payment method */}
                    <div
                        className="rounded-xl p-4 mb-5"
                        style={{
                            backgroundColor: "var(--color-bg-input)",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className="text-sm font-semibold"
                                    style={{
                                        color: "var(--color-text-heading)",
                                    }}
                                >
                                    Card Payment
                                </p>

                                <p
                                    className="text-xs mt-1"
                                    style={{
                                        color: "var(--color-text-muted)",
                                    }}
                                >
                                    Secure payment powered by Razorpay
                                </p>
                            </div>

                            <span className="text-2xl">
                                💳
                            </span>
                        </div>
                    </div>

                    {payError && (
                        <div className="error-msg mb-4">
                            {payError}
                        </div>
                    )}

                    <button
                        onClick={handlePayWithCard}
                        disabled={processing}
                        className="btn-primary w-full py-3 text-sm font-bold rounded-xl"
                        style={{
                            backgroundColor: "var(--color-primary)",
                            opacity: processing ? 0.7 : 1,
                        }}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Opening secure payment…
                            </span>
                        ) : (
                            `Pay ${formatPrice(displayPrice)}`
                        )}
                    </button>

                    <p
                        className="text-xs text-center mt-4"
                        style={{
                            color: "var(--color-text-muted)",
                        }}
                    >
                        You will be redirected to Razorpay's secure
                        payment interface for card entry.
                    </p>
                </div>

                {/* Course summary */}
                <div
                    className="rounded-2xl p-6 h-fit"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        {course.thumbnail?.url ? (
                            <img
                                src={course.thumbnail.url}
                                alt={course.title}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />
                        ) : (
                            <div
                                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0"
                                style={{
                                    backgroundColor:
                                        "rgba(99,102,241,0.08)",
                                }}
                            >
                                📚
                            </div>
                        )}

                        <div className="min-w-0">
                            <p
                                className="text-sm font-semibold line-clamp-2"
                                style={{
                                    color: "var(--color-text-heading)",
                                }}
                            >
                                {course.title}
                            </p>

                            {course.instructor && (
                                <p
                                    className="text-xs mt-1"
                                    style={{
                                        color: "var(--color-text-muted)",
                                    }}
                                >
                                    by {course.instructor.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div
                        className="pt-4 flex items-center justify-between text-sm"
                        style={{
                            borderTop:
                                "1px solid var(--color-border)",
                        }}
                    >
                        <span
                            style={{
                                color: "var(--color-text-muted)",
                            }}
                        >
                            Total
                        </span>

                        <span
                            className="font-bold"
                            style={{
                                color: "var(--color-text-heading)",
                            }}
                        >
                            {formatPrice(displayPrice)}
                        </span>
                    </div>

                    <div
                        className="flex items-center gap-2 mt-4 text-xs"
                        style={{
                            color: "var(--color-text-muted)",
                        }}
                    >
                        <CheckIcon />
                        Secured by Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
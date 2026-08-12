let scriptPromise = null;

export const loadRazorpayScript = () => {
    if (window.Razorpay) return Promise.resolve(true);
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => {
            scriptPromise = null; // allow a retry on next attempt if it failed
            resolve(false);
        };
        document.body.appendChild(script);
    });

    return scriptPromise;
};
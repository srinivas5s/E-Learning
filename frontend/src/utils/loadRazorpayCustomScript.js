let customScriptPromise = null;

export const loadRazorpayCustomScript = () => {
    if (customScriptPromise) return customScriptPromise;

    customScriptPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/razorpay.js";
        script.onload = () => resolve(true);
        script.onerror = () => {
            customScriptPromise = null;
            resolve(false);
        };
        document.body.appendChild(script);
    });

    return customScriptPromise;
};
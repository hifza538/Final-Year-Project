import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import { verifyOtp, forgotPassword } from "../api/authapi";

const OtpVerify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  // Get email from localStorage
  const email = localStorage.getItem("resetEmail");


  /*   Redirect if user reaches here without email    */

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Handle OTP input typing
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace behavior
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste of full OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });

    setOtp(newOtp);
  };

  // Verify OTP submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp({ email, otp: otpCode });

      // Store OTP for reset password step
      localStorage.setItem("resetOtp", otpCode);

      alert("OTP verified successfully!");
      navigate("/reset-password");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setError("");

      await forgotPassword({ email });
      alert("OTP resent successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your identity"
      subtitle="OTP Verification"
      benefits={[
        "Secure OTP verification",
        "One-time password for safety",
        "Reset your password securely",
      ]}
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-black text-slate-900">Enter OTP</h3>
          <p className="mt-2 text-sm text-slate-500">
            We've sent a 6-digit code to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-14 w-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 sm:h-16 sm:w-14"
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Didn't receive code?
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="ml-1 font-semibold text-orange-500 hover:underline disabled:opacity-60"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default OtpVerify;
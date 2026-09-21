// customer-frontend/src/pages/VerifyEmail.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail, resendVerification } from "../services/authService";
import AuthLayout from "../components/layout/AuthLayout";
import { showSuccessToast, showErrorToast } from "../utils/toast";

// Status of the verification attempt itself
const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
};

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [errorMessage, setErrorMessage] = useState("");

  // Resend-link mini form, only shown if verification failed
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const runVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "This verification link is invalid or has expired."
        );
        setStatus(STATUS.ERROR);
      }
    };
    runVerification();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    try {
      await resendVerification(resendEmail.trim().toLowerCase());
      setResendSent(true);
      showSuccessToast("If that email is registered and unverified, a new link has been sent.");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {status === STATUS.VERIFYING && (
          <>
            <div className="bg-primary-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={26} className="text-primary animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h1>
            <p className="text-gray-500 text-sm">This will only take a moment.</p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={26} className="text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your account is now active. You can log in and start ordering.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 bg-primary text-white font-semibold rounded-full
                         hover:bg-primary-dark transition-colors duration-200"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={26} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>

            {!resendSent ? (
              <form onSubmit={handleResend} className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Get a new verification link
                </label>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm mb-3
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full py-2.5 bg-primary text-white font-semibold rounded-full
                             hover:bg-primary-dark transition-colors duration-200
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isResending ? "Sending..." : "Resend Verification Link"}
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                Check your inbox for the new link, then come back here.
              </p>
            )}

            <Link to="/login" className="inline-block mt-6 text-primary font-medium hover:underline text-sm">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
// vendor-frontend/src/pages/VerifyEmail.jsx

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import InputField from "../components/common/InputField";
import AuthLayout from "../components/layout/AuthLayout";
import { verifyEmail, resendVerification } from "../services/authService";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
};

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [errorMessage, setErrorMessage] = useState("");

  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState("");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
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
    setResendError("");
    try {
      await resendVerification(resendEmail.trim().toLowerCase());
      setResendSent(true);
    } catch (err) {
      setResendError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      heading={<>Verify your<br />email.</>}
      subtext="One quick step before your restaurant can start receiving orders."
    >
      <div className="text-center">
        {status === STATUS.VERIFYING && (
          <>
            <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={26} className="text-primary animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h1>
            <p className="text-gray-500 text-sm">This will only take a moment.</p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={26} className="text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your email is confirmed. Once admin approves your account, you'll be able to log in.
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={26} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>

            {!resendSent ? (
              <form onSubmit={handleResend} className="text-left">
                <InputField
                  label="Get a new verification link"
                  name="resendEmail"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                  error={resendError}
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full flex items-center justify-center gap-2
                    bg-primary hover:bg-primary-dark disabled:bg-primary/50
                    text-white font-semibold py-2.5 rounded-lg text-sm
                    transition-colors mt-2"
                >
                  {isResending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Link"
                  )}
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
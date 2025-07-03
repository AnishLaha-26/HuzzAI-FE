import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResetForm from "../components/ResetForm";
import "./ResetPage.css";

export default function ResetPage() {
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // In a real app, you might want to verify the token with your backend
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Here you would typically make an API call to verify the token
        // For now, we'll just check if the token exists and has a valid format
        if (token && token.length > 10) { // Simple validation
          setIsValidToken(true);
        } else {
          setError("Invalid or expired reset link.");
          setIsValidToken(false);
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError("An error occurred while verifying your reset link.");
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isLoading) {
    return (
      <div className="reset-page">
        <div className="glass-form">
          <div className="branding">
            <h1 className="login-title">Resetting Password</h1>
          </div>
          <p className="reset-instructions">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="reset-page">
        <div className="glass-form">
          <div className="branding">
            <h1 className="login-title">Reset Password</h1>
          </div>
          <div className="error-message">{error || "This password reset link is invalid or has expired."}</div>
          <p className="back-to-login">
            Please request a new password reset link from the <a href="/forgot-password" className="text-link">forgot password</a> page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page">
      <div className="glass-form">
        <div className="branding">
          <h1 className="login-title">Reset Password</h1>
        </div>
        <p className="reset-instructions">
          Please enter your new password below.
        </p>
        
        <ResetForm />
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../auth.api";

export default function ResetForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const uidb64 = searchParams.get('uidb64');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [linkValid, setLinkValid] = useState(false);

  // Validate reset link on component mount
  useEffect(() => {
    const validateResetLink = async () => {
      if (!uidb64 || !token) {
        setError("Invalid or missing reset link parameters");
        setLoading(false);
        return;
      }

      try {
        await authAPI.checkResetLink(uidb64, token);
        setLinkValid(true);
      } catch (err: any) {
        setError(err.message || "This password reset link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };

    validateResetLink();
  }, [uidb64, token]);

  // Don't show the form if the link is invalid
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Validating reset link...</p>
      </div>
    </div>;
  }

  if (!linkValid) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
      <p className="text-red-700">{error || 'This password reset link is invalid or has expired.'}</p>
      <button
        onClick={() => navigate('/forgot-password')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Request New Reset Link
      </button>
    </div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (!uidb64 || !token) {
      setError("Invalid or missing reset token");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await authAPI.resetPassword(uidb64, token, newPassword);
      setSuccess("Your password has been reset successfully!");
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.new_password) {
        setError(err.response.data.new_password[0]);
      } else {
        setError('An error occurred while resetting your password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="glass-input"
          placeholder="Enter your new password"
        />
        <label className="show-password">
          <input 
            type="checkbox" 
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">Confirm New Password</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="glass-input"
          placeholder="Confirm your new password"
        />
        <label className="show-password">
          <input 
            type="checkbox" 
            checked={showConfirmPassword}
            onChange={(e) => setShowConfirmPassword(e.target.checked)}
          />
          Show password
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="login-button"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submission started');
    e.preventDefault();
    
    // Basic email validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      console.log('Attempting to send password reset email to:', email);
      // Navigate to the create new account message page
      navigate('/forgot-password/message');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      // Show a user-friendly error message
      setError(err.message || "An error occurred while processing your request. Please try again.");
      setLoading(false);
    }
  };

  // Debug: Log when component renders
  console.log('ForgotForm rendering. Current state:', { email, loading, error, success });

  return (
    <form 
      onSubmit={(e) => {
        console.log('Form onSubmit triggered');
        handleSubmit(e);
      }}
    >
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            console.log('Email input changed:', e.target.value);
            setEmail(e.target.value);
          }}
          required
          className="glass-input"
          placeholder="Enter your email address"
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">Error: {error}</div>}
      {success && <div className="success-message">Success: {success}</div>}

      <div style={{ marginTop: '20px' }}>
        <button
          type="submit"
          disabled={loading}
          className="login-button"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>

      <div className="back-to-login">
        Remember your password?{' '}
        <button 
          type="button" 
          onClick={() => navigate('/login')} 
          className="text-link"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}

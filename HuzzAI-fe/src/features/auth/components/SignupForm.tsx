import { useState } from "react";
import { authAPI, type RegisterData } from "../auth.api";
import { useAuth } from "../userauth";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const { setAuth } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to register user...', {
        email,
        password: password ? '[PROVIDED]' : '[MISSING]',
        password2: confirmPassword ? '[PROVIDED]' : '[MISSING]',
        first_name: firstName,
        last_name: lastName
      });
      
      const registerData: RegisterData = {
        email,
        password,
        password2: confirmPassword,
        first_name: firstName,
        last_name: lastName
      };
      
      const response = await authAPI.register(registerData).catch(error => {
        console.error('Registration error:', error);
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to the server. Please check your internet connection and ensure the backend is running.');
        }
        throw error;
      });
      
      console.log('Registration response:', response);
      
      // Set auth with the correct format including refresh token
      setAuth({
        accessToken: response.access,
        refresh: response.refresh,
        user: response.user || {
          id: 0,
          email: email,
          first_name: firstName,
          last_name: lastName
        }
      });
      
      // Navigate to onboarding after successful registration
      navigate('/onboarding/step1');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="name-row">
          <div className="form-group half">
            <label className="form-label">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="glass-input"
              placeholder="First name"
            />
          </div>
          <div className="form-group half">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="glass-input"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="glass-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="glass-input"
            placeholder="Enter your password"
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
          <label className="form-label">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="glass-input"
            placeholder="Confirm your password"
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

        <button
          type="submit"
          disabled={loading}
          className="signup-button-main"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}

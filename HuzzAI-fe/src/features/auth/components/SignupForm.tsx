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
    setError("");

    // Validate form fields
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    
    try {
      // Log the form data being submitted
      console.log('Form data being submitted:', {
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
      
      const response = await authAPI.register(registerData);
      console.log('Registration response:', response);
      
      // Set auth with the correct format including refresh token
      setAuth({
        accessToken: response.access,
        refresh: response.refresh, // Include refresh token
        user: response.user || {
          id: 0, // Temporary ID, will be updated from the server
          email: email,
          first_name: firstName,
          last_name: lastName
        }
      });
      
      // Navigate to onboarding after successful registration
      navigate('/onboarding/step1');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Log full error details for debugging
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);
      } else if (err.request) {
        console.error('No response received:', err.request);
      }
      
      // Set user-friendly error message
      if (err.response?.data?.email) {
        setError(`Email error: ${Array.isArray(err.response.data.email) ? err.response.data.email[0] : err.response.data.email}`);
      } else if (err.response?.data?.password) {
        setError(`Password error: ${Array.isArray(err.response.data.password) ? err.response.data.password[0] : err.response.data.password}`);
      } else if (err.response?.data?.password2) {
        setError(`Password confirmation error: ${Array.isArray(err.response.data.password2) ? err.response.data.password2[0] : err.response.data.password2}`);
      } else if (err.response?.data?.non_field_errors) {
        setError(Array.isArray(err.response.data.non_field_errors) 
          ? err.response.data.non_field_errors[0] 
          : err.response.data.non_field_errors);
      } else if (err.message) {
        setError(err.message);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Registration failed. Please try again.');
      }
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

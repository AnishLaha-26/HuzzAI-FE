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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      const registerData: RegisterData = {
        email,
        password,
        password2: confirmPassword,
        first_name: firstName,
        last_name: lastName
      };
      
      const response = await authAPI.register(registerData);
      
      // Set auth with the correct format
      setAuth({
        accessToken: response.access,
        user: response.user
      });
      
      // Navigate to onboarding after successful registration
      navigate('/onboarding/step1');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data?.email) {
        setError('Email already exists or is invalid');
      } else if (err.response?.data?.password) {
        setError('Password requirements not met');
      } else if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="glass-input"
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="glass-input"
            placeholder="Confirm your password"
          />
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

import { useState } from "react";
import { authAPI, type LoginData } from "../auth.api";
import { useAuth } from "../userauth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const loginData: LoginData = { email, password };
      const response = await authAPI.login(loginData);
      
      // Set auth with the correct format
      setAuth({
        accessToken: response.access,
        user: response.user
      });
      
      // Navigate to dashboard or home after successful login
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}

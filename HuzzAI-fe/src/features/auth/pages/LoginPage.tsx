import { useNavigate } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Unified glass effect box containing branding and form */}
        <div className="glass-form">
          {/* Branding section with logo + name */}
          <div className="branding">
            <img src="/huzzlogo.png" alt="Logo" className="logo-img" />
            <h1 className="brand-title">HuzzAI</h1>
          </div>

          <h2 className="login-title">Login</h2>

          <LoginForm />

          <div className="signup-section">
            <p className="signup-text">Don't have an account?</p>
            <button 
              className="signup-button" 
              onClick={handleSignupClick}
              type="button"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

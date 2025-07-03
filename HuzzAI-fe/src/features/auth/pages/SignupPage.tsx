import { useNavigate } from 'react-router-dom';
import SignupForm from "../components/SignupForm";
import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Unified glass effect box containing branding and form */}
        <div className="glass-form">
          {/* Branding section with logo + name */}
          <div className="branding">
            <img src="/huzzlogo.png" alt="Logo" className="logo-img" />
            <h1 className="brand-title">HuzzAI</h1>
          </div>

          <h2 className="signup-title">Sign Up</h2>

          <SignupForm />

          <div className="login-section">
            <p className="login-text">Already have an account?</p>
            <button 
              className="login-button-alt" 
              onClick={handleLoginClick}
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

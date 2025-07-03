import ForgotForm from "../components/ForgotForm";
import "./ForgotPage.css";

export default function ForgotPage() {
  return (
    <div className="forgot-page">
      <div className="glass-form">
        <div className="branding">
          <h1 className="login-title">Forgot Password</h1>
        </div>
        <p className="forgot-instructions">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <ForgotForm />
      </div>
    </div>
  );
}

import SignupForm from "../components/SignupForm";
import "./SignupPage.css"; // optional styling

export default function SignupPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Sign Up</h2>
      <SignupForm />
    </div>
  );
}

import { Link } from 'react-router-dom';

const CreateNewAccountMessage = () => {
  return (
    <div className="glass-form">
      <div className="branding">
        <h1 className="login-title">Can't Remember?</h1>
      </div>
      <p className="message-text">
        How you gonna get the girl if you can’t get past the login screen?
      </p>
      <p className="message-text">
        <strong>Create a new account!</strong>
      </p>
      <div className="button-group">
        <Link to="/signup" className="btn-primary">
          Create New Account
        </Link>
        <Link to="/login" className="btn-secondary">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default CreateNewAccountMessage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("User@123");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Login failed. Verify credentials and backend availability.");
    }
  };

  return (
    <div className="login-wrap">
      <form className="panel" onSubmit={submit}>
        <h2>Sign In</h2>
        <p>Authenticate with the Module 6 backend and open the app dashboard.</p>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

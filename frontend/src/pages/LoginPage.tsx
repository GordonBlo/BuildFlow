import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <div className="auth-brand">
          <span className="brand__mark" aria-hidden="true">
            BF
          </span>
          <span className="brand__name">BuildFlow</span>
        </div>
        <header className="auth-card__header">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-heading">Sign in</h1>
          <p>Continue to your project workspace.</p>
        </header>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && <p role="alert">{errorMessage}</p>}

          <button
            className="button button--full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-card__footer">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;

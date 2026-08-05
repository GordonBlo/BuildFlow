import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";
import ErrorMessage from "../components/ui/ErrorMessage";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register({ username, email, password });
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-heading">
        <div className="auth-brand">
          <span className="brand__mark" aria-hidden="true">
            BF
          </span>
          <span className="brand__name">BuildFlow</span>
        </div>
        <header className="auth-card__header">
          <p className="eyebrow">Get started</p>
          <h1 id="register-heading">Create your account</h1>
          <p>Bring your projects and tasks into one clear workspace.</p>
        </header>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
        >
          <div className="form-field">
            <label htmlFor="register-username">
              Username
              <span className="required-marker" aria-hidden="true"> *</span>
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              autoComplete="username"
              minLength={2}
              maxLength={80}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-email">
              Email
              <span className="required-marker" aria-hidden="true"> *</span>
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-password">
              Password
              <span className="required-marker" aria-hidden="true"> *</span>
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && <ErrorMessage message={errorMessage} />}

          <button
            className="button button--full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;

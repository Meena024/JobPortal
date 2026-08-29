import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../services/authApi";
import Initializer from "../../../components/Initializer/Initializer";

import classes from "./Login.module.css";

const Login = ({ accountDeleted = false }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(
    accountDeleted
      ? "Your account is no longer available. Please contact the administrator if you believe this was done in error."
      : null,
  );

  const loginHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.idToken);

      const result = await Initializer(dispatch);

      if (result?.accountDeleted) {
        setError(
          "Your account is no longer available. Please contact the administrator if you believe this was done in error.",
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      {/* =================================================
          BRAND
      ================================================= */}

      <header className={classes.brand}>
        <h1 className={classes.logo}>JobPortal</h1>

        <p className={classes.tagline}>Your career. Your next opportunity.</p>
      </header>

      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <form className={classes.form} onSubmit={loginHandler}>
        <div className={classes.formHeader}>
          <h2 className={classes.title}>Welcome </h2>

          <p className={classes.subtitle}>
            Sign in to continue to your JobPortal account.
          </p>
        </div>

        {/* =================================================
            EMAIL
        ================================================= */}

        <div className={classes.field}>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <div className={classes.field}>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <p className={classes.error} role="alert">
            {error}
          </p>
        )}

        {/* =================================================
            LOGIN
        ================================================= */}

        <button
          type="submit"
          className={classes.loginButton}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* =================================================
            SIGN UP
        ================================================= */}

        <div className={classes.signup}>
          <span>Don't have an account?</span>

          <Link to="/signup">Create an account</Link>
        </div>
      </form>

      {/* =================================================
          FOOTER MESSAGE
      ================================================= */}

      <p className={classes.footerText}>
        Find opportunities. Build careers. Grow together.
      </p>
    </main>
  );
};

export default Login;

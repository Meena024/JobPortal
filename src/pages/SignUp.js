import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import classes from "./SignUp.module.css";

import { signUpUser } from "../services/authApi";
import { setRoleDb } from "../store/authActions";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("job_seeker");

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const signupHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    setLoading(true);

    try {
      const data = await signUpUser(email, password);

      const userId = data.localId;

      try {
        await dispatch(setRoleDb(userId, email, role));

        navigate("/");
      } catch (err) {
        console.error("Failed to save user profile:", err);

        setError(
          "Your account was created, but we couldn't save your profile. Please retry with a new email address.",
        );
      }
    } catch (err) {
      console.error("Signup failed:", err);

      setError(
        err.response?.data?.error?.message ||
          "Failed to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      {/* =================================================
          BRAND
      ================================================= */}

      <header className={classes.brand}>
        <h1 className={classes.logo}>JobPortal</h1>

        <p className={classes.tagline}>Your career. Your next opportunity.</p>
      </header>

      {/* =================================================
          SIGN UP FORM
      ================================================= */}

      <form className={classes.form} onSubmit={signupHandler}>
        <div className={classes.intro}>
          <h2 className={classes.title}>Create your account</h2>

          <p className={classes.subtitle}>
            Join JobPortal and take the next step in your career.
          </p>
        </div>

        {/* =================================================
            EMAIL
        ================================================= */}

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-label="Email"
        />

        {/* =================================================
            PASSWORD
        ================================================= */}

        <input
          type="password"
          placeholder="Create a password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          aria-label="Password"
        />

        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

        <input
          type="password"
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          aria-label="Confirm password"
        />

        {/* =================================================
            ROLE
        ================================================= */}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label="Account type"
        >
          <option value="job_seeker">Job Seeker</option>

          <option value="recruiter">Recruiter</option>
        </select>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && <p className={classes.error}>{error}</p>}

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* =================================================
            LOGIN
        ================================================= */}

        <p className={classes.loginPrompt}>
          Already have an account?{" "}
          <Link to="/" className={classes.loginLink}>
            Sign in
          </Link>
        </p>
      </form>

      {/* =================================================
          FOOTER MESSAGE
      ================================================= */}

      <p className={classes.footerText}>
        Find opportunities. Build careers. Grow together.
      </p>
    </div>
  );
};

export default SignUp;

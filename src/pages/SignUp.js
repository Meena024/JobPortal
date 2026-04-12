import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import classes from "./../Styling/Auth/Login.module.css";

import { signUpUser } from "../services/authApi";
import { dbApi } from "../services/dbApi";

const SignUp = () => {
  const navigate = useNavigate();

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

      await dbApi.put(
        `users/${userId}/profile`,

        {
          email,
          role,
          createdAt: new Date().toISOString(),
        },
      );
      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={signupHandler}>
        <h2 className={classes.title}>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* ROLE SELECTION */}

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="job_seeker">Job Seeker</option>

          <option value="recruiter">Recruiter</option>
        </select>

        {error && <p className={classes.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <Link to="/login" className={classes.signupBtn}>
          Already have account?
        </Link>
      </form>
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import classes from "./../Styling/Auth/Login.module.css";

import { loginUser } from "../services/authApi";
import { dbApi } from "../services/dbApi";

import { authActions } from "../store/authSlice";

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError(null);

    setLoading(true);

    try {
      const data = await loginUser(email, password);

      const userId = data.localId;

      const profile = await dbApi.get(`users/${userId}/profile`);

      /* SAVE TO LOCAL STORAGE */

      localStorage.setItem("token", data.idToken);

      localStorage.setItem("userId", userId);

      localStorage.setItem("role", profile.role);

      /* SAVE TO REDUX STORE */

      dispatch(
        authActions.login({
          token: data.idToken,

          userId,

          role: profile.role,
        }),
      );

      /* REDIRECT BASED ON ROLE */

      if (profile.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (profile.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={loginHandler}>
        <h2 className={classes.title}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={classes.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/signup" className={classes.signupBtn}>
          Create Account
        </Link>
      </form>
    </div>
  );
};

export default Login;

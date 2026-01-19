import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, InputGroup } from "react-bootstrap";
import { Button, Icon } from "semantic-ui-react";
import { supabase } from "../../../supabase";
import "./Style.css"; // ✅ keep custom styles
import { Input } from "semantic-ui-react";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      toast.error(error.message);
    } else {
      setLoading(false);
      toast.success("Logged in successfully");

      navigate("/portal");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-wrapper d-flex align-items-center justify-content-center">
        <div className="login-card shadow p-4 rounded">
          <div className="text-center mb-4">
            <h3 className="fw-bold">ALA-VIT Portal</h3>
            <p className="text-muted">Sign in to continue</p>
            <hr />
          </div>

          <Form onSubmit={handleSubmit}>
            <label className="label">Registered Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
              placeholder="Enter email"
            />

            <label className="label mt-3">Password</label>
            <br />
            <div class="ui right labeled input" style={{ width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                style={{ maxWidth: "319px" }}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password.."
              />
              <div
                class="ui basic label"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i class="fa fa-eye" aria-hidden="true"></i>
                )}{" "}
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center my-3">
              <Link
                // to="/forgot-password"
                className="small text-decoration-none"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                icon
                disabled={loading ? true : false}
                labelPosition="left"
                size="large"
                color="blue"
                fluid
              >
                {loading ? (
                  <>
                    <Icon name="loading" />
                    Loading. Please wait...
                  </>
                ) : (
                  <>
                    <Icon name="sign-in" />
                    Login
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

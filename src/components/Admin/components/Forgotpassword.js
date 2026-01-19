import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Button, Icon, Input } from "semantic-ui-react";
import { supabase } from "../../../supabase";
import "./Style.css";
import { toast, ToastContainer } from "react-toastify";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/#/update-password/", // ✅ change to your deployed URL
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent! Please check your email.");
      navigate("/signin"); // optional: redirect them back to login
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="login-wrapper d-flex align-items-center justify-content-center">
        <div className="login-card shadow p-4 rounded">
          <div className="text-center mb-4">
            <h3 className="fw-bold">ALA-VIT Portal</h3>
            <p className="text-muted">Reset your password</p>
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
              required
            />

            <div className="text-center mt-4">
              <Button
                type="submit"
                icon
                disabled={loading}
                labelPosition="left"
                size="large"
                color="orange"
                fluid
              >
                {loading ? (
                  <>
                    <Icon name="loading" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Icon name="mail" />
                    Send Reset Link
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

export default Forgotpassword;

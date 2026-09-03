import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";


function GoogleLoginButton() {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCredentialResponse = async (response) => {
    try {
      const result = await api.post("auth/google/", {
        credential: response.credential,
      });

      localStorage.setItem("access", result.data.access);
      localStorage.setItem("refresh", result.data.refresh);

      login();

      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data);
      alert("Google login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "continue_with",
      shape: "pill",
    });
  }, []);

  return <div ref={buttonRef} className="flex justify-center"></div>;
}

export default GoogleLoginButton;
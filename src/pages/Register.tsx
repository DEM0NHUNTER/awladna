import React, { useState } from "react";              // Bring in useState
import { useNavigate } from "react-router-dom";      // Bring in useNavigate
import apiClient from "../api/axiosInstance";        // Or wherever your client is
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

    const handleRegister = async () => {
        const response = await apiClient.post("/auth/register", formData);
        setShowVerificationPrompt(true); // Show prompt
    };

    if (showVerificationPrompt) {
        return (
            <div>
                <p>A verification email has been sent to your inbox. Please check your spam folder.</p>
                <button onClick={() => navigate("/verify-email")}>Go to Verification Page</button>
            </div>
        );
    }

    return <RegistrationForm onSubmit={handleRegister} />;
};
export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router";

const API_SEND_OTP =
  "https://apis.allsoft.co/api/documentManagement/generateOTP";
const API_VALIDATE_OTP =
  "https://apis.allsoft.co/api/documentManagement//validateOTP";

export default function Login() {
  const [step, setStep] = useState("input");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(API_SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobile }),
      });
      const data = await res.json();
      if (data.status) {
        setStep("verify");
        setSuccess(data.data);
      } else {
        setError("Failed to send OTP");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(API_VALIDATE_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobile, otp }),
      });
      const data = await res.json();
      if (data.status) {
        setSuccess("Verified! Welcome " + data.data.user_name);
        setTimeout(() => {
          navigate("/admin-user", { replace: true });
        }, 1000);
      } else {
        setError("Invalid OTP");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.svg" alt="FileHub" className="h-8 mb-2" />
          <h2 className="text-2xl font-bold text-center">
            Verify Your Phone Number
          </h2>
          <p className="text-gray-500 text-center text-sm">
            Please enter your phone number to receive a verification code.
          </p>
        </div>
        {step === "input" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}
        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              className="text-blue-600 underline text-sm"
              onClick={() => setStep("input")}
            >
              Didn't receive the code? Resend
            </button>
          </form>
        )}
        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center text-sm">{success}</div>
        )}
      </div>
    </div>
  );
}

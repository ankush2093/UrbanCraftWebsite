"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/store/api/auth";
import styles from "./register.module.scss";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import countryCodes from "@/lib/counteryCode.json";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: "patient",
    gender: "",
    dateOfBirth: "",
    countryCode: "+91",
  });

  type Country = {
    name: string;
    flag: string;
    code: string;
    dial_code: string;
  };

  const [verificationData, setVerificationData] = useState({
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<boolean>(false); // Show verification UI
  const [loading, setLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(60);

  const router = useRouter();
  const { login } = useAuth();
  const [registerUser] = authApi.useRegisterUserMutation();
  const [verifyEmail] = authApi.useVerifyEmailMutation();

  React.useEffect(() => {
    if (!verificationStep) {
      setResendCooldown(60);
      return;
    }

    if (resendCooldown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [verificationStep, resendCooldown]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      setError("Password & Confirm Password do not match");
      setLoading(false);
      return;
    }

    try {
      // Prepare the registration data according to API requirements
      const registrationPayload = {
        email: registerData.email,
        password: registerData.password,
        userType: registerData.userType,
        fullName: registerData.fullName,

        phoneNumber: `${registerData.countryCode}${registerData.phoneNumber}`,

        gender: registerData.gender,
        dateOfBirth: registerData.dateOfBirth,
      };

      // Call the register API
      const response = await registerUser(registrationPayload).unwrap();

      // Success case - move to verification step instead of redirecting
      setSuccessMessage(
        response.message ||
          "Registration successful! Please check your email for the verification code.",
      );

      // Set the email in verification data

      setVerificationData((prev) => ({
        ...prev,
        email: registerData.email,
      }));

      // Move to verification step
      setVerificationStep(true);
    } catch (err: any) {
      console.error("Registration error:", err);

      // Extract error message from API response
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(["", "", "", ""]).slice(0, 4);
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 3);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      // Prepare the verification payload
      const verificationPayload = {
        email: verificationData.email,
        code: otpValue,
      };

      // Call the verify email API
      const response = await verifyEmail(verificationPayload).unwrap();

      // Success case - verification successful
      setSuccessMessage(response.message || "Email verified successfully!");

      // AUTO LOGIN LOGIC
      try {
        const success = await login(
          verificationData.email,
          registerData.password,
        );

        if (!success) {
          setError(
            "Registration successful but login failed. Please login manually.",
          );
          return;
        }

        // Redirect to profile
        router.push("/profile");
      } catch (loginErr: any) {
        console.error("Auto-login error:", loginErr);
        let errorMessage =
          "Registration successful but login failed. Please login manually.";
        if (loginErr?.data?.message) {
          if (Array.isArray(loginErr.data.message)) {
            errorMessage = loginErr.data.message.join(", ");
          } else {
            errorMessage = loginErr.data.message;
          }
        } else if (loginErr?.data?.error) {
          errorMessage = loginErr.data.error;
        } else if (loginErr?.message) {
          errorMessage = loginErr.message;
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error("Verification error:", err);

      // Extract error message from API response
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const registrationPayload = {
        email: registerData.email,
        password: registerData.password,
        userType: registerData.userType,
        fullName: registerData.fullName,
        phoneNumber: `${registerData.countryCode}${registerData.phoneNumber}`,
        gender: registerData.gender,
        dateOfBirth: registerData.dateOfBirth,
      };

      const response = await registerUser(registrationPayload).unwrap();

      setSuccessMessage(
        response.message ||
          "A new verification code has been sent to your email.",
      );

      setResendCooldown(60);
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Unable to resend verification code. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setVerificationStep(false);
    setError(null);
    setSuccessMessage(null);
    setOtp(["", "", "", ""]);
  };

  return (
    <div className={styles.registerSection}>
      <div className="container">
        <div className={styles.row}>
          {/* LEFT */}
          <div className={styles.colLeft}>
            <div className={styles.leftContent}>
              <div className={styles.logo}>
                <img src="img/logo-2.jpeg" alt="Logo" />
              </div>

              <img className={styles.bgImg} src="img/register.png" alt="hero" />

              <h1 className={styles.heroText}>
                Explore <br />
                the things <br />
                <span>you love.</span>
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.colRight}>
            <div className={styles.registerCard}>
              {!verificationStep ? (
                // Registration Form
                <>
                  <h2>Create a new account</h2>
                  <p>It's quick and easy.</p>

                  <div className={styles.divider} />

                  {/* Error Message */}
                  {error && (
                    <div
                      className={`alert alert-danger ${styles.errorMessage}`}
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div
                      className={`alert alert-success ${styles.successMessage}`}
                      role="alert"
                    >
                      {successMessage}
                    </div>
                  )}

                  {/* Full Name */}
                  <input
                    type="text"
                    name="fullName"
                    value={registerData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className={`${styles.input} ${styles.full}`}
                  />

                  {/* Email */}
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                    placeholder="Email Id"
                    required
                    className={`${styles.input} ${styles.full}`}
                  />

                  {/* Phone */}
                  <div className={styles.phone_input_wrapper}>
                    <div className={styles.country_box}>
                      {/* Visual display for selected state (Flag + Code) */}
                      <span className={styles.selected_display}>
                        {/* Find country to get flag, fallback to globe if not found */}
                        {(() => {
                          const selected = countryCodes.find(
                            (c) => c.dial_code === registerData.countryCode,
                          );
                          return selected ? selected.flag : "🌐";
                        })()}{" "}
                        {registerData.countryCode}
                      </span>

                      {/* Actual Select (Transparent but clickable) */}
                      <select
                        value={registerData.countryCode}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            countryCode: e.target.value,
                          }))
                        }
                      >
                        {countryCodes.map((country) => (
                          <option
                            key={`${country.code}-${country.dial_code}`}
                            value={country.dial_code}
                          >
                            {country.flag} {country.name} ({country.dial_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="tel"
                      name="phoneNumber"
                      value={registerData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className={styles.phone_input}
                      required
                    />
                  </div>

                  {/* Gender */}
                  <select
                    name="gender"
                    value={registerData.gender}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.full}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                  {/* Password */}
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      minLength={6}
                      value={registerData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      className={`${styles.input} ${styles.full} ${styles.passwordInput}`}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      minLength={6}
                      value={registerData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                      className={`${styles.input} ${styles.full} ${styles.passwordInput}`}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className={styles.signUpBtn}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Sign Up"}
                  </button>

                  <div className="mt-3 text-center">
                    <p className="text-muted small">
                      I already have an account{" "}
                      <Link href="/login">Login </Link>
                    </p>
                  </div>
                </>
              ) : (
                // Verification Form
                <>
                  <h2>Verify your email</h2>
                  <p>Please enter the 4-digit code sent to your email.</p>

                  <div className={styles.divider} />

                  {/* Error Message */}
                  {error && (
                    <div
                      className={`alert alert-danger ${styles.errorMessage}`}
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div
                      className={`alert alert-success ${styles.successMessage}`}
                      role="alert"
                    >
                      {successMessage}
                    </div>
                  )}

                  <p className={styles.emailDisplay}>
                    Email: {verificationData.email}
                  </p>

                  {/* Verification Code - 4 digit inputs */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={styles.input}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        style={{
                          width: "50px",
                          height: "50px",
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                          padding: "5px",
                        }}
                        required
                      />
                    ))}
                  </div>

                  <div className={styles.buttonContainer}>
                    <button
                      onClick={handleVerification}
                      className={styles.verifyBtn}
                      disabled={loading || otp.join("").length !== 4}
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToRegister}
                      className={styles.backBtn}
                    >
                      Back to Register
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="btn btn-link p-0 text-decoration-none"
                      disabled={loading || resendCooldown > 0}
                    >
                      {resendCooldown > 0
                        ? `Resend OTP in ${resendCooldown}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Checkbox } from "@/components/FormElements/checkbox";
import { adminSignUp, signIn, resetPassword } from "@/lib/routes/auth";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { ThemeToggleSwitch } from "../Layouts/header/theme-toggle";

type AuthMode = "signin" | "signup";

export default function AuthForm() {
  const { login, signup } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signin state
  const [signinData, setSigninData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
  });

  // Signup state
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    bio: "",
  });

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigninData({
      ...signinData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // Add this new handler function
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSigninSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(signinData.email, signinData.password);
      router.push("/"); // Redirect after successful login
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      await signup({
        first_name: signupData.first_name,
        last_name: signupData.last_name,
        email: signupData.email,
        password: signupData.password,
        bio: signupData.bio,
      });
      // After successful signup, switch to signin
      setMode("signin");
      setSigninData({
        email: signupData.email,
        password: "",
      });
    } catch (err) {
      setError("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10">
        <ThemeToggleSwitch/>
      </div>

      <h1 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        {mode === "signin" ? "Welcome Back" : "Create Account"}
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-danger p-3 text-center text-danger">
          {error}
        </div>
      )}

      {mode === "signin" ? (
        <form onSubmit={handleSigninSubmit}>
          <InputGroup
            type="email"
            label="Email"
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Enter your email"
            name="email"
            handleChange={handleSigninChange}
            value={signinData.email}
            icon={<EmailIcon />}
          />

          <InputGroup
            type="password"
            label="Password"
            className="mb-5 [&_input]:py-[15px]"
            placeholder="Enter your password"
            name="password"
            handleChange={handleSigninChange}
            value={signinData.password}
            icon={<PasswordIcon />}
          />

          <div className="mb-4.5">
            <button
              type="submit"
              className="flex w-full dark:text-black cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
              disabled={loading}
            >
              Sign In
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="dark:text-white">
              Do not have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <InputGroup
              type="text"
              label="First Name"
              className="[&_input]:py-[15px]"
              placeholder="First name"
              name="first_name"
              handleChange={handleSignupChange}
              value={signupData.first_name}
              icon={<UserIcon />}
            />
            <InputGroup
              type="text"
              label="Last Name"
              className="[&_input]:py-[15px]"
              placeholder="Last name"
              name="last_name"
              handleChange={handleSignupChange}
              value={signupData.last_name}
              icon={<UserIcon />}
            />
          </div>

          <InputGroup
            type="email"
            label="Email"
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Enter your email"
            name="email"
            handleChange={handleSignupChange}
            value={signupData.email}
            icon={<EmailIcon />}
          />

          <InputGroup
            type="password"
            label="Password"
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Create password"
            name="password"
            handleChange={handleSignupChange}
            value={signupData.password}
            icon={<PasswordIcon />}
          />

          <InputGroup
            type="password"
            label="Confirm Password"
            className="mb-5 [&_input]:py-[15px]"
            placeholder="Confirm password"
            name="confirmPassword"
            handleChange={handleSignupChange}
            value={signupData.confirmPassword}
            icon={<PasswordIcon />}
          />

          <TextAreaGroup
            label="Bio"
            defaultValue={signupData.bio}
            className="mb-5 [&_input]:py-[15px]"
            onChange={handleTextAreaChange}  // Use the new handler here
            placeholder="Tell Us About Yourself"
            name="bio"
          />

          <div className="mb-4.5">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white dark:text-black transition hover:bg-opacity-90"
              disabled={loading}
            >
              Create Account
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:text-black dark:border-secondary dark:border-t-transparent" />
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="dark:text-white">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-primary hover:underline"
              >
                Sign in
                {loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:text-black dark:border-secondary dark:border-t-transparent" />
                )}
              </button>
            </p>
          </div>
        </form>
      )}
    </>
  );
}

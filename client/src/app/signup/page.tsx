"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackgroundSection from "@/components/BackgroundSection";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  // Debounced username check
  useEffect(() => {
    if (!form.username) {
      setUsernameAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/auth/check-username?username=${form.username}`
        );
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch (err) {
        console.error("Username check failed:", err);
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (
      !form.username ||
      !form.password ||
      !form.confirmPassword ||
      !form.email ||
      !form.first_name ||
      !form.last_name
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (usernameAvailable === false) {
      setError("Username is already taken.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Signup failed.");
        return;
      }

      alert("Signup successful!");
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup.");
    }
  };

  return (
    <BackgroundSection>
      <div
        className="flex flex-col justify-start h-full mt-7"
        style={{ marginRight: "60px" }}
      >
        <Logo />
        <Image
          src="/pictures/illustration_signup.png"
          alt="Sign up illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <Card className="w-full max-w-md shadow-md mt-30">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          {form.username && (
            <p
              className={`text-sm ${
                usernameAvailable === null
                  ? "text-gray-500"
                  : usernameAvailable
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {usernameAvailable === null
                ? "Checking availability..."
                : usernameAvailable
                ? "Username is available."
                : "Username is already taken."}
            </p>
          )}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange}
          />
          <Input
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange}
          />
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignup}>
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-semibold">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </BackgroundSection>
  );
}

///to add: email verification, alert, responsive design, oAuth

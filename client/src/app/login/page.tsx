"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { login } from "../../lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import BackgroundSection from "@/components/BackgroundSection";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(form);

    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      alert("Login successful!");
      router.push("/applications");
    } else {
      alert("Login failed");
    }
  };

  return (
    <BackgroundSection>
      {/* Illustration */}
      <div className="flex flex-col justify-start">
        <Logo size="large" />
        <img
          src="/pictures/illustration_login.png"
          alt="Login illustration"
          className="h-[570px] object-contain"
        />
      </div>
      <Card className="w-full max-w-md shadow-md mt-[60px] min-h-[260px] px-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full mt-2" onClick={handleLogin}>
            Login
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account yet?{" "}
            <Link
              href="/signup"
              className="text-[#0f172a] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </BackgroundSection>
  );
}

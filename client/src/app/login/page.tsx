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
import Image from "next/image";
import Link from "next/link";
import { login } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import BackgroundSection from "@/components/BackgroundSection";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    const res = await login({ username, password });

    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      router.push("/applications");
    } else {
      alert("Login failed");
    }
  };

  return (
    <BackgroundSection>
      {/* Illustration */}
      <div className="flex flex-col justify-start">
        <Logo />
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
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
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

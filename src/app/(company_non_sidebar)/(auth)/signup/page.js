"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/utils/axiosConfig";
import slugify from "slugify";

export default function SignupForm({ ...props }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  // ✅ Auto-generate username from company name (replace spaces with underscores)
  useEffect(() => {
    if (form.name.trim()) {
      const generated = slugify(form.name, { lower: true, strict: true });
      setForm((prev) => ({ ...prev, username: generated }));
    }
  }, [form.name]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "username") {
      // ✅ enforce lowercase, replace spaces with underscore, allow underscore
      const sanitized = slugify(value, { lower: true, strict: true });
      setForm((prev) => ({ ...prev, username: sanitized }));
      return;
    }

    setForm((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      if (value.length > 0) setShowHints(true);
      else setShowHints(false);

      const newValidations = {
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /\d/.test(value),
      };
      setValidations(newValidations);

      // Hide hints when all validations pass
      if (Object.values(newValidations).every(Boolean)) {
        setShowHints(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      toast.info("Please ensure your password meets all requirements.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.info("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/create-company", {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      console.log(res.data?.company);
      toast.success(res.data?.message || "Account created successfully!");
      router.push(`/otp/${res.data?.company?.id}`);

    } catch (error) {
      console.error("Signup error:", error);
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo2.svg" alt="Logo" width={18} height={18} />
          </div>
          Snipost DevOrg.
        </a>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription>
                Enter your details to create your company account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Company Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Helius"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="helius_dev"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                    <FieldDescription>
                      Lowercase, use underscores (_) instead of spaces.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      {showHints && (
                        <div className="mt-2 text-sm space-y-1">
                          <p
                            className={
                              validations.length
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            • At least 8 characters
                          </p>
                          <p
                            className={
                              validations.upper
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            • Contains an uppercase letter
                          </p>
                          <p
                            className={
                              validations.lower
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            • Contains a lowercase letter
                          </p>
                          <p
                            className={
                              validations.number
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            • Contains a number
                          </p>
                        </div>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  </Field>

                  <Field className="mt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Account"}
                    </Button>
                    <FieldDescription className="text-center">
                      Already have an account?{" "}
                      <Link href="/signin">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
    FieldSeparator,

} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEnd } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAppDispatch } from '@/lib/redux/hooks'
import { authenticateSuccess } from '@/lib/redux/slices/auth'
import api from '@/utils/axiosConfig'
import { toast } from 'sonner'

export default function Signin({ ...props }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        setLoading(true);
        const {data} = await api.post(`/login`, {
          email: e.target.email.value,
          password: e.target.password.value,
        });
  
        if (data.success) {
            toast.success(data.message || "Profile submitted successfully! Awaiting verification.");
            dispatch(authenticateSuccess(data));
            return router.push("/dashboard");
        } else {
            toast.success(data.message || "Error submitting profile");
        }
  
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Invalid or expired code. Please try again.";
        
        if(err.response?.data?.message === "Please verify your email first") {
          router.push(`/otp/${err?.response?.data?.company?._id}`);
        }
        
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
            <Image src="/logo2.svg" alt="Acme Inc. Logo" width={18} height={18} />
          </div>
          Snipost DevOrg.
        </a>

        <div className={"flex flex-col gap-6"} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password"  required />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    <FieldDescription className="text-center">
                      Don't have an account? <Link href="/signup">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
            and <Link href="#">Privacy Policy</Link>.
          </FieldDescription>
        </div>

      </div>
    </div>
  )
}

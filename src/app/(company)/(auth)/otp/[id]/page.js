"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import api from "@/utils/axiosConfig";
import { toast } from "sonner";

export default function OTPPage() {
  const router = useRouter();
  const { id } = useParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/verify-company-email", { id, code: Number(otp) });
      console.log(res);
      toast.success(res?.data?.message || "Verification successful!");
      router.push(`/settings/${id}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Invalid or expired code. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await api.post("/send-verification-code", { id });
        toast.success("A new code has been sent to your email.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend code. Try again later."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo2.svg" alt="Snipost logo" width={18} height={18} />
          </div>
          Snipost DevOrg.
        </a>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Enter verification code</CardTitle>
            <CardDescription>
              We sent a 6-digit code to your email.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp" className="sr-only">
                    Verification code
                  </FieldLabel>

                  <InputOTP
                    maxLength={6}
                    id="otp"
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    required
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <FieldDescription className="text-center">
                    Enter the 6-digit code sent to your email.
                  </FieldDescription>
                </Field>

                <Button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                <FieldDescription className="text-center mt-2">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-blue-600 hover:text-primary ease-in duration-75 cursor-pointer underline disabled:opacity-50"
                  >
                    {resending ? "Resending..." : "Resend"}
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

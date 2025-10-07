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
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from "next/image"


export default function OTPPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo2.svg" alt="Acme Inc. Logo" width={18} height={18} />
          </div>
          Snipost DevOrg.
        </a>



            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Enter verification code</CardTitle>
                    <CardDescription>We sent a 6-digit code to your email.</CardDescription>
                </CardHeader>
            <CardContent>
                <form>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="otp" className="sr-only">
                            Verification code
                        </FieldLabel>
                        <InputOTP maxLength={6} id="otp" required>
                            <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <FieldDescription className="text-center">
                            Enter the 6-digit code sent to your email.
                        </FieldDescription>
                    </Field>
                    <Button type="submit">Verify</Button>
                    <FieldDescription className="text-center">
                        Didn&apos;t receive the code? 
                        <a href="#">Resend</a>
                    </FieldDescription>
                </FieldGroup>
                </form>
            </CardContent>
        </Card>





      </div>
    </div>
  )
}
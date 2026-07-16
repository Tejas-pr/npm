import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

interface OtpVerificationProps {
  email: string
  loading: boolean
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  className?: string
}

export function ApplicationOtpVerification({
  email,
  loading,
  onVerify,
  onResend,
  className,
  ...props
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onVerify(otp)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Verify your email</h1>
            <FieldDescription>
              We sent a code to {email}. Enter it below to verify.
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp">One-Time Password (OTP)</FieldLabel>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </Field>
          <div className="mt-2 text-center">
            <Button
              variant="link"
              type="button"
              onClick={onResend}
              disabled={loading}
              className="text-sm"
            >
              Didn't receive code? Resend OTP
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

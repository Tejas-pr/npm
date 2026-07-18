import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface VerificationEmailProps {
  otp: string;
  type: string;
}

export const VerificationEmail = ({ otp, type }: VerificationEmailProps) => {
  const title =
    type === 'email-verification'
      ? 'Verify your email'
      : type === 'sign-in'
        ? 'Your Sign-In OTP'
        : type === 'forget-password'
          ? 'Reset your password'
          : 'Your OTP';

  const subtitle =
    type === 'email-verification'
      ? 'Thank you for joining Touch Up. Use the code below to verify your email address and get started.'
      : 'Use the code below to securely access your account.';

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>
              Touch <span style={logoAccent}>Up</span>
            </Text>
          </Section>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>{subtitle}</Text>
          <Section style={otpContainer}>
            <Text style={otpLabel}>Your Verification Code</Text>
            <Text style={otpCode}>{otp}</Text>
          </Section>
          <Text style={footerText}>
            If you didn't request this code, you can safely ignore this email.
          </Text>
          <Section style={footer}>
            <Text style={footerCopyright}>
              &copy; {new Date().getFullYear()} Touch Up. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const main = {
  backgroundColor: '#fcf9f9',
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif",
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#1a1a1a',
  letterSpacing: '-0.5px',
  margin: '0',
};

const logoAccent = {
  color: '#d69e9e',
};

const h1 = {
  fontSize: '24px',
  fontWeight: '700',
  textAlign: 'center' as const,
  marginBottom: '16px',
  color: '#1a1a1a',
};

const text = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#666666',
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const otpContainer = {
  backgroundColor: '#fdf5f5',
  border: '1px solid #f2e1e1',
  padding: '24px',
  textAlign: 'center' as const,
  borderRadius: '12px',
  marginBottom: '32px',
};

const otpLabel = {
  margin: '0 0 8px 0',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: '#999999',
};

const otpCode = {
  fontSize: '36px',
  fontWeight: '800',
  letterSpacing: '6px',
  color: '#c48b8b',
  margin: '0',
};

const footerText = {
  fontSize: '14px',
  color: '#666666',
  textAlign: 'center' as const,
};

const footer = {
  textAlign: 'center' as const,
  borderTop: '1px solid #f0f0f0',
  paddingTop: '24px',
  marginTop: '32px',
};

const footerCopyright = {
  fontSize: '14px',
  color: '#999999',
  margin: '0',
};

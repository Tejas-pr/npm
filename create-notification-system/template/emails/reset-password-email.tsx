import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  url: string;
}

export const ResetPasswordEmail = ({ url }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Touch Up password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>
              Touch <span style={logoAccent}>Up</span>
            </Text>
          </Section>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            We received a request to reset the password for your Touch Up account.
            Click the button below to choose a new password.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={url}>
              Reset Password
            </Button>
          </Section>
          <Text style={footerText}>
            If you didn't request this password reset, you can safely ignore this email.
            The link will expire in 30 minutes.
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

export default ResetPasswordEmail;

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

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
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

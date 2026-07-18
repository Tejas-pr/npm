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

interface NotificationEmailProps {
  title: string;
  body: string;
}

export const NotificationEmail = ({ title, body }: NotificationEmailProps) => {
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
          <Text style={text}>{body}</Text>
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

export default NotificationEmail;

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
  fontSize: '22px',
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

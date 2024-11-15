import { ReactElement } from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Link,
  Heading,
} from '@react-email/components'

interface ResetPasswordEmailProps {
  name: string
  resetLink: string
}

export const ResetPasswordEmail = ({
  name,
  resetLink,
}: ResetPasswordEmailProps): ReactElement => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Care Sync 360 password</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '5px' }}>
          <Heading as="h1">Reset Your Password</Heading>
          <Text>Dear {name},</Text>
          <Text>
            We received a request to reset your Care Sync 360 password. Click the link below to set a new password:
          </Text>
          <Link href={resetLink} style={{ 
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            marginTop: '16px',
            marginBottom: '16px'
          }}>
            Reset Password
          </Link>
          <Text style={{ color: '#666666', fontSize: '14px' }}>
            This link will expire in 1 hour. If you did not request this reset, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
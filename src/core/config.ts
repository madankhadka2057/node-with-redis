import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  db: {
    url: process.env.DATABASE_URL as string,
  },
  mail: {
    user: process.env.GMAIL_USER as string,
    pass: process.env.GMAIL_PASS as string,
    resend: {
      apiKey: process.env.RESEND_API_KEY as string,
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    },
  },
  paseto: {
    privateKey: process.env.PASETO_PRIVATE_KEY || 'k4.secret.placeholder',
    publicKey: process.env.PASETO_PUBLIC_KEY || 'k4.public.placeholder',
    accessTokenExpires: '1h',
    refreshTokenExpires: '7d',
  },

};

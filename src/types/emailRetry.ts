export type EmailRetryPayload = {
  url: string;
  email: string;
  message: string;
  attempts: number;
  lastAttempt: string;
};

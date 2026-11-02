import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ erro?: unknown }>(error)) {
    const message = error.response?.data?.erro;
    if (typeof message === 'string') return message;
  }

  return fallback;
}

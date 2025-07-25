import { Response } from 'express';

export function handleServiceError(err: any): { success: false; error: string[] } {
  if (err?.name === 'ValidationError' && err?.errors) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return { success: false, error: messages };
  }

  return {
    success: false,
    error: ['Unexpected error: ' + (err?.message || 'Unknown error')],
  };
}

export function expectError(response: any, expectedMessage: string, statusCode: number) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors).toBeInstanceOf(Array);
  expect(response.body.errors).toContain(expectedMessage);
}

export const handleError = (res: Response, error: string[]) => {
  res.status(400).json({ errors: error });
};
import { Response } from 'express';

export function handleServiceError(err: any): { success: false; error: string[]; code?: number } {
  if (err?.name === 'ValidationError' && err?.errors) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return { success: false, error: messages, code: 400 };
  }
 
  return {
    success: false,
    error: ['Unexpected error: ' + (err?.message || 'Unknown error')],
    code: 500,
  };
}

export function expectError(response: any, expectedMessage: string, statusCode: number) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toBeInstanceOf(Array);
  expect(response.body.error).toContain(expectedMessage);
}
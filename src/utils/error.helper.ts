import { Response } from 'express';

// export function handleServiceError(err: any): { success: false; error: string[] } {
//   if (err?.name === 'ValidationError' && err?.errors) {
//     const messages = Object.values(err.errors).map((e: any) => e.message);
//     return { success: false, error: messages };
//   }

//   return {
//     success: false,
//     error: ['Unexpected error: ' + (err?.message || 'Unknown error')],
//   };
// }

export function handleServiceError(err: any): { success: false; error: string[]; code?: number } {
  if (err?.name === 'ValidationError' && err?.errors) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return { success: false, error: messages, code: 400 };
  }

  // fallback for unhandled errors
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

// export const handleError = (res: Response, error: string[]) => {
//   res.status(400).json({ errors: error });
// };


export function handleError(res: Response, errors: string[] | { errors: string[]; code?: number }) {
  if (Array.isArray(errors)) {
    return res.status(400).json({ errors });
  }

  const statusCode = errors.code || 400;
  return res.status(statusCode).json({ error: errors.errors });
}
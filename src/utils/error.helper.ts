export function handleServiceError(err: unknown): { success: false; error: string[]; code?: number } {

  if (typeof err === 'object' && err !== null && 'name' in err) {
    const errorObj = err as { name: string; errors?: Record<string, any> };

    if (errorObj.name === 'ValidationError' && errorObj.errors) {
      const messages = Object.values(errorObj.errors).map((e: any) => e.message);
      return { success: false, error: messages, code: 400 };
    }
  }

  if (err instanceof Error) {
    return { success: false, error: ['Unexpected error: ' + err.message], code: 500 };
  }
 
  return { success: false, error: ['Unexpected error: Unknown error'], code: 500 };
} 

export function expectError(response: any, expectedMessage: string, statusCode: number) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toBeInstanceOf(Array);
  expect(response.body.error).toContain(expectedMessage);
}
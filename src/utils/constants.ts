export const PAGE_SIZE = 5; 
 
export const AUTHENTICATION_ERRORS = {
  ACCESS_TOKEN_MISSING: 'Access token is missing',
  INVALID_LOGIN: 'Invalid login',
  REFRESH_TOKEN_NOT_VALID: 'Refresh token not valid',
  ACCESS_TOKEN_SECRET_MISSING: 'Access token secret missing',
  REFRESH_TOKEN_SECRET_MISSING: 'Refresh token secret missing'
} as const

export const DEPARTMENT_ERRORS = {
  NOT_FOUND: 'Department not found',
  NAME_EXISTS: 'Department name exists already'
} as const;

export const EMPLOYEE_ERRORS = {
  NOT_FOUND: 'Employee not found',
  NOT_UPDATED: 'Employee not updated'
} as const;
  
export const USER_ERRORS = {
  USERNAME_EXISTS: 'Username exists already',
  NOT_FOUND: 'User not found',
  FAILED_TO_ADD: 'Failed to add user' 
} as const;

export const USER_MESSAGES = { 
  ADDED_SUCCESSFULLY: 'User added successfully',
  UPDATED_SUCCESSFULLY: 'User updated successfully',
  DELETED_SUCCESSFULLY: 'User deleted successfully'
} as const;

export const AZURE_STORAGE_ERRORS = {
  CONNECTION_STRING_NOT_FOUND: 'Azure Storage connection string not set in environment',
  CONTAINER_NOT_FOUND: 'Azure Storage container string not set in environment'
} as const;


export const GENERAL_ERRORS = {
  UPLOAD_FAILED: 'Upload failed',
  NO_FILE_TO_UPLOAD: 'No file to upload',
  INVALID_CONTENT_TYPE: 'Invalid content type'
} as const;

export const GLOBAL = {
  PRODUCTION: 'production',
  NONE: 'none',
  LAX : 'lax'
} as const;

export const COOKIES = {
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_TOKEN: 'access_token'
} as const;

export const CORS = {
  NOT_ALLOWED: "Not allowed by CORS"
} as const;

export const SERVER = {
  DEFAULT_PORT: 3000,
  API_PATH: '/api',
  VERSION: '/v1'
} as const;

export const FILES = {
  UPLOAD_PHOTO_FILE_NAME: 'photoFile',
  UPLOAD_IMPORT_FILE_NAME: 'importFile'
} as const;

export const EXPECTED_HEADERS: string[] = [
  "Id",
  "Surname",
  "FirstName",
  "DateOfBirth",
  "HireDate",
  "Department",
  "Email",
  "PhoneNumber"
] as const;

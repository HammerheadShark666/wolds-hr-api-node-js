import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export function generateFileName(originalName: string): string { 
  return `${uuidv4()}${path.extname(originalName)}`;
}
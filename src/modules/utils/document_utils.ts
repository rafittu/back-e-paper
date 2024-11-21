import { v4 as uuidv4 } from 'uuid';

export function normalizeFileName(originalName: string): string {
  const timestamp = Date.now();
  const nonAlphanumericRegex = /[^a-z0-9]/g;
  const consecutiveHyphensRegex = /-+g/;

  const safeName = originalName
    .toLowerCase()
    .replace(nonAlphanumericRegex, '-')
    .replace(consecutiveHyphensRegex, '-');
  return `${safeName}-${timestamp}-${uuidv4()}`;
}

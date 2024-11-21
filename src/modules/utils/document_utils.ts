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

export const mapCamelCaseToSnakeCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => mapCamelCaseToSnakeCase(item));
  } else if (data !== null && data.constructor === Object) {
    return Object.keys(data).reduce((result: any, key: string) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = mapCamelCaseToSnakeCase(data[key]);
      return result;
    }, {});
  }
  return data;
};

export const mapSnakeCaseToCamelCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => mapSnakeCaseToCamelCase(item));
  } else if (data !== null && data.constructor === Object) {
    return Object.keys(data).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      result[camelKey] = mapSnakeCaseToCamelCase(data[key]);
      return result;
    }, {});
  }
  return data;
};

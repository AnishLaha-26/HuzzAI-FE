/**
 * Converts an image file to a base64 string
 * @param file - The image file to convert
 * @returns A promise that resolves to the base64 string of the image
 */
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // The result will be a base64 string (data:image/...)
      const base64String = reader.result as string;
      resolve(base64String);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
  });
};

/**
 * Extracts the base64 data from a data URL string
 * @param dataUrl - The data URL (starts with 'data:image/...')
 * @returns The base64 data part of the URL
 */
export const extractBase64Data = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

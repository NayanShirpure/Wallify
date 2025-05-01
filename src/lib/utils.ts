import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Downloads a file from a given URL with a specific filename.
 *
 * @param url - The URL of the file to download.
 * @param filename - The desired name for the downloaded file.
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  } catch (error) {
    console.error('Error downloading file:', error);
    // Optionally re-throw or handle the error (e.g., show a toast notification)
    throw new Error('Failed to download file.');
  }
}

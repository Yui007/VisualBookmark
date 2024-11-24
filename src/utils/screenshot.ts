import { toPng } from 'html-to-image';

export const takeScreenshot = async (url: string): Promise<string> => {
  // Create an iframe to load the page
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.width = '1280px';
  iframe.style.height = '800px';
  document.body.appendChild(iframe);

  try {
    // Load the page in the iframe
    await new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = reject;
      iframe.src = url;
    });

    // Take a screenshot
    const screenshot = await toPng(iframe.contentDocument?.documentElement || iframe);
    return screenshot;
  } catch (error) {
    console.error('Failed to take screenshot:', error);
    return '';
  } finally {
    document.body.removeChild(iframe);
  }
};
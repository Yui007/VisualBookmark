export const validateAndFormatUrl = (url: string): string => {
  try {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
};

export const getFaviconUrl = (url: string): string => {
  try {
    const urlObj = new URL(validateAndFormatUrl(url));
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return '';
  }
};

export const getOgImageUrl = async (url: string): Promise<string> => {
  try {
    const formattedUrl = validateAndFormatUrl(url);

    // First try to get meta information including og:image
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(formattedUrl)}`);
    const data = await response.json();

    // If we have og:image, use it
    if (data.data?.image?.url) {
      return data.data.image.url;
    }

    // If no og:image, try to get a screenshot
    const screenshotResponse = await fetch(
      `https://api.apiflash.com/v1/urltoimage?access_key=6c6d3f6d65164f258f8b3c5f2262f350&url=${encodeURIComponent(formattedUrl)}&format=jpeg&width=1200&height=630&response_type=json`
    );
    const screenshotData = await screenshotResponse.json();

    if (screenshotData.url) {
      return screenshotData.url;
    }

    // Fallback to default wallpaper if previous attempts failed
    return getDefaultWallpaper(formattedUrl); 
  } catch (error) {
    console.error('Failed to fetch image:', error);
    // Return a placeholder or default image URL here
    return '/path/to/placeholder-image.jpg'; // Update with your placeholder image path
  }
};

const getDefaultWallpaper = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const category = domain.split('.')[0];
    return `https://source.unsplash.com/1200x630/?${category},website`;
  } catch {
    // Provide a more reliable fallback if category extraction fails
    return 'https://source.unsplash.com/1200x630/?website,technology'; 
  }
};

// cmsClient.ts
// Example: fetch config from a headless CMS (e.g., Contentful, Strapi, Firebase)

export async function fetchConfigFromCMS(key: string): Promise<any> {
  // Replace with your CMS API endpoint and authentication
  const response = await fetch(`https://cms.example.com/config/${key}`);
  if (!response.ok) throw new Error('Failed to fetch config from CMS');
  return response.json();
}

// Usage example in a screen/component:
// const shopConfig = await fetchConfigFromCMS('shop');
// const homeConfig = await fetchConfigFromCMS('home');

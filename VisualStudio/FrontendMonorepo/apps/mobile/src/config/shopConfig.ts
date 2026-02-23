// shopConfig.ts
// Centralized config for shop UI, tabs, and text/images

import { useEffect, useState } from 'react';

export interface ShopTabConfig {
  key: string;
  label: string;
  icon: string;
  bannerImage?: string;
  description?: string;
  seasonEnd?: string; // ISO string for seasonal tab
}

const SPACE_ID = 'your_space_id'; // TODO: Replace with your Contentful Space ID
const ACCESS_TOKEN = 'your_access_token'; // TODO: Replace with your Contentful API Key

export async function fetchShopTabsConfig(): Promise<ShopTabConfig[]> {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?content_type=shopTab&order=fields.order`,
    {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    },
  );
  const data = await res.json();
  // Map Contentful response to your config shape
  return data.items.map((item: any) => ({
    key: item.fields.key,
    label: item.fields.label,
    icon: item.fields.icon,
    bannerImage: item.fields.bannerImage, // You may need to resolve asset URLs
    description: item.fields.description,
    seasonEnd: item.fields.seasonEnd, // Only for seasonal tab
  }));
}

export function useShopTabsConfig() {
  const [tabs, setTabs] = useState<ShopTabConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchShopTabsConfig()
      .then(setTabs)
      .catch(setError)
      .finally(() => { setLoading(false); });
  }, []);

  return { tabs, loading, error };
}

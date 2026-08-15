import { useQuery } from '@tanstack/react-query';

export const fetchSites = async () => {
  const res = await fetch('/api/sites');
  if (!res.ok) throw new Error('Failed to fetch sites');
  return res.json();
};

export const fetchSiteChanges = async (siteId: string) => {
  const res = await fetch(`/api/sites/${siteId}/changes`);
  if (!res.ok) throw new Error('Failed to fetch changes');
  return res.json();
};

export const useSites = () => {
  return useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });
};

export const useSiteChanges = (siteId: string | null) => {
  return useQuery({
    queryKey: ['site-changes', siteId],
    queryFn: () => fetchSiteChanges(siteId as string),
    enabled: !!siteId,
  });
};

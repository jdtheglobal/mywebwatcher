import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const getAuthHeaders = () => {
  const token = localStorage.getItem('pulseAuthToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'X-Pulse-Auth': `Bearer ${token}` } : {})
  };
};

export const fetchSites = async () => {
  const res = await fetch('/api/sites', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch sites');
  return res.json();
};

export const fetchSiteChanges = async (siteId: string) => {
  const res = await fetch(`/api/sites/${siteId}/changes`, { headers: getAuthHeaders() });
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

export const createSite = async (data: { name: string; url: string; frequency: string }) => {
  const res = await fetch('/api/sites', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create site');
  return res.json();
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });
};

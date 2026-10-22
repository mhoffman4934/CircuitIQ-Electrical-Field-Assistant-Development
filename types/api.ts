export type Site = { id: string; name: string };
export type Workspace = { id: string; name: string; sites: Site[] };
export type Asset = {
  id: string;
  assetTag: string;
  name: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  notes: string | null;
  site: Site;
  createdAt: string;
  updatedAt: string;
};
export type Activity = {
  id: string;
  action: string;
  createdAt: string;
  asset: Pick<Asset, 'id' | 'assetTag' | 'name'>;
};
export type Dashboard = {
  workspace: Workspace | null;
  assetCount: number;
  recentActivity: Activity[];
};
export type AssetPage = { items: Asset[]; total: number; page: number; pageSize: number };

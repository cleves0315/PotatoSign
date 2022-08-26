export interface Folder {
  id: string;
  name: string;
  list: TabsData[];
  // type: string;
}
export interface TabsData {
  active: boolean;
  audible: boolean;
  autoDiscardable: boolean;
  discarded: boolean;
  description?: string;
  favIconUrl: string;
  groupId: number;
  height: number;
  highlighted: boolean;
  id: string;
  incognito: boolean;
  index: number;
  openerTabId?: number;
  mutedInfo: { muted: boolean };
  pinned: boolean;
  selected: boolean;
  status: string;
  title: string;
  url: string;
  width: number;
  windowId: number;
}

export interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: SubItem[];
}

export interface SubItem {
  title: string;
  url: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// types/navigation.ts
export interface NavItemBase {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavItemWithUrl extends NavItemBase {
  url: string;
  items?: never; // This ensures items can't exist if url exists
}

export interface NavItemWithChildren extends NavItemBase {
  items: SubItem[];
  url?: never; // This ensures url can't exist if items exists
}
////////////////////////////////////////////////
export interface SubItem {
  title: string;
  url: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

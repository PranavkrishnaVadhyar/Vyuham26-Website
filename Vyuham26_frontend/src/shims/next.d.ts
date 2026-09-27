export interface Metadata {
  title?: string | { default: string; template: string };
  description?: string;
  keywords?: string[];
  openGraph?: any;
  [key: string]: any;
}

export interface Viewport {
  width?: string;
  initialScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
  themeColor?: string | { media: string; color: string }[];
  colorScheme?: "normal" | "light" | "dark" | "light dark" | "dark light" | "only light";
}

export type NextPage<P = {}, IP = P> = React.ComponentType<P>;

export interface LayoutProps<T = any> {
  children?: React.ReactNode;
  params?: Promise<any> | any;
}

declare module "next" {
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    keywords?: string[];
    [key: string]: any;
  }
  export interface Viewport {
    width?: string;
    initialScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
    themeColor?: string | { media: string; color: string }[];
    colorScheme?: string;
  }
}

declare global {
  namespace React {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
      jsx?: boolean;
      global?: boolean;
    }
  }
}


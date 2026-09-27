import React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  prefetch?: boolean;
  children?: React.ReactNode;
}

export default function Link({ href, onClick, children, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !props.target) {
      e.preventDefault();
      // Custom navigation
      window.dispatchEvent(new CustomEvent("app:navigate", { detail: href }));
      if (href.startsWith("#")) {
        window.location.hash = href;
      } else {
        // Also update hash for compatibility with static host if needed, and push state
        window.location.hash = href.startsWith("/") ? href : `/${href}`;
      }
    }
  };

  const resolvedHref = href.startsWith("#") ? href : `#${href.startsWith("/") ? href : `/${href}`}`;

  return (
    <a href={resolvedHref} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

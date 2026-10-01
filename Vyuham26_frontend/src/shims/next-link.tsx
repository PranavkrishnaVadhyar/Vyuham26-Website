import React from "react";
import { navigate } from "@/lib/router";
import { prefetchRoute } from "@/routes";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  prefetch?: boolean;
  children?: React.ReactNode;
}

export default function Link({
  href,
  onClick,
  onMouseEnter,
  onFocus,
  prefetch = true,
  replace = false,
  children,
  ...props
}: LinkProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(e);
    if (prefetch !== false && href && !href.startsWith("http")) {
      prefetchRoute(href);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(e);
    if (prefetch !== false && href && !href.startsWith("http")) {
      prefetchRoute(href);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      !e.defaultPrevented &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      !props.target &&
      !href.startsWith("http")
    ) {
      e.preventDefault();
      navigate(href, { replace });
    }
  };

  const resolvedHref = href.startsWith("#") || href.startsWith("http")
    ? href
    : `#${href.startsWith("/") ? href : `/${href}`}`;

  return (
    <a
      href={resolvedHref}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </a>
  );
}

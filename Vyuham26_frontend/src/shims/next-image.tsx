import React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  className,
  style,
  loading,
  priority,
  ...props
}: ImageProps) {
  const fillStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...fillStyle, ...style }}
      loading={priority ? "eager" : loading || "lazy"}
      {...props}
    />
  );
}

import React, { lazy, Suspense } from "react";

export default function dynamic<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T } | T>,
  options?: { ssr?: boolean; loading?: () => React.ReactNode }
) {
  const LazyComponent = lazy(async () => {
    const mod = await importer();
    return "default" in (mod as any) ? (mod as any) : { default: mod };
  });

  return function DynamicWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={options?.loading ? options.loading() : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

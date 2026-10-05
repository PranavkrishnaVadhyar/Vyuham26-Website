export const SITE_CONFIG = {
  REG_OPEN: false,
} as const;

export const isRegistrationOpen = (): boolean => {
  return (SITE_CONFIG.REG_OPEN as boolean) === true;
};


const configuredFee = Number(import.meta.env.VITE_PLATFORM_FEE_PERCENTAGE);

export const PLATFORM_FEE_PERCENTAGE = Number.isFinite(configuredFee) && configuredFee >= 0 && configuredFee <= 1
  ? configuredFee
  : 0.08;

export const PAYMENT_PROVIDER = import.meta.env.VITE_PAYMENT_PROVIDER || 'not-connected';
export const YOUTUBE_INGESTION_STATUS = import.meta.env.VITE_YOUTUBE_INGESTION_CONFIGURED === 'true'
  ? 'configured'
  : 'awaiting-api-configuration';

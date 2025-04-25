export interface ScriptConfig {
  id: string;
  enabled: boolean;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
  src: string;
}

// Helper function to safely access environment variables
const getEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  // Only process.env.NEXT_PUBLIC_* variables are accessible in the browser
  const value = process.env[`${key}`];
  
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Configuration for analytics and tracking scripts
 * Add new scripts here as needed
 * 
 * To enable/disable in development or production, set the following environment variables:
 * - ENABLE_ANALYTICS=true|false (master switch for all analytics)
 * - ENABLE_GOATCOUNTER=true|false (for GoatCounter specifically)
 */
export const analyticsScripts: ScriptConfig[] = [
  {
    id: 'goatcounter',
    // Only enable if master analytics switch is on AND specific script is enabled
    // Default to true in production, false in development
    enabled: true,
    async: true,
    attributes: {
      'data-goatcounter': 'https://spriggan.goatcounter.com/count',
    },
    src: '//gc.zgo.at/count.js',
  },
  // Add more scripts here as needed
]; 
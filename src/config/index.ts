/**
 * Configuration Index
 * Central export point for all configuration files
 */

export { APP_CONFIG } from './app.config';
export type { AppConfig } from './app.config';

export { SEO_CONFIG } from './seo.config';
export type { SEOConfig } from './seo.config';

export { META_CONFIG, getPageMeta } from './meta.config';
export type { MetaConfig } from './meta.config';

// Re-export commonly used values for convenience
export const {
	name: APP_NAME,
	version: APP_VERSION,
	url: APP_URL,
} = APP_CONFIG;

export const { defaultTitle: SEO_TITLE, description: SEO_DESCRIPTION } =
	SEO_CONFIG;


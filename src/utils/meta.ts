import { SEO_CONFIG, META_CONFIG, APP_CONFIG } from '@/config';

export function generateMetaTags(page?: keyof typeof META_CONFIG.pages) {
	const baseMeta = {
		title: SEO_CONFIG.defaultTitle,
		description: SEO_CONFIG.description,
		keywords: SEO_CONFIG.keywords.join(', '),
	};

	if (!page) return baseMeta;

	const pageMeta = META_CONFIG.pages[page];
	return {
		title: `${pageMeta.title} | ${APP_CONFIG.name}`,
		description: pageMeta.description,
		keywords: [...SEO_CONFIG.keywords, ...pageMeta.keywords].join(', '),
	};
}

export function generateOpenGraphTags(page?: keyof typeof META_CONFIG.pages) {
	const og = META_CONFIG.openGraph;

	if (!page) return og;

	const pageMeta = META_CONFIG.pages[page];
	return {
		...og,
		title: pageMeta.title,
		description: pageMeta.description,
		url: `${APP_CONFIG.url}/?page=${page}`,
	};
}

export function generateTwitterTags(page?: keyof typeof META_CONFIG.pages) {
	const twitter = META_CONFIG.twitter;

	if (!page) return twitter;

	const pageMeta = META_CONFIG.pages[page];
	return {
		...twitter,
		title: pageMeta.title,
		description: pageMeta.description,
	};
}

export function generateStructuredData() {
	return JSON.stringify(SEO_CONFIG.structuredData, null, 2);
}

export function setDocumentTitle(page?: keyof typeof META_CONFIG.pages) {
	const meta = generateMetaTags(page);
	document.title = meta.title;
}

export function updateMetaTag(name: string, content: string) {
	let meta = document.querySelector(`meta[name="${name}"]`);
	if (!meta) {
		meta = document.createElement('meta');
		meta.setAttribute('name', name);
		document.head.appendChild(meta);
	}
	meta.setAttribute('content', content);
}

export function updateOGTag(property: string, content: string) {
	let meta = document.querySelector(`meta[property="${property}"]`);
	if (!meta) {
		meta = document.createElement('meta');
		meta.setAttribute('property', property);
		document.head.appendChild(meta);
	}
	meta.setAttribute('content', content);
}

export function updatePageMeta(page?: keyof typeof META_CONFIG.pages) {
	const meta = generateMetaTags(page);
	const og = generateOpenGraphTags(page);
	const twitter = generateTwitterTags(page);

	setDocumentTitle(page);

	updateMetaTag('description', meta.description);
	updateMetaTag('keywords', meta.keywords);

	updateOGTag('og:title', og.title);
	updateOGTag('og:description', og.description);
	updateOGTag('og:url', og.url);

	updateMetaTag('twitter:title', twitter.title);
	updateMetaTag('twitter:description', twitter.description);
}

export function getCanonicalUrl(page?: keyof typeof META_CONFIG.pages) {
	if (!page) return APP_CONFIG.url;
	return `${APP_CONFIG.url}/?page=${page}`;
}

export function generateSharingUrl(
	platform: 'facebook' | 'twitter' | 'linkedin',
	page?: keyof typeof META_CONFIG.pages
) {
	const url = getCanonicalUrl(page);
	const meta = generateMetaTags(page);
	const sharing = META_CONFIG.sharing;

	switch (platform) {
		case 'facebook':
			return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

		case 'twitter': {
			const text = encodeURIComponent(meta.title);
			const hashtags = encodeURIComponent(sharing.hashtags.join(','));
			const via = sharing.via;
			return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}&hashtags=${hashtags}&via=${via}`;
		}

		case 'linkedin':
			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

		default:
			return url;
	}
}

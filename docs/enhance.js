console.info('https://en.wikipedia.org/wiki/Progressive_enhancement');

const enhance = async (heading, url, columns, transform) => {
	const loading = (finished) => {
		document.querySelector(`#${heading}`).classList[finished ? 'remove' : 'add']('loading');
	};
	loading();
	try {
		const response = await fetch(url);
		const json = await response.json();
		const rows = transform(json).map((row) => `<td>${row.join('</td><td>')}</td>`);
		const thead = `<thead><tr><th>${columns.join('</th><th>')}</th></tr></thead>`;
		const tbody = `<tbody><tr>${rows.join('</tr><tr>')}</tr></tbody>`;
		document.querySelector(`#${heading} + *`).outerHTML = `<div><table aria-labelledby="${heading}">${thead}${tbody}</table></div>`;
		loading('finished');
	} catch (err) {
		if (location.search === '?debug') {
			console.error(err);
		}
		console.warn(`Could not load #${heading}.`);
		loading('failed');
	}
};

enhance('presentations', '/slides.json', ['Talk', 'Links', 'Event', 'Location'], (json) => json.map((talk) => {
	const links = talk.links.map((link) => {
		const url = new URL(link.url);
		const isSameOrigin = url.host === 'cssence.github.io';
		const rel = isSameOrigin || url.host.endsWith('cssence.com') ? '' : ' rel="noreferrer noopener"';
		const href = isSameOrigin ? url.pathname : link.url;
		return `<a${rel} href="${href}">${link.name}</a>`;
	});
	return [`<em>${talk.title}</em>`, links.join(', '), talk.event, talk.location];
}));

enhance('links', 'https://cv.cssence.com/bookmarks.json', ['Name', 'URL'], (json) => json.map((link) => {
	const url = new URL(link.url);
	const urlDisplay = url.pathname === '/' ? url.host : [url.host, url.pathname].join('');
	const rel = url.host.endsWith('cssence.com') ? '' : ' rel="noreferrer noopener"';
	return [`<a${rel} href="${link.url}">${link.name}</a>`, urlDisplay];
}));

enhance('resources', '/assets.json', ['File', 'Mime Type', 'Dimensions', 'Size'], (json) => json.map((resource) => {
	const url = new URL(resource.url);
	const href = url.host === 'cssence.github.io' ? url.pathname : resource.url;
	const name = url.pathname.split('/').pop();
	const type = resource.mimeType;
	const dims = resource.width ? `${resource.width}×${resource.height}` : 'n/a';
	const size = typeof resource.size === 'number' ? `${Math.round(resource.size / 100) / 10} KB` : '?';
	return [`<a download href="${href}">${name}</a>`, type, dims, `<data value="${resource.size}">${size}</data>`];
}));

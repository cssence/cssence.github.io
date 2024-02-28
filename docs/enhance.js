console.info('https://en.wikipedia.org/wiki/Progressive_enhancement');

const enhance = async (heading, url, columns, transform) => {
	const debug = location.search.includes('debug');
	const loading = (finished, render) => {
		document.querySelector(`#${heading}`).classList[finished ? 'remove' : 'add']('loading');
		if (render) {
			document.querySelector(`#${heading} + *`).outerHTML = render;
		}
		if (finished && debug) {
			console.debug(`Loading #${heading} ${finished}.`);
		}
	};
	const render = (json) => {
		const rows = transform(json).map((row) => `<td>${row.join('</td><td>')}</td>`);
		const thead = `<thead><tr><th>${columns.join('</th><th>')}</th></tr></thead>`;
		const tbody = `<tbody><tr>${rows.join('</tr><tr>')}</tr></tbody>`;
		return `<div><table aria-labelledby="${heading}">${thead}${tbody}</table></div>`;
	};
	loading();
	const preFetched = window.localStorage.getItem(heading);
	if (preFetched) {
		try {
			const json = JSON.parse(preFetched);
			loading('from localStorage', render(json));
		} catch (err) {
			if (debug) {
				console.error(err);
				console.debug(`Could not use localStorage for #${heading}.`);
			}
		}
	}
	try {
		const response = await fetch(url);
		const json = await response.json();
		window.localStorage.setItem(heading, JSON.stringify(json));
		loading('from network', render(json));
	} catch (err) {
		if (debug) {
			console.error(err);
		}
		console.warn(`Could not load #${heading}.`);
		loading('failed');
	}
};

enhance('presentations', '/slides.json', ['Talk', 'Links', 'Event', 'Location', 'Year'], (json) => json.map((talk) => {
	const links = talk.links.map((link) => {
		const url = new URL(link.url);
		const isSameOrigin = url.host === 'cssence.github.io';
		const rel = isSameOrigin || url.host.endsWith('cssence.com') ? '' : ' rel="noreferrer noopener"';
		const href = isSameOrigin ? url.pathname : link.url;
		return `<a${rel} href="${href}">${link.name}</a>`;
	});
	return [`<em>${talk.title}</em>`, links.join(', '), talk.event, talk.location, talk.date.split('-')[0]];
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

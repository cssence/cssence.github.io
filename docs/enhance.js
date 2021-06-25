console.info('https://en.wikipedia.org/wiki/Progressive_enhancement');

const enhance = (heading, url) => {
	document.querySelector(`#${heading}`).classList.add('loading');
	return fetch(url);
};

const finish = (heading, content, err) => {
	if (err) {
		if (location.search === '?debug') {
			console.error(err);
		}
		console.warn(`Could not load ${heading}.`);
	} else {
		document.querySelector(`#${heading} + p`).outerHTML = content;
	}
	document.querySelector(`#${heading}`).classList.remove('loading');
};

enhance('links', 'https://cv.cssence.com/bookmarks.json')
.then((response) => response.json())
.then((json) => {
	const tr = [];
	json.forEach((link) => {
		const url = new URL(link.url);
		console.log(link);
		const urlDisplay = url.pathname === '/' ? url.host : [url.host, url.pathname].join('');
		tr.push(`<tr><td><a href="${link.url}">${link.name}</a></td><td>${urlDisplay}</td></tr>`);
	});
	finish('links', `<div><table aria-labelledby="links"><thead><tr><th>Name</th><th>URL</th></thead><tbody>${tr.join('')}</tbody></table></div>`);
})
.catch((err) => finish('links', null, err))

enhance('resources', 'assets.json')
.then((response) => response.json())
.then((json) => {
	const tr = [];
	json.forEach((resource) => {
		const url = new URL(resource.url);
		const href = url.host === 'cssence.github.io' ? url.pathname : resource.url;
		const name = url.pathname.split('/').pop();
		const type = resource.mimeType;
		const dims = resource.width ? `${resource.width}×${resource.height}` : 'n/a';
		const size = typeof resource.size === 'number' ? `${Math.round(resource.size / 100) / 10} KB` : '?';
		tr.push(`<tr><td><a download href="${href}">${name}</a></td><td>${type}</td><td>${dims}</td><td><data value="${resource.size}">${size}</data></td></tr>`);
	});
	finish('resources', `<div><table aria-labelledby="resources"><thead><tr><th>File</th><th>Mime Type</th><th>Dimensions</th><th>Size</th></thead><tbody>${tr.join('')}</tbody></table></div>`);
})
.catch((err) => finish('resources', null, err))

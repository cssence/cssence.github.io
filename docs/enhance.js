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
	const listItems = [];
	json.forEach((link) => {
		listItems.push(`<li><a href="${link.url}">${link.name}</a></li>`);
	});
	finish('links', `<ul>${listItems.join('')}</ul>`);
})
.catch((err) => finish('links', null, err))

enhance('resources', 'assets.json')
.then((response) => response.json())
.then((json) => {
	const tableRows = [];
	json.forEach((resource) => {
		const url = new URL(resource.url);
		const href = url.host === 'cssence.github.io' ? url.pathname : resource.url;
		const name = url.pathname.split('/').pop();
		const dims = resource.width ? `${resource.width}×${resource.height}` : 'n/a';
		const size = typeof resource.size === 'number' ? `${Math.round(resource.size / 100) / 10} KB` : '?';
		tableRows.push(`<tr><td><a download href="${href}">${name}</a></td><td>${dims}</td><td><data value="${resource.size}">${size}</data></td></tr>`);
	});
	finish('resources', `<div><table><thead><tr><th>File</th><th>Dimensions</th><th>Size</th></thead><tbody>${tableRows.join('')}</tbody></table></div>`);
})
.catch((err) => finish('resources', null, err))

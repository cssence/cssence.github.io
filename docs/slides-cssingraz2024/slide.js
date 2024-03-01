const init = () => {
	const slides = document.querySelectorAll('main > div');
	const slideMap = [];
	slides.forEach((slide, index) => {
		slideMap[index] = slide.querySelectorAll('[data-step]').length;
	});
	let current = 0;
	const slide = (dir) => {
		if (slideMap[current]) {
			const currentStep = parseInt(slides[current].getAttribute('data-current'), 10);
			if (currentStep + dir >= 0 && currentStep + dir <= slideMap[current]) {
				slides[current].setAttribute('data-current', '' + (currentStep + dir));
				return;
			}
		}
		if (current + dir < 0 || current + dir >= slides.length) return;
		slides[current].removeAttribute('data-current');
		current += dir;
		slides[current].setAttribute('data-current', dir === -1 ? '' + slideMap[current] : '0');
	};
	const navigate = (event) => {
		const dir = {'ArrowUp': -1, 'ArrowLeft': -1, 'ArrowRight': 1, 'ArrowDown': 1}[event.key];
		if (dir) slide(dir);
	};
	const act = (event) => {
		const target = '#interactive';
		if (location.hash === target) {
			slides[current].setAttribute('data-current', '0');
			window.addEventListener('keydown', navigate);
		} else if (event && new URL(event.oldURL).hash === target) {
			slides[current].removeAttribute('data-current');
			current = 0;
			window.removeEventListener('keydown', navigate);
		}
	};
	act();
	window.addEventListener("hashchange", act);
};
if (document.readyState !== 'loading') {
	init();
} else {
	document.addEventListener('DOMContentLoaded', init);
}

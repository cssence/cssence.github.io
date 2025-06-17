const init = () => {
	const slides = document.querySelectorAll('main > div');
	const slideMap = [];
	slides.forEach((slide, index) => {
		slideMap[index] = slide.querySelectorAll('[data-step]').length;
	});
	let current = 0;
	const slide = (dir) => {
		if (slideMap[current] && dir === 1) {
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
		const animate = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
		slides[current].scrollIntoView({ behavior: animate ? 'smooth' : 'instant' });
		// history.pushState({}, window.title, `#${slides[current].id}`);
	};
	const navigate = (event) => {
		event.preventDefault();
		const dir = {'ArrowUp': -1, 'ArrowLeft': -1, 'ArrowRight': 1, 'ArrowDown': 1}[event.key];
		if (dir) slide(dir);
	};
	document.querySelector('nav').innerHTML += ' <button aria-pressed="false">Interactive</button>';
	document.querySelector('nav button').addEventListener('click', (event) => {
		const newState = event.target.getAttribute('aria-pressed') === 'false';
		event.target.setAttribute('aria-pressed', newState);
		if (newState === true) {
			const id = location.hash ? location.hash.slice(1) : '';
			const target = parseInt(id, 10);
			if (target == id) current = target;
			slides[current].setAttribute('data-current', '0');
			window.addEventListener('keydown', navigate);
			slides[current].scrollIntoView({ behavior: 'instant' });
		} else {
			slides[current].removeAttribute('data-current');
			window.removeEventListener('keydown', navigate);
		}
	});
};
if (document.readyState !== 'loading') {
	init();
} else {
	document.addEventListener('DOMContentLoaded', init);
}

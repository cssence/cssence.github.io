(function(window, document, loadJS, loadCSS) {
	"use strict";
	if ("querySelector" in document && "addEventListener" in window && "classList" in document.body) {
		var topLevelClassList = document.querySelector("html").classList;
		topLevelClassList.add("js");
		topLevelClassList.remove("no-js");
		document.querySelector("[href='#interactive']").addEventListener("click", function(event) {
			event.preventDefault();
			[].forEach.call(document.querySelectorAll("[id]"), function (section) {
				section.removeAttribute("id");
			});
			var cdn = "https://cdn.jsdelivr.net/reveal.js/3.0.0";
			loadCSS(cdn + "/css/reveal.min.css");
			loadCSS(cdn + "/css/theme/black.css");
			loadJS(cdn + "/js/reveal.min.js", function () {
				Reveal.initialize({
					controls: false,
					history: true,
					overview: false,
					transition: "slide",
					backgroundTransition: "none"
				});
			});
		});
	}
}(window, document, loadJS, loadCSS));

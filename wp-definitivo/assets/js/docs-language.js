(function () {
	'use strict';

	function init() {
		var docs = document.querySelector('.wpdef-docs');
		if (! docs) {
			return;
		}

		var buttons = docs.querySelectorAll('[data-language-toggle]');
		var panels = docs.querySelectorAll('[data-language-panel]');
		var saved = window.localStorage.getItem('wpdef-docs-language') || 'pt';

		function setLanguage(language) {
			buttons.forEach(function (button) {
				var active = button.getAttribute('data-language-toggle') === language;
				button.setAttribute('aria-pressed', active ? 'true' : 'false');
			});
			panels.forEach(function (panel) {
				var active = panel.getAttribute('data-language-panel') === language;
				panel.classList.toggle('is-active', active);
				panel.setAttribute('aria-hidden', active ? 'false' : 'true');
			});
			window.localStorage.setItem('wpdef-docs-language', language);
		}

		buttons.forEach(function (button) {
			button.addEventListener('click', function () {
				setLanguage(button.getAttribute('data-language-toggle'));
			});
		});

		setLanguage(saved === 'en' ? 'en' : 'pt');
	}

	if ('loading' === document.readyState) {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}());

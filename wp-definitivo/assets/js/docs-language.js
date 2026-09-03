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
		var hero = docs.querySelector('.wpdef-docs__hero');
		var footer = docs.querySelector('.wpdef-docs__footer-inner');
		var skip = docs.querySelector('.wpdef-docs__skip');
		var originalHero = hero ? hero.innerHTML : '';
		var originalFooter = footer ? footer.innerHTML : '';
		var originalSkip = skip ? { text: skip.textContent, href: skip.getAttribute('href') } : null;

		function setSidebar(language) {
			docs.querySelectorAll('.wpdef-docs__nav').forEach(function (nav) {
				nav.querySelectorAll('.wpdef-docs__nav-title').forEach(function (title) {
					var list = title.nextElementSibling;
					if (! list || 'UL' !== list.tagName) {
						return;
					}
					var english = Boolean(list.querySelector('a[href^="#en-"]'));
					var visible = 'en' === language ? english : ! english;
					title.hidden = ! visible;
					list.hidden = ! visible;
				});
			});
		}

		function setHeroAndFooter(language) {
			if ('en' !== language) {
				if (hero) hero.innerHTML = originalHero;
				if (footer) footer.innerHTML = originalFooter;
				if (skip && originalSkip) { skip.textContent = originalSkip.text; skip.setAttribute('href', originalSkip.href); }
				return;
			}
			if (hero) {
				hero.querySelector('.wpdef-docs__eyebrow').textContent = 'Official documentation';
				hero.querySelector('.wpdef-docs__lead').textContent = 'A classic, accessible, content-focused theme for blogs, institutional websites, and WooCommerce stores — with native integration for the block editor and Elementor.';
				hero.querySelector('.wpdef-docs__status').innerHTML = '<div><dt>Documented version</dt><dd>1.0.58</dd></div><div><dt>WordPress</dt><dd>6.6 or later</dd></div><div><dt>PHP</dt><dd>7.4 or later</dd></div><div><dt>License</dt><dd>GPL v2 or later</dd></div>';
			}
			if (footer) footer.innerHTML = '<p><strong>WP Definitivo 1.0.58</strong><br>Documentation updated in September 2026.</p><p><a href="https://wpdefinitivo.com/contato/">Request support</a></p>';
			if (skip) { skip.textContent = 'Skip to documentation'; skip.setAttribute('href', '#en-documentation'); }
		}

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
			setSidebar(language);
			setHeroAndFooter(language);
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

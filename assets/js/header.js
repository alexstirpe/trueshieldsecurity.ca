// Toggle header transparency on scroll
(function(){
	const SCROLL_THRESHOLD = 32; // pixels

	function init() {
		const header = document.querySelector('.site-header');
		if(!header) return;

		const onScroll = () => {
			const offset = window.scrollY || document.documentElement.scrollTop;
			if(offset > SCROLL_THRESHOLD) {
				header.classList.add('scrolled');
				header.classList.remove('transparent'); // remove legacy class if present
			} else {
				header.classList.remove('scrolled');
			}
		};

		// Run on load and on scroll
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

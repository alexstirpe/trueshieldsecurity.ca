// Toggle header transparency on scroll
(function(){
	const header = document.querySelector('.site-header');
	if(!header) return;

	const onScroll = () => {
		const offset = window.scrollY || document.documentElement.scrollTop;
		if(offset > 20) {
			header.classList.add('transparent');
		} else {
			header.classList.remove('transparent');
		}
	};

	// Run on load and on scroll
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });
})();

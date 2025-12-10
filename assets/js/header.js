/*
	============================================================
	Project Name: "The Awarded Contract" — True Shield Security Services Website Project
	Description: A fully original website created using basic HTML, CSS,
							 and JavaScript elements for a locally owned and operated 
							 manned security services — True Shield Security. Designed and built as a
							 collaborative portfolio project.

	Created By:
		• Alexandria S.
		• Mohammed M.

	Date: December 9, 2025
	Location: Ontario, Canada

	Ownership: This site was developed in partnership with True Shield Security Services,
						 with full approval and contribution from the business.
						 All content and design elements are original and tailored
						 to represent the brand's local presence and mission.

	Copyright © 2025 True Shield Security Services & Molex | All Rights Reserved.

	✨ Built with pride. Fueled by community. Powered by vision. ✨
	============================================================
*/

// Toggle header transparency on scroll
(function(){
	const SCROLL_THRESHOLD = 32; // fallback pixels

	function init() {
		const header = document.querySelector('.site-header');
		if(!header) return;

		// Exclude about page explicitly
		const isAbout = document.body.classList.contains('about-preview') || /about(?:\.html)?$/.test(location.pathname);

		// Prefer the hero inner (text block) bottom as the trigger so the header
		// becomes solid one logical step before large media (images) end.
		let hero = document.querySelector('.hero');
		let heroInner = document.querySelector('.hero .hero-inner') || null;
		// For home page prefer the hero media image bottom so the header stops exactly
		// at the end of the visual. Fallback to heroInner if image not present.
		let heroMediaImg = document.querySelector('.hero .hero-media .security-main-asset') || null;
		let heroBottom = null;
		if (document.body.classList.contains('home') && heroMediaImg) {
			heroBottom = heroMediaImg.getBoundingClientRect().bottom + window.scrollY;
		} else {
			heroBottom = heroInner ? (heroInner.getBoundingClientRect().bottom + window.scrollY) : (hero ? (hero.getBoundingClientRect().bottom + window.scrollY) : null);
		}

		const recalcHero = () => {
			hero = document.querySelector('.hero');
			heroInner = document.querySelector('.hero .hero-inner') || null;
			heroMediaImg = document.querySelector('.hero .hero-media .security-main-asset') || null;
			if (document.body.classList.contains('home') && heroMediaImg) {
				// Use the image's visual bottom; include a 1px buffer to account for subpixel rounding.
				heroBottom = Math.round(heroMediaImg.getBoundingClientRect().bottom + window.scrollY) - 1;
			} else {
				heroBottom = heroInner ? Math.round(heroInner.getBoundingClientRect().bottom + window.scrollY) - 1 : (hero ? Math.round(hero.getBoundingClientRect().bottom + window.scrollY) - 1 : null);
			}
		};

		// If a hero image exists, ensure we recalc when it finishes loading (important for slow loads)
		if (heroMediaImg) {
			if (!heroMediaImg.complete) {
				heroMediaImg.addEventListener('load', () => { recalcHero(); onScroll(); }, { once: true });
			}
			// also listen for orientationchange to catch browser UI chrome changes on mobile
			window.addEventListener('orientationchange', () => { setTimeout(() => { recalcHero(); onScroll(); }, 120); }, { passive: true });
		}

			let scheduled = false;
			const onScroll = () => {
				if (scheduled) return;
				scheduled = true;
				window.requestAnimationFrame(()=>{
					const offset = window.scrollY || document.documentElement.scrollTop;

					if(!isAbout && heroBottom) {
						// If we're on home and using the hero image, make the header solid
						// precisely when the header bottom reaches the image bottom. This
						// prevents the header from scrolling past the hero image.
						if (document.body.classList.contains('home') && heroMediaImg) {
							// offset + header height represents the header bottom position
							// add a small safety buffer to account for mobile browser chrome and rounding
							const SAFETY_BUFFER = 6; // px
							if ((offset + header.offsetHeight + SAFETY_BUFFER) >= (heroBottom - 1)) {
								header.classList.add('scrolled');
								header.classList.remove('transparent');
							} else {
								header.classList.remove('scrolled');
							}
						} else {
							// Fallback behaviour for other pages: keep the earlier EARLY_OFFSET logic
							const BASE_OFFSET = 48; // base pixels earlier
							const smallViewportAdj = (window.innerWidth <= 640) ? 12 : 0;
							const HOME_EXTRA = 0;
							const EARLY_OFFSET = BASE_OFFSET + smallViewportAdj + HOME_EXTRA;
							if(offset > heroBottom - header.offsetHeight - EARLY_OFFSET) {
								header.classList.add('scrolled');
								header.classList.remove('transparent');
							} else {
								header.classList.remove('scrolled');
							}
						}
					} else {
						if(offset > SCROLL_THRESHOLD) {
							header.classList.add('scrolled');
							header.classList.remove('transparent');
						} else {
							header.classList.remove('scrolled');
						}
					}

					scheduled = false;
				});
			};

		// Init and wire events
		recalcHero();
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', () => { recalcHero(); onScroll(); }, { passive: true });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

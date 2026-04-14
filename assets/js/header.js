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
							applyTransparentState();
							} else {
							header.classList.remove('scrolled');
							applySolidState();
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
								applyTransparentState();
								} else {
								header.classList.remove('scrolled');
								applySolidState();
								}
						}
					} else {
						if(offset > SCROLL_THRESHOLD) {
							header.classList.add('scrolled');
							header.classList.remove('transparent');
							applyTransparentState();
							} else {
							header.classList.remove('scrolled');
							applySolidState();
							}
					}

					scheduled = false;
				});
			};

		// Init and wire events
		recalcHero();
		onScroll();

		// Helpers to enforce visual state via inline styles so legacy CSS
		// can't leave the header in an unexpected color.
		const applyTransparentState = () => {
			try {
				header.style.setProperty('background', 'transparent', 'important');
				header.style.setProperty('color', '#ffffff', 'important');
				header.style.setProperty('box-shadow', 'none', 'important');
				header.style.setProperty('backdrop-filter', 'none', 'important');
				header.classList.remove('scrolled');
				header.classList.add('transparent');
			} catch (e) { /* ignore */ }
		};

		const applySolidState = () => {
			try {
				header.style.removeProperty('background');
				header.style.removeProperty('color');
				header.style.removeProperty('box-shadow');
				header.style.removeProperty('backdrop-filter');
				header.classList.remove('transparent');
				// keep no 'scrolled' class here so default dark background (var(--bg)) shows
			} catch (e) { /* ignore */ }
		};

		// Start with a solid (dark) header at load; onScroll will flip to
		// transparent when appropriate.
		applySolidState();
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

/* Progressive enhancement: copy data-bg-src into inline background-image for
   elements with .bg-enhance when on small viewports. This keeps the <img>
   accessible while using background positioning visually. */
(function(){
	function applyBgEnhance() {
		// allow enhancement on phones and tablets up to 1024px width
		const small = window.innerWidth <= 1024;
		const body = document.body;
		const items = document.querySelectorAll('.bg-enhance');
		if (!items || items.length === 0) return;

		if (small) {
			items.forEach(el => {
				const src = el.getAttribute('data-bg-src');
				const img = el.querySelector('img');
				// prefer an explicit data attribute for background-position, fall back to the img's object-position
				let bgPos = el.getAttribute('data-bg-pos') || '';
				if (!bgPos && img) {
					try {
						const cs = window.getComputedStyle(img);
						const objPos = cs.getPropertyValue('object-position');
						if (objPos) bgPos = objPos.trim();
					} catch (e) {
						/* ignore */
					}
				}

				if (src) {
					el.style.backgroundImage = `url("${src}")`;
					el.style.backgroundRepeat = 'no-repeat';

					// If the source <img> used transform:scale(...) to slightly zoom, copy
					// an equivalent background-size (approx) so the background matches the visual crop.
					let bgSize = 'cover';
					if (img) {
						try {
							const cs = window.getComputedStyle(img);
							const transform = cs.getPropertyValue('transform');
							// look for matrix(...) where scale is present; handle matrix(a, b, c, d, tx, ty)
							if (transform && transform !== 'none') {
								const m = transform.match(/matrix\(([^)]+)\)/);
								if (m && m[1]) {
									const parts = m[1].split(',').map(s => parseFloat(s.trim()));
									// scaleX is parts[0], scaleY is parts[3]
									const sx = parts[0] || 1;
									const sy = parts[3] || 1;
									// approximate background-size percentage relative to cover
									const avgScale = (Math.abs(sx) + Math.abs(sy)) / 2;
									if (!isNaN(avgScale) && avgScale > 0.98 && avgScale < 1.5) {
										// make background-size slightly greater than 100% to emulate scale
										bgSize = `${Math.round(100 * avgScale)}%`;
									}
								}
							}
						} catch (e) { /* ignore */ }
					}

					el.style.backgroundSize = bgSize;
					el.style.backgroundPosition = bgPos || 'center top';
				}

				// apply a lightweight visual-hide directly to the img to avoid a visible double-layer
				if (img) {
					img.style.position = 'absolute';
					img.style.left = '-9999px';
					img.style.width = '1px';
					img.style.height = '1px';
					img.style.overflow = 'hidden';
					img.style.clip = 'rect(1px, 1px, 1px, 1px)';
					img.style.clipPath = 'inset(50%)';
				}
			});
			body.classList.add('use-bg');
		} else {
			items.forEach(el => {
				el.style.backgroundImage = '';
				el.style.backgroundSize = '';
				el.style.backgroundRepeat = '';
				el.style.backgroundPosition = '';
				const img = el.querySelector('img');
				if (img) {
					img.style.position = '';
					img.style.left = '';
					img.style.width = '';
					img.style.height = '';
					img.style.overflow = '';
					img.style.clip = '';
					img.style.clipPath = '';
				}
			});
			body.classList.remove('use-bg');
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applyBgEnhance);
	} else {
		applyBgEnhance();
	}
	window.addEventListener('resize', () => { setTimeout(applyBgEnhance, 80); }, { passive: true });
	window.addEventListener('orientationchange', () => { setTimeout(applyBgEnhance, 160); }, { passive: true });
})();

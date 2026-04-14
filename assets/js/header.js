document.addEventListener("DOMContentLoaded", function () {
	const body = document.body;
	const header = document.querySelector(".site-header");
	const hamburger = document.querySelector(".hamburger");
	const mobileNav = document.querySelector(".mobile-nav");

	function setMenu(open) {
		if (!hamburger || !mobileNav) return;
		hamburger.classList.toggle("active", open);
		hamburger.setAttribute("aria-expanded", String(open));
		mobileNav.classList.toggle("active", open);
		body.classList.toggle("nav-open", open);
	}

	/* Always keep header solid and consistent */
	if (header) {
		header.classList.add("is-solid");
	}

	if (hamburger && mobileNav) {
		hamburger.addEventListener("click", function (event) {
			event.stopPropagation();
			setMenu(!hamburger.classList.contains("active"));
		});

		mobileNav.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", function () {
				setMenu(false);
			});
		});

		document.addEventListener("click", function (event) {
			if (!mobileNav.classList.contains("active")) return;
			const clickedInsideNav = mobileNav.contains(event.target);
			const clickedHamburger = hamburger.contains(event.target);

			if (!clickedInsideNav && !clickedHamburger) {
				setMenu(false);
			}
		});

		window.addEventListener("resize", function () {
			if (window.innerWidth > 900) {
				setMenu(false);
			}
		});
	}
});
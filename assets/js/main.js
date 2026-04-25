document.addEventListener("DOMContentLoaded", function () {
	const cards = document.querySelectorAll(".home .services-grid .card");

	if (!cards.length) return;

	cards.forEach((card, index) => {
		card.style.setProperty("--i", String(index));
		card.dataset.animated = "true";
	});

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	cards.forEach((card) => observer.observe(card));
});


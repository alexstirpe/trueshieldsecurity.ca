<script>
document.getElementById("vaarsQuiz").addEventListener("submit", async function(e) {
	e.preventDefault();

	const formData = new FormData(this);
	const data = Object.fromEntries(formData.entries());

	/* Simple scoring logic */
	let score = 0;

	if (data.unauthorized_activity === "Frequently") score += 2;
	if (data.after_hours_access.includes("Yes")) score += 2;
	if (data.law_enforcement === "Yes") score += 2;
	if (data.client_burden === "Very important") score += 2;

	let resultText = "";

	if (score >= 6) {
		resultText = "VAARS is a strong fit for your property. We recommend speaking with our team.";
	} else if (score >= 3) {
		resultText = "VAARS may benefit your operations depending on your needs.";
	} else {
		resultText = "VAARS may not be necessary at this time, but we’re happy to advise.";
	}

	const resultBox = document.getElementById("quizResult");
	resultBox.textContent = resultText;
	resultBox.hidden = false;

	/* SEND TO GOOGLE SHEETS */
	await fetch("YOUR_GOOGLE_SCRIPT_URL", {
		method: "POST",
		body: JSON.stringify(data)
	});
});
</script>
window.addEventListener("DOMContentLoaded", () => {

	"use strict";

	const showScore = function(data) {
		let result = 0;
		const template = document.querySelector(".summary-template");
		if (!"content" in template) return;
		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			const clone = template.content.cloneNode(true);
			clone.querySelector(".summary-item").setAttribute("id", item.category);
			clone.querySelector(".summary-label-icon").setAttribute("src", item.icon);
			clone.querySelector(".summary-label-text").textContent = item.category;
			clone.querySelector(".summary-score-num").textContent = item.score;
			template.parentNode.appendChild(clone);
			result += item.score;
		}
		result = Math.round(result / data.length);
		document.querySelector(".result-score-num").textContent = result;
	};

	fetch("data.json")
	.then((response) => response.json())
	.then((data) => showScore(data));

});

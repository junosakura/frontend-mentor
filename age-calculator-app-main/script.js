class AgeCalculator {

	constructor() {
		this.$form        = document.querySelector("#form");
		this.$submit      = document.querySelector("#submit");
		this.$inputDay    = document.querySelector("#inputDay");
		this.$inputMonth  = document.querySelector("#inputMonth");
		this.$inputYear   = document.querySelector("#inputYear");
		this.$errorDay    = document.querySelector("#errorDay");
		this.$errorMonth  = document.querySelector("#errorMonth");
		this.$errorYear   = document.querySelector("#errorYear");
		this.$resultDay   = document.querySelector("#resultDay");
		this.$resultMonth = document.querySelector("#resultMonth");
		this.$resultYear  = document.querySelector("#resultYear");
		this._regexpInt   = /^\d+$/;
		this._textEmpty   = "This field is required";
		this._textInvalid = "Must be a valid";
		this._textFuture  = "Must be in the past";
		this._textHyphen  = "--";
	}

	init() {
		this.$submit.addEventListener("click", (event) => {
			event.preventDefault();
			this.run();
		});
	}

	run() {
		const today = this.getToday();
		const birthday = this.getBirthday();
		const age = this.calcAge(today, birthday);
		this.showAge(age);
	}

	getToday() {
		const date = new Date();
		const y = date.getFullYear();
		const m = date.getMonth();
		const d = date.getDate();
		return this.newDate(y, m, d);
	}

	getBirthday() {
		const y = this.getYear();
		const m = this.getMonth(y);
		const d = this.getDay(y, m);
		const date = this.newDate(y, m - 1, d);
		return y && m && d ? date : false;
	}

	getYear() {
		const value = this.$inputYear.value;
		return this.isYear(value) ? value : null;
	}

	getMonth(year) {
		const value = this.$inputMonth.value;
		return this.isMonth(value, year) ? value : null;
	}

	getDay(year, month) {
		const value = this.$inputDay.value;
		return this.isDay(value, year, month) ? value : null;
	}

	isYear(value) {
		const maxValue = 9999;
		const maxDate = this.newDate(value, 0, 1);
		const error = this.getError(value, maxValue, maxDate);
		const flag = this.setError(this.$errorYear, error, "year");
		return flag;
	}

	isMonth(value, year) {
		const maxValue = 12;
		const maxDate = this.newDate(year, value - 1, 1);
		const error = this.getError(value, maxValue, maxDate);
		const flag = this.setError(this.$errorMonth, error, "month");
		return flag;
	}

	isDay(value, year, month) {
		const maxValue = this.newDate(year, month, 0).getDate();
		const maxDate = this.newDate(year, month - 1, value);
		const error = this.getError(value, maxValue, maxDate);
		const flag = this.setError(this.$errorDay, error, "day");
		return flag;
	}

	newDate(year, monthIndex, day) {
		const date = new Date(0);
		date.setFullYear(year);
		date.setMonth(monthIndex);
		date.setDate(day);
		return date;
	}

	getError(value, maxValue, maxDate) {
		if (this.isEmpty(value)) {
			return "empty";
		}
		else if (this.isInvalid(value, maxValue)) {
			return "invalid";
		}
		else if (this.isFuture(maxDate)) {
			return "future";
		}
		else {
			return null;
		}
	}

	setError($error, errorType, dateType) {
		if (errorType === "empty") {
			this.showError($error, this._textEmpty);
			return false;
		}
		else if (errorType === "invalid") {
			this.showError($error, this._textInvalid + " " + dateType);
			return false;
		}
		else if (errorType === "future") {
			this.showError($error, this._textFuture);
			return false;
		}
		else {
			this.showError($error);
			return true;
		}
	}

	showError($error, errorText) {
		$error.textContent = errorText || null;
		$error.hidden = !errorText;
	}

	isEmpty(value) {
		return value === "";
	}

	isInvalid(value, maxValue) {
		return !this._regexpInt.test(value) || value < 1 || value > maxValue;
	}

	isFuture(maxDate) {
		return new Date() < maxDate;
	}

	isDate(date) {
		return Object.prototype.toString.call(date) === "[object Date]";
	}

	calcAge(today, birthday) {
		if (!this.isDate(today) || !this.isDate(birthday)) {
			return false;
		}
		const till = new Date(today - birthday);
		const y = till.getFullYear() - 1970;
		const m = till.getMonth();
		const d = till.getDate() - 1;
		return {year: y, month: m, day: d};
	}

	async showAge(age) {
		if (!age) {
			this.$resultYear.textContent = this._textHyphen;
			this.$resultMonth.textContent = this._textHyphen;
			this.$resultDay.textContent = this._textHyphen;
			this.$form.classList.toggle("error", true);
			return false;
		}
		const timer = 10;
		for (let i = 0; i <= timer; i++) {
			await this.waitAnimation();
			this.$resultYear.textContent = this.clampValue(age.year, timer, i);
			this.$resultMonth.textContent = this.clampValue(age.month, timer, i);
			this.$resultDay.textContent = this.clampValue(age.day, timer, i);
			this.$form.classList.toggle("error", false);
		}
	}

	waitAnimation() {
		return new Promise((resolve) => {
			window.requestAnimationFrame(resolve);
		});
	}

	clampValue(value, timer, i) {
		const now = Math.floor(value / timer * i);
		return Math.min(Math.max(value, 0), now);
	}

}

window.addEventListener("DOMContentLoaded", () => {
	"use strict";
	const app = new AgeCalculator();
	app.init();
});

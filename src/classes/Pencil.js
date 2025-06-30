export class Pencil {
	constructor({
		pointDurability = 100,
		length = 10,
		eraserDurability = 100,
	} = {}) {
		this.initialDurability = pointDurability;
		this.pointDurability = pointDurability;
		this.length = length;
		this.eraserDurability = eraserDurability;
	}

	write(paper, text) {
		let output = paper;
		for (let char of text) {
			const cost = this._charCost(char);
			if (this.pointDurability >= cost) {
				output += char;
				this.pointDurability -= cost;
			} else {
				output += " ";
			}
			// Ensure durability doesn't go below 0
			if (this.pointDurability < 0) this.pointDurability = 0;
		}
		return output;
	}

	sharpen() {
		if (this.length > 0) {
			this.pointDurability = this.initialDurability;
			this.length -= 1;
		}
	}

	erase(paper, word) {
		const lastIndex = paper.lastIndexOf(word);
		if (lastIndex === -1) return paper;

		const chars = paper.split("");
		for (let i = lastIndex + word.length - 1; i >= lastIndex; i--) {
			if (this.eraserDurability > 0 && chars[i] !== " ") {
				chars[i] = " ";
				this.eraserDurability--;
			}
		}

		return chars.join("");
	}

	edit(paper, newText) {
		const blankMatch = paper.match(/ {2,}/);
		if (!blankMatch) return paper;

		// Start AFTER the first space of the matched blanks
		const start = blankMatch.index + 1;

		const chars = paper.split("");

		for (let i = 0; i < newText.length; i++) {
			const idx = start + i;
			if (idx >= chars.length) break;

			if (chars[idx] === " ") {
				chars[idx] = newText[i];
			} else {
				chars[idx] = "@";
			}

			this.pointDurability -= this._charCost(newText[i]);
		}

		return chars.join("");
	}

	_charCost(char) {
		if (char === " " || char === "\n") return 0;
		if (char >= "A" && char <= "Z") return 2;
		return 1;
	}
}

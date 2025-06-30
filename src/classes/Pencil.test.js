import { Pencil } from "./Pencil";

describe("Pencil", () => {
	let pencil;

	beforeEach(() => {
		pencil = new Pencil();
	});

	it("writes text on an empty paper", () => {
		const paper = "";
		const text = "Hello, World!";
		const result = pencil.write(paper, text);
		expect(result).toBe("Hello, World!");
	});

	it("writes text on a paper with existing content", () => {
		const paper = "Existing content. ";
		const text = "Hello, World!";
		const result = pencil.write(paper, text);
		expect(result).toBe("Existing content. Hello, World!");
	});

	it("writes text on a paper with existing content and a newline", () => {
		const paper = "Existing content.\n";
		const text = "Hello, World!";
		const result = pencil.write(paper, text);
		expect(result).toBe("Existing content.\nHello, World!");
	});

	it("degrades durability when writing lowercase and uppercase letters", () => {
		const pencil = new Pencil({ pointDurability: 4 });
		const paper = "";
		const result = pencil.write(paper, "Text"); // T=2, e=1, x=1, t=1 → total needed: 5
		expect(result).toBe("Tex "); // Only 4 durability: "T" (2), "e" (1), "x" (1) = 4 used, "t" can't be written
	});

	it("writing spaces or newlines does not degrade durability", () => {
		const pencil = new Pencil({ pointDurability: 2 });
		const paper = "";
		const result = pencil.write(paper, " \n");
		expect(result).toBe(" \n"); // No degradation
	});

	it("restores point durability when sharpened", () => {
		const pencil = new Pencil({ pointDurability: 4, length: 3 });
		let paper = "";
		paper = pencil.write(paper, "Text"); // uses up 4 durability
		expect(paper).toBe("Tex ");
		pencil.sharpen(); // restores durability to 4
		paper = pencil.write(paper, "yo");
		expect(paper).toBe("Tex yo"); // writes 2 characters
	});

	it("reduces pencil length on sharpen", () => {
		const pencil = new Pencil({ pointDurability: 4, length: 2 });
		pencil.sharpen();
		expect(pencil.length).toBe(1);
		pencil.sharpen();
		expect(pencil.length).toBe(0);
	});

	it("cannot be sharpened when length is 0", () => {
		const pencil = new Pencil({ pointDurability: 4, length: 1 });
		pencil.sharpen(); // length = 0 now
		pencil.write("", "Text"); // uses up durability
		pencil.sharpen(); // does nothing
		expect(pencil.pointDurability).toBe(0); // still 0
	});

	it("erases the last occurrence of a word by replacing it with spaces", () => {
		const pencil = new Pencil();
		let paper =
			"How much wood would a woodchuck chuck if a woodchuck could chuck wood?";
		paper = pencil.erase(paper, "chuck");
		expect(paper).toBe(
			"How much wood would a woodchuck chuck if a woodchuck could       wood?"
		);

		paper = pencil.erase(paper, "chuck");
		expect(paper).toBe(
			"How much wood would a woodchuck chuck if a wood      could       wood?"
		);
	});

	it("eraser degrades and can stop erasing mid-word", () => {
		const pencil = new Pencil({ eraserDurability: 3 });
		let paper = "Buffalo Bill";
		paper = pencil.erase(paper, "Bill"); // 4 chars to erase but only 3 durability
		expect(paper).toBe("Buffalo B   ");
	});

	it("can edit over erased text without collision", () => {
		const pencil = new Pencil({ pointDurability: 100 });
		let paper = "An       a day keeps the doctor away";
		paper = pencil.edit(paper, "onion");
		expect(paper).toBe("An onion a day keeps the doctor away");
	});

	it('replaces overlapping letters with "@" when editing collides', () => {
		const pencil = new Pencil({ pointDurability: 100 });
		let paper = "An       a day keeps the doctor away";
		paper = pencil.edit(paper, "artichoke");
		expect(paper).toBe("An artich@k@ay keeps the doctor away");
	});
});

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies

// Save markdown post
app.post("/api/save-post", (req, res) => {
	const { slug, content } = req.body;
	if (!slug || !content) {
		return res
			.status(400)
			.json({ success: false, message: "Missing slug or content" });
	}

	const filePath = path.join(__dirname, "posts", `${slug}.md`);

	fs.writeFile(filePath, content, (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res
				.status(500)
				.json({ success: false, message: "Failed to save post" });
		}

		res.json({ success: true, message: "Post saved successfully" });
	});
});

// Optional: serve markdown files statically
app.use("/posts", express.static(path.join(__dirname, "posts")));

app.get("/api/posts/:slug", (req, res) => {
	const slug = req.params.slug;
	const filePath = path.join(__dirname, "posts", `${slug}.md`);

	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			return res.status(404).json({ error: "Post not found" });
		}
		res.send(data);
	});
});
app.listen(PORT, () => {
	console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
	res.send("Markdown Post Server is running 🚀");
});

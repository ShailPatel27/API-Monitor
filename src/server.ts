// import express from 'express';
// import path from 'path';

// const app = express()

// app.use(express.json());

// const publicPath = path.join(process.cwd(), "../public");
// app.use(express.static(publicPath));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(publicPath, "index.html"));
// });

// app.post("/check", async (req, res) => {
//     const { url } = req.body;

//     if (!url) {
//         return res.status(400).json({ message: "URL is required" });
//     }

//     try {
//         const response = await fetch(url);
//         res.json({ message: `Status: ${response.status}` });
//     } catch {
//         res.json({ message: "Request failed" });
//     }
// });


// app.listen(3000, ()=>{
//     console.log("Server running on http://localhost:3000")
// });




import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log("SERVER UP on http://localhost:" + PORT);
});

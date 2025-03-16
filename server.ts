import express, { Application } from "express";
import songsRouter from "./routes/songs";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/songs", songsRouter);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;

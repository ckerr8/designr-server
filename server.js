// initialize Express in project
import express from 'express'
import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();


const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());


app.use("/projects", warehouseRoutes);
app.use("/clients", clientsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/assets", assetsRoutes);

app.get("/", (_req, res) => {
	res.send("Welcome to Instock API");
});

// start Express on port 8080
app.listen(8080, () => {
    console.log('Server Started on http://localhost:8080');
    console.log('Press CTRL + C to stop server');
});

// initialize Express in project
import express from 'express'
import "dotenv/config";
import cors from "cors";
import clientsRoutes from "./routes/clients-routes.js";
const app = express();


const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());


app.use("/clients", clientsRoutes);
// app.use("/projects", projectRoutes);
// app.use("/tasks", tasksRoutes);
// app.use("/assets", assetsRoutes);

app.get("/", (_req, res) => {
	res.send("Welcome to Instock API");
});

// start Express on port 8080
app.listen(8080, () => {
    console.log('Server Started on http://localhost:8080');
    console.log('Press CTRL + C to stop server');
});

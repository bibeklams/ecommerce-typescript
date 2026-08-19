import "dotenv/config";
import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import routes from "./routes/mainRoutes.js"
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT||3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use("/api",routes);

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
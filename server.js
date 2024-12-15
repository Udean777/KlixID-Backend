import express from "express";
import { ENV_VARS } from "./config/env_vars.js";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";

import router from "./routes/auth_route.js";

const app = express();

const PORT = ENV_VARS.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", router);

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});

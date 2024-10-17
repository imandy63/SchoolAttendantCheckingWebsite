import app from "./src/index";

const port = process.env.PORT;

if (!port) {
  throw new Error("Port must be defined");
}

const server = app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server down");
  });
});

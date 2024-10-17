import app from "./src";

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Upload service is available on port: ${port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server down");
  });
});

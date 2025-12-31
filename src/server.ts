import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`--------------------------------`);
  console.log(`Manager Eventos se encuentra corriendo en http://localhost:${PORT} 🚀`);
  console.log(`--------------------------------`);
});

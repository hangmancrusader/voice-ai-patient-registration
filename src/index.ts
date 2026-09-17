import app from "../src/app.ts";
import "dotenv/config";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
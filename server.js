
import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 7777;

app.listen(PORT,()=>{
console.log(`Server is Runnig at ${PORT}`);
});
import generate from "./generate.js";

(async () => {
  try {
    const sql = await generate("list all columns from a table named products");
    console.log("👉 Generated SQL:", sql);
  } catch (e) {
    console.error("🔥 Error inside generate():", e);
  }
})();

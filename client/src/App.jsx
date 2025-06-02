// App.jsx
import styles from "./index.module.css";
import sqlLogo from "./assets/mysql-logo.png";
import { useState } from "react";

function App() {
  const [queryDescription, setQueryDescription] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const generatedQuery = await generateQuery();
      setSqlQuery(generatedQuery);
      console.log("returned from server:", generatedQuery);
    } catch (err) {
      console.error("Error generating query:", err.message);
      setSqlQuery("Error: " + err.message);
    }
  };

  const generateQuery = async () => {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Note: must send `queryDescription`, not `description`
      body: JSON.stringify({ queryDescription }),
    });

    if (!response.ok) {
      const errJson = await response.json();
      // errJson might be { error: "queryDescription is required" } or OpenAI error
      throw new Error(errJson.error || "Unknown server error");
    }

    const data = await response.json();
    return data.response.trim();
  };

  return (
    <main className={styles.main}>
      <img src={sqlLogo} alt="" className={styles.icon} />
      <h3>Generate SQL with AI</h3>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="query-description"
          placeholder="Describe your query"
          onChange={(e) => setQueryDescription(e.target.value)}
        />
        <input type="submit" value="Generate query" />
        <pre>{sqlQuery}</pre>
      </form>
    </main>
  );
}

export default App;

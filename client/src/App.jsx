import styles from './index.module.css'
import sqlLogo from './assets/mysql-logo.png'
import { useState } from 'react'
function App() {
  const [queryDescription, setQueryDescription] = useState("")
  const onSubmit = (e) => {
    e.preventDefualt();
    console.log("form submitted: ", queryDescription)
  }


  return (
    <main className={styles.main}>
      <img src={sqlLogo} alt="" className={styles.icon} />
      <h3>Generate SQL with AI</h3>

      <form onSubmmit={onSubmit}>
        <input 
        type="text"
        name ="query-description"
        placeholder="Describe your query"  
        onChange={() => setQueryDescription(e.target.value)} 
        />
        <input type="submit" value="Generate query" />
      </form>
      </main>
  )
}

export default App

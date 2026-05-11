import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  message: string;
};

function App() {
  const [apiStatus, setApiStatus] = useState<string>("Checking API connection...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((response) => response.json())
      .then((data: HealthResponse) => {
        setApiStatus(data.message);
      })
      .catch(() => {
        setApiStatus("API connection failed");
      });
  }, []);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>BuildFlow</h1>
      <p>Construction Project & Finance Manager</p>

      <section
        style={{
          marginTop: "24px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          maxWidth: "420px",
        }}
      >
        <h2>API Status</h2>
        <p>{apiStatus}</p>
      </section>
    </main>
  );
}

export default App;
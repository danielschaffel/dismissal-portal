import { useEffect, useState } from "react";

function BusRoutes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/routes"); // Replace '/api/data' with your backend API endpoint
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bus Information</h1>
      {data.map((item, index) => (
        <p>
          <a href={`http://localhost:3000/route/${item}`} key={index}>
            {item}
          </a>
        </p>
      ))}
    </div>
  );
}

export default BusRoutes;

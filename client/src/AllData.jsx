import { useState, useEffect } from "react";
import axios from "axios";

const AllData = () => {
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/data");
        setAllData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="my-12 max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">All Data</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Title</th>
              <th className="p-2">Added Date</th>
              <th className="p-2">Added Time</th>
              <th className="p-2">Time Since Last Entry</th>
            </tr>
          </thead>
          <tbody>
            {allData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No data available
                </td>
              </tr>
            ) : (
              allData.map((data, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{data.name}</td>
                  <td className="p-2">{data.title}</td>
                  <td className="p-2">{data.addedDate}</td>
                  <td className="p-2">{data.addedTime}</td>
                  <td className="p-2">{data.timeSinceLastEntry || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllData;

import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"; // You can use dayjs instead if you prefer a lighter package

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    addedDate: "",
    addedTime: "",
  });
  const [todayDate, setTodayDate] = useState("");
  const [lastData, setLastData] = useState(null);
  const [timeAgo, setTimeAgo] = useState("");

  // Fetch the last data entry
  const fetchLastData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/data");
      const lastEntry = response.data[0]; // Get the latest data (first in descending order)
      setLastData(lastEntry);

      // Calculate time ago for the last data entry
      if (lastEntry) {
        const lastAddedDateTime = moment(
          `${lastEntry.addedDate} ${lastEntry.addedTime}`
        );
        const timeDifference = moment().diff(lastAddedDateTime, "minutes");

        const timeAgoString =
          timeDifference >= 60
            ? `${Math.floor(timeDifference / 60)} hours ${
                timeDifference % 60
              } minutes ago`
            : `${timeDifference} minutes ago`;
        setTimeAgo(timeAgoString);
      }
    } catch (error) {
      console.error("Error fetching last data:", error);
    }
  };

  useEffect(() => {
    fetchLastData();
    const today = new Date().toISOString().split("T")[0];
    setTodayDate(today);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDataAddedDateTime = moment(
        `${formData.addedDate} ${formData.addedTime}`
      );
      const lastAddedDateTime = moment(
        `${lastData?.addedDate} ${lastData?.addedTime}`
      );

      const timeDiffInMinutes = newDataAddedDateTime.diff(
        lastAddedDateTime,
        "minutes"
      );
      const timeDiffString =
        timeDiffInMinutes >= 60
          ? `${Math.floor(timeDiffInMinutes / 60)} hours ${
              timeDiffInMinutes % 60
            } minutes`
          : `${timeDiffInMinutes} minutes`;

      const dataToSend = {
        ...formData,
        timeSinceLastEntry: timeDiffString,
      };

      const response = await axios.post(
        "http://localhost:5000/data",
        dataToSend
      );
      console.log(response.data);
      alert("Data added successfully");

      // Fetch the latest data after submitting
      fetchLastData();
    } catch (error) {
      console.error(error);
      alert("Error adding data");
    }
  };

  return (
    <div className="my-12">
      <h1 className="text-center">Add Data</h1>

      {/* Show the last data added time ago */}
      {lastData && (
        <div className="text-center my-6">
          <p>Last data was added {timeAgo}</p>
        </div>
      )}

      <form className="max-w-6xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="form-control md:w-1/2 mx-3 lg:mx-0">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered"
              style={{ outline: "none" }}
            />
          </div>
          <div className="form-control md:w-1/2 mx-3 lg:mx-0">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered"
              style={{ outline: "none" }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <div className="w-full">
              <label className="label">
                <span className="label-text">Added Date</span>
              </label>
              <input
                type="date"
                name="addedDate"
                value={formData.addedDate}
                onChange={handleChange}
                required
                max={todayDate}
                className="input input-bordered w-full"
                style={{ outline: "none" }}
              />
            </div>
            <div className="w-full">
              <label className="label">
                <span className="label-text">Added Time</span>
              </label>
              <input
                type="time"
                name="addedTime"
                value={formData.addedTime}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                style={{ outline: "none" }}
              />
            </div>
          </div>
        </div>
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn bg-red-600 hover:bg-red-600 text-white"
          >
            Add Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;

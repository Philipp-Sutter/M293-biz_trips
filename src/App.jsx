import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";

export default function App() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    description: "",
    startTrip: "",
    endTrip: ""
  });

  useEffect(() => {
    fetch("http://localhost:3001/trips")
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
        setFilteredTrips(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      setFilteredTrips(trips.filter((trip) => trip.startTrip[1] === parseInt(selectedMonth)));
    } else {
      setFilteredTrips(trips);
    }
  }, [selectedMonth, trips]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip.id);
    setFormState({
      id: trip.id,
      title: trip.title,
      description: trip.description,
      startTrip: trip.startTrip.join("-"),
      endTrip: trip.endTrip.join("-")
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleCreateTrip = () => {
    const newTrip = {
      ...formState,
      startTrip: formState.startTrip.split("-").map(Number),
      endTrip: formState.endTrip.split("-").map(Number)
    };

    fetch("http://localhost:3001/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTrip)
    })
    .then((response) => response.json())
    .then((data) => {
      setTrips([...trips, data]);
      setFormState({ id: "", title: "", description: "", startTrip: "", endTrip: "" });
    })
    .catch((error) => console.error("Error creating trip:", error));
  };

  const handleUpdateTrip = () => {
    const updatedTrip = {
      ...formState,
      startTrip: formState.startTrip.split("-").map(Number),
      endTrip: formState.endTrip.split("-").map(Number)
    };

    fetch(`http://localhost:3001/trips/${formState.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTrip)
    })
    .then((response) => response.json())
    .then((data) => {
      setTrips(trips.map(trip => trip.id === data.id ? data : trip));
      setFormState({ id: "", title: "", description: "", startTrip: "", endTrip: "" });
      setSelectedTrip(null);
    })
    .catch((error) => console.error("Error updating trip:", error));
  };

  const handleDeleteTrip = (id) => {
    fetch(`http://localhost:3001/trips/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      setTrips(trips.filter(trip => trip.id !== id));
    })
    .catch((error) => console.error("Error deleting trip:", error));
  };

  function renderTrip(t) {
    return (
      <div className="trip" key={t.id}>
        <figure>
          <div>
            <img src={"images/items/" + t.id + ".jpg"} alt={t.title} />
          </div>
          <figcaption>
            <a href="#">{t.title}</a>
            <div>
              <span>
                {t.startTrip[2] + "-" + t.startTrip[1] + "-" + t.startTrip[0]}
              </span>
            </div>
            <p>{t.description}</p>
            <div>
              <button onClick={() => handleSelectTrip(t)}>Update</button>
              <button onClick={() => handleDeleteTrip(t.id)}>Delete</button>
            </div>
          </figcaption>
        </figure>
        {selectedTrip === t.id && <div>Selected Trip: {t.title}</div>}
      </div>
    );
  }

  return (
    <>
      <div>
        <Header />
        <main>
          <section id="filters">
            <label htmlFor="month">Filter by Month:</label>{" "}
            <select id="month" value={selectedMonth} onChange={handleMonthChange}>
              <option value="">All months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </section>
          <section id="trips" className="trips-container">
            {filteredTrips.map(renderTrip)}
          </section>
          <section id="trip-form">
            <h2>{selectedTrip ? "Update Trip" : "Create New Trip"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); selectedTrip ? handleUpdateTrip() : handleCreateTrip(); }}>
              <label>
                Title:
                <input type="text" name="title" value={formState.title} onChange={handleFormChange} required />
              </label>
              <label>
                Description:
                <input type="text" name="description" value={formState.description} onChange={handleFormChange} required />
              </label>
              <label>
                Start Trip (YYYY-MM-DD-HH-MM):
                <input type="text" name="startTrip" value={formState.startTrip} onChange={handleFormChange} required />
              </label>
              <label>
                End Trip (YYYY-MM-DD-HH-MM):
                <input type="text" name="endTrip" value={formState.endTrip} onChange={handleFormChange} required />
              </label>
              <button type="submit">{selectedTrip ? "Update Trip" : "Create Trip"}</button>
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

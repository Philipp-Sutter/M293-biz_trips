import React from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { useState, useEffect } from "react";

export default function App() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/trips")
      .then((response) => response.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  function renderTrip(t) {
    return (
      <div className="product" key={t.id}>
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
              <button type="button" disabled>
                Add to Triplist
              </button>
            </div>
          </figcaption>
        </figure>
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
            <select id="size">
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
          <section id="products">{trips.map(renderTrip)}</section>
        </main>
      </div>
      <Footer />
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TourCard from "../../shared/TourCard";

const TourList = () => {
  const { city } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/tours/city/${city}`
        );
        setTours(response.data);
      } catch (err) {
        setError("Failed to fetch tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [city]);

  if (loading) {
    return <p className="text-center text-lg">Loading tours...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Tours in {city}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {tours.length > 0 ? (
          tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))
        ) : (
          <p className="text-center text-gray-500">No tours available for this city</p>
        )}
      </div>
    </div>
  );
};

export default TourList;

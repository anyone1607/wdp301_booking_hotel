import { useEffect, useState } from "react";
import CardItem from "../../components/Dashboard/CardItem";
import ChartCustom from "../../components/Dashboard/Chart";

function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const toursResponse = await fetch(
          "http://localhost:8000/api/v1/tours",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const toursData = await toursResponse.json();
        console.log("Tours data:", toursData);

        if (!toursData.data) {
          throw new Error("Invalid tours data format");
        }

        const bookingsResponse = await fetch(
          "http://localhost:8000/api/v1/booking",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const bookingsData = await bookingsResponse.json();
        console.log("Bookings data:", bookingsData);

        if (!bookingsData.data) {
          throw new Error("Invalid bookings data format");
        }

        setTours(toursData.data);
        setBookings(bookingsData.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );
  const totalGuests = confirmedBookings.reduce((acc, booking) => {
    return acc + booking.adult + booking.children + booking.baby;
  }, 0);

  // const totalRevenue = confirmedBookings.reduce((acc, booking) => {
  //   const tour = tours.find((tour) => tour.title === booking.tourName);
  //   return (
  //     acc +
  //     (tour
  //       ? tour.price * (booking.adult + booking.children + booking.baby)
  //       : 0)
  //   );

  //   return acc;
  // }, 0);
  const totalRevenue = confirmedBookings.reduce(
    (acc, booking) => acc + (booking?.totalAmount || 0),
    0
  );

  const totalTours = confirmedBookings.length;

  return (
    <>
      <CardItem
        totalTours={totalTours}
        totalGuests={totalGuests}
        totalRevenue={totalRevenue}
      />
      <ChartCustom />
    </>
  );
}

export default DashboardPage;

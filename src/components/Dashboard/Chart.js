import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const ChartCustom = () => {
  const [data, setData] = useState({
    revenue: [],
    guests: [],
    roomIds: [],
    labels: [],
  });
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        // Fetch tours and bookings in parallel
        const [toursResponse, bookingsResponse] = await Promise.all([
          fetch("http://localhost:8000/api/v1/tours", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/v1/booking", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const toursData = await toursResponse.json();
        const bookingsData = await bookingsResponse.json();

        // Verify data structure and access confirmed bookings
        const tours = toursData.data || [];
        const bookings = bookingsData.data || []; // Adjust if bookings are nested in a "data" property

        // Filter for confirmed bookings
        const confirmedBookings = bookings.filter(
          (booking) => booking.status === "confirmed"
        );

        if (!tours.length || !confirmedBookings.length) {
          throw new Error("No tours or confirmed bookings available");
        }

        const monthlyData = {};

        // Process each booking
        confirmedBookings.forEach((booking) => {
          const date = new Date(booking.bookAt || booking.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          const year = date.getFullYear();
          const key = `${month}-${year}`;

          if (!monthlyData[key]) {
            monthlyData[key] = {
              revenue: 0,
              guests: 0,
              roomIds: 0,
            };
          }

          // Update monthly data
          const totalGuests =
            (booking.adult || 0) + (booking.children || 0) + (booking.baby || 0);
          monthlyData[key].revenue += booking.totalAmount || 0;
          monthlyData[key].guests += totalGuests;
          monthlyData[key].roomIds += Array.isArray(booking.roomIds)
            ? booking.roomIds.length
            : 0;
        });

        // Generate sorted labels and data for the chart
        const labels = Object.keys(monthlyData).sort((a, b) => {
          const [monthA, yearA] = a.split("-");
          const [monthB, yearB] = b.split("-");
          const dateA = new Date(`${monthA} 1, ${yearA}`);
          const dateB = new Date(`${monthB} 1, ${yearB}`);
          return dateA - dateB;
        });

        // Set data for chart
        setData({
          revenue: labels.map((label) => monthlyData[label].revenue),
          guests: labels.map((label) => monthlyData[label].guests),
          roomIds: labels.map((label) => monthlyData[label].roomIds),
          labels,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const revenueChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Tổng doanh thu",
        data: data.revenue,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  };

  const guestsChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Tổng số lượng người đặt",
        data: data.guests,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
      },
    ],
  };

  const roomsChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Tổng số phòng đã được đặt",
        data: data.roomIds,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
      },
    ],
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Hotels Dashboard</h5>
          </div>
          <div className="card-body">
            <h6>Revenue</h6>
            <Line
              ref={chartRef}
              data={revenueChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              key={JSON.stringify(revenueChartData)}
            />
            <hr />
            <h6>Guests</h6>
            <Line
              ref={chartRef}
              data={guestsChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              key={JSON.stringify(guestsChartData)}
            />
            <hr />
            <h6>Booked Rooms</h6>
            <Line
              ref={chartRef}
              data={roomsChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              key={JSON.stringify(roomsChartData)}
            />
          </div>
          <div className="card-footer">
            <hr />
            <div className="stats">
              <i className="fa fa-history"></i> Updated now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCustom;

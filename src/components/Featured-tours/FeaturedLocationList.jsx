import React from "react";
import { Col } from "reactstrap";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config";
import HotelCard from "../HotelCard/HotelCard";

const FeaturedLocationList = ({ searchQuery }) => {
    const { data: locations, loading, error } = useFetch(
        `${BASE_URL}/locations/getlocation`
    );

    const filteredLocations = locations?.filter((location) =>
        location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <h4>Loading.....</h4>;
    if (error) return <h4>{error}</h4>;

    return (
        <>
            {filteredLocations.length === 0 ? (
                <h4>No locations found</h4>
            ) : (
                filteredLocations.map((location) => (
                    <Col lg="3" md="4" sm="6" className="mb-4" key={location._id}>
                        <HotelCard location={location} />
                    </Col>
                ))
            )}
        </>
    );
};

export default FeaturedLocationList;
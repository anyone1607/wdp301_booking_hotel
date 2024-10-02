import { GrMoney } from "react-icons/gr";
import { FaEarthAfrica } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";

function CardItem({ totalTours, totalGuests, totalRevenue }) {
  return (
    <div className="row">
      <div className="col-sm-6 col-md-6 col-lg-4">
        <div className="card-stats card">
          <div className="card-body">
            <div className="row">
              <div className="col-5 col-md-4">
                <div className="icon-big text-center icon-warning">
                  <FaEarthAfrica style={{ color: "#51cbce" }} />
                </div>
              </div>
              <div className="col-7 col-md-8">
                <div className="numbers">
                  <p className="card-category">Total Tours</p>
                  <p className="card-title" style={{ fontSize: "24px" }}>
                    {totalTours}
                  </p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <hr />
            <div className="stats">
              <i className="fas fa-sync-alt"></i> Update Now
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-6 col-lg-4">
        <div className="card-stats card">
          <div className="card-body">
            <div className="row">
              <div className="col-5 col-md-4">
                <div className="icon-big text-center icon-warning">
                  <FaUsers style={{ color: "#ef8157" }} />
                </div>
              </div>
              <div className="col-7 col-md-8">
                <div className="numbers">
                  <p className="card-category">Total Guests</p>
                  <p className="card-title" style={{ fontSize: "24px" }}>
                    {totalGuests}
                  </p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <hr />
            <div className="stats">
              <i className="far fa-calendar"></i> Update Now
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-6 col-lg-4">
        <div className="card-stats card">
          <div className="card-body">
            <div className="row">
              <div className="col-5 col-md-4">
                <div className="icon-big text-center icon-warning">
                  <GrMoney style={{ color: "#6bd098" }} />
                </div>
              </div>
              <div className="col-7 col-md-8">
                <div className="numbers">
                  <p className="card-category">Total Revenue</p>
                  <p className="card-title" style={{ fontSize: "24px" }}>
                    $ {totalRevenue}
                  </p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <hr />
            <div className="stats">
              <i className="far fa-clock"></i> Update Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardItem;

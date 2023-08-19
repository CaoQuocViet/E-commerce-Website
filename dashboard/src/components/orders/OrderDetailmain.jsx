import React, { useEffect } from "react";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../../Redux/Actions/OrderActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import moment from "moment";

const OrderDetailmain = (props) => {
  const { orderId } = props;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDelivered, success: successDelivered } = orderDeliver;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPaid, success: successPaid } = orderPay;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, successDelivered]);
  
  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, successPaid]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const payHandler = () => {
    dispatch(payOrder(order));
  };

  return (
    <section className="content-main">
      <div className="content-header">
        <Link to="/orders" className="btn btn-dark text-white">
          Quay lại
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <div className="card">
          <header className="card-header p-3 Header-green">
            <div className="row align-items-center ">
              <div className="col-lg-6 col-md-6">
                <span>
                  <i className="far fa-calendar-alt mx-2 text-white"></i>
                  <b className="text-white">
                    {moment(order.createdAt).format("llll")}
                  </b>
                </span>
                <br />
                <small className="text-white mx-3 ">
                  ID đơn hàng: {order._id}
                </small>
              </div>
              <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                <Link className="btn btn-danger ms-2 border border-dark" to="#">
                  <i className="fas fa-print"></i>
                </Link>
              </div>
            </div>
          </header>
          <div className="card-body">
            {/* Order info */}
            <OrderDetailInfo order={order} />

            <div className="row">
              <div className="col-lg-9">
                <div className="table-responsive">
                  <OrderDetailProducts order={order} loading={loading} />
                </div>
              </div>
              {/* Payment Info */}
              <div className="col-lg-3">
                <div className="box shadow-sm bg-light mb-5">
                  {order.isDelivered ? (
                    <button className="btn btn-success col-12">
                      ĐÃ GIAO ({" "}
                      {moment(order.isDeliveredAt).format("MMM Do YY")})
                    </button>
                  ) : (
                    <>
                      {loadingDelivered && <Loading />}
                      <button
                        onClick={deliverHandler}
                        className="btn btn-dark col-12"
                      >
                        XÁC NHẬN LÀ ĐÃ GIAO HÀNG
                      </button>
                    </>
                  )}
                </div>
                <div className="box shadow-sm bg-light">
                  {order.isPaid ? (
                    <button className="btn btn-success col-12">
                      ĐÃ THANH TOÁN ({" "}
                      {moment(order.isPaidAt).format("MMM Do YY")})
                    </button>
                  ) : (
                    <>
                      {loadingPaid && <Loading />}
                      <button
                        onClick={payHandler}
                        className="btn col-12 btn-danger"
                      >
                        XÁC NHẬN LÀ ĐÃ THANH TOÁN
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderDetailmain;

import React, { useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removefromcart } from "../Redux/Actions/CartActions";

const CartScreen = ({ match, location, history }) => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const productId = match.params.id;
  // const promotion = match.params.promotion;
  const qty = location.search
    ? String(location.search.split("=")[1].split("&")[0])
    : 1;
  const color = location.search
    ? String(location.search.split("&")[1].split("=")[1])
    : 1;
  const size = location.search ? String(location.search.split("=")[3]) : 1;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const total = cartItems.reduce(
    (a, i) => a + i.qty * (i.promotion > 0 ? i.promotion : i.price),
    0
  );

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty, color, size));
    }
  }, [dispatch, productId, qty, color, size]);

  const checkOutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const removeFromCartHandle = (id) => {
    dispatch(removefromcart(id));
  };
  return (
    <>
      <Header advanceCheck={false} />
      {/* Cart */}
      <div className="container">
        {cartItems.length === 0 ? (
          <div className=" alert alert-info text-center mt-3">
            Giỏ hàng đang trống!!!
            <Link
              className="btn btn-success mx-5 px-5 py-3"
              to="/"
              style={{
                fontSize: "12px",
              }}
            >
              MUA SẮM NGAY!!!
            </Link>
          </div>
        ) : (
          <>
            <div className="alert-text">Giỏ hàng ({cartItems.length})</div>
            {/* cartiterm */}
            {cartItems.map((item) => (
              <div className="cart-iterm row">
                <div
                  onClick={() => removeFromCartHandle(item.product)}
                  className="remove-button d-flex justify-content-center align-items-center"
                >
                  <i className="fas fa-times"></i>
                </div>
                <div className="cart-image col-md-3">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-text col-md-5 d-flex align-items-center">
                  <Link to={`/products/${item.product}`}>
                    <h4>{item.name}</h4>
                    {/* <h6>Size: {item.size}</h6>
                    <h6>Màu sắc: {item.color}</h6> */}
                  </Link>
                </div>

                <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
                  <h6>SỐ LƯỢNG</h6>
                  {/* <select
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select> */}
                  <input
                    type="number"
                    placeholder="Type here"
                    className="form-control w-50"
                    id="product_qty"
                    required
                    max={item.countInStock}
                    value={item.qty}
                    onChange={(e) =>
                      e.target.value <= item.countInStock
                        ? dispatch(addToCart(item.product, e.target.value))
                        : alert("Số lượng không đủ")
                    }
                  />
                  {console.log(cartItems)}
                </div>
                <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
                  <h6>GIÁ</h6>
                  <h4>
                    {item.promotion > 0
                      ? item.promotion.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })
                      : item.price.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                    ₫
                  </h4>
                </div>
              </div>
            ))}

            {/* End of cart iterms */}
            <div className="total">
              <span className="sub">Tổng cộng:</span>
              <span className="total-price">
                {total.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
                ₫
              </span>
            </div>
            <hr />
            <div className="cart-buttons d-flex align-items-center row">
              <Link to="/" className="col-md-6 ">
                <button>Tiếp Tục Mua Sắm</button>
              </Link>
              {total > 0 && (
                <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                  <button onClick={checkOutHandler}>Thanh Toán</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartScreen;

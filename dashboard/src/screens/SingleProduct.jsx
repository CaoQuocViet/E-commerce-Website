import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import RatingDisplay from "../components/Home/RatingDisplay";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductReview,
  listProductDetails,
} from "../Redux/Actions/ProductActions";
import Loading from "../components/LoadingError/Loading";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import moment from "moment";
import { FaStar } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import Modal from "react-modal";
import samplePDF from "./Why.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SingleProduct = ({ history, match }) => {
  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [hover, setHover] = React.useState(-1);
  const productId = match.params.id;
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const [cat, setCat] = useState("");
  const {
    loading: loadingCreateReview,
    error: errorCreateReview,
    success: successCreateReview,
  } = productReviewCreate;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  useEffect(() => {
    if (successCreateReview) {
      alert("Review Submitted");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);

  const AddToCartHandle = (e) => {
    e.preventDefault();
    history.push(`/cart/${productId}?qty=${qty}&color=${color}&size=${size}`);
    console.log(qty);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(productId, {
        rating,
        comment,
      })
    );
  };

  function capitalizeFirstLetter(str) {
    const arr = str.split(",");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const capitalized = arr.join(", ");
    return capitalized;
  }

  useEffect(() => {
    if (product.category) {
      setCat(capitalizeFirstLetter(product.category.join(",")));
    }
  }, [product.category]);
  return (
    <>
      <Header advanceCheck={false} />
      <div className="container single-product">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="single-image" onClick={openModal}>
                  <img src={product.image} alt={product.name} />
                </div>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Example Modal"
                >
                  <Document
                    file="https://cdn.discordapp.com/attachments/1128328266936221849/1135294768142889081/Final_Assignment.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                  >
                    Next
                  </button>
                </Modal>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                  </div>

                  <div className="product-count col-lg-10">
                    <div className="flex-box d-flex justify-content-between align-items-center flex-nowrap gap-5">
                      <h6 className="w-full">Thể loại</h6>
                      <span>{cat}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Giá</h6>
                      {product.promotion > 0 ? (
                        <div>
                          <span className="text-danger">
                            {product.promotion.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}{" "}
                            ₫
                          </span>
                          <tab></tab>
                          <del className="text-dark">
                            {product.price.toLocaleString("en-US")}₫
                          </del>
                        </div>
                      ) : (
                        <span>{product.price}₫</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Trạng thái</h6>
                      {product.countInStock > 0 ? (
                        <span>Còn hàng</span>
                      ) : (
                        <span>Không có sẵn</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Đánh giá</h6>
                      <RatingDisplay
                        value={product.rating}
                        text={`${product.numReviews} đánh giá`}
                      />
                    </div>
                    {product.countInStock > 0 ? (
                      <>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <label htmlFor="product_price" className="form-label">
                            <h6>Số lượng</h6>
                          </label>
                          <input
                            type="number"
                            placeholder="Type here"
                            className="form-control w-25"
                            id="product_qty"
                            required
                            max={product.countInStock}
                            value={qty}
                            onChange={(e) =>
                              e.target.value <= product.countInStock
                                ? setQty(e.target.value)
                                : alert("Số lượng không đủ")
                            }
                          />
                        </div>
                        {/* <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>Màu sắc</h6>
                          <select
                            value={color}
                            onChange={(e) => {
                              setColor(e.target.value);
                            }}
                          >
                            {product.color?.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>Size</h6>
                          <select
                            value={size}
                            onChange={(e) => {
                              setSize(e.target.value);
                            }}
                          >
                            {product.size?.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div> */}
                        <button onClick={AddToCartHandle} className="buy-btn">
                          Thêm vào giỏ
                        </button>
                      </>
                    ) : null}
                  </div>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="row my-5">
              <div className="col-md-6">
                <h6 className="mb-3">ĐÁNH GIÁ</h6>
                {product.reviews.length === 0 && (
                  <Message variant={"alert-info mt-3"}>
                    Không có đánh giá
                  </Message>
                )}
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                  >
                    <strong>{review.name}</strong>
                    <RatingDisplay value={review.rating} />
                    <span>{moment(review.createdAt).calendar()}</span>
                    <div className="alert alert-info mt-3">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <h6>TẠO ĐÁNH GIÁ SẢN PHẨM</h6>
                <div className="my-4">
                  {loadingCreateReview && <Loading />}
                  {errorCreateReview && (
                    <Message variant="alert-danger">
                      {errorCreateReview}
                    </Message>
                  )}
                </div>
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="my-4">
                      <strong>Đánh giá</strong>
                      {/* <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      >
                        <option value="">Lựa chọn...</option>
                        <option value="1">⭐Tệ</option>
                        <option value="2">⭐⭐Bình thường</option>
                        <option value="3">⭐⭐⭐Tốt</option>
                        <option value="4">⭐⭐⭐⭐Cực kỳ tốt</option>
                        <option value="5">⭐⭐⭐⭐⭐Đỉnh của chóp</option>
                      </select> */}
                      <Box
                        sx={{
                          width: 200,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Rating
                          name="hover-feedback"
                          value={rating}
                          precision={0.5}
                          getLabelText={getLabelText}
                          onChange={(event, newValue) => {
                            setRating(newValue);
                          }}
                          onChangeActive={(event, newHover) => {
                            setHover(newHover);
                          }}
                          emptyIcon={
                            <StarIcon
                              style={{ opacity: 0.55 }}
                              fontSize="inherit"
                            />
                          }
                        />
                        {rating !== null && (
                          <Box sx={{ ml: 2 }}>
                            {labels[hover !== -1 ? hover : rating]}
                          </Box>
                        )}
                      </Box>
                    </div>
                    <div className="my-4">
                      <strong>Bình luận</strong>
                      <textarea
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button
                        disabled={loadingCreateReview}
                        className="rating-submit-btn col-12 border-0 p-3 rounded text-white"
                      >
                        GỬI
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="my-3">
                    <Message variant={"alert-warning"}>
                      Please{" "}
                      <Link to="/login">
                        " <strong>Login</strong> "
                      </Link>{" "}
                      to write a review{" "}
                    </Message>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default SingleProduct;

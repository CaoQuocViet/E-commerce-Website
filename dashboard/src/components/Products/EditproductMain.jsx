import React, { useState, useEffect } from "react";
import Toast from "../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProduct, updateProduct } from "../../Redux/Actions/ProductActions";
import { PRODUCT_UPDATE_RESET } from "../../Redux/Constants/ProductConstants";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditProductMain = (props) => {
  const { productId } = props;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [promotion, setPromotion] = useState(0);
  const [promotionError, setPromotionError] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);

  const dispatch = useDispatch();

  const productEdit = useSelector((state) => state.productEdit);
  const { loading, error, product } = productEdit;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      toast.success("Product Updated", ToastObjects);
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(editProduct(productId));
      } else {
        setName(product.name);
        setDescription(`${product.description}`);
        setCountInStock(product.countInStock);
        setImage(product.image);
        setPrice(product.price);
        setPromotion(product.promotion);
        setCategoryInput(product.category.join(", "));
      }
    }
  }, [product, dispatch, productId, successUpdate]);

  const mapExistingCategories = (products) => {
    const categoriesSet = new Set();
    products.forEach((product) => {
      product.category.forEach((cat) => {
        categoriesSet.add(cat.toLowerCase());
      });
    });
    return Array.from(categoriesSet);
  };

  // Sample list of products for testing
  const existingProducts = useSelector((state) => state.productList);
  const { products } = existingProducts;
  const existingCategories = mapExistingCategories(products);

  const handleCategoryInputChange = (inputValue) => {
    const lastCommaIndex = inputValue.lastIndexOf(",");
    const lastCategory = inputValue
      .substring(lastCommaIndex + 1)
      .trim()
      .toLowerCase();

    const suggestions =
      lastCategory === ""
        ? []
        : existingCategories.filter((category) =>
            category.startsWith(lastCategory)
          );

    setCategoryInput(inputValue);
    setCategorySuggestions(suggestions);
  };

  const handleCategorySuggestionSelect = (suggestion) => {
    const lastCommaIndex = categoryInput.lastIndexOf(",");
    const beforeComma = categoryInput.substring(0, lastCommaIndex + 1);
    setCategoryInput(`${beforeComma} ${suggestion}, `);
    setCategorySuggestions([]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (parseFloat(promotion) > parseFloat(price)) {
      setPromotionError("Promotion cannot be greater than the price.");
      return;
    } else setPromotionError("");

    const category = categoryInput
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat !== "");
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        description,
        image,
        countInStock,
        promotion,
        category,
      })
    );
  };
  let clickColor = (e) => {
    var color = document.getElementsByName("color");
    var result = "";

    //Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < color.length; i++) {
      if (color[i].checked === true) {
        result += " [" + color[i].value + "]";
      }
    }

    //               // In ra kết quả
    alert("Color: " + result);
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Quay lại sản phẩm
            </Link>
            <h2 className="content-title">Chỉnh sửa sản phẩm</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Cập nhật
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {promotionError && (
                    <Message variant="alert-danger">{promotionError}</Message>
                  )}
                  {errorUpdate && (
                    <Message variant="alert-danger">{errorUpdate}</Message>
                  )}
                  {loadingUpdate && <Loading />}
                  {loading ? (
                    <Loading />
                  ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="form-control"
                          id="product_title"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Thể loại</label>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="form-control"
                          value={categoryInput}
                          onChange={(e) =>
                            handleCategoryInputChange(e.target.value)
                          }
                        />
                        {categorySuggestions.length > 0 && (
                          <ul className="category-suggestions">
                            {categorySuggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleCategorySuggestionSelect(suggestion)
                                }
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Giá
                        </label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          id="product_price"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Số lượng trong kho
                        </label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          id="product_price"
                          required
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Giá khuyến mãi
                        </label>
                        <input
                          type="number"
                          placeholder="Type here"
                          className="form-control"
                          id="product_promotion"
                          required
                          value={promotion}
                          onChange={(e) => setPromotion(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Mô tả</label>
                        <textarea
                          placeholder="Type here"
                          className="form-control"
                          rows="7"
                          required
                          value={`${description}`}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Hình ảnh</label>
                        <input
                          className="form-control"
                          type="text"
                          value={image}
                          required
                          onChange={(e) => setImage(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;

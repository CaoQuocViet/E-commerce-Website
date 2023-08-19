import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PRODUCT_CREATE_RESET } from "../../Redux/Constants/ProductConstants";
import { createProduct } from "../../Redux/Actions/ProductActions";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const AddProductMain = () => {
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

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product } = productCreate;

  useEffect(() => {
    if (product) {
      toast.success("Product Added", ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });
      setName("");
      setDescription("");
      setCountInStock(0);
      setImage("");
      setPrice(0);
      setPromotion(0);
      setCategoryInput("");
    }
  }, [product, dispatch]);

  // Function to map existing categories from products
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

  // Function to handle category input change and suggestion
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
    if (parseFloat(promotion) >= parseFloat(price)) {
      setPromotionError("Giá khuyến mãi phải nhỏ hơn giá gốc");
      return;
    } else setPromotionError("");

    const category = categoryInput
      .split(",")
      .map((cat) => cat.trim().toLowerCase())
      .filter((cat) => cat !== ""); // Remove any empty categories
    dispatch(
      createProduct(
        name,
        price,
        description,
        image,
        countInStock,
        promotion,
        category
      )
    );
    console.log(category);
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
            <h2 className="content-title">Thêm sản phẩm</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Thêm mới
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
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}
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
                      placeholder="Enter Image URL"
                      value={image}
                      required
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;

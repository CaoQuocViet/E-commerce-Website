import React, { useEffect, useState } from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import Rating from "../Home/RatingDisplay";
import { useDispatch, useSelector } from "react-redux";
import { listProductsAdvanced } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Footer from "../Footer";

function AdvanceSearch() {
  const productList = useSelector((state) => state.advancedList);
  const { loading, error, products } = productList;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(15);
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProductsAdvanced());
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkIfSmallScreen = () => {
    setIsSmallScreen(window.innerWidth <= 900);
  };

  useEffect(() => {
    checkIfSmallScreen();
  }, []);

  const categoryGridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${
      isSmallScreen ? (window.innerWidth <= 600 ? 2 : 3) : 5
    }, 1fr)`,
    gap: "8px",
  };

  const checkboxLabelStyle = {
    display: "flex",
    flexDirection: isSmallScreen ? "column" : "row",
    alignItems: "center",
  };

  const smallScreenStyles = `@media (max-width: 900px) {
    .category-checkbox label {
      display: block;
      text-align: center;
    }
  }`;
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
    const updatedInputValue = `${beforeComma} ${suggestion}, `;
    setSelectedCategories([...selectedCategories, suggestion.toLowerCase()]);

    setCategoryInput(updatedInputValue);
    // setCategorySuggestions([]);
  };

  const handleCategoryUncheck = (suggestion) => {
    setSelectedCategories(
      selectedCategories.filter(
        (category) => category !== suggestion.toLowerCase()
      )
    );
    const inputValueWithoutUncheckedCategory = categoryInput
      .split(",")
      .filter(
        (category) => !category.toLowerCase().includes(suggestion.toLowerCase())
      )
      .join(",");
    setCategoryInput(inputValueWithoutUncheckedCategory);
  };
  const handleCategoryFilter = (product) => {
    if (!categoryInput.trim()) return true; // No category filter applied

    const filterCategories = categoryInput
      .toLowerCase()
      .split(",")
      .map((category) => category.trim())
      .filter((category) => category !== "");

    return filterCategories.some((filterCategory) =>
      product.category.some((productCategory) =>
        productCategory.toLowerCase().includes(filterCategory)
      )
    );
  };
  console.log(products);
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(handleCategoryFilter);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const pageNumbers = Math.ceil(filteredProducts.length / productsPerPage);

  const mapExistingCategories = (products) => {
    const categoriesSet = new Set();
    products.forEach((product) => {
      product.category.forEach((cat) => {
        categoriesSet.add(cat.toLowerCase());
      });
    });
    return Array.from(categoriesSet);
  };

  function capitalizeFirstLetter(str) {
    const arr = str.split(",");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const capitalized = arr.join(", ");
    return capitalized;
  }

  const existingCategories = mapExistingCategories(products);
  const [categorySuggestions, setCategorySuggestions] =
    useState(existingCategories);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
      {" "}
      <Header advanceCheck={true} />
      <header className="search-wrapper bg-white container w-50">
        <div>
          {" "}
          <div className="search-bar d-flex align-items-center">
            <i className="fa fa-search px-3"></i>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              className="form-control my-5 p-2"
              onChange={handleSearch}
            />
          </div>
          <div className="categories-search">
            <input
              type="text"
              placeholder="Search by categories..."
              value={categoryInput}
              className="form-control p-2 d-none"
              onChange={(e) => handleCategoryInputChange(e.target.value)}
            />
            {categorySuggestions.length > 0 && (
              <Box sx={categoryGridStyle} className="category-checkbox">
                {" "}
                <style>{smallScreenStyles}</style>
                {categorySuggestions.map((suggestion, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(
                          suggestion.toLowerCase()
                        )}
                        onChange={() =>
                          selectedCategories.includes(suggestion.toLowerCase())
                            ? handleCategoryUncheck(suggestion)
                            : handleCategorySuggestionSelect(suggestion)
                        }
                      />
                    }
                    label={<span style={checkboxLabelStyle}>{capitalizeFirstLetter(suggestion)}</span>}
                  />
                ))}
              </Box>
            )}
          </div>
        </div>
      </header>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12 article">
              <div className="shopcontainer row">
                {loading ? (
                  <div className="mb-5">
                    <Loading />
                  </div>
                ) : error ? (
                  <Message variant="alert-danger">{error}</Message>
                ) : (
                  <>
                    {currentProducts.map((product) => (
                      <div
                        className="shop col-lg-4 col-md-6 col-sm-6"
                        key={product._id}
                      >
                        <div className="border-product">
                          <Link to={`/products/${product._id}`}>
                            <div className="shopBack">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </Link>

                          <div className="shoptext">
                            <p>
                              <Link to={`/products/${product._id}`}>
                                {product.name}
                              </Link>
                            </p>

                            <Rating
                              value={product.rating}
                              text={`${product.numReviews} Đánh giá`}
                            />
                            {product.promotion > 0 ? (
                              <div>
                                <h3 className="text-danger">
                                  {product.promotion.toLocaleString("en-US", {
                                    maximumFractionDigits: 0,
                                  })}
                                  ₫
                                  <span className="discount-text">{`-${(
                                    ((product.price - product.promotion) *
                                      100) /
                                    product.price
                                  ).toLocaleString("en-US", {
                                    maximumFractionDigits: 0,
                                  })}%`}</span>
                                  <tab></tab>
                                  <del className="promote-text text-muted">
                                    {product.price.toLocaleString("en-US")}₫
                                  </del>
                                </h3>
                              </div>
                            ) : (
                              <h3 className="text-danger">
                                {product.price.toLocaleString("en-US")}₫
                              </h3>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <nav
          className="d-flex justify-content-center mt-4"
          aria-label="Page navigation"
        >
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
            </li>
            {Array.from({ length: pageNumbers }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers}
              >
                Tiếp theo
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <Footer />
    </div>
  );
}

export default AdvanceSearch;

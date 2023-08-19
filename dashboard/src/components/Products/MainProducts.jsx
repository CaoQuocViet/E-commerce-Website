import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Product from "./Product";

const MainProducts = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { error: errorDelete, success: successDelete } = productDelete;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [categoryInput, setCategoryInput] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch, successDelete]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

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

  const handleCategoryFilter = (product) => {
    if (!categoryInput.trim()) return true;

    const filterCategories = categoryInput
      .toLowerCase()
      .split(",")
      .map((category) => category.trim());
    return filterCategories.every((filterCategory) =>
      product.category.some((productCategory) =>
        productCategory.toLowerCase().includes(filterCategory)
      )
    );
  };

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

  const existingCategories = mapExistingCategories(products);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Sản phẩm</h2>
        <div>
          <Link to="/addproduct" className="btn btn-primary">
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="search-wrapper">
            {" "}
            <div className="search-bar ">
              <input
                type="text"
                className="form-control p-2"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="categories-search">
              <input
                type="text"
                placeholder="Search by categories..."
                value={categoryInput}
                className="form-control p-2"
                onChange={(e) => handleCategoryInputChange(e.target.value)}
              />
              {categorySuggestions.length > 0 && (
                <ul className="category-suggestions">
                  {categorySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleCategorySuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="products-per-page">
              <select
                id="productsPerPage"
                value={productsPerPage}
                className="form-select"
                onChange={handleProductsPerPageChange}
              >
                <option value={20}>Hiển thị 20 sản phẩm</option>
                <option value={40}>Hiển thị 40 sản phẩm</option>
                <option value={60}>Hiển thị 60 sản phẩm</option>
              </select>
            </div>
          </div>
        </header>

        <div className="card-body">
          {errorDelete && (
            <Message variant="alert-danger">{errorDelete}</Message>
          )}
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row">
              {currentProducts.map((product) => (
                <Product product={product} key={product._id} />
              ))}
            </div>
          )}

          <nav className="float-end mt-4" aria-label="Page navigation">
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
      </div>
    </section>
  );
};

export default MainProducts;

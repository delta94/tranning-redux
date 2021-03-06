import React, { useState, useEffect } from "react";
import Product from "./product";
import * as typeActions from "../actions";
import { useSelector, useDispatch } from 'react-redux';
import "../scss/Carts.scss";

const addCarts = (products, paginate) => {
  const count1 = (paginate - 1) * 16;
  const count2 = paginate * 16;
  let result = null;
  result = products.slice(count1, count2);
  window.localStorage.setItem("carts", JSON.stringify(result));
  return result;
};

const showData = () => {
  const carts = JSON.parse(window.localStorage.getItem("carts"));
  let result = null;
  result = carts.map((cart, i) => {
    return <Product key={i} cart={cart} />;
  });
  return result;
};

const showPaginate = (products, paginate, setPaginate) => {
  let result = [];
  let count =
    products.length % 16 === 0
      ? products.length / 16
      : products.length / 16 + 1;
  for (let i = 1; i <= count; i++) {
    i === paginate
      ? result.push(
          <a key={i} onClick={() => setPaginate(i)} className="active">
            {i}
          </a>
        )
      : result.push(
          <a key={i} onClick={() => setPaginate(i)}>
            {i}
          </a>
        );
  }
  return result;
};

const Carts = () => {
  const listProducts = useSelector(state => state.products.listProducts);
  const text = useSelector(state => state.products.text);
  const type = useSelector(state => state.products.type);
  const star = useSelector(state => state.products.star);
  // const carts = useSelector(state => state.products.carts);
  const [products, setProducts] = useState(listProducts);
  const [paginate, setPaginate] = useState(1);
  const [select, setSelect] = useState("fea");
  const dispatch = useDispatch();

  useEffect(() => {
    if (select === "asc") {
      setProducts(() => [...listProducts].sort((a, b) => a.price - b.price));
    } else if (select === "desc") {
      setProducts(() => [...listProducts].sort((a, b) => b.price - a.price));
    } else if (select === "fea") {
      setProducts(listProducts);
    }
    if (text !== "" || star !== 0 || type !== "") {
      const result = [...listProducts].filter((product) => {
        if (text !== "") {
          return (
            product.name.toLowerCase().indexOf(text.toLowerCase()) !== -1
          );
        } else if (type !== "") {
          return (
            product.type.toLowerCase().indexOf(type.toLowerCase()) !== -1
          );
        } else if (star !== 0) {
          return product.star === star;
        }
      });
      setProducts(() => [...result]);
    }
  }, [select, text, type, star, listProducts]);

  dispatch(typeActions.showProducts(addCarts(products, paginate)));

  return (
    <div className="carts">
      <div className="carts__header">
        <p className="count__sort">{products.length} results found in 3ms</p>
        <div className="sort">
          <label for="sort">Sort by</label>
          <select
            id="sort"
            value={select}
            onChange={(e) => setSelect(e.target.value)}
          >
            <option value="fea">Featured</option>
            <option value="asc">Price asc</option>
            <option value="desc">Price desc</option>
          </select>
        </div>
      </div>
      <div className="carts__main">{showData()}</div>
      <div className="carts__pagination">
        <a
          onClick={
            paginate === 1
              ? () => setPaginate(paginate)
              : () => setPaginate(paginate - 1)
          }
        >
          &laquo; Previous page
        </a>
        {showPaginate(products, paginate, setPaginate)}
        <a
          onClick={
            paginate ===
            (products.length % 16 === 0
              ? Math.ceil(products.length / 16)
              : Math.ceil(products.length / 16))
              ? () => setPaginate(paginate)
              : () => setPaginate(paginate + 1)
          }
        >
          Next page &raquo;
        </a>
      </div>
    </div>
  );
};

export default Carts;

import React, { useEffect, useState, useMemo } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartProduct,
  getUserCart,
  updateCartProduct,
} from "../features/user/userSlice";

const Cart = () => {
  const getTokenFromLocalStorage = useMemo(() => {
    const customer = localStorage.getItem("customer");
    return customer ? JSON.parse(customer) : null;
  }, []);

  const config2 = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""}`,
      Accept: "application/json",
    },
  }), [getTokenFromLocalStorage]);

  const dispatch = useDispatch();
  const [productupdateDetail, setProductupdateDetail] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const userCartState = useSelector((state) =>
     state.auth.cartProducts);
  
  console.log(userCartState)

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, [dispatch, config2]);

  useEffect(() => {
    if (productupdateDetail !== null) {
      dispatch(
        updateCartProduct({
          cartItemId: productupdateDetail?.cartItemId,
          quantity: productupdateDetail?.quantity,
        })
      );
      setTimeout(() => {
        dispatch(getUserCart(config2));
      }, 200);
    }
  }, [productupdateDetail, dispatch, config2]);

  const deleteACartProduct = (id) => {
    if (!config2) {
      console.error("config2 is not defined");
      return;
    }
    dispatch(deleteCartProduct({ id: id, config2: config2 }));
    setTimeout(() => {
      dispatch(getUserCart(config2));
    }, 200);
  };

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < userCartState?.length; index++) {
      sum += Number(userCartState[index].quantity) * userCartState[index].price;
    }
    setTotalAmount(sum);
  }, [userCartState]);

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Product</h4>
              <h4 className="cart-col-2">Price</h4>
              <h4 className="cart-col-3">Quantity</h4>
              <h4 className="cart-col-4">Total</h4>
            </div>
            {userCartState &&
              userCartState.map((item, index) => (
                <div
                  key={index}
                  className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
                >
                  <div className="cart-col-1 gap-15 d-flex align-items-center">
                    <div className="w-25">
                      <img
                        src={item?.productId.images[0].url}
                        className="img-fluid"
                        alt="product image"
                      />
                    </div>
                    <div className="w-75">
                      <p>{item?.productId.title}</p>
                    </div>
                  </div>
                  <div className="cart-col-2">
                    <h5 className="price">Rs. {item?.price}</h5>
                  </div>
                  <div className="cart-col-3 d-flex align-items-center gap-15">
                    <div>
                      <input
                        className="form-control"
                        type="number"
                        name={"quantity" + item?._id}
                        min={1}
                        max={10}
                        id={"card" + item?._id}
                        value={item?.quantity}
                        onChange={(e) => {
                          setProductupdateDetail({
                            cartItemId: item?._id,
                            quantity: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <AiFillDelete
                        onClick={() => deleteACartProduct(item?._id)}
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="cart-col-4">
                    <h5 className="price">Rs. {item?.quantity * item?.price}</h5>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Continue To Shopping
              </Link>
              {(totalAmount !== null || totalAmount !== 0) && (
                <div className="d-flex flex-column align-items-end">
                  <h4>
                    SubTotal: Rs. {totalAmount || 0}
                  </h4>
                  <p>Taxes and shipping calculated at checkout</p>
                  <Link to="/checkout" className="button">
                    Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;

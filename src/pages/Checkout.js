import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { config } from "../utils/axiosConfig";
import {
  createAnOrder,
  deleteUserCart,
  getUserCart,
  resetState,
} from "../features/user/userSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let shippingSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  address: yup.string().required("Address Details are Required"),
  state: yup.string().required("State is Required"),
  city: yup.string().required("City is Required"),
  country: yup.string().required("Country is Required"),
  pincode: yup.number("Pincode No is Required").required().positive().integer(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotalAmount(sum);
    }
  }, [cartState]);

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  useEffect(() => {
    if (
      authState?.orderedProduct?.order !== null &&
      authState?.orderedProduct?.success === true
    ) {
      navigate("/my-orders");
    }
  }, [authState]);

  const [cartProductState, setCartProductState] = useState([]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      address: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      other: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      localStorage.setItem("address", JSON.stringify(values));
      setTimeout(() => {
        checkOutHandler(values);
      }, 300);
    },
  });

 

  const placeOrderHandler = (e) => {
    e.preventDefault();
    if (!formik.isValid || !formik.dirty) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    // hello();
    formik.handleSubmit();
  };

  const checkOutHandler = async (values) => {
    // Prepare order details to send to the backend
    const orderData = {
      shippingInfo: values,
      orderItems: cartProductState,
      totalPrice: totalAmount + 100,  // Add shipping cost
      totalPriceAfterDiscount: totalAmount + 100,  // Add shipping cost
    };

    try {
      const result = await axios.post(
        "http://localhost:5000/api/user/cart/create-order", // Your backend endpoint
        orderData,
        config2
      );
      console.log('Order creation response:', result);
      if (result.data.success) {
        dispatch(createAnOrder(result.data.order));
        dispatch(deleteUserCart(config2));
        localStorage.removeItem("address");
        dispatch(resetState());
        setTimeout(() => {
          navigate("/my-orders");
        }, 5000); 
        // navigate("/my-orders");
      }
    } catch (error) {
      toast.error("Failed to place order.");
    }
  };

  useEffect(() => {
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      items.push({
        product: cartState[index].productId._id,
        quantity: cartState[index].quantity,
        price: cartState[index].price,
        image: cartState[index].productId.imageUrl,
      });
    }
    setCartProductState(items);
  }, [cartState]);

  return (
    <Container class1="checkout-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-7">
          <div className="checkout-left-data">
            <h3 className="website-name">Online Shop</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="text-dark total-price" to="/cart">
                    Cart
                  </Link>
                </li>
                &nbsp; /&nbsp;
                <li className="breadcrumb-ite total-price active" aria-current="page">
                  Information
                </li>
                &nbsp; /&nbsp;
                <li className="breadcrumb-item total-price active">
                  Shipping
                </li>
                &nbsp; &nbsp;
                <li className="breadcrumb-item total-price active" aria-current="page">
                  Payment
                </li>
              </ol>
            </nav>

            <h4 className="title total">Contact Information</h4>
            <p className="user-details total">helpline@gmail.com</p>

            <h4 className="mb-3">Shipping Address</h4>
            <form
              onSubmit={placeOrderHandler}  // Use placeOrderHandler to trigger backend call
              className="d-flex gap-15 flex-wrap justify-content-between"
            >
              <div className="w-100">
                <select
                  className="form-control form-select"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange("country")}
                  onBlur={formik.handleBlur("country")}
                >
                  <option value="" selected disabled>
                    Select Country
                  </option>
                  <option value="India">India</option>
                </select>
                <div className="error ms-2 my-1">
                  {formik.touched.country && formik.errors.country}
                </div>
              </div>

              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-control"
                  name="firstname"
                  value={formik.values.firstname}
                  onChange={formik.handleChange("firstname")}
                  onBlur={formik.handleBlur("firstname")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.firstname && formik.errors.firstname}
                </div>
              </div>

              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-control"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange("lastname")}
                  onBlur={formik.handleBlur("lastname")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.lastname && formik.errors.lastname}
                </div>
              </div>

              <div className="w-100">
                <input
                  type="text"
                  placeholder="Address"
                  className="form-control"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange("address")}
                  onBlur={formik.handleBlur("address")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.address && formik.errors.address}
                </div>
              </div>

              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="City"
                  className="form-control"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange("city")}
                  onBlur={formik.handleBlur("city")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.city && formik.errors.city}
                </div>
              </div>

              <div className="flex-grow-1">
                <select
                  className="form-control form-select"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange("state")}
                  onBlur={formik.handleBlur("state")}
                >
                  <option value="" selected disabled>
                    Select State
                  </option>
                  
                  <option value="AndhraPradesh">AndhraPradesh</option>
                  <option value="Telangana">Telangana</option>
                </select>
                <div className="error ms-2 my-1">
                  {formik.touched.state && formik.errors.state}
                </div>
              </div>

              <div className="flex-grow-1">
                <input
                  type="number"
                  placeholder="Pincode"
                  className="form-control"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange("pincode")}
                  onBlur={formik.handleBlur("pincode")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.pincode && formik.errors.pincode}
                </div>
              </div>

              <div className="w-100">
              <button className="button" type="submit"
                    onClick = {placeOrderHandler}>
                      Place Order
                    </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-5">
          <div className="checkout-right-data">
            <h4 className="total-price-title">Order Summary</h4>
            <div className="d-flex justify-content-between">
              <p className="total-price">Total Price:</p>
              <p className="total-price">
                ₹ {totalAmount && totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="total-price">Shipping Fee:</p>
              <p className="total-price">₹ 100</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="total-price">Total After Discount:</p>
              <p className="total-price">
                ₹ {(totalAmount + 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;

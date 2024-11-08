import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";

// import wish from "../images/wish.svg";
// import wishlist from "../images/wishlist.svg";
// import watch from "../images/watch.jpg";
// import watch2 from "../images/watch-1.avif";
// import addcart from "../images/add-cart.svg";
// import view from "../images/view.svg";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlilce";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-toastify";
import { addProdToCart } from "../features/user/userSlice";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { grid, data } = props;
  const dispatch = useDispatch();
  console.log(data);
  const location = useLocation();

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const [wishlist, setWishlist] = useState(wishlistState || []);

  useEffect(() => {
    setWishlist(wishlistState || []);
  }, [wishlistState]);

  const isProductInWishlist = (productId) => {
    return wishlist?.some((item) => item._id === productId);
  };

  const addToWish = (productId) => {
    if (isProductInWishlist(productId)) {
      dispatch(addToWishlist(productId)); // Dispatch the action to update the wishlist in Redux store

      const updatedWishlist = wishlist.filter((item) => item._id !== productId);
      setWishlist(updatedWishlist);
      toast.success("Item removed from wishlist successfully!");
      
    } else {
      dispatch(addToWishlist(productId)); // Dispatch the action to update the wishlist in Redux store

      const product = data.find((item) => item._id === productId);
      setWishlist([...wishlist, product]);
      toast.success("Item added to wishlist successfully!"); 
    }
  
  };
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const addToCart = (product) =>{
    const existingProduct = cartState.find(
      (item) => item.productId._id === product._id
    );
    if (existingProduct) {
      toast.info("This product is already in your cart!");
    }else{
      dispatch(
        addProdToCart({
          productId: product._id,
          quantity: 1, // default quantity set to 1
          price: product.price,
        })
      );
      // toast.success("Product added to cart!");
    }
  }

  return (
    <>
      {data?.map((item, index) => {
        const isWishlist = isProductInWishlist(item._id);
        console.log(isWishlist);
        return (
          <div
            key={index}
            className={` ${
              location.pathname == "/product" ? `gr-${grid}` : "col-3"
            } `}
          >
            <div className="product-card position-relative">
              <div className="wishlist-icon position-absolute">
                <button
                  className="border-0 bg-transparent"
                  onClick={(e) => addToWish(item?._id)}
                >
                  {isWishlist ? (
                    <AiFillHeart className="fs-5 me-1" />
                  ) : (
                    <AiOutlineHeart className="fs-5 me-1" />
                  )}
                </button>
              </div>

              <div className="product-image">
                <img
                  src={item?.images[0]?.url}
                  // className="img-fluid d"
                  alt="product image"
                  height={"250px"}
                  width={"100%"}
                  onClick={() => navigate("/product/" + item?._id)}
                />
                <img
                  src={item?.images[0]?.url}
                  // className="img-fluid d"
                  alt="product image"
                  height={"250px"}
                  width={"100%"}
                  // onClick={() => navigate("/product/" + item?._id)}
                  onClick={() => navigate("/product/" + item?._id)}

                />
              </div>
              <div className="product-details">
                <h6 className="brand">{item?.brand}</h6>
                <h5 className="product-title">
                  {grid === 12 || grid === 6
                    ? item?.title
                    : item?.title?.substr(0, 80) + "..."}
                </h5>
                <ReactStars
                  count={5}
                  size={24}
                  value={item?.totalrating}
                  edit={false}
                  activeColor="#ffd700"
                />

                <p className="price">Rs.{item?.price}</p>
                  {/* Add to Cart Button */}
                  <center>
                  <button
                      className="button"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </center>
                
              </div>
              <div className="action-bar position-absolute">
                <div className="d-flex flex-column gap-15">
                  
                  {/* <button className="border-0 bg-transparent">
                    <img src={prodcompare} alt="compare" />
                  </button> */}

                  {/* <button className="border-0 bg-transparent">
                    <img
                      onClick={() => navigate("/product/" + item?._id)}
                      src={view}
                      alt="view"
                    />
                  </button> */}
                  {/* <button className="border-0 bg-transparent">
                    <img src={addtocart} alt="addcart" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductCard;

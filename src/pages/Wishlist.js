import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlilce";
import { getuserProductWishlist } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { addProdToCart } from "../features/user/userSlice";
const Wishlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getuserProductWishlist());
  };
  // Get the wishlist and cart state from the Redux store
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const cartState = useSelector((state) => state?.auth?.cartProducts);

  // const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const removeFromWishlist = (id) => {
    dispatch(addToWishlist(id));
    toast.success("Item removed from wishlist successfully!");
    setTimeout(() => {
      dispatch(getuserProductWishlist());
    }, 300);
  };
  // Function to add item to cart
  const addToCart = (product, quantity = 1) => {
    // Check if the product is already in the cart
    const isProductInCart = cartState.some((item) => item.productId._id === product._id);
    
    if (isProductInCart) {
      toast.info("This product is already in your cart!");
    } else {
      // Dispatch action to add product to cart
      dispatch(
        addProdToCart({
          productId: product._id,
          quantity,
          price: product.price,
        })
      );
      // toast.success("Product added to cart!");
    }
  };

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
          {wishlistState && wishlistState.length === 0 && (
            <div className="text-center fs-3">No Data</div>
          )}
          {wishlistState &&
            wishlistState?.map((item, index) => {
              return (
                <div className="col-3" key={index}>
                  <div className="wishlist-card position-relative">
                    <img
                      onClick={() => {
                        removeFromWishlist(item?._id);
                      }}
                      src="images/cross.svg"
                      alt="cross"
                      className="position-absolute cross img-fluid"
                    />
                    <div className="wishlist-card-image">
                      <img
                        src={
                          item?.images[0].url
                            ? item?.images[0].url
                            : "images/watch.jpg"
                        }
                        className="img-fluid w-100"
                        alt="watch"
                        style={{ height: "200px" }}
                      />
                    </div>
                    <div className="py-3 px-3">
                      <h5 className="title">{item?.title}</h5>
                      <h6 className="price">Rs. {item?.price}</h6>
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
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </>
  );
};

export default Wishlist;

import axiosAPI from "../api.main";

export const createProductReview = async (data) => {
  return await axiosAPI.post("/product-review", data);
};

export const isReviewedAPI = async (data) => {
    return await axiosAPI.post("/product-review/is-reviewed", data);
  };
  

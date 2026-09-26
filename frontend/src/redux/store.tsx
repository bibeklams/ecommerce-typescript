import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import seoReducer from "./slices/seoSlice";
import wishlistReducer from "./slices/wishlistSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import paymentReduce from "./slices/paymentSlice";
import dashboardReducer from "./slices/dashboardSlice";
import userReducer from "./slices/userSlice";
import sellerReducer from "./slices/sellerSlice";
import sellerDashboardReducer from "./slices/sellerDashboardSlice";
import reviewReducer from "./slices/reviewSlice";
import recommendationReducer from "./slices/recommendationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    seo: seoReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReduce,
    dashboard: dashboardReducer,
    sellerDashboard: sellerDashboardReducer,
    user: userReducer,
    seller: sellerReducer,
    review: reviewReducer,
    recommendation: recommendationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

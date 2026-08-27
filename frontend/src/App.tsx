import { useEffect } from "react";

import { useAppDispatch } from "./redux/hooks";
import { getProfile } from "./redux/slices/authSlice";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;

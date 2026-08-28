import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { login } from "../../redux/slices/authSlice";

type LoginData = {
  email: string;
  password: string;
};

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (
    values: LoginData,
    { resetForm }: { resetForm: () => void },
  ) => {
    const result = await dispatch(login(values));

    if (login.fulfilled.match(result)) {
      toast.success("Login successful");
      resetForm();

      if (result.payload.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  };

  return (
    <main>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Email */}
            <div>
              <label htmlFor="email">Email:</label>

              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email"
              />

              <ErrorMessage name="email" component="p" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password">Password:</label>

              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />

              <ErrorMessage name="password" component="p" />
            </div>

            {/* Backend / Redux error */}
            {error && <p>{error}</p>}

            {/* Submit */}
            <button type="submit" disabled={loading || isSubmitting}>
              {loading ? "Logging..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default LoginPage;

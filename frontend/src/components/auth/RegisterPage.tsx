import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { register } from "../../redux/slices/authSlice";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[^A-Za-z0-9]/, "Password must contain a special character")
    .required("Password is required"),
});

const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleSubmit = async (
    values: RegisterData,
    { resetForm }: { resetForm: () => void },
  ) => {
    const result = await dispatch(register(values));

    if (register.fulfilled.match(result)) {
      toast.success("Registration successful");

      resetForm();

      navigate("/login");
    }
  };

  return (
    <main>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Name */}
            <div>
              <label htmlFor="name">Name</label>

              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
              />

              <ErrorMessage name="name" component="p" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>

              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />

              <ErrorMessage name="email" component="p" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password">Password</label>

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

            <button type="submit" disabled={loading || isSubmitting}>
              {loading ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default RegisterPage;

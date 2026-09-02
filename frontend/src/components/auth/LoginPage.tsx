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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Log in to your account to continue
        </p>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>

                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>

                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />

                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Backend / Redux error */}
              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Logging..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default LoginPage;

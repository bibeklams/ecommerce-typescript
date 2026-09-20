import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { forgotPassword } from "../../services/auth.service";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6">
        <Link
          to="/login"
          className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 010 1.06L9.06 10l3.73 3.71a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to login
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-gray-900">
          Forgot password
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a code to reset your
          password.
        </p>

        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await forgotPassword(values);

              navigate("/verify-reset-otp", {
                state: { email: values.email },
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <Field
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;

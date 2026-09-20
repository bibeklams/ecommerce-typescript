import { Formik, Form, Field } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyResetOtp } from "../../services/auth.service";

const VerifyResetOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6">
        <Link
          to="/forgot-password"
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
          Back
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-gray-900">Verify OTP</h1>

        <p className="mb-6 text-sm text-gray-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-gray-900">{email}</span>
        </p>

        <Formik
          initialValues={{ otp: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await verifyResetOtp({
                email,
                otp: values.otp,
              });

              navigate("/reset-password", {
                state: { email },
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>

                <Field
                  id="otp"
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  placeholder="––––––"
                  value={values.otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("otp", e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 outline-none placeholder:tracking-normal placeholder:text-sm placeholder:font-normal placeholder:text-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || values.otp.length !== 6}
                className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default VerifyResetOtpPage;

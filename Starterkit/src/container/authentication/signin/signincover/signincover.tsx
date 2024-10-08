import { FC, Fragment, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import desktoplogo from "../../../../assets/images/brand-logos/desktop-logo.png";
import desktopdarklogo from "../../../../assets/images/brand-logos/desktop-dark.png";
import img2 from "../../../../assets/images/authentication/2.png";
import img3 from "../../../../assets/images/authentication/3.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface SignincoverProps {}

const Signincover: FC<SignincoverProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [passwordShow, setpasswordShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        try {
          // Validate the token with the server
          const response = await fetch(
            "http://localhost:5000/token-validation",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ token })
            }
          );

          if (!response.ok) {
            throw new Error("Token validation failed");
          }

          const result = await response.json();

          if (result.valid) {
            // Redirect to the app if the token is valid
            navigate(`${import.meta.env.BASE_URL}app/dashboards/crm/`);
          } else {
            // Token is invalid, you might want to handle this scenario
            console.log("Invalid token");
            // Optionally, clear token and redirect to login page
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            navigate("/authentication/signin/signincover");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // Handle error (e.g., redirect to login page)
          navigate("/authentication/signin/signincover");
        }
      } else {
        // No token found, redirect to login page
        navigate("/authentication/signin/signincover");
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, rememberMe })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await response.json();
      console.log("response: ", data);
      setAlerts([
        {
          message: "Успешно влизане!",
          color: "success",
          icon: <i className="ri-check-line"></i>
        }
      ]);

      // Store token in local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      navigate(`${import.meta.env.BASE_URL}app/dashboards/crm/`);
    } catch (error: any) {
      setAlerts([
        {
          message: error.message,
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12">
          <div className="flex justify-center items-center h-full">
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="p-[3rem]">
                <div className="mb-4">
                  <Link
                    aria-label="anchor"
                    to={`${import.meta.env.BASE_URL}app/dashboards/crm/`}
                  >
                    <img
                      src={desktoplogo}
                      alt=""
                      className="authentication-brand desktop-logo"
                    />
                    <img
                      src={desktopdarklogo}
                      alt=""
                      className="authentication-brand desktop-dark"
                    />
                  </Link>
                </div>
                <p className="h5 font-semibold mb-2">Sign In</p>
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                  Hello Jhon !
                </p>
                {alerts.map((alert, idx) => (
                  <div
                    className={`alert alert-${alert.color} flex items-center`}
                    role="alert"
                    key={idx}
                  >
                    {alert.icon}
                    <div>{alert.message}</div>
                  </div>
                ))}
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-12 gap-y-4">
                    <div className="xl:col-span-12 col-span-12 mt-0">
                      <label
                        htmlFor="signin-email"
                        className="form-label text-default"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg w-full !rounded-md"
                        id="email"
                        placeholder="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="xl:col-span-12 col-span-12 mb-4">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default block"
                      >
                        Password
                        <Link
                          to={`${
                            import.meta.env.BASE_URL
                          }authentication/resetpassword/resetrequest`}
                          className="ltr:float-right rtl:float-left text-danger"
                        >
                          Forget password?
                        </Link>
                      </label>
                      <div className="input-group">
                        <input
                          type={passwordShow ? "text" : "password"}
                          className="form-control form-control-lg !rounded-e-none"
                          id="password"
                          placeholder="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                          onClick={() => setpasswordShow(!passwordShow)}
                          id="button-addon2"
                        >
                          <i
                            className={`${
                              passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="form-check !ps-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                            htmlFor="rememberMe"
                          >
                            Remember password?
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-12 col-span-12 grid mt-2">
                      <button
                        type="submit"
                        className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-center">
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                    Dont have an account?{" "}
                    <Link
                      to={`${
                        import.meta.env.BASE_URL
                      }authentication/signup/signupcover`}
                      className="text-primary"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
          </div>
        </div>
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
          <div className="authentication-cover">
            <div className="aunthentication-cover-content rounded">
              <div className="swiper keyboard-control">
                <Swiper
                  spaceBetween={30}
                  navigation={true}
                  centeredSlides={true}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center">
                      <div>
                        <div className="mb-[3rem]">
                          <img
                            src={img2}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem]">Sign In</h6>
                        <p className="font-normal text-[.875rem] opacity-[0.7]">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center">
                      <div>
                        <div className="mb-[3rem]">
                          <img
                            src={img3}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem]">Sign In</h6>
                        <p className="font-normal text-[.875rem] opacity-[0.7]">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center">
                      <div>
                        <div className="mb-[3rem]">
                          <img
                            src={img2}
                            className="authentication-image"
                            alt=""
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem]">Sign In</h6>
                        <p className="font-normal text-[.875rem] opacity-[0.7]">
                          {" "}
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ipsa eligendi expedita aliquam quaerat nulla
                          voluptas facilis. Porro rem voluptates possimus, ad,
                          autem quae culpa architecto, quam labore blanditiis at
                          ratione.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signincover;

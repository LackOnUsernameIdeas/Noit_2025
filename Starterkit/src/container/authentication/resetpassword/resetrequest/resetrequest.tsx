import { FC, Fragment, useState } from "react";
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
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface ResetRequestProps {}

const ResetRequest: FC<ResetRequestProps> = () => {
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordResetRequest = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/password-reset-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result);

        setAlerts([
          {
            message: "Изпратихме Ви линк за смяна на паролата успешно!",
            color: "success",
            icon: <i className="ri-check-line"></i>
          }
        ]);
      } else {
        setAlerts([
          {
            message: result.error || "Не успяхме да изпратим имейл. Опитайте отново.",
            color: "danger",
            icon: <i className="ri-error-warning-fill"></i>
          }
        ]);
      }
    } catch (error) {
      setAlerts([
        {
          message: "Не успяхме да изпратим имейл. Опитайте отново.",
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    } finally {
      setIsSubmitting(false);
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
              <p className="h5 font-semibold mb-2">Забравили сте паролата си?</p>
              <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                Въведете своя имейл тук и ако имате профил с него, ще получите линк за смяна на паролата.
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
              <div className="grid grid-cols-12 gap-y-4">
                <div className="xl:col-span-12 col-span-12 mt-0">
                  <label
                    htmlFor="reset-email"
                    className="form-label text-default"
                  >
                    Имейл
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control form-control-lg w-full !rounded-md"
                      id="reset-email"
                      placeholder="Въведете своя имейл адрес"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="xl:col-span-12 col-span-12 grid mt-2">
                  <button
                    className="ti-btn ti-btn-primary w-full py-2"
                    onClick={handlePasswordResetRequest}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Изпращаме имейл..." : "Създай нова парола"}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                  Объркахте нещо?{" "}
                  <Link
                    to={`${
                      import.meta.env.BASE_URL
                    }authentication/signin/signincover/`}
                    className="text-primary"
                  >
                    Върни се към формата за влизане
                  </Link>
                </p>
              </div>
            </div>
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
                        <h6 className="font-semibold text-[1rem]">
                          Reset Password
                        </h6>
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
                        <h6 className="font-semibold text-[1rem]">
                          Reset Password
                        </h6>
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
                        <h6 className="font-semibold text-[1rem]">
                          Reset Password
                        </h6>
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

export default ResetRequest;

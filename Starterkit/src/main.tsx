import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./pages/App.tsx";
import Signincover from "./container/authentication/signin/signincover/signincover.tsx";
import Signinbasic from "./container/authentication/signin/signinbasic/signinbasic.tsx";
import Authenticationlayout from "./pages/authenticationlayout.tsx";
import Error401 from "./container/error/401error/401error.tsx";
import Error404 from "./container/error/404error/404error.tsx";
import Error500 from "./container/error/500error/500error.tsx";
import Comingsoon from "./container/authentication/comingsoon/comingsoon.tsx";
import Createbasic from "./container/authentication/createpassword/basic/basic.tsx";
import Createcover from "./container/authentication/createpassword/cover/cover.tsx";
import Undermaintanace from "./container/authentication/undermaintanace/undermaintanace.tsx";
import Lockbasic from "./container/authentication/lockscreen/lockbasic/lockbasic.tsx";
import Lockcover from "./container/authentication/lockscreen/lockcover/lockcover.tsx";
import Resetbasic from "./container/authentication/resetpassword/resetbasic/resetbasic.tsx";
import Resetcover from "./container/authentication/resetpassword/resetcover/resetcover.tsx";
import Signupbasic from "./container/authentication/signup/signupbasic/signupbasic.tsx";
import Signupcover from "./container/authentication/signup/signupcover/signupcover.tsx";
import Twostepbasic from "./container/authentication/twostepverification/twostepbasic/twostepbasic.tsx";
import Twostepcover from "./container/authentication/twostepverification/twostepcover/twostepcover.tsx";
import Crm from "./container/dashboards/crm/crm.tsx";
import Test from "./container/test/test.tsx";
import "./index.scss";
import ResetRequest from "./container/authentication/resetpassword/resetrequest/resetrequest.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/authentication/signin/signincover" />}
          />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            {/* Default route */}
            <Route path="" element={<Navigate to="home" />} />
            <Route path="home" element={<Crm />} />
            <Route path="test" element={<Test />} />
          </Route>

          <Route path="/" element={<Authenticationlayout />}>
            <Route path="authentication/comingsoon" element={<Comingsoon />} />
            <Route
              path="authentication/createpassword/basic"
              element={<Createbasic />}
            />
            <Route
              path="authentication/createpassword/cover"
              element={<Createcover />}
            />
            <Route
              path="authentication/lockscreen/lockbasic"
              element={<Lockbasic />}
            />
            <Route
              path="authentication/lockscreen/lockcover"
              element={<Lockcover />}
            />
            <Route
              path="authentication/resetpassword/resetbasic"
              element={<Resetbasic />}
            />
            <Route
              path="authentication/resetpassword/resetcover/:token"
              element={<Resetcover />}
            />
            <Route
              path="authentication/resetpassword/resetrequest"
              element={<ResetRequest />}
            />
            <Route
              path="authentication/signup/signupbasic"
              element={<Signupbasic />}
            />
            <Route
              path="authentication/signup/signupcover"
              element={<Signupcover />}
            />
            <Route
              path="authentication/signin/signinbasic"
              element={<Signinbasic />}
            />
            <Route
              path="authentication/signin/signincover"
              element={<Signincover />}
            />
            <Route
              path="authentication/twostepverification/twostepbasic"
              element={<Twostepbasic />}
            />
            <Route
              path="authentication/twostepverification/twostepcover"
              element={<Twostepcover />}
            />
            <Route
              path="authentication/undermaintenance"
              element={<Undermaintanace />}
            />
            <Route path="error/401error" element={<Error401 />} />
            <Route path="error/404error" element={<Error404 />} />
            <Route path="error/500error" element={<Error500 />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);

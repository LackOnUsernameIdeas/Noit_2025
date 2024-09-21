import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./pages/App.tsx";
import Signincover from "./container/authentication/signin/signin.tsx";
import Authenticationlayout from "./pages/authenticationlayout.tsx";
import Resetcover from "./container/authentication/resetpassword/resetpassword.tsx";
import Signupcover from "./container/authentication/signup/signup.tsx";
import Twostepcover from "./container/authentication/twostepverification/twostepverification.tsx";
import Crm from "./container/dashboards/crm/crm.tsx";
import Test from "./container/test/test.tsx";
import "./index.scss";
import ResetRequest from "./container/authentication/resetpassword/resetrequest.tsx";
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
            <Route
              path="authentication/resetpassword/resetcover/:token"
              element={<Resetcover />}
            />
            <Route
              path="authentication/resetpassword/resetrequest"
              element={<ResetRequest />}
            />
            <Route
              path="authentication/signup/signupcover"
              element={<Signupcover />}
            />
            <Route
              path="authentication/signin/signincover"
              element={<Signincover />}
            />
            <Route
              path="authentication/twostepverification/twostepcover"
              element={<Twostepcover />}
            />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);

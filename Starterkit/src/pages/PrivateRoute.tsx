import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean>(true); // State to store token validation status
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/token-validation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const result = await response.json();
        setIsValid(result.valid);
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) {
    return <div>Loading...</div>; // Render a loading state while token validation is in progress
  }

  return isValid ? (
    children
  ) : (
    <Navigate to="/authentication/signin/signincover" />
  );
};

export default PrivateRoute;

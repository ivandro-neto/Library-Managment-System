import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user, accessToken, refreshAccessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
      setLoading(false);
    };

    validateToken();
  }, [accessToken, refreshAccessToken]);

  if (loading) {
    return <p>Loading...</p>; // Pode ser substituído por um spinner
  }

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.some((role) => user?.roles.includes(role))) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

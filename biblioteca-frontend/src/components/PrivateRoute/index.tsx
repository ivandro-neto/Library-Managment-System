import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user, accessToken, refreshAccessToken } = useContext(AuthContext);

  useEffect(() => {
    if (!accessToken) return;
    refreshAccessToken();
  }, [accessToken, refreshAccessToken]);

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.some((role) => user?.roles[0].includes(role))) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

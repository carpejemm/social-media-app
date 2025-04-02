import { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { UserContext } from "../context/user.context";

interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<Record<string, unknown>>;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    return null;
  }

  const { currentUser } = userContext;

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;

import { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { UserContext } from "../context/user.context";

interface IPublicRouteProps extends RouteProps {
  component: React.ComponentType<Record<string, unknown>>;
}

const PublicRoute: React.FC<IPublicRouteProps> = ({
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
        currentUser ? <Redirect to="/newsfeed" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;

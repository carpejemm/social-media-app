import { useForm } from "react-hook-form";
import { IUser, login } from "../hooks/authService";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonPage,
  useIonLoading,
} from "@ionic/react";
import "./Login.css";
import { NavLink } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useForm<IUser>();
  const [loading, dismiss] = useIonLoading();

  const onSubmit = async (data: IUser) => {
    await loading();
    try {
      await login(data?.email, data?.password);
      dismiss();
    } catch (error) {
      console.error("Login error:", error);
      dismiss();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle>Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <IonInput
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="login-input"
                  required
                />
                <IonInput
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="login-input"
                  required
                />
                <IonButton
                  type="submit"
                  expand="block"
                  className="login-button"
                >
                  Login
                </IonButton>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Do not have an account?{" "}
                <NavLink to="/signup" className="text-blue-500 hover:underline">
                  Signup
                </NavLink>
              </p>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

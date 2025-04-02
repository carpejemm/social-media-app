import { SubmitHandler, useForm } from "react-hook-form";
import { createUserDocumentFromAuth, signUp } from "../hooks/authService";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonPage,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import "./SignUp.css";
import { NavLink } from "react-router-dom";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const { register, handleSubmit } = useForm<SignUpFormData>();
  const [loading, dismiss] = useIonLoading();
  const [ionAlert] = useIonAlert();

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    await loading();

    if (data?.password !== data.confirmPassword) {
      console.error("Passwords do not match");
      await dismiss();
      ionAlert({
        // header: "Error",
        message: "Passwords do not match",
        buttons: ["OK"],
      });
      return;
    }

    try {
      const user = await signUp(data.email, data.password, data.fullName);
      await createUserDocumentFromAuth(user, {
        displayName: data.fullName,
      });
      await dismiss();
    } catch (error) {
      console.error("Signup error:", error);
      await dismiss();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="signup-container">
          <IonCard className="signup-card">
            <IonCardHeader>
              <IonCardTitle>Sign Up</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
                <IonInput
                  {...register("fullName")}
                  placeholder="Full Name"
                  className="signup-input"
                  required
                />
                <IonInput
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="signup-input"
                  required
                />
                <IonInput
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="signup-input"
                  required
                />
                <IonInput
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm Password"
                  className="signup-input"
                  required
                />
                <IonButton
                  type="submit"
                  expand="block"
                  className="signup-button"
                >
                  Sign Up
                </IonButton>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <NavLink to="/login" className="text-blue-500 hover:underline">
                  Log in
                </NavLink>
              </p>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;

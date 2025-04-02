import { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import { UserContext } from "../context/user.context";

import "./Profile.css";
import { logout } from "../hooks/authService";

const Profile: React.FC = () => {
  const userContext = useContext(UserContext);
  const router = useIonRouter();

  if (!userContext || !userContext.currentUser) {
    return <IonContent>Loading...</IonContent>;
  }

  const { currentUser, setCurrentUser } = userContext;

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    router.push("/login", "root"); // Redirect to login page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle onClick={() => router.push("/")}>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="profile-container">
          <IonCard className="profile-card">
            <IonCardContent>
              <h2>Full Name: {currentUser.displayName || "N/A"}</h2>
              <p>Email: {currentUser.email}</p>
              <IonButton onClick={handleLogout}>Logout</IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

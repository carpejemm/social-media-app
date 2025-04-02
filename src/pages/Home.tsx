import { useContext, useState, useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./Home.css";
import { usePostStore } from "../store/userStore"

// import ExploreContainer from "../components/ExploreContainer";
import { UserContext } from "../context/user.context";
import { logout } from "../hooks/authService";

const Home: React.FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const userContext = useContext(UserContext);
  const router = useIonRouter();
  const { posts, fetchPosts } = usePostStore();

  if (!userContext) {
    return null;
  }
  const { currentUser, setCurrentUser } = userContext;

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    router.push("/login", "root"); 
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>App</IonTitle>

          {currentUser && (
            <IonButtons slot="end">
              <IonButton
                id="user-menu-button"
                onClick={() => setPopoverOpen(true)}
              >
                ☰
              </IonButton>

              <IonPopover
                isOpen={popoverOpen}
                onDidDismiss={() => setPopoverOpen(false)}
                trigger="user-menu-button"
              >
                <IonList>
                  <IonItem
                    button
                    onClick={() => {
                      router.push("/profile", "forward");
                      setPopoverOpen(false);
                    }}
                  >
                    Profile
                  </IonItem>
                  <IonItem button onClick={handleLogout}>
                    Logout
                  </IonItem>
                </IonList>
              </IonPopover>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="post-container">
          {posts?.map((post) => (
            <IonCard key={post.id} className="post">
              <IonCardHeader>
                <IonCardTitle>Post #{post.id} - {post.title}</IonCardTitle>
              </IonCardHeader>
              <IonImg src={post.image} alt={`Post ${post.id}`} />
              <IonCardContent>{post.body}</IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SpotifyService from "./services/SpotifyService";
import { AuthorizeSpotifyButton } from "./pages/login/AuthorizeSpotifyButton";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/Firebase";
import { UserContext } from "./context/UserContext";

function App() {
  const navigate = useNavigate();
  const [isSpotifyAuthorized, setIsSpotifyAuthorized] = useState(false);
  const { pathname } = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getSession() {
      const hasSpotifyAuth = await SpotifyService.instance.getSpotifySession(
        user!
      );
      if (hasSpotifyAuth) {
        setIsSpotifyAuthorized(true);
      }
    }
    if (user) {
      getSession();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        if (pathname === "/login") {
          navigate("/top_items");
        }
      } else {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="bg-secondary-light dark:bg-black text-black dark:text-white h-full p-4">
      <UserContext.Provider value={user}>
        {!isSpotifyAuthorized && <AuthorizeSpotifyButton />}
        <Outlet />
      </UserContext.Provider>
    </div>
  );
}

export default App;

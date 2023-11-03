import { AuthorizeSpotifyButton } from "./pages/login/AuthorizeSpotifyButton";
import { Header } from "./pages/login/Header";

function App() {
  return (
    <div className="flex flex-row justify-center bg-white dark:bg-black h-screen">
      <div className="flex flex-col my-20 gap-10">
        <Header />
        <AuthorizeSpotifyButton />
      </div>
    </div>
  );
}

export default App;

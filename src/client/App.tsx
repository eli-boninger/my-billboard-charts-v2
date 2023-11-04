import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-white dark:bg-black h-screen text-black dark:text-white">
      <Outlet />
    </div>
  );
}

export default App;

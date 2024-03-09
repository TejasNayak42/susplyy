import { useCookies } from "react-cookie";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

const Logout = () => {
  const [, , removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    // Remove token cookie
    removeCookie("token");
    // Remove local storage
    localStorage.clear();
    // Redirect to "/"
    window.location.href = "/";
  };

  return (
    <Button onClick={handleLogout} variant={"destructive"}>
      Logout
    </Button>
  );
};

export default Logout;

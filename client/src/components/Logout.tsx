import { useCookies } from "react-cookie";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

const Logout = () => {
  const [, , removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    // Remove token cookie
    removeCookie("token");
    // Redirect to "/"
    window.location.href = "/";
  };

  return (
    <Button variant={"link"}>
      <LogOut
        onClick={handleLogout}
        className="h-full text-red-500 hover:scale-105 transition-all duration-200"
      />
    </Button>
  );
};

export default Logout;

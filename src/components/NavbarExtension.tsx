
import { NavLink } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const NavbarExtension = () => {
  return (
    <NavLink 
      to="/contact" 
      className={({ isActive }) => 
        `px-3 py-2 transition-colors hover:text-foreground flex items-center gap-1.5 ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`
      }
    >
      <MessageCircle className="h-4 w-4" />
      Contact
    </NavLink>
  );
};

export default NavbarExtension;

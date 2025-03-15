
import { NavLink } from "react-router-dom";

const NavbarExtension = () => {
  return (
    <NavLink 
      to="/contact" 
      className={({ isActive }) => 
        `px-3 py-2 transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`
      }
    >
      Contact
    </NavLink>
  );
};

export default NavbarExtension;

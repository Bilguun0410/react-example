import { Link, NavLink } from "react-router-dom";
import { menu } from "../constant/menu";

export const Header = () => {
  return (
    <header>
      <nav className="fixed inset-x-0 top-3">
        <ul className="flex py-2 rounded-sm bg-sidebar/40 backdrop-blur-sm gap-3 mx-auto max-w-2xl justify-center">
          {menu.map((item, index) => (
            <li key={index}>
              <NavLink
                className="hover:font-bold aria-[current=page]:text-destructive transition-all ease-in-out hover:text-myColor hover:border-b"
                to={item.href}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

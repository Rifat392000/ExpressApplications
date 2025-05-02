import { NavLink } from 'react-router';
const Header = () => {
    const navLinkClass = ({ isActive }) =>
        isActive
          ? "text-orange-500 font-semibold border-b-2 border-orange-500"
          : "text-gray-700 hover:text-orange-500";
    
      return (
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600">Coffee Hub</h1>
            <nav className="space-x-6">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/addCoffee" className={navLinkClass}>
                Add Coffee
              </NavLink>
              <NavLink to="/users" className={navLinkClass}>
                Users
              </NavLink>
              <NavLink to="/signin" className={navLinkClass}>
                Sign In
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Sign Up
              </NavLink>
            </nav>
          </div>
        </header>
      );
};

export default Header;
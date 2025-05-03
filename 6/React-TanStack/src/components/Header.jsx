import { NavLink } from "react-router-dom"

const Header = () => {
  return (
    <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/PostsTraditional">Posts Traditional</NavLink>
        <NavLink to="/PostDetailsRQ">Post Details React Query</NavLink>
    </div>
  )
}

export default Header
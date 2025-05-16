import './App.css';
import Users from './components/Users';
import { useLoaderData } from 'react-router-dom';

function App() {
  const users = useLoaderData();

  return (
    <>
      <h1>Simple CRUD Operation</h1>
      <Users users={users}></Users>
    </>
  );
}

export default App;

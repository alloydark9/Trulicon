import { useNavigate } from "react-router-dom";


const Dashboard = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/vault")
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleClick} className="bg-blue-400 text-white cursor-pointer">
        Create Vault
      </button>
    </div>
  );
};

export default Dashboard;

import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-5">
      <h1 className="text-3xl font-bold">Welcome to Trulicon!</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
};

export default Welcome;

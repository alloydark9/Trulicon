import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <form
        action="/login"
        className="flex flex-col gap-4"
        onSubmit={handlesubmit}
      >
        <input
          type="value"
          name="validator"
          placeholder="Username or Email or Phone"
          className="border-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-2"
        />
        <button
          type="submit"
          className="bg-blue-400 text-white cursor-pointer"
        >
          Login
        </button>
      </form>
      <button>
        Don't have an account?{" "}
        <span
          className="font-bold text-blue-700 hover:underline cursor-pointer"
          onClick={() => navigate("/register", { replace: true })}
        >
          Register
        </span>
      </button>
    </div>
  );
};

export default Login;

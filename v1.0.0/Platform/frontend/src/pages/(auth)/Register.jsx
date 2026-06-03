import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // to build
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-10">
      <form action="/register" className="flex flex-col gap-4" onSubmit={(e)=>e.preventDefault()}>
        <input
          type="value"
          name="name"
          placeholder="Full Name"
          className="border-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-2"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          className="border-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-2"
        />
        <input
          type="value"
          name="country"
          placeholder="Country (eg. IN, US)"
          className="border-2"
        />
        <p>Date of Birth:</p>
        <input type="date" name="dob" className="border-2" />
        <p>Gender:</p>
        <div className="flex gap-5">
          <label className="flex items-center gap-2">
            <input type="radio" name="gender" value="Male" />
            Male
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="gender" value="Female" />
            Female
          </label>
        </div>
        <button type="submit" className="bg-blue-400 text-white cursor-pointer" onClick={handleSubmit}>
          Register
        </button>
      </form>
      <button>
        Already have an account?{" "}
        <span
          className="font-bold text-blue-700 hover:underline cursor-pointer"
          onClick={() => navigate("/login", { replace: true })}
        >
          Login
        </span>
      </button>
    </div>
  );
};

export default Register;

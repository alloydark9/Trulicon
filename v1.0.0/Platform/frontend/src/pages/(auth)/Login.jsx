import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    validator: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!formData.validator.trim()) {
      alert("Username, email or phone required");
      return false;
    }

    if (!formData.password.trim()) {
      alert("Password required");
      return false;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await dispatch(
      login({
        validator: formData.validator,
        password: formData.password
      }),
    );

    if (login.fulfilled.match(result)) {
      navigate("/app/dashboard", {
        replace: true,
      });
    }
  };
  {
    error && <p className="text-red-500">{error}</p>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <form
        action="/login"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="validator"
          placeholder="Username or Email or Phone"
          className="border-2"
          value={formData.validator}
          onChange={handleChange}
        />
        <input
          type="value"
          name="password"
          placeholder="Password"
          className="border-2"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-400 text-white cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
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

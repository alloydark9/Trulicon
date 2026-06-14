import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { register } from "../../redux/slices/authSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedGender, setSelectedDate] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        country: "",
        dob: "",
        gender: "",
        password: ""
    });

    const { loading, error } = useSelector(state => state.auth);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(
            register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                username: formData.username,
                country: formData.country,
                dob: formData.dob,
                gender: formData.gender,
                password: formData.password
            })
        );

        if (register.fulfilled.match(result)) {
            navigate("/app/dashboard", {
                replace: true
            });
        }
    };
    {
        error && <p className="text-red-500">{error}</p>;
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-10">
            <form
                action="/register"
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="border-2"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="border-2"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border-2"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile Number"
                    className="border-2"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border-2"
                    value={formData.password}
                    onChange={handleChange}
                />
                <input
                    type="value"
                    name="country"
                    placeholder="Country (eg. IN, US)"
                    className="border-2"
                    value={formData.country}
                    onChange={handleChange}
                />
                <p>Date of Birth:</p>
                <input
                    type="date"
                    name="dob"
                    className="border-2"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={handleChange}
                />
                <p>Gender:</p>
                <div className="flex gap-5">
                    {["male", "female"].map(gender => (
                        <div className="p-5 gap-5" key={gender}>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value={gender}
                                    onChange={handleChange}
                                />
                                {""}
                                {gender.charAt(0).toUpperCase() +
                                    gender.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-400 text-white cursor-pointer"
                >
                    {loading ? "Registering..." : "Register"}
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

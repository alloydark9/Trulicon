import { useNavigate } from "react-router-dom";
import VaultPopup from "../../components/VaultPopup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { vaultCreate, vaultJoin } from "../../redux/slices/vaultSlice";
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isPopup, setIsPopup] = useState(false);
  const [isWannaJoin, setIsWannaJoin] = useState(false);
  const { loading, error } = useSelector((state) => state.vault);
  const user = useSelector((state) => state.auth.user);

  const [inputData, setInputData] = useState({
    vaultName: "",
    vaultCode: "",
  });

  const handleChange = (e) => {
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePopup = () => {
    setIsPopup(true);
  };

  const clickJoin = () => {
    setIsWannaJoin(true);
  };

  const clickCreate = () => {
    setIsWannaJoin(false);
  }

  const handleSubmit = async () => {
    let result;
    if (isWannaJoin) {
      result = await dispatch(vaultJoin({ code: inputData.vaultCode }));
    } else {
      result = await dispatch(vaultCreate({ name: inputData.vaultName }));
    }

    if (
      vaultCreate.fulfilled.match(result) ||
      vaultJoin.fulfilled.match(result)
    ) {
      let vaultCode = result.payload.data.vault?.code;
      navigate(`/vault/${vaultCode}`);
    }
  };

  const logoutUser = async () => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) {
      navigate("/", {
        replace: true,
      });
    }
  };

  <div className="w-screen h-screen flex justify-center items-center flex-col gap-5">
    {error && <p className="text-red-500">{error}</p>}
  </div>;

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-5">
      <h1 className="text-3xl font-bold">
        {user?.data?.user?.name}'s Dashboard
      </h1>
      <button
        onClick={handlePopup}
        className="bg-blue-400 text-white cursor-pointer w-auto h-auto p-2"
      >
        Create Vault
      </button>
      <button
        onClick={logoutUser}
        className="bg-red-400 text-white cursor-pointer w-auto h-auto p-2"
      >
        Logout Vault
      </button>

      <VaultPopup
        isOpen={isPopup && !isWannaJoin}
        onClose={() => setIsPopup(false)}
      >
        <div className="p-4 p-10 bg-white w-auto h-auto flex justify-center items-center flex-col gap-6">
          <input
            type="text"
            name="vaultName"
            placeholder="Enter name of Vault"
            className="border-2"
            onChange={handleChange}
            value={inputData.vaultName}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-400 text-white cursor-pointer w-auto h-auto p-2"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Vault"}
          </button>
          <button>
            Wanna join?{" "}
            <span
              className="font-bold text-blue-700 hover:underline cursor-pointer"
              onClick={clickJoin}
            >
              Join Vault
            </span>
          </button>
        </div>
      </VaultPopup>

      <VaultPopup
        isOpen={isPopup && isWannaJoin}
        onClose={() => setIsPopup(false)}
      >
        <div className="p-4 p-10 bg-white w-auto h-auto flex justify-center items-center flex-col gap-6">
          <input
            type="text"
            name="vaultCode"
            placeholder="Enter code of Vault"
            className="border-2"
            onChange={handleChange}
            value={inputData.vaultCode}
          />
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-blue-400 text-white cursor-pointer w-auto h-auto p-2"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Vault"}
          </button>
          <button>
            Wanna create?{" "}
            <span
              className="font-bold text-blue-700 hover:underline cursor-pointer"
              onClick={clickCreate}
            >
              Create Vault
            </span>
          </button>
        </div>
      </VaultPopup>
    </div>
  );
};

export default Dashboard;

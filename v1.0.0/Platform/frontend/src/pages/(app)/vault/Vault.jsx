import { useEffect, useState } from "react";
// import socket from "../../../config/socket";
// import { vaultJoin } from "../../../socket/events/vaultEvents";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../../redux/slices/userSlice";
import { getVaultByCode } from "../../../redux/slices/vaultSlice";
import useVaultSocket from "../../../socket/events/vaultEvents";
import { useParams } from "react-router-dom";

const Vault = () => {
  const { currentVault } = useSelector((state) => state.vault);
  const [members, setMembers] = useState([]);
  const { code } = useParams();

  const dispatch = useDispatch();

  useVaultSocket(currentVault, () => {
    dispatch(getVaultByCode(currentVault));
  });

  useEffect(() => {
    if (!code) return;

    dispatch(getVaultByCode({code:code}));
  }, [code, dispatch]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentVault?.members) return;

      const memberData = await Promise.all(
        currentVault.members.map((id) => dispatch(getUserById(id)).unwrap()),
      );

      setMembers(memberData);
    };
    fetchMembers();
  }, [currentVault, dispatch]);

  return (
    <div className="w-full h-screen flex flex-col p-10 justify-center items-center">
      <h1>Vault name: {currentVault?.name}</h1>
      <h1>Vault code: {currentVault?.code}</h1>
      <h1>Vault status: {currentVault?.status}</h1>
      <h1>
        members:
        {members.map((member) => (
          <div key={member?.data?.user?._id}>
            @{member?.data?.user?.username}
          </div>
        ))}
      </h1>
    </div>
  );
};

export default Vault;

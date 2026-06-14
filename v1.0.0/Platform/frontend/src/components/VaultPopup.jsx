

const VaultPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-[rgba(0,0,0,0.5)] w-screen h-screen z-100 flex justify-center items-center fixed top-0 left-0" onClick={onClose}>
      <div className="z-11n w-auto h-auto p-5 bg-white" onClick={(e) => e.stopPropagation()}>
        <button className="text-2xl text-black cursor-pointer" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default VaultPopup;

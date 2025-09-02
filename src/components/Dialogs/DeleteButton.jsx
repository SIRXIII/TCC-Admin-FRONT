import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const DeleteButton = ({ onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6]"
      >
        Delete
      </button>

      <ConfirmDialog
        isOpen={open}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default DeleteButton;

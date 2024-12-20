import React from "react";
import { useTranslation } from "next-i18next";

type GroupActionsProps= {
  isGroupAdmin: boolean;
  loggedInUserRole: string;
  setIsSliderOpen: (open: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
  handleLeaveGroup: () => void;
  handleDeleteGroup: () => void;
  setIsGroceryListOpen: (open: boolean) => void;
}

const GroupActions: React.FC<GroupActionsProps> = ({
  isGroupAdmin,
  loggedInUserRole,
  setIsSliderOpen,
  setIsModalOpen,
  handleLeaveGroup,
  handleDeleteGroup,
  setIsGroceryListOpen,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="absolute top-30 left-5 flex flex-col space-y-1">
      {loggedInUserRole === "user" && (
        <button
          onClick={() => setIsSliderOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          {t("group.viewUsers.button")}
        </button>
      )}

      {(isGroupAdmin || loggedInUserRole === "ApplicationAdmin") && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {t("group.createGroceryList.button")}
        </button>
      )}

      <button
        onClick={() => setIsGroceryListOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
      >
        {t("group.viewGroceryList.button")}
      </button>

      {(isGroupAdmin || loggedInUserRole === "ApplicationAdmin") && (
        <button
          onClick={handleDeleteGroup}
          className="bg-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-800"
        >
          Delete Group
        </button>
      )}
    </div>
  );
};

export default GroupActions;

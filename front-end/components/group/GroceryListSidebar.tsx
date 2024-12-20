import React from "react";
import { useTranslation } from "next-i18next";
import GroceryList from "@components/groceryList/groceryListList";

interface GroceryListSidebarProps {
  isGroceryListOpen: boolean;
  setIsGroceryListOpen: (open: boolean) => void;
  groupId: number;
}

const GroceryListSidebar: React.FC<GroceryListSidebarProps> = ({ isGroceryListOpen, setIsGroceryListOpen, groupId }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[40%] bg-gray-100 shadow-lg transform ${
        isGroceryListOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-500 to-green-900 text-white">
<h3 className="text-lg font-semibold">{t("group.grocerylist")}</h3>
        <button
          onClick={() => setIsGroceryListOpen(false)}
          className="text-white text-2xl leading-none"
        >
          &times;
        </button>
      </div>
      <div className="p-4 overflow-y-auto flex flex-col gap-4">
        {groupId && <GroceryList groupId={groupId} />}
      </div>
    </div>
  );
};

export default GroceryListSidebar;
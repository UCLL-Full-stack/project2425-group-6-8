import React from "react";
import { useTranslation } from "next-i18next";

interface UserListSidebarProps {
  isSliderOpen: boolean;
  setIsSliderOpen: (open: boolean) => void;
  groupchat: any;
  isGroupAdmin: boolean;
  openKickConfirmation: (nickname: string, userId: number) => void;
}

const UserListSidebar: React.FC<UserListSidebarProps> = ({
  isSliderOpen,
  setIsSliderOpen,
  groupchat,
  isGroupAdmin,
  openKickConfirmation,
}) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform ${
        isSliderOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-900 to-green-500 text-white">
        <h3 className="text-gray-300">{t("users.title")}</h3>
        <button
          onClick={() => setIsSliderOpen(false)}
          className="text-white text-2xl leading-none"
        >
          &times;
        </button>
      </div>
      <div className="p-4">
        {groupchat?.userGroups && groupchat.userGroups.length > 0 ? (
          <ul>
            {groupchat.userGroups.map((userGroup: any) => (
              <li key={userGroup.user.id} className="py-2 border-b border-gray-300 flex justify-between items-center">
                <span>
                  <span className="font-semibold">{userGroup.user.nickname}</span>
                  <span className="text-gray-500 ml-2">
                    ({t(`group.role.${userGroup.role}`)})
                  </span>
                </span>
                {isGroupAdmin && (
                  <button
                    onClick={() => openKickConfirmation(userGroup.user.nickname, userGroup.user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    {t("group.kick")}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("group.validate.noUsers")}</p>
        )}
      </div>
    </div>
  );
};

export default UserListSidebar;

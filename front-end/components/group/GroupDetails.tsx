import React from "react";
import { useTranslation } from "next-i18next";

interface GroupDetailsProps {
  groupchat: any;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ groupchat }) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex-grow p-4 bg-gray-50 flex flex-col">
      <h1>{groupchat?.name || t("group.details.defaultName")}</h1>
      <h4 className="text-l font-semibold text-gray-800 dark:text-black text-center">
        {t("group.id")}: {groupchat?.id || t("group.details.noId")}
      </h4>
    </div>
  );
};

export default GroupDetails;

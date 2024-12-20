import React from "react";
import { useTranslation } from "next-i18next";

interface KickConfirmationModalProps {
  isOpen: boolean;
  userNickname: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const KickConfirmationModal: React.FC<KickConfirmationModalProps> = ({
  isOpen,
  userNickname,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800">
          {t("group.kickConfirmation.title")}
        </h2>
        <p className="mt-2 text-gray-600">
          {t("group.kickConfirmation.text", { nickname: userNickname })}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            {t("group.kickConfirmation.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            {t("group.kickConfirmation.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KickConfirmationModal;

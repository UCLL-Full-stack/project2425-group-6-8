import Link from "next/link";
import { Group } from "@types";
import { useTranslation } from "next-i18next";

type Props = {
  group: Group[];
};

const GroupList: React.FC<Props> = ({ group }: Props) => {
  const { t } = useTranslation("common");

  return (
    <>
      <h3 className="px-0 text-2xl font-semibold text-gray-800 dark:text-black">
        {t("group.title")}
      </h3>
      <ul className="max-w-md space-y-4 mt-4">
        {group.map((groupItem) => (
          <li
            key={groupItem.id}
            className="rounded-lg bg-green-900 text-white p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link
              href={`/group/${groupItem.id}`}
              className="text-lg font-medium hover:underline flex justify-between items-center"
            >
              <span>{groupItem.name}</span>
              <span className="text-sm">➔</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GroupList;

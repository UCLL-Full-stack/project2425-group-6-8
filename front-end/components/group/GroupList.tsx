import Link from "next/link";
import { Group } from "@types";

type Props = {
  group: Group[]; // Change this to an array of Group objects
};

const GroupList: React.FC<Props> = ({ group }: Props) => {
  return (
    <ul className="w-full max-w-lg">
      {group.map((groupItem) => (
        <li
          key={groupItem.id}
          className="border-b py-4 flex justify-between items-center"
        >
          <span className="text-lg">{groupItem.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;

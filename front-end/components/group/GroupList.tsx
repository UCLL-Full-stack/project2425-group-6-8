import Link from "next/link";

type Group = {
  id: string;
  name: string;
};

type GroupListProps = {
  groups: Group[];
};

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  return (
    <ul className="w-full max-w-lg">
      {groups.map((group) => (
        <li
          key={group.id}
          className="border-b py-4 flex justify-between items-center"
        >
          <span className="text-lg">{group.name}</span>
          <Link href={`/groups/${group.id}`}>
            <a className="text-blue-500 hover:underline">View Details</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;

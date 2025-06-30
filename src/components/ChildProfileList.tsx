import { Link } from 'react-router-dom';
import { ChildProfile } from '../types/child-profile.types';

interface Props {
  children: ChildProfile[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ChildProfileList = ({ children, onEdit, onDelete }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => (
        <div key={child.child_id} className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">{child.name}</h3>
          <p className="text-gray-500">Age: {child.age}</p>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => onEdit(child.child_id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(child.child_id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
            <Link
              to={`/chat?child_id=${child.child_id}`}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition flex-1 text-center"
            >
              Chat
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
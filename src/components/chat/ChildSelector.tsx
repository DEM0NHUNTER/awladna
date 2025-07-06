// src/components/chat/ChildSelector.tsx
import React from 'react';

interface Child {
  id: number;
  name: string;
  age: number;
}

interface Props {
  childrenList: Child[];
  selectedChildId: number | null;
  onSelect: (child: Child) => void;
}

const ChildSelector: React.FC<Props> = ({ childrenList, selectedChildId, onSelect }) => {
  return (
    <div className="px-4 py-2">
      <label className="text-sm font-medium text-gray-600 mr-2">Chat about:</label>
      <select
        className="px-2 py-1 border rounded"
        value={selectedChildId ?? ''}
        onChange={(e) => {
          const selected = childrenList.find(c => c.id === Number(e.target.value));
          if (selected) onSelect(selected);
        }}
      >
        <option value="">Select a child</option>
        {childrenList.map(child => (
          <option key={child.id} value={child.id}>
            {child.name} (age {child.age})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChildSelector;

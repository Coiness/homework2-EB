// components/filter/FilterGroup.tsx
import { ReactNode } from "react";

interface FilterGroupProps {
  grouptitle: string;
  children: ReactNode;
}

// title是告诉用户Group的名字，像是分类、标签这种，具体的单选/多选逻辑在子组件实现

export function FilterGroup({ grouptitle, children }: FilterGroupProps) {
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-3 text-sm text-gray-900">{grouptitle}</h4>
      {children}
    </div>
  );
}

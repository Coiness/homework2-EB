"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { FilterGroup } from "./FilterGroup";

interface Option {
  label: string;
  value: string;
}

interface CheckboxFilterProps {
  title: string;
  paramKey: string;
  options: Option[];
}

export function CheckboxFilter({
  title,
  paramKey,
  options,
}: CheckboxFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 现在的选项值？searchParams到底get了个什么？现存的paramKey？那label干什么用的？
  // url标签的存储方式：paramKey:label[]，如果不存在paramKey，说明没有相关标签被选择，返回[]
  // 里面有什么label是由Option决定，paramKey决定的是label这一类的名称
  // label 给用户看，value 给url看

  // const currentValues = searchParams.get(paramKey)?.split(",")||[]
  const currentValues = searchParams.get(paramKey)
    ? searchParams.get(paramKey)!.split(",").filter(Boolean)
    : [];

  const checks = new Set(currentValues);

  const handleCheckedChange = (checked: boolean, value: string) => {
    // 获取 params，也就是现在的fliter参数
    const params = new URLSearchParams(searchParams.toString());
    // 使用newValues，这步是为了不变性，避免直接修改currentValues

    let newValues = [...currentValues];

    // 修改newValues为目标值
    if (checked) {
      if (!newValues.includes(value)) {
        newValues.push(value);
      }
    } else {
      newValues = newValues.filter((v) => v !== value);
    }

    // 使用newValues更新我们的params
    // 疑问：newValues 的数据结构？为什么我们要将他toString，toString后的结果是什么？
    if (newValues.length > 0) {
      params.set(paramKey, newValues.toString());
    } else {
      params.delete(paramKey);
    }

    // 依旧使用router.push进行更新，但是存在疑问，这个router有url吗？
    // 我们直接push会不会出现url = "/products/products"的情况？
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  };

  // ui设计，为每个

  return (
    <FilterGroup grouptitle={title}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2 py-1">
          <Checkbox
            id={`${paramKey}-${option.value}`}
            checked={checks.has(option.value) ? true : false}
            onCheckedChange={(checked) =>
              handleCheckedChange(Boolean(checked), option.value)
            }
          />
          <Label htmlFor={`${paramKey}-${option.value}`} className="text-sm">
            {option.label}
          </Label>
        </div>
      ))}
    </FilterGroup>
  );
}

// 现在的疑惑：
// 1. paramKey干什么用的？为什么会作为props传给这个组件？
// 2. 为什么paramKey是string属性？这个如果是要读取一个过滤选型，那就不应该用string，但是我看option类型，也不应该只读取一个吧？
// 3. 怎么样传递这个check呢？这个check是状态吗？根据url来setState？
// 4. 读不懂shadcn的组件，里面的泛型看起来好复杂。。

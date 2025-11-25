import { CategoryFilter } from "./CategoryFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { CheckboxFilter } from "./CheckoutboxFilter";

const CATEGORIES = [
  { id: "clothes", name: "服饰" },
  { id: "electronics", name: "数码" },
  { id: "home", name: "家居" },
];

const TAGS = [
  { label: "热销", value: "hot" },
  { label: "新品", value: "new" },
  { label: "包邮", value: "free_shipping" },
];

export function FilterSection() {
  return (
    <aside className="w-64 shrink-0 pr-6 border-r hidden md:block">
      <div className="sticky top-4">
        <h3 className="font-bold text-lg mb-4">筛选</h3>
        <CategoryFilter categories={CATEGORIES} />
        <div className="my-4 border-t" />
        <PriceRangeFilter />
        <div className="my-4 border-t" />
        <CheckboxFilter title="标签" paramKey="tags" options={TAGS} />
      </div>
    </aside>
  );
}

import { FilterSection } from "@/components/FilterComponents/FilterSection";
import { ToolbarClient } from "@/components/MainContent/ToolbarClient";
import { DisplaySection, Toolbar } from "@/components/MainContent";
import { api } from "@/lib/api";
import type { ProductFilter } from "@/types";

// Server Component: 解析 URL 参数 -> 转换为 ProductFilter -> 请求数据 -> 渲染
// 学习点（提问）：
// - 你为什么想把过滤器放到 URL 而不是 local state？URL 对 share / back/forward 有什么好处？
//  router.push是将url放进history里，所以无论是back/forward都可以很好地处理，不会出现状态丢失的情况
// - 当页面首次加载（SSR）时，我们为什么更倾向于在 Server Component 中请求数据？
//  更快吧，可以先在服务器端请求然后渲染然后发送HTML给用户，这样可以节省时间
export default async function ProductsPage({
  searchParams,
}: {
  // Next.js App Router 会把搜索参数按键值传入这个 prop
  // NOTE: in Next 16/Turbopack the `searchParams` may be passed as a Promise
  // so we accept either the resolved object or a Promise that resolves to it.
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  // Helper: 把 searchParams 解析为后端期望的字段
  function parseFilters(
    params: Record<string, string | string[] | undefined>
  ): ProductFilter {
    const page = Number(params.page ?? "1") || 1;
    const pageSize = Number(params.pageSize ?? "12") || 12;

    const query = typeof params.query === "string" ? params.query : undefined;
    const category =
      typeof params.category === "string" ? params.category : undefined;

    // tags 可以是 "hot,new" 的字符串，也可能是数组（多次 ?tags=hot&tags=new），下面兼容两种情况
    let tags: string[] | undefined;
    const tagsRaw = params.tags;
    if (typeof tagsRaw === "string") {
      tags = tagsRaw.split(",").filter(Boolean);
    } else if (Array.isArray(tagsRaw)) {
      tags = tagsRaw
        .flatMap((t) => (t ? String(t).split(",") : []))
        .filter(Boolean);
    }

    const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
    const sort =
      typeof params.sort === "string"
        ? (params.sort as ProductFilter["sort"])
        : undefined;

    // 强制 page 和 pageSize 为 number（ProductFilter 的要求）
    const filter: ProductFilter = {
      page,
      pageSize,
      query,
      category,
      tags,
      minPrice,
      maxPrice,
      sort,
    };

    return filter;
  }

  // `searchParams` can be a Promise in the new app router — unwrap it before use
  const resolvedSearchParams = await searchParams;
  const filter = parseFilters(resolvedSearchParams);

  // 在 Server 环境直接调用 api.getProducts（我们的 api.fetcher 使用 fetch，MSW 在测试/开发中会拦截）
  const data = await api.getProducts(filter);

  const products = data.items;
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="flex gap-6 p-6">
      <FilterSection />
      <div className="flex-1">
        {/* ToolbarClient 在客户端读取 search params 并直接写入 url (router.push) */}
        <ToolbarClient
          productCount={data.total}
          defaultSort={filter.sort ?? "default"}
        />
        {/* DisplaySection 由 server 提供数据渲染 */}
        <DisplaySection
          products={products}
          currentPage={data.page}
          totalPages={totalPages}
          // 额外：可以把 onAddToCart / onProductClick 通过 props 传入（client-side）
        />
      </div>
    </div>
  );
}

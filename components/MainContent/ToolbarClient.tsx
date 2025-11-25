"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Toolbar } from "./Toolbar";

export function ToolbarClient(
  props: Omit<React.ComponentProps<typeof Toolbar>, "onSortChange"> & {
    defaultSort?: string;
  }
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 说明：searchParams.get 返回 string | null
  const currentSort =
    searchParams.get("sort") ?? props.defaultSort ?? "default";

  const onSortChange = (sort: string) => {
    // 修改 URL 参数，并保持其它参数不变
    const params = new URLSearchParams(searchParams.toString());
    if (sort && sort !== "default") params.set("sort", sort);
    else params.delete("sort");

    // 排序改变后通常需要重置到第一页
    params.set("page", "1");

    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  };

  return (
    <Toolbar {...props} currentSort={currentSort} onSortChange={onSortChange} />
  );
}

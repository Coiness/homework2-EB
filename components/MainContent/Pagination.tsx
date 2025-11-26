"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * 简易分页组件
 * 学习点（提问）：
 * - 对于大型数据集你会选择前端分页还是后端分页？为什么？
 *    后端分页，否则传输数据量过大，增加客户端负担
 * - 如果后端支持 cursor-based pagination，你会如何调整 UI？
 *    cursor-based pagination是游标检索技术，可以根据游标来加载内容
 *    优点：和传统分页相比性能更优
 *    缺点：无法随心所欲地跳转，基本只能上一页下一页这样
 *    我的话，会选择无限滚动来适配cursor-based pagination
 *    这个技术天然适配无限滚动，不断地加载下一页，不会因为偏移量导致查询速度变慢
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const prev = () => onPageChange?.(Math.max(1, currentPage - 1));
  const next = () => onPageChange?.(Math.min(totalPages, currentPage + 1));

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prev}
          disabled={currentPage <= 1}
        >
          上一页
        </Button>
        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={next}
          disabled={currentPage >= totalPages}
        >
          下一页
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <label>每页</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </select>
      </div>
    </div>
  );
};

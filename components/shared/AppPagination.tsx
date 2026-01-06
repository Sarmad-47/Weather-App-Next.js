"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis";

function getPageItems(
  page: number,
  totalPages: number,
  siblingCount = 1
): PageItem[] {
  // If small, show all pages
  const totalNumbers = siblingCount * 2 + 5; // first, last, current +/- siblings, 2 ellipsis
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const firstPage = 1;
  const lastPage = totalPages;

  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const items: PageItem[] = [firstPage];

  if (showLeftEllipsis) items.push("ellipsis");
  else {
    for (let p = 2; p < leftSibling; p++) items.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) items.push(p);

  if (showRightEllipsis) items.push("ellipsis");
  else {
    for (let p = rightSibling + 1; p < totalPages; p++) items.push(p);
  }

  items.push(lastPage);

  return items;
}

interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export function AppPagination({
  page,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: AppPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages, siblingCount);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  return (
    <Pagination className={cn("mt-6", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goTo(page - 1);
            }}
            className={cn(page === 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {items.map((it, idx) =>
          it === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationLink
                href="#"
                isActive={page === it}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(it);
                }}
              >
                {it}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goTo(page + 1);
            }}
            className={cn(
              page === totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

'use client'
import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export const useAdmisionHistory = ({ initialData }: { initialData: any }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paginationModel, setPaginationModel] = useState(() => ({
    page: Number(searchParams.get("page") || 0),
    pageSize: Number(searchParams.get("pageSize") || 10),
  }));

  const [filterModel, setFilterModel] = useState<GridFilterModel>(() => {
    const filter = searchParams.get("filter");
    return filter ? JSON.parse(filter) : { items: [], quickFilterValues: [] };
  });

  const [sortModel, setSortModel] = useState<GridSortModel>(() => {
    const sort = searchParams.get("sort");
    return sort ? JSON.parse(sort) : [];
  });

  const updateURL = useCallback(
    (
      pagination: typeof paginationModel,
      filter: GridFilterModel,
      sort: GridSortModel,
    ) => {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("pageSize", String(pagination.pageSize));
      if (sort.length > 0) params.set("sort", JSON.stringify(sort));
      if (
        filter.items.length > 0 ||
        (filter.quickFilterValues && filter.quickFilterValues.length > 0)
      ) {
        params.set("filter", JSON.stringify(filter));
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    updateURL(paginationModel, filterModel, sortModel);
  }, [paginationModel, filterModel, sortModel, updateURL]);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
      sort: JSON.stringify(sortModel),
      filter: JSON.stringify(filterModel),
    });
    return `/api/dashboard/admision/history?${params.toString()}`;
  }, [paginationModel, filterModel, sortModel]);

  const { data, isLoading, isValidating, mutate } = useSWR(query, {
    fallbackData: initialData,
    keepPreviousData: true,
    revalidateOnMount: false,
  });

  return {
    data,
    isLoading,
    mutate,
    query,
    isValidating,

    paginationModel,
    setPaginationModel,

    filterModel,
    setFilterModel,

    sortModel,
    setSortModel,
  };
};

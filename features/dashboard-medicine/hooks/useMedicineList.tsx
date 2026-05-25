"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import useSWR from "swr";
import dayjs from "@/features/core/utils/dayjs";
import { getServerTime } from "@/features/core/actions/time";

export const useMedicineList = ({ initialData }: { initialData: any }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [showExpired, setShowExpired] = useState(false);
  const [serverNowIso, setServerNowIso] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getServerTime().then((d) => {
      if (active) setServerNowIso(d.gregorianIso);
    });

    return () => {
      active = false;
    };
  }, []);

  const baseToday = useMemo(() => {
    return serverNowIso ? dayjs(serverNowIso).startOf("day") : null;
  }, [serverNowIso]);
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
      window.history.replaceState(null, "", `?${params.toString()}`);
    },
    [],
  );
  useEffect(() => {
    updateURL(paginationModel, filterModel, sortModel);
  }, [paginationModel, filterModel, sortModel, updateURL]);
  const query = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(paginationModel.page));
    params.set("pageSize", String(paginationModel.pageSize));
    params.set("sort", JSON.stringify(sortModel));
    params.set("filter", JSON.stringify(filterModel));

    if (showExpired) {
      params.set("expired", "true");
    }

    return `/api/dashboard/medicine/list?${params.toString()}`;
  }, [paginationModel, sortModel, filterModel, showExpired]);

  const { data, isLoading, mutate } = useSWR(query, {
    fallbackData: initialData,
    keepPreviousData: true,
    revalidateOnMount: false,
  });

  return {
    data,
    isLoading,
    mutate,
    query,

    paginationModel,
    setPaginationModel,

    filterModel,
    setFilterModel,

    sortModel,
    setSortModel,

    showExpired,
    setShowExpired,

    serverNowIso,
    baseToday,
  };
};

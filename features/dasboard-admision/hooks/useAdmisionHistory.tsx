"use client";
import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "@/features/core/utils/dayjs";
import useSWR from "swr";
import { useNotificationStore } from "@/features/core";

export const useAdmisionHistory = ({ initialData }: { initialData: any }) => {
  const { show } = useNotificationStore();
  const searchParams = useSearchParams();
  const [fromDateTime, setFromDateTime] = useState<dayjs.Dayjs | null>(() => {
    const fromParam = searchParams.get("fromDateTime");
    return fromParam ? dayjs(fromParam, { jalali: true }).calendar("jalali") : null
  });

  const [toDateTime, setToDateTime] = useState<dayjs.Dayjs | null>(() => {
    const toParam = searchParams.get("toDateTime");
    return toParam ? dayjs(toParam, { jalali: true }).calendar("jalali") : null
  });

  useEffect(() => {
    if (toDateTime) {
      if (!fromDateTime) {
        show("تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد", 'error');
        return;
      }
      if (toDateTime.isBefore(fromDateTime)) {
        show("تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد", 'error');
      }
    }
  }, [fromDateTime, toDateTime]);

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
      if (fromDateTime) {
        params.set("fromDateTime", fromDateTime.format('YYYY-MM-DD HH:mm:ss'));
      }
      if (toDateTime) {
        params.set("toDateTime", toDateTime.format('YYYY-MM-DD HH:mm:ss'));
      }
      window.history.replaceState(null, "", `?${params.toString()}`);
    },
    [toDateTime, fromDateTime],
  );

  useEffect(() => {
    updateURL(paginationModel, filterModel, sortModel);
  }, [paginationModel, filterModel, sortModel, updateURL]);

  const query = useMemo(() => {
    // اعتبارسنجی قبل از ساخت query
    if (fromDateTime && toDateTime && toDateTime.isBefore(fromDateTime)) {
      return null; // query نامعتبر
    }

    const params = new URLSearchParams({
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
      sort: JSON.stringify(sortModel),
      filter: JSON.stringify(filterModel),
    });

    if (fromDateTime) {
      const gregorianFrom = fromDateTime.calendar('gregory').format('YYYY-MM-DDTHH:mm:ss');
      params.append('fromDateTime', gregorianFrom);
    }

    if (toDateTime) {
      const gregorianTo = toDateTime.calendar('gregory').format('YYYY-MM-DDTHH:mm:ss');
      params.append('toDateTime', gregorianTo);
    }
    return `/api/dashboard/admision/history?${params.toString()}`;
  }, [paginationModel, filterModel, sortModel, fromDateTime, toDateTime]);

  const { data, isLoading, isValidating, mutate } = useSWR(
    query ? query : null,
    {
      fallbackData: initialData,
      keepPreviousData: true,
      revalidateOnMount: false,
    }
  );

  return {
    data,
    isLoading: query ? isLoading : false,
    mutate,
    query,
    isValidating: query ? isValidating : false,
    fromDateTime,
    setFromDateTime,
    toDateTime,
    setToDateTime,
    paginationModel,
    setPaginationModel,

    filterModel,
    setFilterModel,

    sortModel,
    setSortModel,
  };
};

"use client";
import { useCallback, useMemo, useState } from "react";
import { DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { UserDialog } from "./userDialog";
import { DateTimeTrigger, useNotificationStore } from "@/features/core";
import { UserRow } from "../../type";
import { createManagerColumns } from "./managerColumn";
import { ManagerToolbar } from "./managerToolbar";
import { useUsersList } from "../../hooks/useUsersList";
import { resetUserPasswordAction } from "../../actions";
const ALWAYS_HIDDEN_FIELDS = ["id"];
const ALWAYS_HIDDEN = Object.fromEntries(
  ALWAYS_HIDDEN_FIELDS.map((field) => [field, false]),
);

export const UsersList = ({ initialData }: { initialData: any }) => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<UserRow | undefined>(undefined);
  const { show } = useNotificationStore();
  const [resetPasswordLoadingId, setResetPasswordLoadingId] = useState<
    number | null
  >(null);

  const [dateTimeTrigger, setDateTimeTrigger] =
    useState<DateTimeTrigger>("shamsi");
  const {
    data,
    isLoading,
    mutate,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    sortModel,
    setSortModel,
    isValidating,
  } = useUsersList({ initialData });
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      firstName: false,
      lastName: false,
      ...ALWAYS_HIDDEN,
    });
  const resetPassword = useCallback(
    async (userId: number) => {
      setResetPasswordLoadingId(userId);
      try {
        const res = await resetUserPasswordAction(userId);
        if (res.ok) {
          show("رمز عبور با موفقیت تغییر یافت", "success");
        } else {
          show(res.message, "error");
        }
      } catch (error) {
        show("مشکلی به وجود آمده", "error");
      } finally {
        setResetPasswordLoadingId(null);
      }
    },
    [show],
  );
  const columns = useMemo(
    () =>
      createManagerColumns({
        dateTimeTrigger,
        onEditUser: (row) => {
          setRow(row);
          setOpen(true);
        },
        resetPasswordLoadingId,
        onResetPassword: resetPassword,
      }),
    [dateTimeTrigger, resetPasswordLoadingId, resetPassword],
  );
  return (
    <Box sx={{ width: "100%" }}>
      <UserDialog
        onSaved={() => mutate()}
        onClose={() => setOpen(false)}
        open={open}
        row={row}
      />
      <Box sx={{ height: 750, width: "100%" }}>
        <DataGrid
          rows={data?.rows ?? []}
          rowCount={Number(data?.total ?? 0)}
          loading={isLoading || isValidating}
          columns={columns}
          getRowId={(row) => row.id}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => {
            setColumnVisibilityModel({ ...newModel, ...ALWAYS_HIDDEN });
          }}
          pageSizeOptions={[10, 25, 50]}
          disableColumnFilter
          showToolbar
          slotProps={{
            columnsManagement: {
              getTogglableColumns: (columns) =>
                columns
                  .filter((c) => !ALWAYS_HIDDEN_FIELDS.includes(c.field))
                  .map((c) => c.field),
            },
          }}
          slots={{
            toolbar: () => (
              <ManagerToolbar
                columns={columns}
                showQuickFilter
                dateTimeTrigger={dateTimeTrigger}
                onChangeDateTime={(value) => setDateTimeTrigger(value)}
                quickFilterProps={{
                  debounceMs: 400,
                  slotProps: {
                    root: { placeholder: "نام | کد ملی | شماره تماس" },
                  },
                }}
                rows={data?.rows ?? []}
                sx={{ justifyContent: "flex-start" }}
                onAddUser={() => {
                  setRow(undefined);
                  setOpen(true);
                }}
              />
            ),
          }}
        />

        <Typography variant="caption" color="text.secondary">
          جدول کاربران | جستجو: نام، کدملی، شماره تماس، نقش، وضعیت
        </Typography>
      </Box>
    </Box>
  );
};

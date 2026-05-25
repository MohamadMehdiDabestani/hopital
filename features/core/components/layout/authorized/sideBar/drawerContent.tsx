"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawerStore, useUserStore } from "@/features/core";
import Link from "next/link";

type MenuItem = { title: string; url: string };
type MenuGroup = { 
  title: string; 
  items: MenuItem[];
  roles: string[];
};

const menu: MenuGroup[] = [
  {
    title: "مدیریت",
    roles: ["manager" , "doctor"],
    items: [
      { title: "لیست کاربران", url: "/dashboard/manager" },
      { title: "افزودن کاربران از طریق اکسل", url: "/dashboard/manager/importExcel" },
    ],
  },
  {
    title: "پذیرش",
    roles: ["admision", "manager" , "doctor"],
    items: [
      { title: "صف فعلی پذیرش", url: "/dashboard/admision" },
      { title: "تاریخچه ی پذیرش", url: "/dashboard/admision/history" },
    ],
  },
  {
    title: "دکتر",
    roles: ["doctor"],
    items: [
      { title: "مطب دکتر", url: "/dashboard/doctor" },
    ],
  },
  {
    title: "داروخانه",
    roles: ["medicine", "manager" , "doctor"],
    items: [
      { title: "صف دریافت", url: "/dashboard/medicine/queue" },
      { title: "لیست داروها", url: "/dashboard/medicine" },
      { title: "لیست آزمایشات", url: "/dashboard/medicine/tests" },
      { title: "افزودن داروها از طریق اکسل", url: "/dashboard/medicine/importExcel" },
    ],
  },
];

export const DrawerContent = () => {
  const { open, drawerWidth, setOpen } = useDrawerStore();
  const pathname = usePathname();
  const { user } = useUserStore();

  const filteredMenu = useMemo(() => {
    if (!user?.role) return [];
    return menu.filter((group) => group.roles.includes(user.role));
  }, [user?.role]);

  const matchedAccordionIndex = useMemo(() => {
    return filteredMenu.findIndex((group) =>
      group.items.some((item) => item.url === pathname)
    );
  }, [pathname, filteredMenu]);

  const [expanded, setExpanded] = useState<number | false>(false);

  useEffect(() => {
    if (matchedAccordionIndex >= 0) {
      setExpanded(matchedAccordionIndex);
    }
  }, [matchedAccordionIndex]);

  return (
    <Box
      sx={{
        width: drawerWidth,
        transition: "width 0.3s",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "end", p: 1 }}>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ mt: 1 }} />
      <Box sx={{ visibility: open ? "visible" : "hidden" }}>
        {filteredMenu.map((group, i) => (
          <Accordion
            key={group.title}
            expanded={expanded === i}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? i : false)}
            sx={{
              boxShadow: "none",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{group.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {group.items.map((item) => {
                  const isActive = item.url === pathname;
                  return (
                    <ListItem key={item.url} disablePadding>
                      <ListItemButton
                        selected={isActive}
                        sx={{
                          pl: 4,
                          bgcolor: isActive ? "action.selected" : "transparent",
                        }}
                        LinkComponent={Link}
                        href={item.url}
                      >
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

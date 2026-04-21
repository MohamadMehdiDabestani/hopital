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
import { useDrawerStore } from "@/features/core";
import Link from "next/link";

type MenuItem = { title: string; url: string };
type MenuGroup = { title: string; items: MenuItem[] };

const menu: MenuGroup[] = [
  {
    title: "عنوان آکوردین ۱",
    items: [
      { title: "عنوان آیتم ۱", url: "/doctor" },
      { title: "d", url: "/doctor/d" },
    ],
  },
  {
    title: "عنوان آکوردین ۲",
    items: [
      { title: "عنوان آیتم ۳", url: "/url-3" },
      { title: "عنوان آیتم ۴", url: "/url-4" },
    ],
  },
];

export const DrawerContent = () => {
  const { open, drawerWidth, setOpen } = useDrawerStore();
  const pathname = usePathname();

  // for finding whiche accordion should open
  const matchedAccordionIndex = useMemo(() => {
    return menu.findIndex((group) =>
      group.items.some((item) => item.url === pathname)
    );
  }, [pathname]);

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
      <Divider sx={{mt: 1}} />
      <Box sx={{ visibility: open ? "visible" : "hidden" }}>
        {menu.map((group, i) => (
          <Accordion
            key={group.title}
            expanded={expanded === i}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? i : false)}
            sx={{
              boxShadow : "none"
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{group.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{p : 0}}>
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

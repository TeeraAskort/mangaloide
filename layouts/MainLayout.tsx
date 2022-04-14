import { Box } from "@mui/material";
import Head from "next/head";
import { FC, ReactNode } from "react";
import { Navbar } from "../components/ui";
import { Sidebar } from "../components/ui/Sidebar";

interface Props {
  title?: string;
  children: ReactNode;
}

export const MainLayout: FC<Props> = ({ title = "Mangaloide", children }) => {
  return (
    <Box sx={{ flexFlow: 1 }}>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <Sidebar />

      <Box sx={{ padding: "10px 20px" }}>{children}</Box>
    </Box>
  );
};

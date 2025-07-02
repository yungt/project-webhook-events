import "@mantine/core/styles.css";
import "@mantine/core/styles/UnstyledButton.css";
import "@mantine/core/styles/Button.css";
import "@mantine/core/styles/Table.css";
import "@mantine/core/styles/Pagination.css";
import "@mantine/dates/styles.css";
import "../styles/styles.scss";
import type {Metadata} from "next";
import {ReactNode} from "react";
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from "@mantine/core";
import {theme} from "../frontend/mantine/MantineTheme";

export const metadata: Metadata = {
  title: "Receiver Frontend",
  description: "Receiver Frontend",
}

export default function RootLayout({children}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript/>
    </head>
    <body>
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
    </body>
    </html>
  );
}
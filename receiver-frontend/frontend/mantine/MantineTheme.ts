"use client";

import styles from "./MantineTheme.module.scss";
import {createTheme} from "@mantine/core";

export const theme = createTheme({
  activeClassName: styles.active,
});
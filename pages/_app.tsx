import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import {
  mantineProviderProps,
  modalProviderProps
} from "../constants/mantine.constant";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { AppWithLayout } from "../types/app-layout.type";
import "../styles/globals.css";
import { NavigationProgress } from "@mantine/nprogress";
import RouterTransition from "../components/RouterTransition";

const RDDApp: AppWithLayout = ({ Component, pageProps }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  const componentGetLayout = Component.getLayout ?? ((page) => page);

  const getLayout = () => {
    const page = componentGetLayout(<Component {...pageProps} />);

    return <>{page}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider {...mantineProviderProps}>
        <ModalsProvider {...modalProviderProps}>
          <RouterTransition />
          <Head>
            <title>Read Damage Detection App</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
            {/* <link rel="icon" type="image/svg+xml" href="/sipadu.svg" /> */}
          </Head>
          <Notifications />

          {getLayout()}
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default RDDApp;

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
import RouterTransition from "../components/RouterTransition";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { SessionProvider } from "next-auth/react";

const RDDApp: AppWithLayout = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  dayjs.locale("id");

  const [queryClient] = React.useState(() => new QueryClient());

  const componentGetLayout = Component.getLayout ?? ((page) => page);

  const getLayout = () => {
    const page = componentGetLayout(<Component {...pageProps} />);

    return <>{page}</>;
  };

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider {...mantineProviderProps}>
          <ModalsProvider {...modalProviderProps}>
            <RouterTransition />
            <Head>
              <title>Road Damage Detection App</title>
              <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
              />
            </Head>
            <Notifications />

            {getLayout()}
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default RDDApp;

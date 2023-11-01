import {
  AppShell,
  Burger,
  Container,
  Group,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { FC } from "react";
import { IconHome2, IconTestPipe, IconVideoPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
  subTitle?: React.ReactNode;
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({
  children,
  subTitle,
  title,
  titleIcon
}) => {
  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap={5}>
          <NavLink
            label="Beranda"
            active={router.pathname === "/"}
            leftSection={<IconHome2 size={20} stroke={1.5} />}
            component={Link}
            href="/"
          />

          <NavLink
            label="Deteksi Video"
            active={router.pathname.startsWith("/video")}
            leftSection={<IconVideoPlus size={20} stroke={1.5} />}
            component={Link}
            href="/video"
          />

          <NavLink
            label="Job"
            active={router.pathname === "/job"}
            component={Link}
            href="/job"
            leftSection={<IconTestPipe size={20} stroke={1.5} />}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <Stack mt="md">
            <Group>
              {titleIcon ? (
                <ThemeIcon radius="md" size={50} variant="gradient">
                  {titleIcon}
                </ThemeIcon>
              ) : null}

              <Stack gap={0}>
                {subTitle && (
                  <Text c="dimmed" mb={-4}>
                    {subTitle}
                  </Text>
                )}
                {title && <Title order={2}>{title}</Title>}
              </Stack>
            </Group>
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;

import {
  Button,
  Card,
  Flex,
  TextInput,
  PasswordInput,
  Stack,
  Title,
  Group,
  Image,
  Loader
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { validateEmail } from "../../utils/other.util";
import LoadingBumper from "../../components/LoadingBumper";

export default function Page() {
  const form = useForm({
    initialValues: {
      email: "",
      password: ""
    },

    validate: {
      email: (value) => (validateEmail(value) ? null : "Email tidak valid"),
      password: (value) => (value !== "" ? null : "Password tidak boleh kosong")
    }
  });

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.onSubmit(async (values) => {
      setIsSubmit(true);
      const res = await signIn("credentials", {
        redirect: false,
        ...values
      });

      if (!res?.ok) {
        notifications.show({
          title: "Login gagal",
          message: "Periksa lagi email dan passwordmu!",
          color: "red",
          autoClose: 4000
        });
        setIsSubmit(false);
      } else {
        setIsSuccessLogin(true);
        notifications.show({
          title: "Login berhasil",
          message: "Selamat datang!",
          color: "green",
          autoClose: 4000
        });
        router.push("/");
      }
    })();
  };

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isSuccessLogin, setIsSuccessLogin] = useState<boolean>(false);

  return isSuccessLogin ? (
    <LoadingBumper />
  ) : (
    <Flex justify="center" align="center" h={"calc(100vh - 110px)"}>
      <Card
        withBorder
        w={{ base: 350, xs: 450 }}
        mx="auto"
        px={{ base: "md", xs: "xl" }}
        py={35}
        shadow="xl"
        radius="md"
        mt={-50}
      >
        <Stack gap={0} mb="lg">
          <Title ta="center" order={2} fw="normal">
            Selamat Datang!
          </Title>

          <Image src="/logo.png" alt="Logo PUPR" height={100} fit="contain" />
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Masukkan Email Anda"
              {...form.getInputProps("email")}
              autoComplete="true"
              name="email"
            />

            <PasswordInput
              placeholder="Password"
              label="Password"
              withAsterisk
              {...form.getInputProps("password")}
            />

            <Flex justify="end" mt="lg">
              <Button type="submit" loading={isSubmit}>
                Login
              </Button>
            </Flex>
          </Stack>
        </form>
      </Card>
    </Flex>
  );
}

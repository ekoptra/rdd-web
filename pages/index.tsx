import { NextPageWithLayout } from "../types/app-layout.type";
import AppLayout from "../components/AppLayout";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Divider,
  Group,
  Image,
  List,
  Loader,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconTargetArrow, IconVideo } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useVideoQuery } from "../hooks/video-query.hook";
import { useJobListQuery } from "../hooks/job-query.hook";

const elements: { kode: string; nama: string }[] = [
  { kode: "D00", nama: "Wheel Mark Longitudinal Crack" },
  { kode: "D01", nama: "Construction Joint Longitudinal Crack" },
  { kode: "D10", nama: "Equal Interval Longitudinal Crack" },
  { kode: "D11", nama: "Construction Joint Lateral Crack" },
  { kode: "D20", nama: "Alligator Crack" },
  { kode: "D40", nama: "Pothole" },
  { kode: "D44", nama: "White Line Blur" }
];

const Home: NextPageWithLayout = () => {
  const { data } = useSession();
  const router = useRouter();

  const { query: videoQuery } = useVideoQuery();
  const { query: jobQuery } = useJobListQuery({});

  const rows = elements.map((element) => (
    <Table.Tr key={element.kode}>
      <Table.Td>{element.kode}</Table.Td>
      <Table.Td>{element.nama}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack mb="xl">
      <Title order={3}>Selamat Datang {data?.user.name}</Title>

      <SimpleGrid cols={{ sm: 3 }} mt="md">
        <Card withBorder py="md" px="xl">
          <Stack>
            <Group justify="space-between" align="center">
              <Text size="lg" style={{ fontWeight: "bold" }}>
                Jumlah Video
              </Text>
              <Avatar size="md" color="blue">
                <IconVideo size="1.5rem" />
              </Avatar>
            </Group>

            <Text size="xl" mb="lg">
              {videoQuery.isLoading || !videoQuery.data ? (
                <Loader size="xs" />
              ) : (
                videoQuery.data.data.length
              )}{" "}
              Video
            </Text>

            <Group justify="flex-start">
              <Button
                size="xs"
                variant="subtle"
                onClick={() => router.replace("/video")}
              >
                Selengkapnya
              </Button>
            </Group>
          </Stack>
        </Card>

        <Card withBorder py="md" px="xl">
          <Stack>
            <Group justify="space-between">
              <Text size="lg" style={{ fontWeight: "bold" }}>
                Jumlah Deteksi
              </Text>
              <Avatar size="md" color="orange">
                <IconTargetArrow size="1.5rem" />
              </Avatar>
            </Group>

            <Text size="xl" mb="lg">
              {jobQuery.isLoading || !jobQuery.data ? (
                <Loader size="xs" />
              ) : (
                jobQuery.data.data.length
              )}{" "}
              Deteksi
            </Text>

            <Group justify="flex-start">
              <Button
                size="xs"
                variant="subtle"
                onClick={() => router.replace("/detection")}
              >
                Selengkapnya
              </Button>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>

      <Divider
        my="xs"
        label={<Title order={2}>Tentang Radactor</Title>}
        labelPosition="left"
        color="dark"
      />

      <Text>
        Kami memperkenalkan Radactor, suatu sistem pendeteksi kerusakan jalan
        berbasis web secara post processing yang memanfaatkan teknologi
        Artificial Intelligence. Radactor hadir sebagai solusi dari permasalahan
        pendeteksian jalanan rusak dari video yang masih dilakukan secara manual
        sehingga membutuhkan waktu yang relatif lebih lama. Radactor dapat
        mendeteksi 7 jenis kerusakan jalan secara otomatis
      </Text>

      <Table highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Kode Kerusakan</Table.Th>
            <Table.Th>Nama Kerusakan</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Image src="/penjelasan.png" alt="Penjelasan" />

      <Title order={4}>Bagaimana model dapat mendeteksi kerusakan jalan?</Title>

      <Text>
        Radactor dibangun menggunakan model Artificial Intelligence yaitu You
        Only Look Once (YOLO). YOLO merupakan sebuah model Object Detection yang
        dikembangkan oleh Joseph Redmon and Ali Farhadi. Pada proses pemrosesan,
        algoritma YOLO melakukan ekstraksi fitur dan training klasifikasi
        terlebih dahulu sehingga dapat mengenali dan membedakan jenis kerusakan
        jalan. Output yang dihasilkan YOLO berupa Bounding Box (Kotak Pembatas)
        dari kerusakan jalan yang dideteksi. Dengan adanya algoritma YOLO,
        aplikasi Radactor ini dapat mendeteksi sekaligus mendapatkan lokasi
        kerusakan jalan.
      </Text>

      <Text>
        Pembangunan model deteksi kerusakan jalan pada Radactor dibangun dengan
        arsitektur YOLOv8. YOLOv8 adalah model object detection terbaru yang
        dikembangkan oleh Ultralytics. Model ini merupakan pengembangan dari
        YOLOv5, dengan beberapa perubahan dan peningkatan pada arsitektur dan
        pengalaman pengembangan suatu input gambar atau video. YOLOv8 telah
        diuji pada berbagai dataset object detection, dan menunjukkan hasil yang
        sangat akurat. Pada dataset COCO, YOLOv8 mencapai mAP@0.5:0.95 sebesar
        51.1%, yang merupakan peningkatan sebesar 2,2% dibandingkan YOLOv5.
      </Text>

      <Title order={4}>Seberapa akurat model yang kami kembangkan?</Title>

      <Image src="/proses.png" alt="Proses Pengembangan" />

      <Text>
        Terdapat dua model yang kami bangun yaitu Model RDD Jepang dan Model RDD
        Indonesia
      </Text>

      <List withPadding>
        <List.Item>
          Model RDD Jepang: model yang dilatih dengan pretrained model COCO
          (YOLOv8) pada Japan Road Damage Dataset 2018. Model yang dibangun
          telah dapat digunakan untuk deteksi 10 jenis kerusakan jalan di Jepang
          dengan nilai akurasi mAP mencapai 0,686 dan F1-Score 0,62.
        </List.Item>
        <List.Item>
          Model RDD Indonesia: model yang dilatih dengan pretrained model RDD
          Jepang pada dataset Indonesia yang sudah terlebih dahulu dilabeli
          secara manual. Model yang dibangun telah dapat digunakan untuk deteksi
          7 jenis kerusakan jalan di Indonesia dengan nilai akurasi mAP mencapai
          0,696 dan F1-Score 0,650.
        </List.Item>
      </List>

      <Table highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nama Model</Table.Th>
            <Table.Th>mAP</Table.Th>
            <Table.Th>F1 Score</Table.Th>
            <Table.Th>Keterangan</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr key="model-jepang">
            <Table.Td>Model RDD Jepang</Table.Td>
            <Table.Td>0.688</Table.Td>
            <Table.Td>0.620</Table.Td>
            <Table.Td>
              Dilatih menggunakan pretrained model COCO pada dataset Japan Road
              Damage Dataset 2018
            </Table.Td>
          </Table.Tr>
          <Table.Tr key="model-indonesia">
            <Table.Td>Model RDD Indonesia</Table.Td>
            <Table.Td>0.696</Table.Td>
            <Table.Td>0.650</Table.Td>
            <Table.Td>
              Dilatih menggunakan pretrained Model RDD Jepang pada dataset
              Indonesia hasil pelabelan manual
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <List withPadding mt="lg">
        <List.Item>
          Link Github Aplikasi:{" "}
          <Anchor href="https://github.com/ekoptra/rdd-web" target="_blank">
            https://github.com/ekoptra/rdd-web
          </Anchor>
        </List.Item>
        <List.Item>
          Link Pengembangan Model:{" "}
          <Anchor
            href="https://s.stis.ac.id/PemodelanRDDJepang"
            target="_blank"
          >
            https://s.stis.ac.id/PemodelanRDDJepang
          </Anchor>
          ,{" "}
          <Anchor
            href="https://s.stis.ac.id/PemodelanRDDIndonesia"
            target="_blank"
          >
            https://s.stis.ac.id/PemodelanRDDIndonesia
          </Anchor>
        </List.Item>
        <List.Item>
          Link PPT:{" "}
          <Anchor href="https://s.stis.ac.id/PPTRadactor" target="_blank">
            https://s.stis.ac.id/PPTRadactor
          </Anchor>
        </List.Item>
      </List>
    </Stack>
  );
};

Home.getLayout = (page) => {
  return <AppLayout breadcrumbs={[{ title: "Home" }]}>{page}</AppLayout>;
};

export default Home;

import { GetServerSideProps } from "next";
import AppLayout from "../../components/AppLayout";
import { NextPageWithLayout } from "../../types/app-layout.type";

type Props = {
  videoId: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (contex) => {
  const videoId = contex.query["id"] as string;

  return {
    props: {
      videoId
    }
  };
};

const DetailVideoPage: NextPageWithLayout<Props> = ({ videoId }) => {
  return `${videoId}`;
};

DetailVideoPage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default DetailVideoPage;

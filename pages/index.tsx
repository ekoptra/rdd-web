import { NextPageWithLayout } from "../types/app-layout.type";
import AppLayout from "../components/AppLayout";

const Home: NextPageWithLayout = () => {
  return "Beranda";
};

Home.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;

import AppLayout from "../../components/AppLayout";
import { NextPageWithLayout } from "../../types/app-layout.type";

const Home: NextPageWithLayout = () => {
  return "Job";
};

Home.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;

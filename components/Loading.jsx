import Head from "next/head";
import Navbar from "./Navbar";
import FooterBar from "./common/FooterBar";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <>
      <Navbar />
      <Head>
        <title>Loading...</title>
        <meta name="description" content="Loading..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/11/favicon.png" />
      </Head>
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin" size={38} /> 
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default Loading;
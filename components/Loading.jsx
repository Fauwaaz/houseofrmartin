import Head from "next/head";

const Loading = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
        <meta name="description" content="Loading..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mr-2"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    </>
  );
};

export default Loading;
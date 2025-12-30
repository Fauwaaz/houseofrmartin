const Hero = () => {
  return (
    <section className="relative w-full hero mt-[125px] md:mt-[80px] lg:mt-[85px] h-[30vh] md:h-[50vh] lg:h-[90vh] flex items-end justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/home-houseofrmartin.jpg"
      >
        <source
          src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/R-martin-video-2-.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (dark gradient for better text visibility) */}
      {/* <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 text-center px-4 font-geograph-md mb-10">
        <h1 className="text-2xl md:text-5xl lg:text-8xl text-[#DBDBDB] text-outline">Wear What Makes You -<span className="text-outline-white text-[#FF0000]"> YOU</span></h1>
      </div> */}
    </section>
  );
};

export default Hero;  
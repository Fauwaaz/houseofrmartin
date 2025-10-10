import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="mt-[80px] lg:mt-0 min-h-screen w-full relative hero">
      {/* <div className={styles.left}>
        <h3 className={styles.title}>
          Our Best <br />
          Collections
          <br /> For You
        </h3>
        <p className={styles.description}>
          The latest mobile phone models available to you with the best prices
          delivered to you in no time.
        </p>
        <div className={styles.buttons}>
          <button className={styles.addToCart} onClick={addToCart}>
            <FiShoppingBag />
            Add to cart
          </button>
          <Link href={`/product/${url}`}>
            <button className={styles.button}>
              <div className={styles.buttonImage}>
                <Image
                  alt="hero image"
                  src={image}
                  priority
                  layout="fill"
                  objectFit="contain"
                  quality={100}
                />
              </div>
              <span className={styles.buttonText}>
                More info <RiArrowRightSLine />{" "}
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.image}>
          <Image
            src={HeroBackground}
            layout="fill"
            objectFit="contain"
            alt="hero background"
          />
          <Image
            src={image}
            priority
            layout="fill"
            objectFit="contain"
            alt="hero background two"
          />
          <div className={styles.offer}>
            <h4>Get up to 30% off</h4>
            <p>We offer a 30% discount from orders above $20</p>
          </div>

          <div className={styles.features}>
            <div style={{}}>
              <div className={styles.top}>
                <div>
                  <motion.span
                    key={slide}
                    initial="initial"
                    animate="animate"
                    variants={ValueAnimation}
                  >
                    {features[slide].value}
                  </motion.span>
                </div>

                <motion.p
                  key={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={ValueAnimation}
                >
                  {features[slide].name}
                </motion.p>
              </div>
            </div>
            <div className={styles.bottom}>
              <motion.p
                key={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={ValueAnimation}
              >
                {features[slide].message}
              </motion.p>
            </div>
            <div className={styles.dots}>
              {features.map((feature, i) => (
                <button onClick={() => setSlide(i)} key={i}>
                  <span
                    className={
                      i === slide ? `${styles.active}` : `${styles.inactive}`
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div> */}
      <div className="w-full hidden lg:flex min-h-screen">
        <div
          style={{
            backgroundImage: "url('/hero/rmartin-hero-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "30%",
            height: "auto",
          }}
        >
        </div>
        <div style={{ width: "40%" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "auto" }}
          >
            <source src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div
          style={{
            backgroundImage: "url('/hero/rmartin-hero-3.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "30%",
            height: "auto",
          }}
        >
        </div>
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-center w-full font-geograph-md">
          <h1 className="text-5xl md:text-5xl lg:text-8xl text-[#DBDBDB] text-outline">Wear What makes you -<span className="text-outline-white text-[#FF0000]">you</span></h1>
        </div>
        <motion.div
          className="border-[5px] border-white/80 rounded-full absolute top-1/2 left-1/4 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="m-1 rounded-full w-5 h-5 bg-white/50"></div>
        </motion.div>
        <motion.div
          className="border-[5px] border-white/80 rounded-full absolute top-2/4 right-1/4 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="m-1 rounded-full w-5 h-5 bg-white/50"></div>
        </motion.div>
      </div>
      <div className="block lg:hidden">
        <Image 
          src={'/hero/rmartin-hero-1.png'}
          width={100}
          height={100}
          alt="hero banner"
          className='object-cover w-full'
          unoptimized
          quality={100}
        />
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-center w-full font-geograph-md">
          <h1 className="text-5xl md:text-5xl lg:text-8xl text-[#DBDBDB] text-outline">Wear What makes you -<span className="text-outline-white text-[#FF0000]">you</span></h1>
        </div>
      </div>

    </section>
  );
};

export default Hero;
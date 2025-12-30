import Image from "next/image";
import { Layout } from "../components";

const About = () => {
    return (
        <Layout>
            <section className="mt-[125px] md:mt-[75px] lg:mt-[80px]  h-[20vh] md:h-50vh lg:h-[80vh] flex flex-col items-center justify-center bg-[url(https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/about-houseofrmartin-scaled.jpg)] bg-cover w-full bg-no-repeat bg-center px-4">
                {/* <div className="max-w-3xl text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">About Us</h1>
                    <p className="text-lg mb-6">Welcome to House of R-Martin, your number one source for all things fashion.</p>
                </div> */}
            </section>
            
            <section className="max-w-1920 mx-5 mb-10 mt-10">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-center w-full">
                    <div className="flex justify-center">
                        <Image
                            src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/ourstory-banner-scaled.jpg"
                            alt="About Us Image"
                            width={400}
                            height={400}
                            quality={100}
                            unoptimized
                            className="rounded-[20px] shadow-lg w-full lg:w-3/4 h-auto"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl lg:text-5xl text-center lg:text-left font-bold mb-4 uppercase">Our Story</h2>
                        <p className="text-lg mb-4">House of R-Martin began as a legacy and evolved into a perspective , a bridge between generations. What started as a foundation of reliability has transformed into a new way of seeing style: one that understands how emotion, influence, and everyday life shape how men show up in the world.
                            <br /><br />
                            We present our collections through that lens, a woman&apos;s eye for detail, a man&apos;s instinct for ease, and a generation&apos;s need for relevance. Each collection is a study in balance, where trends meet thought, and simplicity meets substance.
                            <br /> <br />
                            House of R-Martin stands for stories stitched with trust, intention, and a sense of belonging.
                            For men who understand subtle power.
                            For women who see it before the world does.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-1920 mx-5 mb-10 mt-10">
                <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-0 items-center w-full px-0 lg:px-3">
                    <div>
                        <h2 className="text-3xl lg:text-5xl text-center lg:text-left font-bold mb-4 uppercase">About the Founder</h2>
                        <p className="text-lg mb-4">
                            At just 22, Mahak Keswani brings a refreshing lens to men&apos;s fashion, one shaped by global exposure, instinctive storytelling, and a deep understanding of culture and connection. <br /> <br />
                            A graduate of Michigan State University in Advertising Management, Mahak&apos;s understanding of markets and behaviour comes from both academic rigour and lived experience. <br /> <br />
                            She grew up observing how the men in her life approached clothing as utility, not expression. That observation became a question and eventually, a calling: What if men&apos;s fashion could feel more thoughtful, more intuitive, and more emotionally aware? <br /> <br />
                            In 2025, she founded House of R-Martin to design perspective. Her goal is clear, to bring direction back to men&apos;s fashion, a category shaped by trends but starved of perspective.  <br /> <br />
                            Under her vision, House of R-Martin stands for consistency and cultural rhythm. Each collection is built around relevance, emotion, and expression, fashion that moves with people, not just with seasons.  <br /> <br />
                            Mahak&apos;s approach is rooted in curiosity and strategy, balancing global insight with Dubai&apos;s distinct energy.  <br /> <br />
                            For her, House of R-Martin is where intention are shaped into identity. Beyond the brand, Mahak is also stepping into her content creation journey, sharing her world through a lens of curiosity, culture, and creativity, continuing to blend storytelling and style in her own authentic way.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/founder-scaled.jpeg"
                            alt="About Us Image"
                            width={400}
                            height={400}
                            quality={100}
                            unoptimized
                            className="rounded-[20px] shadow-lg w-full lg:w-3/4 h-auto"
                        />
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default About;
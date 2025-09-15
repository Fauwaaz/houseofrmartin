import Image from "next/image";
import { Layout } from "../components";

const About = () => {
    return (
        <Layout>
            <section className="min-h-[90vh] flex flex-col items-center justify-center bg-[url(https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/about-us-img.png)] w-full bg-no-repeat p-4">
                <div className="max-w-3xl text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">About Us</h1>
                    <p className="text-lg mb-6">Welcome to House of RMartin, your number one source for all things fashion.</p>
                </div>
            </section>
            <section className="mx-5 mb-10 mt-10 lg:mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                    <div className="flex justify-center">
                        <Image
                            src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/about-us-img-2.png"
                            alt="About Us Image"
                            width={500}
                            height={500}
                            quality={100}
                            className="rounded-lg shadow-lg w-full h-auto"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-4 uppercase">Our Story</h2>
                        <p className="text-lg mb-4">Founded in 2020, House of RMartin has come a long way from its beginnings. When we first started out, our passion for fashion drove us to start our own business.</p>
                        <p className="text-lg mb-4">We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
                        <p className="text-lg">Sincerely, <br /> The House of RMartin Team</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default About;
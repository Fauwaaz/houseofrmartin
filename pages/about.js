import { Layout } from "../components";

const About = () => {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="text-lg text-center max-w-2xl">
                    Welcome to our store! We are committed to providing you with the best products and services. Our mission is to enhance your shopping experience with quality items and exceptional customer support. <br/>Thank you for choosing us!
                </p>
            </div>
        </Layout>
    );
};

export default About;
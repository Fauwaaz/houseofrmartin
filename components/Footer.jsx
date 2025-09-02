import Link from "next/link";
import Image from "next/image";
import { FiFacebook, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className='bg-white'>
      <div className=" ">
        <div className="grid grid-cols-4 w-full gap-10 py-20 justify-items-center">
          <div className="col-span-1 ">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="House of RMartin"
                width={150}
                height={50}
                className="mb-4"
                unoptimized
                quality={100}
              /></Link>
          </div>
          <div className="col-span-1 uppercase">
            <h5 className="text-lg font-geograph-md">Company</h5>
            <ul className="mt-4 space-y-2 text-black/90">
              <li>About</li>
              <li>FAQs</li>
              <li>Return Policy</li>
              <li>Shipping Policy</li>
              <li>Terms and Condition</li>
            </ul>
          </div>
          <div className="col-span-1 uppercase">
            <h5 className="text-lg font-geograph-md">Shop</h5>
            <ul className="mt-4 space-y-2 text-black/90">
              <li>Best Seller</li>
              <li>New Arrivals</li>
              <li>Sale</li>
            </ul>
          </div>
          <div className="col-span-1 uppercase">
            <h5 className="text-lg font-geograph-md">Follow us</h5>
            <ul className="mt-2 text-black/90 flex gap-3 items-center justify-center">
              <li><Link href="#"><FiInstagram size={24}/></Link></li>
              <li><Link href="#"><FiFacebook size={24}/></Link></li>
              <li><Link href="#"><FiYoutube size={24}/></Link></li>
              <li><Link href="#"><FiLinkedin size={24}/></Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div className="py-5 px-10 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} House of RMartin. All rights reserved.</p>
          <Link href="https://sparkcloud.in" target="_blank" rel="noopener noreferrer">
            <Image
              src="/footer/sparkcloud.png"
              alt="sparkcloud"
              width={175}
              height={100}
              className="mt-2"
              quality={100}
              unoptimized
            />  
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

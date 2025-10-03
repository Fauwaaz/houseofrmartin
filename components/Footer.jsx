import Link from "next/link";
import Image from "next/image";
import { FiFacebook, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";

const links = [
  {label: "About", href: "/about"},
  {label: "FAQs", href: "/faqs"},
  {label: "Return & Refund", href: "/returns-refund"},
  {label: "Shipping", href: "/shipping"},
  {label: "Terms and Condition", href: "/terms-condition"}
];  

const Footer = () => {
  return (
    <footer className="bg-white">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-20 px-6 md:px-16 lg:px-24 text-center justify-items-center md:text-left">
          
      
          <div className="flex justify-center md:justify-start">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="House of RMartin"
                width={250}
                height={50}
                className="mb-4 mx-auto md:mx-0"
                unoptimized
              />
            </Link>
          </div>

          <div className="uppercase">
            <h5 className="text-lg font-geograph-md">Company</h5>
            <ul className="mt-4 space-y-2 text-black/90">
              {links.map((link, index) => (
                <li key={index} className="hover:underline">
                  <Link href={link?.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="uppercase">
            <h5 className="text-lg font-geograph-md">Shop</h5>
            <ul className="mt-4 space-y-2 text-black/90">
              <li><Link href="/shop/bestsellers">Best Seller</Link></li>
              <li><Link href="/shop/new">New Arrivals</Link></li>
              <li><Link href="/shop/sale">Sale</Link></li>
            </ul>
          </div>

          <div className="uppercase">
            <h5 className="text-lg font-geograph-md">Follow us</h5>
            <ul className="mt-4 flex gap-4 items-center justify-center md:justify-start">
              <li><Link href="#"><FiInstagram size={22} /></Link></li>
              <li><Link href="#"><FiFacebook size={22} /></Link></li>
              <li><Link href="#"><FiYoutube size={22} /></Link></li>
              <li><Link href="#"><FiLinkedin size={22} /></Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-5 px-6 md:px-16 border-t border-dashed border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600 text-center md:text-left">
          &copy; {new Date().getFullYear()} House of RMartin. All rights reserved.
        </p>
        <Link
          href="https://sparkcloud.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center md:justify-end"
        >
          <Image
            src="/footer/sparkcloud.png"
            alt="sparkcloud"
            width={170}
            height={50}
            className="mt-2 md:mt-0"
            unoptimized
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
import Link from "next/link"

const BeforeFooter = () => {
  return (
    <section className='w-full relative'>
      <div className='absolute z-10 left-10 top-1/2 transform -translate-y-1/2'>
        <h2 className="text-3xl lg:text-4xl text-black mb-4 uppercase font-akkurat tracking-wide">Sign up for special offers</h2>
        <p className="text-black mb-4">Enter your email here*</p>
        <form className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-md border border-gray-300 focus:outline-none text-sm"
            required
            autoComplete='off'
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="marketing"
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <label htmlFor="marketing" className="text-black text-sm cursor-pointer">
              I agree to receive marketing emails from <Link href="/" className="underline hover:no-underline">House of R-Martin.</Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-[200px] text-center bg-black  text-white p-3 rounded-full uppercase hover:bg-white transition duration-200 ease-in  cursor-pointer   hover:text-black hover:border-black"
          >
            Subscribe
          </button>
        </form>
      </div>
      <div className="absolute w-full h-[700px] bg-black opacity-20"></div>
      <div className="w-full h-[300px] md:h-[500px] lg:h-[700px] bg-[url(https://dashboard.houseofrmartin.com/wp-content/uploads/2025/09/before-footer-email.png)] bg-no-repeat bg-cover md:bg-position-right lg:bg-position-center">
      </div>

    </section>
  )
}

export default BeforeFooter
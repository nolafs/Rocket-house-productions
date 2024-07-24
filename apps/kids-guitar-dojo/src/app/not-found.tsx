import Link from 'next/link';
import {ArrowRight2} from 'iconsax-react';
import Image from "next/image";
import errorImage from "@assets/error.png";



const Page404 = () => (<>
      <div className="py-[60px] md:py-[80px] lg:py-[100px] xl:py-[120px] bg-[#fff] text-center">
        <div className="container mx-auto px-[12px] 2xl:px-0">
            <Image src={errorImage} alt={"404 Error"} className={'mx-auto'} />
          <h3
            className="text-black text-[20px] md:text-[22px] lg:text-[30px] font-bold mt-[40px] mb-[15px] leading-[1.3]">
            Oops! That page can't be found
          </h3>

          <p
            className="text-[14px] md:text-[15px] lg:text-[16px] md:max-w-[540px] text-[#4c4c4c] leading-[1.7] ml-auto mr-auto mb-[15px] lg:mb-[18px]">
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>

          <Link
            href="/"
            className="bg-black text-white text-[14px] font-medium inline-block uppercase rounded-full py-[15px] px-[38px] transition duration-500 ease-in-out hover:bg-[#EF4335]"
          >
            Back To Home <ArrowRight2
            className="inline-block relative -top-[2px]"
            size={20}
          />
          </Link>
        </div>
      </div>
    </>
  )
;

export default Page404;

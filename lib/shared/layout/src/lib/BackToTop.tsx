"use client";

import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return function cleanup() {
      window.removeEventListener("scroll", checkScrollTop);
    };
  });

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 100) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 100) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        onClick={scrollTop}
        style={{
          display: showScroll ? "block" : "none",
        }}
        className="bg-black text-white fixed right-[30px] bottom-[0] cursor-pointer w-[30px] h-[30px] rounded-t-full text-center leading-[35px] text-[20px] hover:bg-[#EF4335]"
      >
        <i className="bx bxs-up-arrow-alt"></i>
      </div>
    </>
  );
};

export default BackToTop;

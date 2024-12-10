import React from "react";

function NSCDC() {
  return (
    <body className="flex justify-center items-center h-[100vh] relative">
      <main className="w-[30%] h-[90vh] shadow-2xl shadow-black text-center bg-white pr">
        <div className="flex gap-10">
          <div className="h-[4vh] w-[2vw] bg-black"></div>
          <div className="h-[4vh] w-[2vw] bg-red-600"></div>
        </div>
        <h1 className="text-8xl font-bold ">NSCDC</h1>
        <p className="text-[15px] font-bold">
          Nigeria Security & Civil Defense Corps
        </p>

        <div className="flex">
          <div className="flex gap-12">
            <div className="h-[35vh] w-[2vw] bg-black"></div>

            <div className="h-[35vh] w-[2vw] bg-red-600"></div>
          </div>

          <div>
            <img
              src="/NSCDC/deputy-removebg-preview.png"
              alt=""
              className="h-[24vh] w-[14vw] m-4"
            />
            <p className="font-bold text-blue-800 text-xl">S.DANIEL</p>
          </div>

          <div className=" bg-red-600 text-white flex justify-center items-center w-[4vw]">
            <p className="rotate-[-90deg] font-bold text-5xl">RETIRED</p>
          </div>
        </div>
        <img
          src="/NSCDC/lologo-removebg-preview.png"
          alt=""
          className="h-[8vh] w-[6vw] relative bottom-48
                mx-4"
        />

        <section className="flex justify-center items-center">
          <div>
            <p className="text-blue-900 font-bold text-xl">O+</p>
            <p className="text-red-600 font-semibold text-xl">BLOOD GROUP</p>
          </div>

          <img
            src="/NSCDC/coat-removebg-preview.png"
            alt=""
            className="w-[8vw] h-[12vh]"
          />

          <div>
            <p className="border-b border-red-600 "></p>
            <p className="text-red-600 font-semibold text-xl">SIGNATURE</p>
          </div>
        </section>

        <footer className="bg-blue-950 text-white h-[15vh] flex justify-center items-center">
          <p className="font-bold text-4xl">SERVICE NO: 19437</p>
        </footer>
      </main>
    </body>
  );
}

export default NSCDC;


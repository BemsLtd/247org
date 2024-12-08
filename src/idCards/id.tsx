import React from "react";
import "./src/input.css";
import "./src/output.css"

function Id() {
  return (
    <main className="h-[90vh] w-full justify-center items-center relative">
      <section className="border-[gray] border-2 w-[50vw] h-[62vh] justify-center rounded-xl bg-[#fcefd3]">
        <div className="flex justify-between mt-5">
          <div>
            <h1 className="text-green-900 text-center text-xl font-[times new roman] font-bold">
              UNIVERSITY OF ABUJA
            </h1>
            <div className="my-4 mx-4">
              <p className="text-xl font-mono text-center">
                FEDERAL CAPITAL TERRITORY
              </p>
              <p className="bg-red-600 w-[20vw] text-white text-xl text-center rounded-xl">
                STUDENT IDENTITY CARD
              </p>

              <div className="flex p-5 gap-10 mt">
                <img src="/Ironse_dev/me-removebg-preview.png" alt="" width="150" />
                <div className="leading-10 font-bold justify-between font-mono">
                  <img src="/Ironse_dev/university-removebg-preview.png" alt="" width="230"
                    className="opacity-30 relative left-[40%]"
                  />
                  <div className="z-50 absolute top-[30%] w-[100%] text-black">
                    <p className="text-lg">REG NO: 20/207 FST/198</p>
                    <p className="text-lg">NAME: Anaba Arinze Augustine</p>
                    <p className="text-lg">YEAR OF ENTERY: 2015/08/16</p>
                    <p className="text-lg">COURSE: Food Technology</p>
                    <p className="text-lg">FACULTY: Food LAB</p>
                    <p className="text-lg">BLOOD: B+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img
              src="/Ironse_dev/university-removebg-preview.png"
              alt=""
              width="150"
            />
          </div>
        </div>

        <div className="mr-10 border-b-2 border-b-red-700"></div>
        <p className="text-red-600 font-bold text-2xl mr-4 text-end">
          Holder's Signature
        </p>
      </section>
    </main>
  );
}

export default Id;


import React from "react";
import "./src/input.css";
import "./src/output.css";
export const Id2 = () => {
  return (
      <main className="h-[90vh] w-[60%] justify-center items-center relative">
        <section
            className="border-[gray] border-2 w-[45vw] h-[55vh] justify-center rounded-xl bg-[#fcefd3] shadow-md shadow-[gray]"
        >
          <div className="flex justify-between mt-5">
            <div>
              <h1
                  className="text-green-900 text-center text-5xl font-semibold font-[times new roman]"
              >
                UNIVERSITY OF ABUJA
              </h1>
              <div className="my-6 mx-8">
                <p className="text-4xl font-mono font-bold">
                  FEDERAL CAPITAL TERRITORY
                </p>
                <p className="bg-red-600 w-[15vw] text-center text-white text-2xl">
                  STUDENT IDENTITY CARD
                </p>
              </div>
            </div>
            <div className="">
              <img src="/img/logoo.png" alt="" width="150"/>
            </div>
          </div>

          <div className="flex p-3 gap-10">
            <img src="/img/david.png" alt="" width="200"/>
            <div className="leading-10 ">
              <img src="/img/logoo.png" alt="" width="230" className="opacity-50 relative left-[40%]"/>
              <div className="z-50 absolute top-[30%] w-[100%] font-bold">
                <p className="text-3xl font-mono">Reg no: 20/207 BMT/198</p>
                <p className="text-3xl font-mono">Name: Ebeleagu David Ben</p>
                <p className="text-3xl font-mono">Year of Entry: 2014/2015</p>
                <p className="text-3xl font-mono">Course: Biomedical Technology</p>
                <p className="text-3xl font-mono">Faculty: Faculty Of Health</p>
                <p className="text-3xl font-mono">Blood: AB-</p>
              </div>
            </div>
          </div>

          <div className="mr-10 border-b-2 border-b-red-700">
            <p className="text-red-600 font-mono font-bold text-2xl text-end">Holder's Signature</p>
          </div>
        </section>
      </main>
  );
};



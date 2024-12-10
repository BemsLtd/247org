import React from "react";

function Nigerian_Bar_Association() {
  return (
    <div className="p-3 flex justify-center items-center max-w-[100vw] relative">
      <main className="bg-[#fcefd3] h-[46%] w-[35%] border-[4px] border-black rounded-xl justify-center items-center">
        <section className="flex  h-[30%]">
          <div className="w-[29vw] pl-7">
            <img
              className="rounded-full w-20 h-20"
              src="./images/FireShot Capture 014 - (4) WhatsApp - web.whatsapp.com.png"
              alt=""
            />
          </div>
          <div className="w-[100vw] text-green-600 pl-4">
            <h1 className="font-semibold">NIGERIAN BAR ASSOCIATION</h1>
            <small>ABUJA BRANCH (UNITY BAR)</small>
            <p className="text-red-600 font-semibold">MEMBERSHIP CARD</p>
          </div>
        </section>

        <div>
          <p className="bg-green-900 pl-5 text-white">
            CARD NO:NBA/ABJ/3656/24
          </p>
        </div>

        <section className="p-2 m-2 flex justify-between">
          <div className="h-30">
            <p>
              <small>NAME:</small> MIRACLE DAVID OLUEBUBE
            </p>
            <p>
              <small>ENROLMENT NO:</small> SCN742221
            </p>
            <p>
              <small>Year of cail:</small>2024
            </p>
            <p>
              <small>Date issued:</small>15/05/24
            </p>
            <p>
              <small>Hilder's Sign:</small>
            </p>
          </div>
          <div className="">
            <img
              className="h-36 w-40 border-black border-[2px]"
              src="./images/62d60dfb-3efd-4a75-92e1-aa5fa4b0a0da.jpg"
              alt=""
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Nigerian_Bar_Association;


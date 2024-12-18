import React from "react";

function GTB() {
  return (
    <section className="relative h-[70vh] w-[70vw] flex justify-center items-center">
      <div className="flex flex-col border-2 border-[gray] h-[70%] w-[55%] p-5 shadow-md shadow-[gray] bg-[whitesmoke]">
        <p className="text-5xl font-[times-new-roman]">
          DAVID <span className="text-3xl">EBELEAGU</span>
        </p>
        <p className="text-2xl ml-8">2015/7002</p>
        <div className="flex justify-between">
          <div className="p-7">
            <img
              src="/img/Micheal 018.jpg"
              alt="Gtbank"
              width={170}
              className="border-2 border-[gray] h-[28vh] "
            />
          </div>
          <div className="h-[29vh] w-[14vw] bg-[#dd6f2b] p-7">
            <div className="bg-white h-[7vh] w-[4vw] ml-24" />
            <h1 className="text-3xl text-white p-5 font-medium">GTBank</h1>
            <p className="pt-14 w-[20vw] font-bold">Guaranty Trust Bank plc</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GTB;

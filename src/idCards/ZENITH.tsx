import React from 'react'

export default function ZENITH() {
  return (
<section className="flex flex-col justify-center items-center  h-[100vh] ">
  <section className="border-[4px] px-8 border-black shadow-xl shadow-black bg-repeat-round w-[50vw] bg-[url('/images/backz-removebg-preview.png')]">
    <div className="text-center ">
      <h1 className="text-4xl font-bold ">CHIDI</h1>
    </div>
    <div className="flex justify-between   ">
      <div className="flex flex-col gap-4 font-semibold text-xl">
        <p>ONYEMIZU CHIDI S</p>
        <div>
          <span>STAFF NO:</span>
          <span>PP20240114</span>
        </div>
        <div>
          <span>D.O.E</span>
          <span>12/02/24</span>
        </div>
      </div>
      <div className="border-2 border-red-500">
        <img src="/images/staff-removebg-preview.png" alt="zenith bank" className="h-[20vh]" />
      </div>
    </div>
    <div className="flex  ">
      <img src="/images/zenith-removebg-preview.png" alt="zenith bank" className="h-[15vh] " />
      <div className="pt-14 absolute left-[35vw] bottom-[29vh]">
        <p className="font-bold text-3xl px-9 py-1 bg-gradient-to-r from-white to-red-700">SECONDED TO ZENITH BANK PLC</p>
      </div>
    </div>
  </section>
</section>

  )
}

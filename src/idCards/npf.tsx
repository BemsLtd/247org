import React from "react";

function NPF() {
  return (
    <section className="relative shadow-md shadow-blue-600 h-[60vh] w-[18vw]">
      <div className="bg-blue-800 h-3" />
      <div className="bg-yellow-300 h-1" />
      <div className="bg-green-600 h-3" />
      <div className="bg-gradient-to-b from-white via-[#81a8e7] to-[#fcef8e] h-[52vh] mt-1">
        <div className="flex gap-1 ">
          <img src="/npf/POLICE.png" alt="Nigerian police id cards" width={50} />
          <div className="leading-4">
            <h1 className="font-bold ">THE NIGERIA POLICE </h1>
            <p className="font-bold pl-3">WARRANT CARD</p>
          </div>
        </div>
        <div className="justify-center items-center flex">
          <img src="/npf/OLU.png" width="60%" alt="Nigerian police id cards" />
        </div>
        <div className="font-mono text-xs font-bold ml-8 flex mt-1 ">
          <p>
            Name: Obed Oluomachi <br />
            Rank: IGP <br />
            AP: 36613 <br />
            Blood Group: A+
            <br />
          </p>
          <img src="/npf/sign.png" alt="Nigerian police id cards" width="35%" className="mt-5" />
        </div>
        <div className="font-mono text-xs font-bold ml-8">
          Exp: 09.04.24
          <br />
        </div>
      </div>
      <div className="bg-[#f10404] h-5" />
    </section>
  );
}

export default NPF;

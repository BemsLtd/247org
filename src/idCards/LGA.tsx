import React from "react";

function LGA() {
  return (
    <div className="flex justify-center font-['Arial'] items-center h-[100vh] relative">
      <section className="flex justify-center items-center">
        <div className="card bg-[whitesmoke] shadow-lg rounded-lg border">
          <div className="p-6">
            <header className="flex items-center space-x-2">
              <img
                src="/LGA/logo.png"
                alt="logo"
                className="w-20 h-20 rounded-full overflow-visible"
              />

              <div className="text-2xl text-center font-bold gap-[-20] text-blue-950">
                <p>ABIA STATE UNIFIED LOCAL</p>
                <p>GOVERNMENT SERVICE</p>
              </div>
            </header>

            <div className="flex justify-center [margin-top:0.9rem] items-center gap-7">
              <div
                className="bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/LGA/AT.png'), url('/LGA/logo.png')",
                  backgroundSize: "45% auto, 45% auto",
                  backgroundPosition: "left center, right center",
                  opacity: 1,
                }}
              >
                <p className="font-semibold text-lg text-gray-900">
                  STAFF IDENTITY CARD
                </p>
                <p className="font-extrabold text-2xl mt-3 text-gray-900">
                  AMANDA ESTHER
                </p>
                <p className="font-semibold text-sm text-red-600">
                  SENIOR HIGHER
                </p>
                <p className="font-semibold text-sm mt-1 text-gray-900">
                  DEPT: COMMUNICATIONS
                </p>
                <p className="[word-spacing:0.5rem] font-semibold text-sm text-gray-900">
                  BG: B+ GENOTYPE: AA
                </p>

                <div className="flex justify-between items-center text-gray-900">
                  <p className="font-semibold text-sm">Holder's Sign:</p>
                  <img
                    src="sign.png"
                    alt="signature"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold text-center text-white bg-[red] rounded-sm p-1">
                  ASULGS/24/94935
                </p>

                <figure className="relative border-4 border-slate-900 bg-white overflow-visible">
                  <img
                    src="/LGA/my%20face.jpg"
                    alt="Me"
                    className="w-40 h-30 m-1"
                  />
                  <figcaption className="m-1 absolute mt-1">
                    <img
                      src="barcode.png"
                      alt="Barcode"
                      className="w-40 h-10 bg-white"
                    />
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <footer className="flex justify-start gap-[75px] mt-[-28.5px] items-center p-1 m-2 bg-slate-900">
            <img src="./my%20face.jpg" alt="Me" className="w-10 h-10" />
            <p className="text-white font-extrabold text-3xl">KALU</p>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default LGA;


import React from "react"
type Props = {};
const Irenose_Devs = (props: Props) => {
    return (
        <section className="  w-[50vw] shadow-2xl bg-green-300 rounded-2xl py-3 relative p-3">
            <div className="flex">
                <img className="w-[10%]" src="/img/id-removebg-preview.png" alt=""/>
                <div>
                    <h1 className="justify-center items-center flex font-bold text-green-700 text-[30px] pl-[60px]">FEDERAL
                        REPUBLIC OF NIGERIA</h1>
                    <h3 className="justify-center items-center flex font-bold text-green-700 text-[13px] pl-[90px]">INDEPENDENT
                        NATIONAL ELECTORAL COMMISSION</h3>
                    <h2 className="justify-center items-center flex font-bold text-green-700 text-[10px]">VOTER'S CARD</h2>

                </div>

            </div>
            <div className="flex ">
                <p className="pl-[50px]">CODE</p>
                <p className="pl-[50px]">01-10-10-014</p>
                <p className="pl-[50px]">VIN</p>
                <p className="pl-[50px]">90F5</p>
                <p className="pl-[50px]">AF29</p>
                <p className="pl-[50px]">B123</p>
                <p className="pl-[50px]">C123</p>
            </div>

            <section className=" flex   gap-5 p-3">
                <div className="flex justify-around w-[45%] ">


                    <div className="flex flex-col gap-1 px-3">
                        <span>A</span>
                        <span>1</span>
                        <span>4</span>
                        <span>5</span>
                        <span>4</span>
                        <span>7</span>
                        <span>8</span>
                        <span>7</span>
                        <span>7</span>
                    </div>


                    <div>
                        <img className=" h-[37vh]" width="300" src="/img/cool.jpg" alt=""/>
                        <p>***** ****** ****** </p>

                    </div>
                </div>


                <div className="w-[40%]">
                    <div className="py-1">
                        <p>DELIM ABIA OHOAFIA</p>
                        <small>ANIA OHOAFIA</small>
                    </div>
                    <div className="py-1 font-bold">
                        <p>OGBOSO, NNENNA EMEA</p>
                    </div>
                    <div className="py-1">
                        <p>DATE OF BIRTH</p>
                        <small>14-02-1983</small>
                    </div>

                    <div className="py-1">
                        <p>OCCUP
                            ATION</p>
                        <small>CIVIL SERVANT</small>
                    </div>
                    <div className="py-1">
                        <p>ADDRESS</p>
                        <small>NO.7 UMUOCHEALA ROAD ABYI ARIARIA</small>
                    </div>


                </div>
            </section>


        </section>
    );
};
export default Irenose_Devs;

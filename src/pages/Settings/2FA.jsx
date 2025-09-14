import React, { useState } from "react";

const TwoFA = () => {
  const [selected, setSelected] = useState("sms");

  return (
    <div className="flex-1 bg-white p-6 rounded-lg border border-[#00000033]">
      <div className="flex flex-col gap-6 rounded-lg bg-[#FFFFFF]">
        <div>
          <h3 className="text-lg font-semibold text-[#232323] ">
            2FA Verification
          </h3>
        </div>
        <div className="flex flex-col gap-6">
          <div
            className={`flex items-center p-4 rounded-lg border border-[#D9D9D9] cursor-pointer ${
              selected === "auth"
            }`}
            onClick={() => setSelected("auth")}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="twofa"
                checked={selected === "auth"}
                onChange={() => setSelected("auth")}
                className="w-5 h-5 rounded-full border-2 border-[#F77F00] appearance-none 
                         checked:bg-[#F77F00] cursor-pointer "
              />

              <div className="flex flex-col flex-1 gap-1.5 leading-[150%] tracking-[-3%]">
                <div className="flex justify-between items-center w-full gap-[30px]">
                  <p className="font-medium text-[#232323]">
                    Authenticator App
                  </p>
                  <button className="text-sm text-[#F77F00] fw6 justify-center ">
                    Set
                  </button>
                </div>
                <p className="text-xs text-[#4F4F4F] fw5">
                  Use Google Authenticator or Authy for a one-time passcode.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center p-4 rounded-lg border border-[#D9D9D9] cursor-pointer ${
              selected === "sms"
            }`}
            onClick={() => setSelected("sms")}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="twofa"
                checked={selected === "sms"}
                onChange={() => setSelected("sms")}
                className="w-5 h-5 rounded-full border-2 border-[#F77F00] appearance-none 
                         checked:bg-[#F77F00] cursor-pointer mt-1"
              />

              <div className="flex flex-col flex-1 gap-1.5 leading-[150%] tracking-[-3%]">
                <div className="flex justify-between items-center w-full gap-[30px]">
                  <p className="font-medium text-[#232323]">SMS Code</p>
                  <button className="text-sm text-[#F77F00] fw6 justify-center">
                    Edit
                  </button>
                </div>
                <p className="text-xs text-[#4F4F4F] fw5 ">
                  Your SMS number is (44) 123 1234 741
                </p>
              </div>
            </div>
          </div>

          
        </div>
        <div className="flex justify-end gap-2  leading-[150%] tracking-[-3%] ">
            <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 fw6 text-xs justify-center text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]">
              Discard
            </button>
            <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gp-2 fw6 text-xs justify-center text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]">
              Save Changes
            </button>
          </div>
      </div>

    </div>
  );
};

export default TwoFA;

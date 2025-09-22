import React, { useState } from "react";
import API from "../../services/api"; 
import { toast } from "react-toastify";

const TwoFA = () => {
  const user = JSON.parse(localStorage.getItem("auth_user")) || {};
  const [selected, setSelected] = useState(user?.two_factor_method || "none");
  const [qrData, setQrData] = useState(null);
  // const [setupToken, setSetupToken] = useState(null);
  // const [otpCode, setOtpCode] = useState("");

  const handleSave = async () => {
    try {
      await API.post("/2fa/update", { method: selected });
      localStorage.setItem(
        "auth_user",
        JSON.stringify({ ...user, two_factor_method: selected })
      );
      toast.success("Two-Factor method updated successfully!");
    } catch (error) {
      console.error("Error updating 2FA:", error);
      toast.error("Failed to update Two-Factor method.");
    }
  };

  const handleDiscard = () => {
    setSelected(user?.two_factor_method || "none");
  };

  const handleGenerateTotp = async () => {
    try {
      const res = await API.post("/2fa/generate-totp");
      setQrData(res.data.qr);
      
    } catch (error) {
      toast.error("Failed to generate TOTP QR code");
    }
  };

  const radioClass =
    "w-5 h-5 rounded-full border-2 border-[#F77F00] appearance-none cursor-pointer " +
    "checked:border-[#F77F00] checked:bg-white relative " +
    "after:content-[''] after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#F77F00] " +
    "after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 " +
    "after:scale-0 checked:after:scale-100 transition-all";

  return (
    <div className="flex-1 bg-white p-6 rounded-lg border border-[#00000033]">
      <div className="flex flex-col gap-6 rounded-lg bg-[#FFFFFF]">
        <h3 className="text-lg font-semibold text-[#232323]">2FA Verification</h3>

        <div className="flex flex-col gap-6">
          <div
            className="flex items-center p-4 rounded-lg border border-[#D9D9D9]"
            onClick={() => setSelected("totp")}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="twofa"
                checked={selected === "totp"}
                onChange={() => setSelected("totp")}
                className={radioClass}
              />
              <div className="flex flex-col flex-1 gap-1.5">
                <div className="flex justify-between items-center w-full gap-[30px]">
                  <p className="font-medium text-[#232323]">Authenticator App</p>
                  {selected === "totp" && !qrData && (
                    <button
                      className="text-sm text-[#F77F00] fw6"
                      onClick={handleGenerateTotp}
                    >
                      Set
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#4F4F4F]">
                  Use Google Authenticator or Authy for a one-time passcode.
                </p>

                {qrData && (
                  <div className="mt-3 flex flex-col gap-2">
                    {/* <div
                      className="w-64 h-64"
                      dangerouslySetInnerHTML={{ __html: qrData }}
                    /> */}
                    <img src={qrData} alt="QR Code" className="w-64 h-64" />
                   
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex items-center p-4 rounded-lg border border-[#D9D9D9]"
            onClick={() => setSelected("email")}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="twofa"
                checked={selected === "email"}
                onChange={() => setSelected("email")}
                className={radioClass}
              />
              <div className="flex flex-col flex-1 gap-1.5">
                <p className="font-medium text-[#232323]">Email</p>
                <p className="text-xs text-[#4F4F4F]">
                  Your Email is <strong>{user?.email}</strong>
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center p-4 rounded-lg border border-[#D9D9D9]"
            onClick={() => setSelected("none")}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="twofa"
                checked={selected === "none"}
                onChange={() => setSelected("none")}
                className={radioClass}
              />
              <div className="flex flex-col flex-1 gap-1.5">
                <p className="font-medium text-[#232323]">No 2FA</p>
                <p className="text-xs text-[#4F4F4F]">
                  Disable Two-Factor Authentication
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleDiscard}
            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 fw6 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 fw6 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFA;

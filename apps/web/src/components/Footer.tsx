import xionLogo from "../assets/logo.png";

const FooterLogin = () => {
  const isMainnet = false;

  return (
    <div className="self-end pointer-events-auto w-full z-[1000] flex flex-col gap-2 sm:gap-12 pb-safe items-center sm:flex-row sm:justify-between sm:items-end">
      <div className="text-xs font-normal leading-5 text-center sm:text-left max-w-[280px] sm:max-w-full">
        <span className="text-secondary-text">
          By continuing, you agree to and acknowledge that you have read and
          understand the
        </span>
        <a
          href="https://burnt.com/terms-and-conditions"
          className="pl-1 text-white underline font-bold"
        >
          Disclaimer
        </a>
        <span className="text-secondary-text">.</span>
      </div>
      <div className="flex gap-3 justify-center items-end sm:my-0">
        <p className="text-xs sm:text-sm text-secondary-text mb-0.5 sm:mb-1.5 text-nowrap">
          Powered by
        </p>
        <div className="flex flex-row-reverse items-center sm:items-start sm:flex-col">
          <div
            className={`flex justify-between items-center h-[18px] ${
              isMainnet ? "bg-mainnet-bg" : "bg-testnet-bg"
            } px-1 py-0 ml-2 mt-1.5 sm:ml-0 sm:mb-2 ${
              isMainnet ? "text-mainnet" : "text-testnet"
            } rounded-[4px] text-[10px] tracking-widest`}
          >
            {isMainnet ? "MAINNET" : "TESTNET"}
          </div>
          <a
            href="https://burnt.com/terms-and-conditions"
            className="w-[70px] h-[24px] sm:w-[108px] sm:h-[39px]"
          >
            <img src={xionLogo} alt="XION Logo" width="108" height="39" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterLogin;

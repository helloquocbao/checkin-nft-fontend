"use client";
import { ConnectButton } from "@mysten/dapp-kit";

const HeaderComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg p-2 navbar-light bg-white fixed-top">
      <ConnectButton />
    </nav>
  );
};

export default HeaderComponent;

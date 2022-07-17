import React, { ReactNode } from "react";
import Header from "../Header/Header";

type Props = {
  children: ReactNode;
};

if (typeof document !== "undefined") {
  document.body.addEventListener("touchmove", function (e) {
    e.preventDefault();
  });
}

const Layout: React.FC<Props> = (props) => (
  <div className="m-auto flex w-full flex-col place-items-center p-3 sm:max-w-2xl">
    <Header />
    <div className="m-4 flex w-full flex-col place-items-center">
      {props.children}
    </div>
  </div>
);

export default Layout;

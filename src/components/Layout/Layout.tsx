import React, { ReactNode } from "react";
import Navigation from "../Navigation/Navigation";

type Props = {
  children: ReactNode;
};

if (typeof document !== "undefined") {
  document.body.addEventListener("touchmove", function (e) {
    e.preventDefault();
  });
}

const Layout: React.FC<Props> = (props) => (
  <div className="m-auto mb-20 flex w-full flex-col place-items-center">
    <Navigation />
    <div className="m-4 flex w-full flex-col place-items-center sm:max-w-2xl">
      {props.children}
    </div>
  </div>
);

export default Layout;

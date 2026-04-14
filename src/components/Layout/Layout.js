import Header from "./Header";
import Footer from "./Footer";

import classes from "../../Styling/Layout/Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={classes.layout}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

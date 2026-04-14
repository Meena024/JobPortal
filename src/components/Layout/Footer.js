import classes from "../../Styling/Layout/Footer.module.css";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <p>© {new Date().getFullYear()} JobPortal</p>
    </footer>
  );
};

export default Footer;

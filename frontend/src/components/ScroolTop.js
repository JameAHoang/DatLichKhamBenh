import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = (props) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    props.handleScrollTop();
    // window.scrollTo({ top: top, behavior: "smooth" });
  }, [pathname]);
  return null;
};
export default ScrollTop;

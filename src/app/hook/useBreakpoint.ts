import { useState, useEffect } from "react";

export enum BREAK_POINT_SIZE {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XXL = "xxl"
}

type BreakPointSize =
  | BREAK_POINT_SIZE.XS
  | BREAK_POINT_SIZE.SM
  | BREAK_POINT_SIZE.MD
  | BREAK_POINT_SIZE.LG
  | BREAK_POINT_SIZE.XL
  | BREAK_POINT_SIZE.XXL;

const resolveBreakpoint = (width: number): BreakPointSize => {
  if (width < 576) {
    return BREAK_POINT_SIZE.XS;
  } else if (width >= 576 && width < 768) {
    return BREAK_POINT_SIZE.SM;
  } else if (width >= 768 && width < 992) {
    return BREAK_POINT_SIZE.MD;
  } else if (width >= 992 && width < 1200) {
    return BREAK_POINT_SIZE.LG;
  } else if (width >= 1200 && width < 1440) {
    return BREAK_POINT_SIZE.XL;
  } else if (width >= 1440) {
    return BREAK_POINT_SIZE.XXL;
  }
  return BREAK_POINT_SIZE.XS;
};

const useBreakpoint = () => {
  const [size, setSize] = useState<BreakPointSize>(() => resolveBreakpoint(window.innerWidth));

  useEffect(() => {
    const calcInnerWidth = () => {
      setSize(resolveBreakpoint(window.innerWidth));
    };

    window.addEventListener("resize", calcInnerWidth);

    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  return size;
};

export default useBreakpoint;

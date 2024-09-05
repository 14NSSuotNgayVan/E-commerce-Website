import React, { useEffect, useState } from "react";
import useBreakpoint, { BREAK_POINT_SIZE } from "../../../hook/useBreakpoint";

interface Props {
  children: React.ReactNode;
  className?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

const { XS, SM, MD, LG, XL, XXL } = BREAK_POINT_SIZE;

const ColCustom: React.FC<Props> = (props) => {
  const { children, xs = 1, sm, md, lg, xl, xxl, className } = props;
  const size = useBreakpoint();

  const [col, setCol] = useState<number | undefined>(xs);

  useEffect(() => {
    setCol(matchSize(size));
  }, [size]);

  const matchSize = (size: string = XS) => {
    switch (size) {
      case XS:
        return xs;
      case SM:
        return sm;
      case MD:
        return md;
      case LG:
        return lg;
      case XL:
        return xl;
      case XXL:
        return xxl;
      default:
        return xs;
    }
  };

  const styles: React.CSSProperties = {
    gridColumn: `span ${col || xs || 1} / span ${col || xs || 1}`
  };

  return <div style={styles} className={className || ""}>{children}</div>;
};

export default ColCustom;

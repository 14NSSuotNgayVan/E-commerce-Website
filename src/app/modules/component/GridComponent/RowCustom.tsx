import React, { useCallback, useEffect, useState } from "react";
import useBreakpoint, { BREAK_POINT_SIZE } from "../../../hook/useBreakpoint";

interface Props {
  children: React.ReactNode;
  className?: string;
  gap?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

const { XS, SM, MD, LG, XL, XXL } = BREAK_POINT_SIZE;

const RowCustom: React.FC<Props> = (props) => {
  const { children, gap, xs, sm, md, lg, xl, xxl, className } = props;
  const size = useBreakpoint();

  const [cols, setCols] = useState(xs);

  const matchSize = useCallback((size: string = XS) => {
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
  }, [lg, md, sm, xl, xs, xxl]);
  
  useEffect(() => {
    setCols(matchSize(size));
  }, [size, matchSize]);

  const styles: React.CSSProperties = {
    display: "grid",
    width: "100%",
    gap: gap || "10.4px",
    gridTemplateColumns: `repeat(${cols || xs || 1}, minmax(0, 1fr))`
  };

  return <div style={styles} className={className || ""}>{children}</div>;
};

export default RowCustom;

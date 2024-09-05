import * as React from "react";
import "./_loading-indicator.scss";

type IProps = {
  show: boolean;
}

const LoadingIndicator: React.FC<IProps> = ({ show }) => {
  return (
    <>
      {show && (
        <div className="loading-wrapper">
          <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      )}
    </>
  );
};

export default LoadingIndicator;

import { Link } from 'react-router-dom';
import "../../../../../app/modules/styles/index.scss";
import { hasRole } from '../../../../../app/modules/utils/FunctionUtils';
import { KTSVG } from '~/_metronic/helpers';
import { ROLE } from '~/app/constants/Common';

export function MenuInner() {

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className='header-brand'>
        <Link className='header-brand-link w-100 flex flex-middle flex-center' to={hasRole([ROLE.MANAGER, ROLE.ROLE_SUPPER_ADMIN]) ? "/receipt" : hasRole([ROLE.ADMIN, ROLE.ROLE_ANALYST]) ? "report" : "/home"}>
          <KTSVG path='/media/logos/logo.svg' svgClassName='spaces w-60 h-60' />
          <h5 className="text-uppercase text-app-logo flex-grow-1">angel shop</h5>
        </Link>
      </div>
    </div>
  );
}

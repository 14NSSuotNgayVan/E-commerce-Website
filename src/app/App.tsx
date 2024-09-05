import {Suspense, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer, toast, Zoom} from 'react-toastify'
import AppContext from './AppContext'
import LoadingIndicator from './modules/component/loading/LoadingIndicator'
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  return (
    <AppContext.Provider value={{ pageLoading, setPageLoading }}>
      <LoadingIndicator show={pageLoading}/>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
            <ToastContainer
              autoClose={3000}
              position={toast.POSITION.TOP_RIGHT}
              transition={Zoom}
              theme='colored'
              pauseOnHover={false}
            />
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </AppContext.Provider>
  )
}

export default App;

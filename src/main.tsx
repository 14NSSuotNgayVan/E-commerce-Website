import React from 'react'
import { createRoot } from 'react-dom/client'
// Axios
import axios from 'axios'
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'
import './_metronic/assets/sass/plugins.scss'
import './_metronic/assets/sass/style.react.scss'
import './_metronic/assets/sass/style.scss'
import { AuthProvider, setupAxios } from './app/modules/auth'
import { AppRoutes } from './app/routing/AppRoutes'
import { SpeedInsights } from '@vercel/speed-insights/react';
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios)

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <MetronicI18nProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <SpeedInsights />
    </MetronicI18nProvider>
  // </React.StrictMode>,
)

import {ReactNode} from 'react'
import {MenuComponent} from '../assets/ts/components'

type WithChildren = {
  children?: ReactNode
}

const reInitMenu = () => {
  setTimeout(() => {
    MenuComponent.reInitialization()
  }, 500)
}

export {type WithChildren, reInitMenu}

import React, { ReactNode } from 'react'
import Header from '../Header/Header'

type Props = {
  children: ReactNode
}

if (typeof document !== 'undefined') {
  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault()
  })
}

const Layout: React.FC<Props> = (props) => (
  <div className="m-auto w-full sm:max-w-2xl flex flex-col place-items-center p-3">
    <Header />
    <div className="w-full m-4 flex flex-col place-items-center">
      {props.children}
    </div>
  </div>
)

export default Layout

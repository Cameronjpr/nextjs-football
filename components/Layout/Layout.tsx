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
  <div>
    <Header />
    <div className="m-4 flex flex-col place-items-center">{props.children}</div>
  </div>
)

export default Layout

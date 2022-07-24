import { ReactNode } from 'react'

type HeadingProps = {
  level: string
  children: ReactNode
}
const Heading = ({ level, children }: HeadingProps) => {
  switch (level) {
    case '1':
      return (
        <h1 className="w-full rounded-md p-2 text-center font-rubik text-3xl italic text-orange-600 sm:text-5xl">
          {children}
        </h1>
      )
    case '2':
      return (
        <h2 className="text-xl sm:text-3xl text-center font-rubik mb-8 sm:mb-16 text-emerald-600 px-20">
          {children}
        </h2>
      )
    case '3':
      return <h3>{children}</h3>
    default:
      return <span>{children}</span>
  }
}

export default Heading

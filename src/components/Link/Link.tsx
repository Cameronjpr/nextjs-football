import NextLink, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

type StyledLinkProps = LinkProps & {
  children: ReactNode
}

const Link = ({ href, children }: StyledLinkProps) => {
  return (
    <NextLink href={href}>
      <span className="w-max h-max self-center mb-10 p-3 text-lg cursor-pointer bg-orange-200 text-amber-900 hover:bg-orange-300 rounded-xl drop-shadow-md">
        {children}
      </span>
    </NextLink>
  )
}

export default Link

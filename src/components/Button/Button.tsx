import classNames from 'classnames'
import { ReactNode } from 'react'

type ButtonProps = {
  onClick: () => void
  disabled: boolean
  children: ReactNode
}

const Button = ({ onClick, disabled = false, children }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={classNames(
        'h-10 w-20 rounded-md p-1 text-center drop-shadow font-semibold',
        disabled
          ? 'cursor-not-allowed bg-slate-100 text-slate-600'
          : ' bg-orange-200 text-amber-900 hover:bg-orange-300'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button

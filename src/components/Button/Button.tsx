import classNames from 'classnames'
import { ReactNode } from 'react'

type ButtonProps = {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  children: ReactNode
  type?: string
}

const Button = ({
  onClick,
  disabled = false,
  isLoading = false,
  children,
  type,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={classNames(
        'min-w-min rounded-md p-3 text-center drop-shadow font-semibold',
        disabled
          ? 'cursor-not-allowed bg-slate-100 text-slate-600'
          : ' bg-orange-200 text-amber-900 hover:bg-orange-300',
        type === 'warning'
          ? 'bg-red-200 text-red-900 hover:bg-red-300 outline outline-red-700'
          : '',
        isLoading ? 'animate-pulse' : ''
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button

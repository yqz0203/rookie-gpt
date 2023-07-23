import classNames from 'classnames';
import Spinner from '../Spinner';
import { forwardRef, isValidElement } from 'react';

export default forwardRef(function Button(
  props: {
    children?: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: React.ReactNode | React.ComponentType<any>;
    loading?: boolean;
    type: 'primary' | 'outline' | 'default';
    size?: 'small' | 'normal';
    className?: string;
    disabled?: boolean;
    full?: boolean;
    onClick?(): void;
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  const {
    className,
    disabled,
    icon,
    loading,
    full = false,
    type = 'default',
    size = 'normal',
    onClick,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon: any = icon;

  return (
    <button
      ref={ref}
      disabled={loading || disabled}
      className={classNames(
        'transition-all flex items-center font-medium outline-none cursor-pointer disabled:!opacity-70 disabled:!cursor-not-allowed disabled:active:!shadow-transparent space-x-1',
        type === 'primary' &&
          'bg-cyan-600/20 hover:bg-cyan-600/30 active:shadow-cyan-600 text-cyan-600',
        type === 'default' &&
          'bg-gray-600/10 hover:bg-gray-600/30 active:shadow-gray-600 text-gray-600',
        type === 'outline' &&
          'bg-white text-xs border-[2px] border-gray-200 hover:border-gray-600 active:border-gray-600 focus:shadow-gray-600 text-gray-700',
        size === 'normal' &&
          'rounded-md px-4 h-[35px] text-sm active:shadow-[0_0_0_2px]',
        size === 'small' &&
          'rounded-md px-1 h-[30px] text-xs active:shadow-[0_0_0_1px]',
        full && 'w-full items-center justify-center',
        className,
      )}
      onClick={onClick}
    >
      {loading ? (
        <Spinner
          size={14}
          borderClassName={
            type === 'default'
              ? 'border-gray-600'
              : type === 'outline'
              ? 'border-gray-600'
              : undefined
          }
        />
      ) : isValidElement(icon) ? (
        Icon
      ) : Icon ? (
        <Icon width={18} height={18} />
      ) : null}
      <span>{props.children}</span>
    </button>
  );
});

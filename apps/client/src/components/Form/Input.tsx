import classNames from 'classnames';
import { forwardRef } from 'react';

export default forwardRef(function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { full?: boolean },
  ref: React.Ref<HTMLInputElement>,
) {
  const { className, full, ...rest } = props;

  return (
    <input
      ref={ref}
      placeholder="请输入"
      className={classNames(
        'border-gray-300 min-w-[200px] max-w-full outline-none focus:outline-none text-sm border-[1px] focus:border-cyan-600 rounded px-3 h-8',
        className,
        full && 'w-full',
      )}
      {...rest}
    />
  );
});

const Textarea = forwardRef(function Textarea(
  props: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { full?: boolean },
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { className, full, ...rest } = props;

  return (
    <textarea
      ref={ref}
      placeholder="请输入"
      className={classNames(
        'border-gray-300 min-w-[200px] max-w-full outline-none focus:outline-none text-sm border-[1px] focus:border-cyan-600 rounded px-3 py-1 min-h-8',
        className,
        full && 'w-full',
      )}
      {...rest}
    />
  );
});

export { Textarea };

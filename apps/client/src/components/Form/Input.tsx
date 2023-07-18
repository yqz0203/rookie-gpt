import classNames from 'classnames';

export default function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  const { className, ...rest } = props;

  return (
    <input
      placeholder="请输入"
      className={classNames(
        'border-gray-300 min-w-[200px] max-w-full outline-none focus:outline-none text-sm border-[1px] focus:border-cyan-600 rounded px-3 h-8',
        className,
      )}
      {...rest}
    />
  );
}

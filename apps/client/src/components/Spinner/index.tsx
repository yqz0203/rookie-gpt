import classNames from 'classnames';

export default function Spinner(props: {
  size?: number;
  white?: boolean;
  loading?: boolean;
  className?: string;
  borderClassName?: string;
}) {
  const { size = 20, className, borderClassName, loading = true } = props;

  if (!loading) return null;

  return (
    <div
      className={classNames(
        'inline-block rounded-full border-[2px] border-r-transparent animate-spin m-1',
        borderClassName || 'border-cyan-600',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

import * as RadixSlider from '@radix-ui/react-slider';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

const Slider = (props: RadixSlider.SliderProps) => {
  const { className, ...rest } = props;
  const [innerValue, setInnerValue] = useState(rest.defaultValue);

  useEffect(() => {
    setInnerValue(rest.value);
  }, [rest.value]);

  return (
    <RadixSlider.Root
      {...rest}
      onValueChange={e => {
        setInnerValue(e);
        rest.onValueChange?.(e);
      }}
      className={classNames(
        'relative flex items-center select-none touch-none w-[200px] h-[40px] mx-1',
        className,
      )}
    >
      <RadixSlider.Track className="bg-gray-100 flex-1 h-[3px] relative rounded-full">
        <RadixSlider.Range className="absolute bg-cyan-600 h-full rounded-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block relative w-5 h-5 bg-white outline-none shadow-[0_1px_6px] shadow-black/20 rounded-full">
        <div className="absolute top-[110%] left-0 right-0 text-xs text-center">
          {innerValue || rest.min}
        </div>
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
};

export default Slider;

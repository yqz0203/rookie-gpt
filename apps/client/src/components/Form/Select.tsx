import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const SelectItem = React.forwardRef(function SelectItem(
  { children, className, ...props }: any,
  forwardedRef,
) {
  return (
    <RadixSelect.Item
      className={classnames(
        'flex items-center pr-9 pl-6 h-8 relative cursor-pointer hover:bg-cyan-600 focus:bg-cyan-600 focus:text-white focus:outline-none hover:text-white text-sm rounded',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <RadixSelect.ItemText className="text-sm">
        {children}
      </RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute left-0 w-6 flex items-center justify-center">
        <CheckIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

interface Props extends RadixSelect.SelectProps {
  options: { label: string; value: any }[];
}

const Select = (props: Props) => {
  const { options, ...selectProps } = props;

  return (
    <RadixSelect.Root {...selectProps}>
      <RadixSelect.Trigger className="inline-flex rounded pl-4 border-[1px] border-gray-300 w-[200px] text-sm h-8 items-center gap-1 bg-white cursor-pointer outline-none">
        <div className='flex-1 text-left whitespace-nowrap min-w-0 overflow-hidden text-ellipsis'>
          <RadixSelect.Value placeholder="请选择..." className="flex-1" />
        </div>
        <RadixSelect.Icon className="pr-2 ml-1">
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="z-[2000] bg-white rounded shadow-[0_0_6px_1px_rgba(0,0,0,0.2)]">
          <RadixSelect.Viewport className="p-1">
            <RadixSelect.Group>
              {options.map(item => {
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </RadixSelect.Group>
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

export default Select;

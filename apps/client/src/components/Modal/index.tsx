import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import Button from '../Button';

interface Props extends Dialog.DialogProps {
  title?: ReactNode;
  trigger?: React.ReactNode;
  clickMaskClose?: boolean;
  confirmLoading?: boolean;
  confirmText?: string;
  onConfirm?(): void;
}

const Modal = (props: Props) => {
  const {
    title,
    confirmLoading,
    trigger,
    children,
    clickMaskClose = true,
    confirmText = '确认',
    onConfirm,
    ...dialogProps
  } = props;

  const ContentComp = clickMaskClose ? Dialog.Content : 'div';

  return (
    <Dialog.Root {...dialogProps}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <div
          className="fixed inset-0 z-[998] bg-black/20 animate-in fade-in-0"
          onClick={e => {
            e.stopPropagation();
          }}
        />
        <ContentComp className="fixed z-[999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative animate-in slide-in-from-bottom-2/4 fade-in rounded-md bg-white shadow-[0_10px_28px_-10px_rgba(14,18,22,0.4)] duration-300">
            <Dialog.Title className="font-bold text-base h-[50px] px-5 flex items-center">
              {title}
            </Dialog.Title>
            <div className="px-5 pt-3">{children}</div>

            <div className="flex justify-end mt-6 px-5 pb-5">
              <Button
                type="primary"
                loading={confirmLoading}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>
        </ContentComp>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;

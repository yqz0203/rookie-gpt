import {
  memo,
  forwardRef,
  useState,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react';
import { Modal, Input } from '../components';
import { current, produce } from 'immer';
import useSWRMutation from 'swr/mutation';
import { ConversationDto } from '../types/dto';
import request from '../utils/request';
import { toast } from 'react-hot-toast';

export interface EditConversationTitleModalAction {
  open(id: number, title: string): void;
}

export default memo(
  forwardRef(function EditConversationTitleModal(
    props: object,
    ref: Ref<EditConversationTitleModalAction>,
  ) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitleInput, setEditTitleInput] = useState('');
    const idRef = useRef<number>();

    const { trigger, isMutating } = useSWRMutation(
      '/chats/query-conversation',
      async () => {
        await request.post('/chats/update-conversation', {
          id: idRef.current,
          title: editTitleInput,
        });

        setEditModalOpen(false);

        return editTitleInput;
      },
      {
        onSuccess() {
          toast.success('更新成功');
        },
        onError(e) {
          toast.error(e.message);
        },
        populateCache(result, currentData) {
          return produce(currentData, draft => {
            if (!draft) return draft;

            const item = draft.find(item => item.id === idRef.current);

            item.title = result;
          });
        },
      },
    );

    useImperativeHandle(ref, () => {
      return {
        open(id, title) {
          idRef.current = id;
          setEditTitleInput(title);
          setEditModalOpen(true);
        },
      };
    });

    return (
      <Modal
        title="会话标题"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onConfirm={() => trigger()}
        confirmLoading={isMutating}
      >
        <Input
          placeholder="请输入标题"
          className="!w-[400px]"
          disabled={isMutating}
          value={editTitleInput}
          onChange={e => setEditTitleInput(e.target.value)}
        />
      </Modal>
    );
  }),
);

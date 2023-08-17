import useSWR from 'swr';
import { pick } from 'lodash';
import useSWRMutation from 'swr/mutation';
import { Button } from '../../components';
import request from '../../utils/request';
import { toast } from 'react-hot-toast';

const SingleChatButton = (props: { chatConversationId?: number }) => {
  const { chatConversationId } = props;

  const { data: chatConfig } = useSWR(
    chatConversationId
      ? ['/chats/query-conversation-config', { chatConversationId }]
      : null,
  );

  const { trigger, isMutating } = useSWRMutation(
    ['/chats/query-conversation-config', { chatConversationId }],
    async (key, { arg }: { arg: boolean }) => {
      const res = await request.post('/chats/update-conversation-config', {
        ...pick(chatConfig, [
          'model',
          'temperature',
          'topP',
          'prompts',
          'prompts',
        ]),
        singleChatMode: arg,
        chatConversationId,
      });

      return res;
    },
    {
      onSuccess() {
        toast.success('保存成功');
      },
      onError(err) {
        toast.error(err.message);
      },
      revalidate: true,
    },
  );

  return (
    <Button
      type="outline"
      size="small"
      disabled={isMutating}
      icon={
        <input
          type="checkbox"
          checked={chatConfig?.singleChatMode || false}
          onChange={() => {
            //
          }}
        />
      }
      onClick={() => {
        trigger(!chatConfig?.singleChatMode);
      }}
    >
      单轮对话
    </Button>
  );
};

export default SingleChatButton;

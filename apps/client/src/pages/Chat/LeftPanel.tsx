import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { APP_NAME } from '../../config';
import Conversation from './Conversation';
import request from '../../utils/request';
import useConversationList from '../../service/useConversationList';
import { useEffect } from 'react';
import { Button } from '../../components';

export default function LeftPanel(props: {
  chatConversationId?: number;
  onConversationChange(id: number): void;
}) {
  const { data } = useConversationList();

  const { trigger, isMutating } = useSWRMutation(
    '/chats/query-conversation',
    async () => {
      const res = await request.post('/chats/create-conversation', {
        title: '',
      });

      props.onConversationChange(res.id);

      return res;
    },
    {
      populateCache: (current, prev) => {
        return [current, ...(prev || [])];
      },
      onSuccess() {
        setTimeout(() => {
          document.querySelector('#conversation-list')?.scroll({ top: 0 });
        }, 50);
      },
      revalidate: true,
    },
  );

  const { data: financeData } = useSWR<{ limit: number; usage: number }>(
    '/openai/finance-info',
    {
      refreshInterval: 30000,
    },
  );

  useEffect(() => {
    if (data?.length === 0) {
      trigger();
    }
  }, [data?.length, trigger]);

  return (
    <div className="w-[300px] h-full border-r from-slate-100 to-white bg-gradient-to-b flex flex-col">
      <h2 className="text-3xl font-bold px-4 pt-6 py-8">
        {APP_NAME}

        {financeData && (
          <span className="text-xs float-right font-normal mt-5 text-cyan-600">
            ${(financeData.usage / 100).toFixed(2)}/
            {Math.ceil(financeData.limit).toFixed(1)}
          </span>
        )}
      </h2>

      <Conversation
        current={props.chatConversationId}
        onConversationChange={props.onConversationChange}
      />

      <div className="pb-3 pt-3 px-4 flex">
        <Button
          className="ml-auto"
          type="outline"
          size="small"
          loading={isMutating}
          icon={<PlusCircledIcon />}
          onClick={trigger}
        >
          新建会话
        </Button>
      </div>
    </div>
  );
}

import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useLatest } from 'ahooks';
import dayjs from 'dayjs';
import { animated, useTransition } from '@react-spring/web';

import useConversationList from '../../service/useConversationList';
import { ReactComponent as IconClose } from '../../assets/close.svg';
import useSWRMutation from 'swr/mutation';
import request from '../../utils/request';
import { ConversationDto } from '../../types/dto';

export default function Conversation(props: {
  current?: number;
  onConversationChange(id: number): void;
}) {
  const { current, onConversationChange } = props;
  const { data } = useConversationList();

  const onConversationChangeRef = useLatest(onConversationChange);

  useEffect(() => {
    if (!current && data && data.length) {
      onConversationChangeRef.current?.(data[0]?.id);
    }
  }, [current, data, onConversationChangeRef]);

  const dataRef = useLatest(data);

  const { trigger } = useSWRMutation(
    '/chats/query-conversation',
    async (url, { arg }: { arg: ConversationDto }) => {
      const index =
        current !== arg.id
          ? undefined
          : dataRef.current?.findIndex(item => item.id === arg.id);

      await request.post('/chats/delete-conversation', { id: arg.id });

      if (index !== undefined && index >= 0) {
        if (dataRef.current?.[index + 1]) {
          console.log(dataRef.current?.[index + 1].id);

          onConversationChange(dataRef.current?.[index + 1].id);
        } else {
          onConversationChange(dataRef.current?.[index - 1]?.id || 0);
        }
      }
      return arg;
    },
    {
      populateCache(result, currentData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return currentData.filter((item: any) => item.id !== result.id);
      },
    },
  );

  const refMap = useMemo(() => new WeakMap(), []);

  const transitions = useTransition(data || [], {
    from: { opacity: 0, height: 0 },
    keys: item => item.id,
    enter: item => async next => {
      await next({ opacity: 1, height: refMap.get(item).scrollHeight });
    },
    leave: [{ opacity: 0, height: 0 }],
  });

  return (
    <div
      className="flex-1 mx-2 min-h-0 overflow-y-scroll px-2 scrollbar scrollbar-1"
      id="conversation-list"
    >
      <div className="">
        {transitions((style, item) => (
          <animated.div
            className="overflow-hidden"
            ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
            key={item.id}
            style={style}
          >
            <div
              key={item.id}
              onClick={() => props.onConversationChange(item.id)}
              className={classNames(
                'relative group bg-white rounded-lg cursor-pointer my-1.5 transition-colors border-[2px] pl-4 pr-4 py-2',
                current === item.id
                  ? 'border-gray-600'
                  : 'border-gray-200 hover:bg-gray-200',
              )}
            >
              <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis pr-4">
                {item.title || '新的会话'}
              </div>
              <div className="text-xs mt-4">
                <span>共{item.messageCount}条对话</span>
                <span className="float-right">
                  {dayjs(item.latestMessageTime || item.updatedAt).format(
                    'YYYY-M-D HH:mm:ss',
                  )}
                </span>
              </div>

              <IconClose
                onClick={e => {
                  e.stopPropagation();
                  trigger(item);
                }}
                width={20}
                height={20}
                className="transition-all absolute right-1 top-1 opacity-0 group-hover:opacity-100 translate-x-[5px] group-hover:translate-x-0"
              />
            </div>
          </animated.div>
        ))}
      </div>
    </div>
  );
}

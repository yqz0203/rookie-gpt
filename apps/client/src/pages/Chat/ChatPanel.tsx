import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMemoizedFn, useRequest } from 'ahooks';
import { flushSync } from 'react-dom';
import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';
import classNames from 'classnames';

import ChartItem from './ChatItem';
import './markdown.css';
import { useAuthStore } from '../../store';
import { API_HOST } from '../../config';
import StopPng from '../../assets/stop.png';
import { MessageDto } from '../../types/dto';
import useConversationList from '../../service/useConversationList';
import request from '../../utils/request';
import ConfigDialog from './ConfigDialog';

export interface ChatPanelApi {
  scrollToEnd(force?: boolean): void;
  isSending(): boolean;
}

function ChatPanel(
  props: { chatConversationId?: number },
  ref: React.Ref<ChatPanelApi>,
) {
  const { chatConversationId } = props;
  const { token } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [streamData, setStreamData] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<() => void>();

  /** 滚动到底部 */
  const scrollToEnd = (force = false) => {
    if (!bodyRef.current) return;

    if (
      force ||
      bodyRef.current.scrollHeight <=
        bodyRef.current.clientHeight + bodyRef.current.scrollTop + 50
    ) {
      // try {
      // bodyRef.current?.scroll({ top: 9999999, behavior: 'smooth' });
      // } catch (e) {
      bodyRef.current?.scrollTo(0, 9999999);
      // }
    }
  };

  /** 发送 */
  const send = useMemoizedFn(async () => {
    flushSync(() => {
      setSubmitting(true);
    });

    scrollToEnd(true);

    const abort = new AbortController();
    let latestMessage = '';

    abortRef.current = () => abort.abort();

    try {
      const res = await fetch(API_HOST + '/openai/chatCompletion', {
        method: 'POST',
        signal: abort.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatConversationId,
          message: currentQuestion,
        }),
      });

      if (res.status >= 400) {
        setSubmitting(false);

        const data = (await res.json()) as any;
        toast.error(data?.message || data?.message?.[0] || '出错了，请重试');
        return;
      }

      const reader = res.body?.getReader();

      let resData: MessageDto[] = [];

      if (reader) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // 刷新最后消息时间
            mutate('/chats/query-conversation');
            mutateMessageList(prev => [...(prev || []), ...resData]);

            setCurrentQuestion('');
            setSubmitting(false);
            setStreamData('');

            return;
          } else {
            const decoder = new TextDecoder('utf-8');
            const str = decoder.decode(value);
            setStreamData(prev => {
              // 头部空行
              if (!latestMessage && !str.trim()) return prev;

              if (str.startsWith('EASYGPTRES://')) {
                resData = JSON.parse(str.replace('EASYGPTRES://', ''));
              } else {
                latestMessage = prev + str;
              }

              return latestMessage;
            });
          }
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        setSubmitting(false);
        setStreamData('');
        return;
      }

      setSubmitting(false);
      toast.error(e.message);
    }
  });

  const { data: conversations, mutate: mutateConversationList } =
    useConversationList();
  const conversationInfo = useMemo(() => {
    return conversations?.find(item => item.id === chatConversationId);
  }, [chatConversationId, conversations]);

  const {
    data: messageList,
    isLoading: isLoadingMessageList,
    mutate: mutateMessageList,
  } = useSWR<MessageDto[]>(
    chatConversationId
      ? ['/chats/query-conversation-message', { chatConversationId }]
      : null,
  );

  const { run: onDelete } = useRequest(
    async (id: number) => {
      await request.post('/chats/delete-conversation-message', { id });
    },
    {
      manual: true,
      onSuccess(res, params) {
        mutateMessageList(prev => prev?.filter(item => item.id !== params[0]), {
          revalidate: false,
        });

        mutateConversationList();
      },
      onError(e) {
        toast.error(e.message);
      },
    },
  );

  useLayoutEffect(() => {
    scrollToEnd();
  }, [streamData, submitting]);

  useLayoutEffect(() => {
    bodyRef.current?.scrollTo(0, 0);
  }, [chatConversationId]);

  useImperativeHandle(ref, () => {
    return {
      scrollToEnd,
      isSending() {
        return submitting;
      },
    };
  });

  return (
    <div className="flex h-full flex-1 min-w-0 flex-col">
      <div className="h-[44px] text-center leading-[44px] text-sm px-[100px] items-center border-b justify-center font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {conversationInfo?.title}
      </div>

      <div
        className="flex-1 overflow-y-auto overflow-x-hidden py-5 bg-gray-100 text-[15px] scrollbar scrollbar-2"
        ref={bodyRef}
      >
        {messageList?.length === 0 && (
          <ChartItem pos={'l'} content={'你好，请问有什么问题？'} />
        )}
        {messageList?.map(item => (
          <ChartItem
            key={item.id}
            id={item.id as number}
            pos={item.role === 'user' ? 'r' : 'l'}
            content={item.content}
            onDelete={onDelete}
          />
        ))}

        {submitting && currentQuestion && (
          <ChartItem pos="r" id={-1} content={currentQuestion} />
        )}
        {(submitting || streamData) && (
          <ChartItem pos="l" showCursor content={streamData || ''} />
        )}
      </div>

      <div className="px-4 py-2 border-t ">
        <div className='flex space-x-4 pb-2'>
          <ConfigDialog chatConversationId={conversationInfo?.id} />
        </div>

        <div className="pb-safe relative">
          <textarea
            value={currentQuestion}
            onInput={e => setCurrentQuestion(e.currentTarget.value)}
            className="flex-1 h-[80px] pl-3 pr-[80px] py-2 w-full focus:border-cyan-600 resize-none  border-[2px] text-sm rounded-md outline-none disabled:text-gray-300"
            placeholder={'按ctrl+enter发送'}
            disabled={submitting || isLoadingMessageList}
            onKeyDown={e => {
              if (e.ctrlKey && e.key === 'Enter') {
                send();
              }
            }}
          />
          <button
            className={classNames(
              'transition-all absolute bottom-4 text-sm right-3 rounded-md py-2 w-[60px] h-[36px] flex items-center justify-center text-white disabled:cursor-not-allowed disabled:text-gray-200',
              submitting
                ? ' active:bg-red-600 disabled:active:bg-red-500 bg-red-500'
                : ' active:bg-cyan-600 disabled:active:bg-cyan-500 bg-cyan-500',
            )}
            disabled={!currentQuestion.trim()}
            onClick={submitting ? abortRef.current : send}
          >
            {submitting ? (
              <img src={StopPng} className="w-[10px] h-[10px] animate-ping" />
            ) : (
              '发送'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(ChatPanel);

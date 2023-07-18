import { useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import toast from 'react-hot-toast';

import './markdown.css';
import classNames from 'classnames';
import LeftPanel from './LeftPanel';
import withLogin from '../../components/withLogin';
import ChatPanel, { ChatPanelApi } from './ChatPanel';

function Chat() {
  const [chatConversationId, setChatConversationId] = useState<number>();
  const chatPanelRef = useRef<ChatPanelApi>(null);
  const onConversationChange = useMemoizedFn((id: number) => {
    if (chatPanelRef.current?.isSending()) {
      return toast.error('当前会话正在请求中，请先结束');
    }

    setChatConversationId(id);
  });

  return (
    <div className="h-full pt-[5vh]">
      <div
        className={classNames(
          'relative max-w-[1200px] mx-auto border shadow-sm flex bg-white overflow-hidden rounded-lg h-[90vh]',
        )}
      >
        <LeftPanel
          chatConversationId={chatConversationId}
          onConversationChange={onConversationChange}
        />
        <ChatPanel chatConversationId={chatConversationId} ref={chatPanelRef} />
      </div>
    </div>
  );
}

export default withLogin(Chat);

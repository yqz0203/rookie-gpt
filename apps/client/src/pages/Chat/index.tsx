import { useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import toast from 'react-hot-toast';

import './markdown.css';
import classNames from 'classnames';
import LeftPanel from './LeftPanel';
import withLogin from '../../components/withLogin';
import ChatPanel, { ChatPanelApi } from './ChatPanel';
import { useAppGlobalSetting } from '../../store';

function Chat() {
  const [chatConversationId, setChatConversationId] = useState<number>();
  const chatPanelRef = useRef<ChatPanelApi>(null);
  const appSettings = useAppGlobalSetting();
  const onConversationChange = useMemoizedFn((id: number) => {
    if (chatPanelRef.current?.isSending()) {
      return toast.error('当前会话正在请求中，请先结束');
    }

    setChatConversationId(id);
  });

  return (
    <div className="h-full overflow-hidden">
      <div
        className={classNames(
          'relative mx-auto flex bg-white overflow-hidden',
          appSettings.fullScreen
            ? 'w-full h-full'
            : 'max-w-[1200px] mt-[5vh] h-[90vh] border shadow-sm rounded-lg',
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

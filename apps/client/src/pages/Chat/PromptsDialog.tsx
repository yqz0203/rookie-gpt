import useSWR from 'swr';
import { produce } from 'immer';
import { useEffect, useState } from 'react';
import {
  MixerHorizontalIcon,
  PlusIcon,
  MinusCircledIcon,
} from '@radix-ui/react-icons';
import { useLatest } from 'ahooks';
import { pick } from 'lodash';
import useSWRMutation from 'swr/mutation';
import { Button, Modal, Select, Textarea } from '../../components';
import request from '../../utils/request';
import { toast } from 'react-hot-toast';

const ConfigDialog = (props: { chatConversationId?: number }) => {
  const { chatConversationId } = props;
  const [modelOpen, setModelOpen] = useState(false);
  const [prompts, setPrompts] = useState<{ role: string; content: string }[]>(
    [],
  );

  const { data: chatConfig } = useSWR(
    chatConversationId
      ? ['/chats/query-conversation-config', { chatConversationId }]
      : null,
  );

  const { trigger, isMutating } = useSWRMutation(
    ['/chats/query-conversation-config', { chatConversationId }],
    async () => {
      const res = await request.post('/chats/update-conversation-config', {
        ...pick(chatConfig, ['model', 'temperature', 'topP']),
        prompts: JSON.stringify(prompts),
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

  const chatConfigRef = useLatest(chatConfig);

  useEffect(() => {
    if (modelOpen && chatConfigRef.current) {
      setPrompts(JSON.parse(chatConfigRef.current.prompts || []));
    }
  }, [modelOpen, chatConfigRef]);

  return (
    <Modal
      open={modelOpen}
      onOpenChange={setModelOpen}
      title="提示词配置"
      onConfirm={trigger}
      confirmLoading={isMutating}
      trigger={
        <Button type="outline" size="small" icon={<MixerHorizontalIcon />}>
          提示词
        </Button>
      }
    >
      <div className="w-[500px] max-h-[500px] py-2 pr-2 scrollbar overflow-y-scroll overflow-x-hidden">
        <div className="space-y-4">
          {/* <div className="flex justify-between items-center">
            <div className="text-sm">模型：</div>
            <Input />
          </div> */}

          {prompts.map((item, index) => {
            return (
              <div key={index} className="flex items-start justify-between">
                <MinusCircledIcon
                  className="text-red-500 cursor-pointer mt-2 mr-3 hover:text-red-700"
                  onClick={() => {
                    setPrompts(prompts.filter((item, i) => i !== index));
                  }}
                />

                <Select
                  value={item.role}
                  onValueChange={v => {
                    setPrompts(prev => {
                      return produce(prev, draft => {
                        const prompt = draft[index];

                        prompt.role = v;
                      });
                    });
                  }}
                  options={[
                    {
                      label: '系统（System）',
                      value: 'system',
                    },
                    {
                      label: 'AI助手（Assistant）',
                      value: 'assistant',
                    },
                    {
                      label: '用户（User）',
                      value: 'user',
                    },
                  ]}
                />

                <div className="flex-1 ml-2">
                  <Textarea
                    full
                    placeholder="请输入提示词"
                    value={item.content}
                    onChange={e => {
                      setPrompts(prev => {
                        return produce(prev, draft => {
                          const prompt = draft[index];

                          prompt.content = e.target.value;
                        });
                      });
                    }}
                    className=""
                    rows={5}
                  />
                </div>
              </div>
            );
          })}

          <div className="ml-6">
            <Button
              type="outline"
              icon={<PlusIcon />}
              full
              onClick={() => {
                setPrompts(prev => [...prev, { role: 'system', content: '' }]);
              }}
            >
              添加
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigDialog;

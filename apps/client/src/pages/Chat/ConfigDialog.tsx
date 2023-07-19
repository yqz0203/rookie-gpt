import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { useLatest } from 'ahooks';
import { pick } from 'lodash';
import useSWRMutation from 'swr/mutation';
import { Button, Modal, Select, Slider } from '../../components';
import request from '../../utils/request';
import { toast } from 'react-hot-toast';

const ConfigDialog = (props: { chatConversationId?: number }) => {
  const { chatConversationId } = props;
  const [modelOpen, setModelOpen] = useState(false);
  const [config, setConfig] = useState<{
    model: string;
    temperature: number;
    topP: number;
  }>({ model: '', temperature: 1, topP: 1 });

  const { data: chatConfig } = useSWR(
    chatConversationId
      ? ['/chats/query-conversation-config', { chatConversationId }]
      : null,
  );

  const { trigger, isMutating } = useSWRMutation(
    ['/chats/query-conversation-config', { chatConversationId }],
    async () => {
      const res = await request.post('/chats/update-conversation-config', {
        ...pick(chatConfig, ['model', 'temperature', 'topP', 'prompts']),
        ...config,
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
      setConfig({
        model: chatConfigRef.current?.model,
        temperature: chatConfigRef.current?.temperature,
        topP: chatConfigRef.current?.topP,
      });
    }
  }, [modelOpen, chatConfigRef]);

  return (
    <Modal
      open={modelOpen}
      onOpenChange={setModelOpen}
      title="模型配置"
      onConfirm={trigger}
      confirmLoading={isMutating}
      trigger={
        <Button type="outline" size="small" icon={<MixerHorizontalIcon />}>
          模型配置
        </Button>
      }
    >
      <div className="w-[500px] py-2 scrollbar overflow-y-auto overflow-x-hidden">
        <div className="space-y-4">
          {/* <div className="flex justify-between items-center">
            <div className="text-sm">模型：</div>
            <Input />
          </div> */}

          <div className="flex justify-between items-center">
            <div className="text-sm">模型(model)：</div>
            <Select
              value={config?.model}
              onValueChange={v => setConfig(prev => ({ ...prev, model: v }))}
              options={[
                {
                  label: 'gpt-3.5-turbo',
                  value: 'gpt-3.5-turbo',
                },
                {
                  label: 'gpt-3.5-turbo-0613',
                  value: 'gpt-3.5-turbo-0613',
                },
                {
                  label: 'gpt-3.5-turbo-16k',
                  value: 'gpt-3.5-turbo-16k',
                },
                {
                  label: 'gpt-3.5-turbo-16k-0613',
                  value: 'gpt-3.5-turbo-16k-0613',
                },
                {
                  label: 'gpt-4',
                  value: 'gpt-4',
                },
                {
                  label: 'gpt-4-0613',
                  value: 'gpt-4-0613',
                },
              ]}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">温度(temperature)：</div>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={[config.temperature]}
              onValueChange={v =>
                setConfig(prev => ({ ...prev, temperature: v[0] }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">核采样(top_p)：</div>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[config.topP]}
              onValueChange={v => setConfig(prev => ({ ...prev, topP: v[0] }))}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigDialog;

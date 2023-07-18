import { useRequest } from 'ahooks';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Spinner } from '../../components';
import request from '../../utils/request';
import { APP_NAME } from '../../config';
import { useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', code: '' });
  const { setToken } = useAuthStore();

  const { run: getCode, loading: loadingCode } = useRequest(
    async (email: string) => {
      await request.post('/auth/sendCode', { email });
    },
    {
      manual: true,
      onSuccess() {
        toast.success('已发送验证码');
        setStep(2);
      },
      onError(e) {
        toast.error(e.message);
      },
    },
  );

  const navigate = useNavigate();

  const { run: login, loading: loadingLogin } = useRequest(
    async (email: string, code: string) => {
      return await request.post<{ accessToken: string }>('/auth/login', {
        email,
        code,
      });
    },
    {
      manual: true,
      onSuccess(res) {
        toast.success('登录成功');
        setToken(res.accessToken);

        navigate('/', { replace: true });
      },
      onError(e) {
        toast.error(e.message);
      },
    },
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[400px] h-[300px] p-6 bg-white rounded-lg -mt-[100px] shadow-md border animate-in fade-in zoom-in duration-500">
        <div className="text-3xl text-center font-bold mb-2">{APP_NAME}</div>
        <div className="text-sm text-gray-400 text-center mb-8">请登录</div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (step === 1) {
              if (!formData.email.match(/^[^@]+@[^@]+$/)) {
                return toast.error('请输入合法的邮箱地址');
              }

              getCode(formData.email);
            } else {
              if (!formData.code.trim()) {
                return toast.error('请输入验证码');
              }
              login(formData.email, formData.code);
            }
          }}
        >
          {step === 1 && (
            <>
              <div className="h-[50px] rounded-md bg-white">
                <input
                  placeholder="请输入邮箱"
                  name="email"
                  value={formData.email}
                  autoFocus
                  onChange={e => {
                    setFormData(v => ({ ...v, email: e.target.value }));
                  }}
                  className="h-full w-full border outline-none px-3 rounded"
                />
              </div>
              <div className="text-sm mt-2">
                邮箱未注册？
                <a className="text-blue-500" href="mailto:yqz0203@hotmail.com">
                  请联系我
                </a>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="h-[50px] rounded-md bg-white">
                <input
                  placeholder="请输入验证码"
                  type="password"
                  name="code"
                  value={formData.code}
                  autoFocus
                  onChange={e => {
                    setFormData(v => ({ ...v, code: e.target.value }));
                  }}
                  className="h-full w-full border outline-none px-3 rounded"
                />
              </div>
              <div className="text-sm mt-2">
                未收到验证码？请检查垃圾箱或
                <a className="text-blue-500" href="mailto:yqz0203@hotmail.com">
                  联系我
                </a>
              </div>
            </>
          )}

          <div className="mt-6">
            <button className="rounded-md flex items-center justify-center w-full h-[48px] active:bg-cyan-600 text-white bg-cyan-500 disabled:!bg-cyan-300">
              {loadingCode || loadingLogin ? (
                <Spinner white loading />
              ) : step === 1 ? (
                '获取验证码'
              ) : (
                '登录'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import classNames from 'classnames';
import {
  memo,
  useDeferredValue,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// @ts-ignore
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { ReactComponent as IconRobot } from '../../assets/robot.svg';
import { ReactComponent as IconUser } from '../../assets/user.svg';
import { ReactComponent as IconDelete } from '../../assets/delete.svg';
import { ReactComponent as IconCopy } from '../../assets/copy.svg';
import 'highlight.js/styles/atom-one-dark.css';
import styles from './Chat.module.css';
import { copyToClipboard } from '../../utils/utils';
import toast from 'react-hot-toast';

const md = markdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {
        //
      }
    }

    return ''; // use external default escaping
  },
});

const Btn = memo(function Btn(props: {
  Icon: React.ComponentType<any>;
  title: string;
  onClick?(): void;
}) {
  return (
    <div
      onClick={props.onClick}
      className="w-[30px] relative h-[30px] group/item hover:w-[60px] transition-all duration-200 rounded-[15px] shadow border cursor-pointer bg-white whitespace-nowrap pl-[25px]"
    >
      <props.Icon
        height={20}
        width={20}
        className="absolute top-[4px] left-[4px]"
      />
      <span className="opacity-0 transition-opacity group-hover/item:opacity-100 text-xs duration-200 leading-[30px]">
        {props.title}
      </span>
    </div>
  );
});

function ChatItem(props: {
  id?: number;
  pos: 'l' | 'r';
  content: string;
  showCursor?: boolean;
  onDelete?(id: number): void;
}) {
  const { pos = 'l', id, content, showCursor = false, onDelete } = props;

  const deferContent = useDeferredValue(content);

  const mdContent = useMemo(() => {
    return pos === 'r' ? content : md.render(deferContent);
  }, [content, deferContent, pos]);

  const contentRef = useRef<HTMLDivElement>(null);
  const [cursorPoint, setCursorPoint] = useState<{
    left: number;
    top: number;
  }>({ left: 16, top: 12 });

  useLayoutEffect(() => {
    if (!contentRef.current || pos === 'r' || !showCursor) return;

    let el: HTMLElement | null = contentRef.current;

    while (el && el.children.length) {
      el = el.children.item(el.children.length - 1) as HTMLElement;
    }

    if (!el) return;

    const text = el.innerText || el.textContent || '';

    const range = document.createRange();
    if (!el.childNodes[0]) return;

    try {
      range.setEnd(el.childNodes[0], text.length);
    } catch (e) {
      return;
    }
    const rects = range.getClientRects();
    const lastRect = rects[rects.length - 1];

    setCursorPoint({
      left:
        lastRect.left +
        lastRect.width +
        -contentRef.current?.getBoundingClientRect().left +
        18,
      top:
        lastRect.top -
        lastRect.height +
        -contentRef.current?.getBoundingClientRect().top +
        28,
    });
  }, [deferContent, pos, showCursor]);

  const Avatar = pos === 'l' ? IconRobot : IconUser;

  const avatar = (
    <div
      className={classNames(
        'w-[40px] h-[40px] group rounded-full float-left flex items-center justify-center text-white',
        pos === 'l' ? 'bg-slate-500' : 'bg-indigo-500',
      )}
    >
      <Avatar className="w-[20px] h-[20px] text-white" />
    </div>
  );

  const body = (
    <div
      className={classNames(
        'max-w-[80%] relative group',
        pos === 'l' ? 'ml-3' : 'mr-3',
      )}
    >
      <div
        className={classNames(
          'px-4 py-2 bg-white rounded-md break-all relative min-h-[38px]',
        )}
      >
        <div
          className={classNames(
            pos === 'l' ? 'markdown-body' : 'whitespace-pre-wrap break-all',
          )}
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: mdContent || '' }}
        >
          {/* {mdContent} */}
        </div>
        {pos === 'l' && showCursor && (
          <div
            className={classNames(styles.cursor, ' absolute')}
            style={cursorPoint}
          />
        )}
      </div>

      <div
        className={classNames(
          'h-[35px] transition-all opacity-0 group-hover:opacity-100 flex items-end space-x-1',
          pos === 'l' ? 'justify-start' : 'justify-end',
        )}
      >
        {id && id > 0 && (
          <>
            <Btn
              Icon={IconDelete}
              title="删除"
              onClick={() => {
                onDelete?.(id);
              }}
            />
            <Btn
              Icon={IconCopy}
              title="复制"
              onClick={() => {
                try {
                  copyToClipboard(content);

                  toast.success('复制成功');
                } catch (e) {
                  //
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={classNames(
        'my-3 px-3 clear-both flex',
        pos === 'l' ? 'justify-start' : 'justify-end',
      )}
    >
      {pos === 'l' ? (
        <>
          {avatar}
          {body}
        </>
      ) : (
        <>
          {body}
          {avatar}
        </>
      )}
    </div>
  );
}

export default memo(ChatItem);

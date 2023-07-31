import { useRef, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';

interface ButtonProps {
  // sum: (a: number, b: number) => number;
  // logMessage: (message: string) => void;
  // 👇️ turn off type checking
  // doSomething: (params: any) => any;
  onSave: (note: { title: string; content: string }) => void;
  isOpen: boolean;
}

const myTheme = EditorView.theme(
  {
    '&': {
      color: 'white',
    },
    '.cm-content': {
      caretColor: '#0e9',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0e9',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#074',
    },
    '.cm-gutters': {
      backgroundColor: '#045',
      color: '#ddd',
      border: 'none',
    },
  },
  { dark: true }
);

export const NoteEditor = (props: ButtonProps) => {
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const saveNote = () => {
    props.onSave({
      title,
      content: code,
    });
    setCode('');
    setTitle('');
    //ToDo close modal
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [props.isOpen]);

  let isCtrl = false;

  return (
    <div
      className="card mt-5 border border-gray-200 bg-base-100 shadow-xl"
      onKeyDown={(e) => {
        // e.preventDefault();
        console.log('foo');
        if (e.key === 'Control') {
          e.preventDefault();
          isCtrl = true;
        }
        if (isCtrl && e.key === 's') {
          e.preventDefault();
          saveNote();
        }
      }}
      onKeyUp={(e) => {
        e.preventDefault();
        if (e.key === 'Control') {
          isCtrl = false;
        }
      }}
    >
      <div className="card-body">
        <h2 className="card-title">
          <input
            ref={inputRef}
            id="titleInput"
            type="text"
            placeholder="Note title"
            className="input-primary input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
          className="border border-gray-300"
          theme={myTheme}
        />
      </div>
      <div className="card-actions justify-end">
        <button
          style={{ margin: '5px' }}
          onClick={() => {
            saveNote();
          }}
          className="btn-primary btn"
          disabled={title.trim().length === 0 || code.trim().length === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
};

import { useRef, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';

interface ButtonProps {
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
  const [note, setNote] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const saveNote = () => {
    if (!props.isOpen) {
      return;
    }
    props.onSave({
      title,
      content: note,
    });
    setNote('');
    setTitle('');
    inputRef.current && inputRef.current.focus();
    //ToDo close modal
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [props.isOpen]);

  //callback function for ctrl+s to save feature
  const handleSave = (e: KeyboardEvent) => {
    if (!props.isOpen) {
      return;
    }
    e.preventDefault();
    saveNote();
  };

  const config = { ctrlKey: true, code: 'KeyS' };
  useKeyboardShortcut(handleSave, config);

  return (
    <div
      id="noteEditorDiv"
      className={'card mt-5 border border-gray-200 bg-base-100 shadow-xl'}
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
          value={note}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setNote(value)}
          className="border border-gray-300"
          theme={myTheme}
        />
      </div>
      <div className="card-actions justify-end">
        <button
          style={{ margin: '5px' }}
          onClick={(e) => {
            e.preventDefault();
            saveNote();
          }}
          className="btn-primary btn"
          disabled={title.trim().length === 0 || note.trim().length === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
};

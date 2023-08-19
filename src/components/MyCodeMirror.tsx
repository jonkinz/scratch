import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import type { ViewUpdate } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from 'codemirror';
import type { Dispatch } from 'react';
import type { SetStateAction } from 'react';

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

interface CodeMirrorProps {
  // onSave: (note: { title: string; content: string }) => void;
  // isOpen: boolean;
  value: string;
  setNote: Dispatch<SetStateAction<string>>;
}

function MyCodeMirror(props: CodeMirrorProps) {
  const onChange = React.useCallback(
    (value: string, viewUpdate: ViewUpdate) => {
      console.log(viewUpdate);
      console.log('value:', value);
      props.setNote(value);
    },
    [props]
  );

  return (
    <CodeMirror
      value={props.value}
      // extensions={[javascript({ jsx: true })]}
      onChange={onChange}
      // onChange={props.setNote}
      width="500px"
      height="30vh"
      minWidth="100%"
      minHeight="30vh"
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ]}
      className="border border-gray-300"
      theme={myTheme}
    />
  );
}
export default MyCodeMirror;

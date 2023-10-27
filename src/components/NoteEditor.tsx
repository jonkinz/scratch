import { useFormik } from 'formik';
import { useRef, useEffect, useState } from 'react';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';
import MyCodeMirror from './MyCodeMirror';
// import * as Yup from 'yup';
// import * as Constants from '~/constants';
import { type RouterOutputs } from '../utils/api';
type Topic = RouterOutputs['topic']['getAll'][number];
type Note = RouterOutputs['note']['getAll'][number];
import { NoteValidateSchema } from '~/constants/NoteValidateSchema';
import { toFormikValidate } from 'zod-formik-adapter';
// import { CreateTopicInput } from './CreateTopicInput';
// const TitleSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(Constants.NOTE_TITLE_LENGTH_MIN, Constants.ERROR_MESSAGE_MIN)
//     .max(Constants.NOTE_TITLE_LENGTH_MAX, Constants.ERROR_MESSAGE_MAX),
// });

type EditorProps = {
  topics: Topic[] | undefined;
  note: Note | null;
  onSave: (note: {
    newTopic: string;
    topic: string;
    title: string;
    content: string;
  }) => void;
  isOpen: boolean;
};

export const NoteEditor = (props: EditorProps) => {
  // Set up initial values for formik and the code mirror editor.
  const topics = props.topics;
  let title = '';
  let noteString = '';
  let defaultTopicId = topics && topics[0] ? topics[0].id : '';
  if (props.note) {
    noteString = props.note.content;
    title = props.note.title;
    defaultTopicId = props.note.topicId;
  }
  const [note, setNote] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      newTopic: '',
      topic: defaultTopicId,
      title: title,
      note: '',
    },
    validate: toFormikValidate(NoteValidateSchema),
    enableReinitialize: true,
    // validationSchema: TitleSchema,
    onSubmit: () => {
      saveNote();
    },
  });

  // formik.values.topic = defaultTopicId;
  const saveNote = () => {
    if (!formik.isValid) {
      return;
    }
    if (!props.isOpen) {
      return;
    }
    props.onSave({
      newTopic: formik.values.newTopic,
      topic: formik.values.topic,
      title: formik.values.title,
      content: note,
    });
  };

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current && inputRef.current.focus();
      setNote(noteString);
    } else {
      //TODO: have to clear the form when it's closed. formik can't be a dependency here, you get an infinite loop of rendering.
      // formik.resetForm();
      setNote('');
    }
  }, [props.isOpen, noteString]);

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
      <form onSubmit={formik.handleSubmit}>
        <div className="card-body">
          <h2 className="card-title">
            <div className="form-control w-full">
              <div className="grid grid-cols-10 gap-4">
                <div id="leftInput" className="col-span-3">
                  {topics && topics.length > 0 ? (
                    <select
                      className={`select select-bordered w-full max-w-xs`}
                      name="topic"
                      id="topic"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.topic}
                      // defaultValue={topics && topics[0] ? topics[0].id : ''}
                    >
                      <option disabled selected>
                        Choose a topic
                      </option>
                      {topics &&
                        topics.map((topic) => {
                          return (
                            <option key={topic.id} value={topic.id}>
                              {topic.name}
                            </option>
                          );
                        })}
                    </select>
                  ) : (
                    <input
                      ref={inputRef}
                      name="newTopic"
                      id="newTopic"
                      type="text"
                      placeholder="Note topic"
                      className={`input input-bordered w-full ${
                        formik.touched.newTopic && formik.errors.newTopic
                          ? 'input-error'
                          : 'input-primary'
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newTopic}
                    />
                  )}
                </div>
                <div className="col-span-7">
                  <input
                    ref={inputRef}
                    name="title"
                    id="title"
                    type="text"
                    placeholder="Note title"
                    className={`input input-bordered w-full ${
                      formik.touched.title && formik.errors.title
                        ? 'input-error'
                        : 'input-primary'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                  />
                </div>
              </div>
              {formik.touched.title && formik.errors.title ? (
                <span className="label-text-alt text-right text-red-500">
                  {formik.errors.title}
                </span>
              ) : (
                <span style={{ height: '16px' }}></span>
              )}
            </div>
          </h2>
          <MyCodeMirror value={note} setNote={setNote} />
        </div>
        <div className="card-actions justify-end">
          <button
            style={{ margin: '5px' }}
            type="reset"
            className="btn btn-secondary"
            onClick={() => formik.resetForm()}
          >
            {' '}
            Reset
          </button>
          <button
            style={{ margin: '5px' }}
            type="submit"
            className="btn btn-primary"
            disabled={!formik.isValid}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

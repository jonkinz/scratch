import { useFormik } from 'formik';
import { useRef, useEffect, useState } from 'react';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';
import MyCodeMirror from './MyCodeMirror';
// import * as Yup from 'yup';
// import * as Constants from '~/constants';
import { type RouterOutputs } from '../utils/api';
type Topic = RouterOutputs['topic']['getAll'][number];
import { NoteValidateSchema } from '~/constants/NoteValidateSchema';
import { toFormikValidate } from 'zod-formik-adapter';

// const TitleSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(Constants.NOTE_TITLE_LENGTH_MIN, Constants.ERROR_MESSAGE_MIN)
//     .max(Constants.NOTE_TITLE_LENGTH_MAX, Constants.ERROR_MESSAGE_MAX),
// });

type EditorProps = {
  topics: Topic[] | undefined;
  onSave: (note: { topic: string; title: string; content: string }) => void;
  isOpen: boolean;
};

export const NoteEditor = (props: EditorProps) => {
  const [note, setNote] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const topics = props.topics;
  const defaultTopicId = topics && topics[0] ? topics[0].id : '';
  console.log(defaultTopicId);
  // defaultValue={topics && topics[0] ? topics[0].id : ''}
  const formik = useFormik({
    initialValues: {
      topic: '',
      title: '',
      note: '',
    },
    validate: toFormikValidate(NoteValidateSchema),
    // validationSchema: TitleSchema,
    onSubmit: () => {
      saveNote();
    },
  });
  formik.values.topic = defaultTopicId;
  const saveNote = () => {
    if (!formik.isValid) {
      return;
    }
    if (!props.isOpen) {
      return;
    }
    props.onSave({
      topic: formik.values.topic,
      title: formik.values.title,
      content: note,
    });
  };

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current && inputRef.current.focus();
    } else {
      //TODO: have to clear the form when it's closed. formik can't be a dependency here, you get an infinite loop of rendering.
      formik.resetForm();
    }
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
      <form onSubmit={formik.handleSubmit}>
        <div className="card-body">
          <h2 className="card-title">
            <div className="form-control w-full">
              <div className="grid grid-cols-10 gap-4">
                <div id="leftInput" className="col-span-3">
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

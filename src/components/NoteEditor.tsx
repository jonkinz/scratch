import { useFormik } from 'formik';
import { useRef, useEffect, useState } from 'react';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';
import MyCodeMirror from './MyCodeMirror';
import * as Yup from 'yup';
import * as Constants from '~/constants';

const TitleSchema = Yup.object().shape({
  title: Yup.string()
    .min(Constants.NOTE_TITLE_LENGTH_MIN, Constants.ERROR_MESSAGE_MIN)
    .max(Constants.NOTE_TITLE_LENGTH_MAX, Constants.ERROR_MESSAGE_MAX),
});

interface ButtonProps {
  onSave: (note: { title: string; content: string }) => void;
  isOpen: boolean;
}
export const NoteEditor = (props: ButtonProps) => {
  const [note, setNote] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      note: '',
    },
    // validate: toFormikValidate(NoteSchema),
    validationSchema: TitleSchema,
    // validationSchema: toFormikValidateSchema(NoteSchema),
    onSubmit: () => {
      saveNote();
    },
  });

  const saveNote = () => {
    if (!formik.isValid) {
      return;
    }
    if (!props.isOpen) {
      return;
    }
    props.onSave({
      title: formik.values.title,
      content: note,
    });
  };

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current && inputRef.current.focus();
    } else {
      //clear note editor on close
      setNote('');
      // setTitle('');
      // () => formik.resetForm();
      // clear title in form input
      formik.values.title = '';
    }
  }, [props.isOpen, formik.values]);

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
              <input
                ref={inputRef}
                name="title"
                id="title"
                type="text"
                placeholder="Note title"
                className={`${
                  formik.touched.title && formik.errors.title
                    ? 'input input-bordered input-error'
                    : 'input input-bordered input-primary'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
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

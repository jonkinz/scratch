import { useFormik } from 'formik';
import { useRef, useEffect, useState } from 'react';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';
import MyCodeMirror from './MyCodeMirror';
import { toFormikValidate, toFormikValidationSchema } from 'zod-formik-adapter';
import { NoteSchema } from '~/constants/NoteSchema';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
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
// FormikConfig<{ input: string; note: string; }>

// interface Values {
//   title: string;
//   note: string;
// }

// interface Errors {
//   title?: string;
//   note?: string;
// }

// const validate = (values: Values) => {
//   const errors: Errors = {};
//
//   // This is the same as using the Errors interface, in that the props are optional.
//   // const errors: Partial<Values> = {};
//   // const errors: Values | Record<string, never> = {};
//   if (!values.title) {
//     errors.title = 'Required';
//   } else if (values.title.length > 15) {
//     errors.title = 'Must be 15 characters or less';
//   }
//   console.log(errors);
//   return errors;
// };

export const NoteEditor = (props: ButtonProps) => {
  const [note, setNote] = useState<string>('');
  // const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      note: '',
    },
    // validate: validate,
    // validate: toFormikValidate(NoteSchema),
    validationSchema: TitleSchema,
    // validationSchema: toFormikValidateSchema(NoteSchema),
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      console.log(values);
      saveNote();
    },
  });

  const saveNote = () => {
    if (!formik.isValid) {
      return;
    }
    // e.preventDefault();
    if (!props.isOpen) {
      return;
    }
    props.onSave({
      title: formik.values.title,
      content: note,
    });
    setNote('');
    // setTitle('');
    formik.resetForm();
    inputRef.current && inputRef.current.focus();
    //ToDo close modal
  };

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current && inputRef.current.focus();
    } else {
      //clear note editor on close
      setNote('');
      // setTitle('');
      console.log('teset');
      // () => formik.resetForm();
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
            <input
              ref={inputRef}
              name="title"
              id="title"
              type="text"
              placeholder="Note title"
              className="input input-primary input-lg w-full font-bold"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              // value={title}
              // onChange={(e) => setTitle(e.currentTarget.value)}
            />

            {/* {formik.touched.title && formik.errors.title ? notify() : null} */}
            {/* toast.error(errorMessage[0]); */}
            {formik.touched.title && formik.errors.title ? (
              <div>{formik.errors.title}</div>
            ) : null}
          </h2>

          {/* <input */}
          {/*   ref={inputRef} */}
          {/*   name="note" */}
          {/*   id="note" */}
          {/*   type="text" */}
          {/*   placeholder="Note note" */}
          {/*   className="input-primary input input-lg w-full font-bold" */}
          {/*   onChange={formik.handleChange} */}
          {/*   onBlur={formik.handleBlur} */}
          {/*   value={formik.values.note} */}
          {/*   // value={note} */}
          {/*   // onChange={(e) => note(e.currentTarget.value)} */}
          {/* /> */}
          <MyCodeMirror value={note} setNote={setNote} />
        </div>
        <div className="card-actions justify-end">
          <button
            style={{ margin: '5px' }}
            type="submit"
            // onClick={(e) => {
            //   e.preventDefault();
            //   saveNote();
            // }}
            className="btn btn-primary"
            // disabled={title.trim().length === 0 || note.trim().length === 0}
            disabled={!formik.isValid}
          >
            Save
          </button>
          {/* <button type="submit">Foooo</button> */}
        </div>
      </form>
    </div>
  );
};

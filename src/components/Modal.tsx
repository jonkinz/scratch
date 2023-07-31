import type { TransitionEvent } from 'react';
import type { TransitionEventHandler } from 'react';
// import useKeypress from '~/hooks/useKeypress';
import { useState, useRef } from 'react';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: (e: TransitionEvent<HTMLDialogElement>) => void;
  setIsShowModal: (isShow: boolean) => void;
  isShowModal: boolean;
};

export const Modal = (props: ModalProps) => {
  const ref = useRef(null);

  // const [isShow, setIsShow] = useState<boolean>(false);
  // < input type="checkbox" id="my-modal-4" className="modal-toggle" />
  //
  // <label htmlFor="my-modal-4" className="modal cursor-pointer" onTransitionEnd={props.setIsVisible}>
  //
  //   <label className="relative w-11/12 max-w-5xl" htmlFor="">
  //     {props.children}
  //   </label>
  // </label>

  return (
    <div ref={ref}>
      {/* Open the modal using ID.showModal() method */}
      <dialog
        id="my_modal_1"
        className={
          'modal h-full w-full ' + (props.isShowModal ? ' modal-open' : '')
        }
        onTransitionEnd={props.setIsVisible}
      >
        {/* <dialog id="my_modal_1" className={"modal modal-open"}> */}
        <form method="dialog" className="modal-box w-11/12 max-w-5xl">
          {props.children}
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn"
              onClick={(e) => props.setIsShowModal(false)}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

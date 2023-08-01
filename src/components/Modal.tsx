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
          <div className="flex justify-end">
            <button
              className="btn-square btn"
              onClick={(e) => props.setIsShowModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {props.children}
        </form>
      </dialog>
    </div>
  );
};

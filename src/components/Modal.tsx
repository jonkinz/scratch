import { useState, useRef } from 'react';
import type { TransitionEvent } from 'react';
// import useKeypress from '~/hooks/useKeypress';
import { useOutsideClick } from '~/hooks/useClickOutside';
import { useIsVisible } from '~/hooks/useIsVisible';
import '../styles/modal.module.css';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: (e: TransitionEvent<HTMLElement>) => void;
  isVisible: boolean;
  setIsShowModal: (isShow: boolean) => void;
  isShowModal: boolean;
};

export const Modal = (props: ModalProps) => {
  const handleClickOutside = () => {
    if (isVisible) {
      console.log('the modal is visible, so close it');
      props.setIsShowModal(false);
    } else {
      console.log('modal is closed, do nothing here');
    }
  };

  const [isVisible, setIsVisible] = useState<boolean>(false);
  // const ref = React.useRef<HTMLInputElement>(null);
  // const dialogRef = useRef<HTMLDivElement>(null);
  // const isVisible = useIsVisible(dialogRef);
  const ref = useOutsideClick(handleClickOutside);

  return (
    <div id="modalContainer">
      <dialog
        id="my_modal_1"
        className={
          'modal h-full w-full ' + (props.isShowModal ? ' modal-open' : '')
        }
        // onTransitionEnd={() => setIsVisible(!isVisible)}
        onTransitionEnd={() => {
          if (!props.isShowModal) {
            console.log('transition over, modeal is CLOSED');
            setIsVisible(false);
          } else {
            console.log('transition over, modal is open');
            setIsVisible(true);
          }
        }}
      >
        {/* <dialog id="my_modal_1" className={"modal modal-open"}> */}
        <form
          ref={ref}
          method="dialog"
          className="modal-box w-11/12 max-w-5xl"
          id="modalBoxForm"
        >
          <div className="flex justify-end">
            <button
              className="btn-square btn"
              onClick={() => props.setIsShowModal(false)}
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

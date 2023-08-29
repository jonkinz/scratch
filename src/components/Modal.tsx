import useOnClickOutside from '~/hooks/useClickOutside';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';
import { useRef } from 'react';
import '../styles/modal.module.css';
// import { useOutsideClick } from '~/hooks/useClickOutsideOld';
import type { MouseEvent } from 'react';
// import { useState, MouseEventHandler } from 'react';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: (isVisible: boolean) => void;
  isVisible: boolean;
  setIsShowModal: (isShow: boolean) => void;
  isShowModal: boolean;
};

// type Event = MouseEvent | TouchEvent;
export const Modal = (props: ModalProps) => {
  const handleCloseModal = (e: Event | MouseEvent) => {
    // modal is visible when the css transition is over, and isShowModal is true
    e.preventDefault();
    console.log('foo');
    if (props.isVisible) {
      setIsShowModal(false);
    }
  };

  const { isVisible, setIsVisible, setIsShowModal, isShowModal } = props;

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(isVisible, ref, handleCloseModal);

  // const ref = useOutsideClick(handleCloseModal);
  const config = { code: 'Escape' };
  useKeyboardShortcut(handleCloseModal, config);

  return (
    <div id="modalContainer">
      <dialog
        id="my_modal_1"
        className={'modal h-full w-full ' + (isShowModal ? ' modal-open' : '')}
        onTransitionEnd={() => {
          if (!isShowModal) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }}
      >
        <div
          ref={ref}
          className="no-scrollbar modal-box w-11/12 max-w-5xl "
          id="modalBox"
        >
          <div className="flex justify-end">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              // onClick={() => setIsShowModal(false)}
              onClick={(e) => handleCloseModal(e)}
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
        </div>
      </dialog>
    </div>
  );
};

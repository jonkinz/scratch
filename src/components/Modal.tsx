import useOnClickOutside from '~/hooks/useClickOutside';
import useKeyboardShortcut from '~/hooks/useKeyboardShortcut';
import { useRef } from 'react';
import '../styles/modal.module.css';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: (isVisible: boolean) => void;
  isVisible: boolean;
  setIsShowModal: (isShow: boolean) => void;
  isShowModal: boolean;
};

export const Modal = (props: ModalProps) => {
  const handleCloseModal = (e: Event) => {
    // modal is visible when the css transition is over, and isShowModal is true
    e.preventDefault();
    if (props.isVisible) {
      props.setIsShowModal(false);
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, handleCloseModal);
  const config = { code: 'Escape' };
  useKeyboardShortcut(handleCloseModal, config);

  return (
    <div id="modalContainer">
      <dialog
        id="my_modal_1"
        className={
          'modal h-full w-full ' + (props.isShowModal ? ' modal-open' : '')
        }
        onTransitionEnd={() => {
          if (!props.isShowModal) {
            props.setIsVisible(false);
          } else {
            props.setIsVisible(true);
          }
        }}
      >
        <div ref={ref} className="modal-box w-11/12 max-w-5xl" id="modalBox">
          <div className="flex justify-end">
            <button
              className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
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
        </div>
      </dialog>
    </div>
  );
};

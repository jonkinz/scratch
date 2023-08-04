import type { TransitionEvent } from 'react';
// import useKeypress from '~/hooks/useKeypress';
import { useOutsideClick } from '~/hooks/useClickOutside';
import '../styles/modal.module.css';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: (e: TransitionEvent<HTMLElement>) => void;
  setIsShowModal: (isShow: boolean) => void;
  isShowModal: boolean;
  isVisible: boolean;
};

export const Modal = (props: ModalProps) => {
  const handleClickOutside = () => {
    if (props.isVisible) {
      props.setIsShowModal(false);
    }
  };
  const ref = useOutsideClick(handleClickOutside);
  return (
    <div id="modalContainer">
      <dialog
        id="my_modal_1"
        className={
          'modal h-full w-full ' + (props.isShowModal ? ' modal-open' : '')
        }
        onTransitionEnd={props.setIsVisible}
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

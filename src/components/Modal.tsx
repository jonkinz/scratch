import type { TransitionEvent } from 'react';
import type { CSSProperties } from 'react';
import type { TransitionEventHandler } from 'react';
// import useKeypress from '~/hooks/useKeypress';
import { useState, useEffect, useRef } from 'react';
import '../styles/modal.module.css';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: (e: TransitionEvent<HTMLElement>) => void;
  setIsShowModal: (isShow: boolean) => void;
  isShowModal: boolean;
};

export const Modal = (props: ModalProps) => {
  const ref = useRef(null);

  // const { onClickOutside } = props;
  //
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       onClickOutside && onClickOutside();
  //     }
  //   };
  //   console.log('test');
  //   document.addEventListener('click', handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside, true);
  //   };
  // }, [onClickOutside]);
  // const [isShow, setIsShow] = useState<boolean>(false);
  // < input type="checkbox" id="my-modal-4" className="modal-toggle" />
  //
  // <label htmlFor="my-modal-4" className="modal cursor-pointer" onTransitionEnd={props.setIsVisible}>
  //
  //   <label className="relative w-11/12 max-w-5xl" htmlFor="">
  //     {props.children}
  //   </label>
  // </label>
  const modalBackground: CSSProperties = {
    position: 'fixed',
    paddingTop: '100px',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    color: 'transparent',
  };

  // z-index: -1;
  //     grid-column-start: 1;
  //     grid-row-start: 1;
  //     display: grid;
  //     align-self: stretch;
  //     justify-self: stretch;
  //     color: transparent;
  // }

  return (
    <div id="modalContainer" ref={ref}>
      {/*   style={modalBackground} */}
      {/*   className="modal-backdrop2 dashboard" */}
      {/*   onClick={(e) => props.setIsShowModal(false)} */}
      {/*   onTransitionEnd={props.setIsVisible} */}
      {/* > */}
      {/*   <button onClick={(e) => props.setIsShowModal(false)}>close</button> */}
      {/*   clse */}
      {/* </div> */}
      {/* Open the modal using ID.showModal() method */}
      <dialog
        id="my_modal_1"
        className={
          'modal h-full w-full ' + (props.isShowModal ? ' modal-open' : '')
        }
        onClick={(e) => props.setIsShowModal(false)}
        onTransitionEnd={props.setIsVisible}
      >
        {/* <dialog id="my_modal_1" className={"modal modal-open"}> */}
        <form
          method="dialog"
          className="modal-box w-11/12 max-w-5xl"
          id="modalBoxForm"
        >
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

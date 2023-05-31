import { useRef, useEffect, useState, useCallback, RefObject, SyntheticEvent } from 'react';

type ModalProps = {
  children: React.ReactNode; //👈 children prop typr
  setIsVisible: () => void;
};

export const Modal = (props: ModalProps) => {

  return (
    <>
      {/* The button to open modal */}
      {/* < label htmlFor="my-modal-4" className="btn" > open modal</label > */}

      {/* Put this part before </body> tag */}
      < input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer" onTransitionEnd={props.setIsVisible}>

        <label className="modal-box relative w-11/12 max-w-5xl" htmlFor="">
          {props.children}
        </label>
      </label>
    </>
  );
};

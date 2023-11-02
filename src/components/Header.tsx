import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    // <header className="navbar bg-primary text-primary-content">
    <header className="sticky top-0 z-10 bg-teal-700 text-white">
      {/* <div className="flex-1 pl-5 text-3xl font-bold"> */}
      {/* Note Taker */}
      {/* {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ''} */}
      {/* </div> */}
      <section className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <h1 className="text-3xl font-medium">
          <a href="#hero" className="href">
            {/* 📓 Note Taker */}
            {/* 📙 Note Taker 📘📖 */}
            📘 Note Taker
          </a>
        </h1>
        <div>
          <button
            id="mobile-open-button"
            className="text-3xl focus:outline-none sm:hidden"
          >
            &#9776;
          </button>
          <nav className="hidden space-x-8 text-xl sm:block" aria-label="main">
            <a href="#rockets" className="hover:opacity-90">
              rockets
            </a>
            <a href="#contact" className="hover:opacity-90">
              contact
            </a>
            <a href="#tesimonials" className="hover:opacity-90">
              testimonials
            </a>
          </nav>
        </div>
      </section>
      {/* <div className="flex-none gap-2"> */}
      {/*   <div className="dropdown dropdown-end"> */}
      {/*     {sessionData?.user ? ( */}
      {/*       <div className="tooltip tooltip-left" data-tip="Sign Out"> */}
      {/*         <label */}
      {/*           tabIndex={0} */}
      {/*           className="avatar btn btn-circle btn-ghost" */}
      {/*           onClick={() => void signOut()} */}
      {/*         > */}
      {/*           <div className="w-10 rounded-full"> */}
      {/*             <Image */}
      {/*               src={sessionData?.user?.image ?? ''} */}
      {/*               alt={sessionData?.user?.name ?? ''} */}
      {/*               width={56} */}
      {/*               height={56} */}
      {/*             /> */}
      {/*           </div> */}
      {/*         </label> */}
      {/*       </div> */}
      {/*     ) : ( */}
      {/*       <button */}
      {/*         className="btn btn-ghost rounded-btn" */}
      {/*         onClick={() => void signIn()} */}
      {/*       > */}
      {/*         Sign in */}
      {/*       </button> */}
      {/*     )} */}
      {/*   </div> */}
      {/* </div> */}
    </header>
  );
};

import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { api, type RouterOutputs } from '../utils/api';
import { Header } from '~/components/Header';
import { NoteEditor } from '~/components/NoteEditor';
import { NoteCard } from '~/components/NoteCard';
import { Modal } from '~/components/Modal';
import { TopicSelector } from '~/components/TopicSelector';
import { LoadingPage } from '~/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker 2</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <section
          data-theme="summer"
          id="appContainer"
          className="container m-auto h-screen"
        >
          <Header />
          {/* <qtatusBar /> */}
          <Content />
          <footer className="sticky bottom-0 h-1 bg-white" />
        </section>
      </main>
    </>
  );
};

export default Home;

// type Topic = RouterOutputs["topic"]["getAll"][0];
// Chirp tutorial uses
type Topic = RouterOutputs['topic']['getAll'][number];
// daniel bark video
type Note = RouterOutputs['note']['getAll'][0];

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const {
    data: topics,
    refetch: refetchTopics,
    isLoading: isTopicsLoading,
    status,
    fetchStatus,
  } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const { mutate: createTopic, isLoading: isCreatingTopic } =
    api.topic.create.useMutation({
      onSuccess: (data) => {
        toast.success('topic created!');
        void refetchTopics();
        setSelectedTopic(selectedTopic ?? data ?? null);
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error('Could not create topic');
        }
      },
    });

  const { mutate: deleteTopic, isLoading: isDeletingTopic } =
    api.topic.delete.useMutation({
      onSuccess: () => {
        toast.success('topic deleted');
        setSelectedTopic(null);
        void refetchTopics();
      },
    });

  const {
    refetch: refetchNotes,
    data: notes,
    isLoading: isNotesLoading,
  } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? '',
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  // const { getNoteByid } = api.note.getById.useQuery({
  //   note: note.id,
  // }).data;

  const { mutate: createNote, isLoading: isCreatingNote } =
    api.note.create.useMutation({
      onSuccess: (data) => {
        void refetchNotes();
        void refetchTopics();
        setSelectedNote(selectedNote ?? data ?? null);
        toast.success('note created!');
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.title;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error('Failed to create note! Please try again later.');
        }
      },
    });

  const { mutate: updateNote, isLoading: isUpdatingNote } =
    api.note.update.useMutation({
      onSuccess: () => {
        toast.success('note updated!');
        void refetchNotes();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.title;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error('Failed to create note! Please try again later.');
        }
      },
    });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const handleClick = (event: React.MouseEvent, topic: Topic) => {
    event.preventDefault();
    setSelectedTopic(topic);
  };

  const Topics = () => {
    // if ('fetching' === fetchStatus || isTopicsLoading) {
    // return <div className="flex grow">{/* <LoadingPage /> */}</div>;
    // }
    return (
      <>
        {topics?.length ? (
          <ul className="menu rounded-box w-56 bg-base-100 p-2">
            {topics?.map((topic) => (
              <li key={topic.id} style={{ height: '40px' }}>
                <div id="topicDiv" className="grid grid-cols-2 gap-2">
                  <div className="justify-self-stretch">
                    <TopicSelector
                      handleClick={(event, topic) => {
                        handleClick(event, topic);
                      }}
                      topic={topic}
                      isSelected={topic.id === selectedTopic?.id}
                    />
                  </div>
                  <div className="justify-self-end">
                    <button
                      onClick={() => {
                        deleteTopic({ id: topic.id });
                      }}
                      className="btn btn-warning btn-xs px-5"
                    >
                      delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  };

  const Notes = () => {
    return (
      <div>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="mt-5">
              <NoteCard
                note={note}
                onDelete={() => {
                  deleteNote.mutate({ id: note.id });
                }}
                editNote={(note) => {
                  setSelectedNote(note);
                  setIsShowModal(true);
                }}
              />
            </div>
          ))
        ) : (
          <>
            <span>You don&apos;t have any notes on </span>
            <span className="font-bold">{selectedTopic?.name}</span>
          </>
        )}
      </div>
    );
  };

  const CreateTopicButton = () => {
    return (
      <input
        type="text"
        // ref={ref}
        placeholder="New Topic"
        className="input input-bordered input-sm w-full"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            createTopic({
              name: e.currentTarget.value,
            });
            e.currentTarget.value = '';
          }
        }}
      />
    );
  };

  const Hero = () => {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Notetaker</h1>
            <p className="py-6">Please login to see your notes</p>
          </div>
        </div>
      </div>
    );
  };

  type AddNoteButtonProps = {
    id?: string;
    styleClass?: string;
    buttonLabel?: string;
  };

  const AddNoteButton = ({
    id = '',
    styleClass = '',
    buttonLabel = 'Add Note',
  }: AddNoteButtonProps) => {
    return (
      <button
        id={id}
        className={`btn btn-primary btn-outline ${styleClass}`}
        onClick={(): void => {
          setSelectedNote(null);
          setIsShowModal(true);
        }}
      >
        {buttonLabel}
      </button>
    );
  };

  // Is the note editor modal currently visible?
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Has the 'Add Note' button been clicked?
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const handleIsModalVisible = (isVisible: boolean) => {
    setIsModalVisible(isVisible);
  };

  const isShowLoading =
    isUpdatingNote || isCreatingNote || isCreatingTopic || isDeletingTopic;

  return (
    <>
      <div tabIndex={0}>
        <div className="h-4 w-full"></div>
        {/* only show app page if there's a session */}
        {sessionData ? (
          <div id="mainDiv" className="">
            {/* if there are no topics / notes, just show an add note button */}
            {topics && topics?.length > 0 ? (
              <div className="container m-auto grid grid-cols-3  gap-4 md:grid-cols-5 lg:grid-cols-8">
                <div
                  id="leftOptions"
                  className="tile col-span-1 md:col-span-2 lg:col-span-3"
                >
                  <CreateTopicButton />
                  <div className="h-4 w-full"></div>
                  <Topics />
                </div>
                <div
                  id="rightDiv"
                  className=" tile col-span-2 md:col-span-3 lg:col-span-5"
                >
                  {selectedTopic && <AddNoteButton />}
                  {selectedTopic && <Notes />}
                </div>
              </div>
            ) : (
              <div
                id="centerButtonDiv"
                className="flex h-80 items-center justify-center"
              >
                <AddNoteButton
                  id="addNoteButton"
                  styleClass="btn-wide btn-lg"
                />
              </div>
            )}
            {/* {topics && topics.length > 0 && ( */}
            {/*   <div id="rightDiv" className="col-span-7"> */}
            {/*     {selectedTopic && <AddNoteButton />} */}
            {/*     {selectedTopic && <Notes />} */}
            {/*   </div> */}
            {/* )} */}
            {isShowLoading && (
              <div className="flex items-center justify-center">
                <LoadingPage />
              </div>
            )}

            <Modal
              setIsVisible={handleIsModalVisible}
              isVisible={isModalVisible}
              setIsShowModal={setIsShowModal}
              isShowModal={isShowModal}
            >
              <NoteEditor
                topics={topics}
                isOpen={isModalVisible}
                note={selectedNote}
                onSave={({ newTopic, topic, title, content }) => {
                  if (selectedNote) {
                    // update note if there is a selected note
                    updateNote({
                      id: selectedNote.id,
                      title,
                      content,
                      // topicId: selectedTopic?.id ?? '',
                      topicId: topic ?? '',
                    });
                  } else {
                    createNote({
                      title,
                      content,
                      // topicId: selectedTopic?.id ?? '',
                      topicId: topic ?? '',
                      topicName: newTopic,
                    });
                  }
                }}
              />
            </Modal>
          </div>
        ) : (
          <Hero />
        )}
      </div>
    </>
  );
};

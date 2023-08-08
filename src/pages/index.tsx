import { useState } from 'react';
import type { TransitionEvent } from 'react';
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
import StatusBar from '~/components/StatusBar';
import { FormikTest } from '~/components/FormTest';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker 2</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <StatusBar />
        <Content />
      </main>
    </>
  );
};

export default Home;

// type Topic = RouterOutputs["topic"]["getAll"][0];
// Chirp tutorial uses
type Topic = RouterOutputs['topic']['getAll'][number];
// daniel bark video

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

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

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
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

  const deleteTopic = api.topic.delete.useMutation({
    onSuccess: () => {
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

  const getNoteById = api.note.getById.useQuery('clhnuouv60001ml082drg4grb', {
    enabled: sessionData?.user !== undefined,
  });

  // const createNote = api.note.create.useMutation({
  const { mutate, isLoading: isCreatingNote } = api.note.create.useMutation({
    onSuccess: () => {
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
    // console.log(fetchStatus);
    if ('fetching' === fetchStatus || isTopicsLoading) {
      console.log('topics loading');
      return (
        <div className="flex grow">
          <LoadingPage />
        </div>
      );
    }

    if (isTopicsLoading || isNotesLoading) {
      console.log('topics or notest are loading');
      return <div>Loading</div>;
    }

    return (
      <ul className="menu rounded-box w-56 bg-base-100 p-2">
        {topics?.map((topic) => (
          <li key={topic.id}>
            <div className="grid grid-cols-5 gap-3">
              <TopicSelector
                handleClick={(event, topic) => {
                  handleClick(event, topic);
                }}
                topic={topic}
                isSelected={topic.id === selectedTopic?.id}
              />
              <div className="col-span-1">
                <button
                  onClick={() => {
                    deleteTopic.mutate({ id: topic.id });
                  }}
                  className="btn-warning btn-xs btn px-5"
                >
                  delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
              />
            </div>
          ))
        ) : (
          <>
            <span>You don&apos;t have any notes on </span>
            <span className="font-bold">{selectedTopic?.title}</span>
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
        className="input-bordered input input-sm w-full"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            createTopic.mutate({
              title: e.currentTarget.value,
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
            {/* <button className="btn btn-primary">Get Started</button> */}
          </div>
        </div>
      </div>
    );
  };

  // Is the note editor modal currently visible?
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Has the 'Add Note' button been clicked?
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  // 'isModalVisible' prop should be toggled when the transition event is 'transform'. This allows
  // me to set the focus on the modal's input.
  const handleShowModal = (e: TransitionEvent<HTMLElement>) => {
    // e.preventDefault();
    // console.log(e.propertyName);
    // if (e.propertyName === 'transform') {
    //   // console.log(e);
    //   setIsModalVisible((isModalVisible) => {
    //     return !isModalVisible;
    //   });
    // }
  };

  return (
    <>
      <div tabIndex={0}>
        {/* <FormikTest /> */}
        {sessionData ? (
          <div className="mx-5 mt-5 grid grid-cols-2 gap-2">
            <div id="leftOptions" className="col-span-1 px-2">
              <CreateTopicButton />
              <div className="divider"></div>
              <Topics />
            </div>
            <div id="rightDiv" className="col-span-1">
              {selectedTopic && (
                <button
                  className="btn"
                  onClick={(): void => {
                    setIsShowModal(true);
                  }}
                >
                  Add Note
                </button>
              )}

              <Notes />
            </div>

            {isCreatingNote && (
              <div className="flex items-center justify-center">
                <LoadingPage />
              </div>
            )}
            <Modal
              setIsVisible={handleShowModal}
              isVisible={isModalVisible}
              setIsShowModal={setIsShowModal}
              isShowModal={isShowModal}
            >
              <NoteEditor
                isOpen={isModalVisible}
                onSave={({ title, content }) => {
                  mutate({
                    title,
                    content,
                    topicId: selectedTopic?.id ?? '',
                  });
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

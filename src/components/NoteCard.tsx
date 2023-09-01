import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { type RouterOutputs } from '../utils/api';
import { api } from '../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  NOTE_CARD_CONTENT_LENGTH,
  NOTE_CARD_TOPIC_LENGTH,
  NOTE_CARD_TITLE_LENGTH,
} from '~/constants';
import { truncate } from '~/utils/utils';
dayjs.extend(relativeTime);
type Note = RouterOutputs['note']['getAll'][0];

export const NoteCard = ({
  note,
  onDelete,
  editNote,
}: {
  note: Note;
  onDelete: () => void;
  editNote: (note: Note) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const topic = api.topic.getTopicById.useQuery({
    topicId: note.topicId,
  }).data;
  const topicName = topic?.name ?? '';
  const truncTitle = truncate(note.title, NOTE_CARD_TITLE_LENGTH);
  const truncTopic = truncate(topicName, NOTE_CARD_TOPIC_LENGTH);
  const truncContent = truncate(note.content, NOTE_CARD_CONTENT_LENGTH);
  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse-arrow ${
            isExpanded ? 'collapse-open' : ''
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title flex justify-between text-xl font-bold">
            <div>{truncTitle}</div>
            <div>{truncTopic}</div>
          </div>
          {/* <div className=" text-xl font-bold">{topic?.name}</div> */}
          <span className="font-thin">
            {` · ${dayjs(note.createdAt).fromNow()}`}
          </span>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              {/* <div className="">{!topic?.name}</div> */}
              <ReactMarkdown>{truncContent}</ReactMarkdown>
            </article>
          </div>
        </div>

        <div className="card-actions mx-2 flex justify-between">
          <button
            className="btn btn-warning btn-xs  px-5"
            onClick={() => editNote(note)}
          >
            Edit Note
          </button>
          <button className="btn btn-warning btn-xs  px-5" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

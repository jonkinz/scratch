import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { type RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
// import * as dayjs from 'dayjs'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
type Note = RouterOutputs["note"]["getAll"][0];
type Topic = RouterOutputs["topic"]["getAll"][0];


// const ProfileFeed = (props: { userId: string }) => {
//   const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
//     userId: props.userId,
//   });

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const topic = api.topic.getTopicById.useQuery({
    topicId: note.topicId,
  }).data;

  if (topic) {

    // console.log(topic)
  }

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse-arrow ${isExpanded ? "collapse-open" : ""
            } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title text-xl font-bold">{note.title}</div>
          <span
            className="font-thin"
          >
            {` · ${dayjs(
              note.createdAt
            ).fromNow()}`}
          </span>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">

              <div className="">{!topic?.title}</div>
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        <div className="card-actions mx-2 flex justify-end">
          <button className="btn-warning btn-xs btn px-5" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

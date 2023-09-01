// import React from 'react'; // we need this to make JSX compile

import { type RouterOutputs } from '../utils/api';

type Topic = RouterOutputs['topic']['getAll'][0];
import { NOTE_CARD_TOPIC_LENGTH } from '~/constants';
import { truncate } from '~/utils/utils';

interface TopicSelectorProps {
  handleClick: (
    event: React.MouseEvent<Element, MouseEvent>,
    topic: Topic
  ) => void;
  topic: Topic;
  isSelected: boolean;
}

export const TopicSelector = ({
  handleClick,
  topic,
  isSelected,
}: TopicSelectorProps) => {
  const truncTopic = truncate(topic.name, NOTE_CARD_TOPIC_LENGTH);
  return (
    <a
      id="topicAnchor"
      className={isSelected ? 'col-span-4 bg-sky-950' : 'col-span-4'}
      href="#"
      onClick={(event) => handleClick(event, topic)}
    >
      {truncTopic}
    </a>
  );
};

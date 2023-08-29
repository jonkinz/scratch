import React from 'react'; // we need this to make JSX compile

import { api, type RouterOutputs } from '../utils/api';

type Topic = RouterOutputs['topic']['getAll'][0];

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
  return (
    <a
      id="topicAnchor"
      className={isSelected ? 'col-span-4 bg-sky-950' : 'col-span-4'}
      href="#"
      onClick={(event) => handleClick(event, topic)}
    >
      {topic.name}
    </a>
  );
};

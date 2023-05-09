import React from 'react'; // we need this to make JSX compile

import { api, type RouterOutputs } from "../utils/api";

type Topic = RouterOutputs["topic"]["getAll"][0];


// type TopicSelectorProps = {
//   handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
//   topic: Topic;
// };

interface TopicSelectorProps {
  // handleClick: () => void;
  handleClick: (event: React.MouseEvent<Element, MouseEvent>, topic: Topic) => void;
  topic: Topic;
  isSelected: boolean;
}

export const TopicSelector = ({ handleClick, topic, isSelected }: TopicSelectorProps) => {

  return (

    <a
      id="topicAnchor"

      // className={"col-span-4 bg-indigo-400 "}
      className={isSelected ? "col-span-4 bg-sky-400" : "col-span-4"}
      href="#"
      onClick={(event) => handleClick(event, topic)}
    // onClick={(evt) => {
    //   // evt.preventDefault();
    //   // // console.log(`topic set to ${topic.title}`)
    //   // // console.log(topic)
    //   // handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>);
    //   // // setIsActive(isActive => !isActive);
    //   // if (topic.id === selectedTopic?.id) {
    //   //   console.log(`topic is same as selected topic!!!`)
    //   // }
    //   // else {
    //   //   console.log(topic);
    //   //   console.log(selectedTopic);
    //   // }
    // }}
    >
      {topic.title}
    </a>
  )
}



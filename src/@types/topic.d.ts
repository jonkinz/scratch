// @types.todo.ts
export interface ITopic {
  id: number;
  title: string;
  description: string;
  status: boolean;
}
export type TopicContextType = {
  // todos: ITopic[];
  // saveTopic: (todo: ITopic) => void;
  // updateTopic: (id: number) => void;
  createTopic: (name: string) => void;
};

export interface TopicEntity {
  time: string;
  title: string;
}

export interface ModuleEntity {
  id: string;
  title: string;
  time: string;
  topics: TopicEntity[];
}

export interface CourseScrap {
  id: number;
  title: string;
  url: string;
  modules: ModuleEntity[];
}

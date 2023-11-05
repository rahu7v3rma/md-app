type Block = {
    name: string;
    icon: string;
    locked: boolean;
    description: string;
};

type Lesson = {
    id: number;
    title: string;
    icon: string;
};

export type UserBlock = {
    is_completed: boolean;
    order: number;
    block: Block;
    user_lessons: UserLesson[];
};

export type UserLesson = {
    lesson: Lesson;
    is_completed: boolean;
    order: number;
};

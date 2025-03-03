export type Log = {
    UserDrink: boolean;
};

export type DailyLog = {
    [key: string]: Log;
};

export type NotificationListResponse = {
    count: number;
    has_next: boolean;
    has_previous: boolean;
    list: Notification[];
    next_page_number: any;
};

export type Notification = {
    type: string;
    payload: string | null;
    date_time: string;
    description: string;
    id: number;
    read_flag: boolean;
    title: string;
};

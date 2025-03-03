import {
    Attachment,
    Channel,
    ChannelMemberResponse,
    StreamChat,
    UserResponse
} from 'stream-chat';

import { EditLogBlood } from '@/types/log';

export const MockData: any = {
    journey: [
        {
            is_completed: false,
            order: 1,
            block: {
                name: 'cs 101',
                icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/cs101.png',
                locked: false,
                description:
                    'Discover how to eliminate anxiety about what you put in your mouth'
            },
            user_lessons: [
                {
                    is_completed: false,
                    order: 1,
                    lesson: {
                        id: 1,
                        title: 'programming',
                        icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/programming.png'
                    }
                },
                {
                    is_completed: true,
                    order: 2,
                    lesson: {
                        id: 2,
                        title: 'db',
                        icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/db.png'
                    }
                }
            ]
        },
        {
            is_completed: false,
            order: 2,
            block: {
                name: 'cs 102',
                icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/cs101.png',
                locked: false,
                description:
                    'Discover how to eliminate anxiety about what you put in your mouth'
            },
            user_lessons: [
                {
                    is_completed: false,
                    order: 1,
                    lesson: {
                        id: 1,
                        title: 'programming',
                        icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/programming.png'
                    }
                },
                {
                    is_completed: false,
                    order: 2,
                    lesson: {
                        id: 2,
                        title: 'db',
                        icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/db.png'
                    }
                }
            ]
        },
        {
            is_completed: false,
            order: 3,
            block: {
                name: 'cs 103',
                icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/cs102.png',
                locked: true,
                description:
                    'Discover how to eliminate anxiety about what you put in your mouth'
            },
            user_lessons: [
                {
                    is_completed: false,
                    order: 1,
                    lesson: {
                        id: 3,
                        title: 'algorithms',
                        icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/algorithms.png'
                    }
                },
                {
                    is_completed: false,
                    order: 2,
                    lesson: {
                        id: 4,
                        title: 'patterns',
                        icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/patterns.png'
                    }
                }
            ]
        }
    ],
    activeBlock: {
        is_completed: false,
        order: 1,
        block: {
            name: 'cs 101',
            icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/cs101.png',
            locked: false,
            description:
                'Discover how to eliminate anxiety about what you put in your mouth'
        },
        user_lessons: [
            {
                is_completed: false,
                order: 1,
                lesson: {
                    id: 1,
                    title: 'programming',
                    icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/programming.png'
                }
            },
            {
                is_completed: true,
                order: 2,
                lesson: {
                    id: 2,
                    title: 'db',
                    icon: 'https://bh-md-static-37458bd29d6a2cf3.s3.amazonaws.com/db.png'
                }
            }
        ]
    },
    logTabData: [
        {
            icon: '<svg> </svg> ',
            id: 1,
            screen: 'LogBlood',
            title: 'Log Blood Glucose',
            type: 'UserGlucose'
        },
        {
            id: 2,
            icon: '<svg> </svg> ',
            title: 'Log Hydration',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        },
        {
            id: 3,
            icon: '<svg> </svg> ',
            title: 'Log Hydration3',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        },
        {
            id: 4,
            icon: '<svg> </svg> ',
            title: 'Log Hydration4',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        },
        {
            id: 5,
            icon: '<svg> </svg> ',
            title: 'Log Hydration5',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        },
        {
            id: 6,
            icon: '<svg> </svg> ',
            title: 'Log Hydration6',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        },
        {
            id: 7,
            icon: '<svg> </svg> ',
            title: 'Log Hydration7',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        }
    ],
    dailyCompletedTasks: {
        UserDrink: false,
        UserExercise: false,
        UserFast: true,
        UserGlucose: true,
        UserInsulin: true,
        UserLesson: false,
        UserMedication: true,
        UserWeight: false
    },
    pickerValues: {
        hydration: {},
        weight: {},
        glucose: {},
        medication: {},
        insulin: {},
        exercise: {}
    }
};

export const mockContentReducerState = {
    loading: false,
    navigationKey: '',
    journey: [
        {
            is_completed: false,
            order: 1,
            block: {
                name: 'block1',
                icon: '/media/75beddf6-e8e1-4a0c-aaf3-7890c94f8aab.png',
                locked: false,
                description: 'description1'
            },
            user_lessons: [
                {
                    lesson: {
                        id: 1,
                        title: 'lesson1',
                        icon: '/media/b27dd75e-43fb-4200-add0-50020abe0b06.png'
                    },
                    is_completed: true,
                    order: 1
                },
                {
                    lesson: {
                        id: 2,
                        title: 'lesson2',
                        icon: '/media/332cc47d-9200-4f53-8909-b9a07f59ce00.png'
                    },
                    is_completed: false,
                    order: 2
                },
                {
                    lesson: {
                        id: 3,
                        title: 'lesson3',
                        icon: '/media/90425ab2-931b-41d3-bcd0-e44ada75c60f.png'
                    },
                    is_completed: false,
                    order: 3
                }
            ]
        }
    ]
};

export const mockContentSelector = {
    loading: false,
    activeLesson: {
        lesson: {
            id: 2,
            title: 'lesson2',
            icon: '/media/332cc47d-9200-4f53-8909-b9a07f59ce00.png'
        },
        is_completed: false,
        order: 2
    },
    activeBlock: {
        is_completed: false,
        order: 1,
        block: {
            name: 'block1',
            icon: '/media/75beddf6-e8e1-4a0c-aaf3-7890c94f8aab.png',
            locked: false,
            description: 'description1'
        },
        user_lessons: [
            {
                lesson: {
                    id: 1,
                    title: 'lesson1',
                    icon: '/media/b27dd75e-43fb-4200-add0-50020abe0b06.png'
                },
                is_completed: false,
                order: 1
            },
            {
                lesson: {
                    id: 2,
                    title: 'lesson2',
                    icon: '/media/332cc47d-9200-4f53-8909-b9a07f59ce00.png'
                },
                is_completed: true,
                order: 2
            }
        ]
    }
};

export const logItem: EditLogBlood = {
    type: 'UserLesson',
    id: 1,
    log_time: '',
    amount: 0,
    unit: '',
    measurement_type: ''
};

export const mockAttachment: Attachment = {
    image_url:
        'https://us-east.stream-io-cdn.com/1237334/images/bbc8c8f0-fd25-48b3-8967-bd256bc5eb1b.anime.png?Key-Pair-Id=APKAIHG36VEWPDULE23Q&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly91cy1lYXN0LnN0cmVhbS1pby1jZG4uY29tLzEyMzczMzQvaW1hZ2VzL2JiYzhjOGYwLWZkMjUtNDhiMy04OTY3LWJkMjU2YmM1ZWIxYi5hbmltZS5wbmc~Km9oPTIyNCpvdz0yMjQqIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjk4NzQwNTg0fX19XX0_&Signature=Rdm3s~09cXNa5NxdRZH2RGk0~MByiEytIEt6~GzkQN2cuOrNr8OPTxj1kEFFpY8rQYIIVyJ6Edp-Fz4OyWepBqEAIYXURYnof~syP4sdQT84hsowJbxuh1fQUuQPB3MVq6lxL3cKIkRFemTrSdTXS~dr6Uxmoo7xT8~5h6hp9JN2i19UWUSac-8QBeObyHvCqLPpicx3NTkQHKrjDEifrhROhWfspbaGJJPQ52D168XvGE3YgIsZhsur0sXdooVJYl4Nc2kh9tIH35cbS9d6Y5oAQsFLDFZiRgh-C1zjDroAL-F1rtZ~25mxhnlgDyN6CJNCB4R5B4-Oxehps-nGTw__&oh=224&ow=224',
    mime_type: 'image/png',
    originalFile: {
        extension: null,
        fileSize: 14380,
        filename: 'anime.png',
        height: 225,
        playableDuration: null,
        source: 'picker',
        uri: 'ph://6F90DC2A-FCC2-4512-9B37-1BC0DB175580/L0/001',
        width: 225
    },
    original_height: 224,
    original_width: 224,
    type: 'giphy'
};
export const currentUser: UserResponse = {
    id: '1ba586c0b89202f7307b61f1229330978a843afc98589ffc6a62f209225d3528',
    role: 'customer',
    created_at: '2023-02-28T21:11:55.069783Z',
    updated_at: '2023-09-04T11:19:39.641563Z',
    last_active: '2023-10-06T17:15:26.915989907Z',
    banned: false,
    online: true,
    invisible: false,
    devices: [],
    mutes: [],
    channel_mutes: [],
    unread_count: 0,
    total_unread_count: 0,
    unread_channels: 0,
    language: '',
    name: 'Test User 1',
    image: null
};

export const members: Record<string, ChannelMemberResponse> = {
    '1ba586c0b89202f7307b61f1229330978a843afc98589ffc6a62f209225d3528': {
        user_id:
            '1ba586c0b89202f7307b61f1229330978a843afc98589ffc6a62f209225d3528',
        user: {
            id: '1ba586c0b89202f7307b61f1229330978a843afc98589ffc6a62f209225d3528',
            role: 'customer',
            created_at: '2023-02-28T21:11:55.069783Z',
            updated_at: '2023-09-04T11:19:39.641563Z',
            last_active: '2023-10-06T16:49:52.895391019Z',
            banned: false,
            online: true,
            name: 'Test User 1',
            image: null
        },
        created_at: '2023-03-18T18:07:35.050513Z',
        updated_at: '2023-03-18T18:07:35.050513Z',
        banned: false,
        shadow_banned: false,
        role: 'member',
        channel_role: 'channel_member'
    },
    e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9: {
        user_id:
            'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9',
        user: {
            id: 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9',
            role: 'coach',
            created_at: '2023-02-28T20:53:38.035486Z',
            updated_at: '2023-09-04T11:19:47.822109Z',
            last_active: '2023-10-03T20:24:58.357617Z',
            banned: false,
            online: false,
            name: 'Coach Coach Test Coach 1',
            image: 'coach image'
        },
        created_at: '2023-03-18T18:07:35.050513Z',
        updated_at: '2023-03-18T18:07:35.050513Z',
        banned: false,
        shadow_banned: false,
        role: 'owner',
        channel_role: 'channel_member'
    }
};

export class ChannelGenerator {
    channel: Channel | null;
    _client: StreamChat | undefined;
    user_id: string;
    chatProfile_token: string;

    constructor(
        _client: StreamChat,
        user_id: string,
        chatProfile_token: string
    ) {
        this._client = _client;
        this.channel = null;
        this.user_id = user_id;
        this.chatProfile_token = chatProfile_token;
    }

    async initChannel() {
        if (this._client) {
            await this._client.connectUser(
                { id: this.user_id },
                this.chatProfile_token
            );
            let channels = await this._client.queryChannels({
                members: { $in: [this.user_id] }
            });
            this.channel = channels[0];
        }
    }

    setName(name: string) {
        if (this.channel?.data) {
            this.channel.data.name = name;
        }
    }

    setImage(image: string) {
        if (this.channel?.data) {
            this.channel.data.image = image;
        }
    }

    setMembers(_members: Record<string, ChannelMemberResponse>) {
        if (this.channel?.state) {
            this.channel.state.members = _members;
        }
    }
}

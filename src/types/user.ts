export type UserInfo = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
};

export type UserProfile = {
    diabetes_type: string | null;
    image: string | null;
    onboarding_form_url: string | null;
    preferred_units: string;
};

export type UserChatProfile = {
    apiKey: string;
    token: string;
    userId: string;
    firebasePushProviderName: string;
};

export type SearchUserList = {
    id: string;
    name: string;
    message: string;
    time: string;
};

export type CoachInfo = {
    first_name: string;
    last_name: string;
    profile_image: string | null;
    chat_id: string;
};

export type Group = {
    id: string;
    name: string;
    chat_id: string;
};

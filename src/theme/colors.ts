// theme colors
const PRIMARY = '#72996B';
const PRIMARY_LIGHT = '#D3E29F40';
const BACKGROUND = '#F5F5F5';
const SHEET_BACKGROUND_COLOR = 'rgba(0,0,0,0.5)';
const BACKGROUND_LIGHTEST = '#FAFAFF';
const LOG_PAGE_BACKGROUND_COLOR = '#f5f4ee';

// INPUT
const INPUT = '#D3E6F8';
const INPUT_BG = '#EEF4FA';
const INPUT_ERROR_BG = '#FFECEC';
const INPUT_ERROR_BORDER = '#F9D4D4';
const INPUT_ERROR_PLACEHOLDER = '#D05151';
const INPUT_BORDER = '#D3E29F';

// PROGRESS BAR
const PROGRESS_BAR_FILL = '#4DBA0B';
const PROGRESS_BAR_FILL_BORDER = '#3A9A00';
const PROGRESS_BAR_ACTIVITY_INDICATOR = PRIMARY;
const PROGRESS_BAR_FILL_GREEN = '#72996B';
const PROGRESS_BAR_FILL_DISABLE = '#BFC4C9';
const PROGRESS_BAR_TRACK_GREEN = '#EDF0DA';

// PROGRESS CIRCLE
const PROGRESS_CIRCLE_COLOR = '#f00';
const PROGRESS_CIRCLE_SHADOW_COLOR = '#999';
const PROGRESS_CIRCLE_BG_COLOR = '#e9e9ef';
const PROGRESS_CIRCLE_START_BALL_COLOR = '#72996B';
const PROGRESS_CIRCLE_START_BALL_DISABLE_COLOR = '#BDBECA';
const PROGRESS_CIRCLE_INNER_BALL_COLOR = '#5B37BE';
const PROGRESS_CIRCLE_INNER_BALL_DISABLE_COLOR = '#A4AAAF';

// SLIDER
const SLIDER_BG = 'rgba(120, 120, 128, 0.32)';

// BUTTON
const BUTTON_BORDER = '#D3E6F8';
const GREEN_CHECK_DARK = '#D3E6F8';
const BUTTON_LIGHTER_BORDER = '#f4f8e7';
const BUTTON_LIGHTER_BACKGROUND = '#f4f8e7';
const BUTTON_PRIMARY_BORDER = '#5A3DBF';
const BUTTON_DISABLED_BG = '#cccccc';
const BUTTON_DISABLED_BORDER = '#D6D6D6';
const BUTTON_IMAGE_BACKGROUND = '#F0E957';
const BUTTON_ICON_BACKGROUND = '#D3E29F40';
const BUTTON_RED_BACKGROUND = '#B16663';
const BUTTON_SUCCESS_BACKGROUND = '#4DBA0B';
const BUTTON_GREEN_BACKGROUND = '#72996B';
const BUTTON_WHITE_BACKGROUND = '#FFFFFF';
const BUTTON_DARK_RED_BACKGROUND = '#CD4049';

const TEXT_BLACK = '#271A51'; // more of a dark-blue
const TEXT_DARK_BLACK = '#1F1E22';
const TEXT_BLACK_GRAY = '#4D4F4D';
const TEXT_GRAY_BLACK = '#4D4F4D';
const TEXT_WHITE = '#FFFFFF';
const TEXT_GREEN = '#72996B';
const TEXT_CHARCOAL = '#4D4F4D';
const TEXT_DUSKY_OLIVE = '#847F60';
const TEXT_ERROR = '#D05151';
const TEXT_LIGHTER = 'rgba(235, 235, 245, 0.6)';
const TEXT_DISABLED = '#D6D6D6';
const TEXT_GRAY = '#A4AAAF';
const TEXT_GRAY_BASE = '#58595A';
const TEXT_PRIMARY = PRIMARY;
const TEXT_PURPLE = '#6E51D0';
const TEXT_LINK = '#3ED1FF';
const TEXT_DARK_GREEN = '#72996B';
const TEXT_DARKER = '#4D4F4D';
const TEXT_MAIN_DARKER = '#4D4F4D';

//ICONS
const EYE_ICON = '#6E51D0';
const EYE_ICON_GREEN = '#72996B';
const EYE_ICON_ERROR_BORDER = '#D05151';
const GREEN_CHECK_MARK = '#4DBA0B';

// toast messages
const ERROR_BACKGROUND = '#D05151';
const SUCCESS_BACKGROUND = '#4DBA0B';
const INFO_BACKGROUND = '#A4AAAF';

//Modals
const MODAL_BACKDROP = 'rgba(0,0,0,0.5)';
const MODAL_CLOSE_HANDLE = '#F5F8FB';
const MODAL_ITEM_DIVIDER = '#E6E8EC';

//EXTRAS
const SUCCESS_LIGHTEST = '#ECF8E6';
const SUCCESS_LIGHTER = '#DFEED8';
const DARK_CHARCOAL = '#1F1E22';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const BLACK_LIGHTER = 'rgba(37, 37, 37, 0.6)';
const JOURNEY_BACKGROUND = '#CEE1FE';
const JOURNEY_SECONDARY = '#ADCAF4';
const BLOCK_IN_PROGRESS = PRIMARY;
//const BLOCK_COMPLETE = '#4DBA0B';
const ERROR_LIGHTEST = '#FFECEC';
const ERROR_LIGHTER = '#F9D4D4';
const ERROR_BASE = '#D05151';
const BLACK_SHADOW = '#171717';
const CARD_COMPLETED = '#eff8e7';
const CARD_INPROGRESS = '#f0f4f8';
const PAGE_BG = '#F5F8FB';
const LIGHT_BACK_COLOR = '#D3E29F40';
const BLACK_CARDS = 'rgba(0, 0, 0, 0.3)';
const HEADER_SHADOW = 'rgba(0, 0, 0, 0.03)';
const GRAY_SHADOW = '#0000000D';
const BORDER_COLOR = '#E1E6C2';
const TRANSPARENT_COLOR = 'transparent';
const BADGE_RED = '#F50157';

//SWITCH
const SWITCH_TOGGLED = '#72996B';
const SWITCH_BUTTON = WHITE;

// pagination
const ACTIVE_PAGINATION_DOT = PRIMARY;
const INACTIVE_PAGINATION_DOT = PRIMARY_LIGHT;

export const Colors = {
    theme: {
        primary: PRIMARY,
        primary_light: PRIMARY_LIGHT,
        app_background: BACKGROUND,
        app_sheet_background_color: SHEET_BACKGROUND_COLOR,
        app_background_lightest: BACKGROUND_LIGHTEST,
        log_page_background_color: LOG_PAGE_BACKGROUND_COLOR
    },
    text: {
        black: TEXT_BLACK,
        black_gray: TEXT_BLACK_GRAY,
        dark_green: TEXT_DARK_GREEN,
        text_gray_black: TEXT_GRAY_BLACK,
        dark_black: TEXT_DARK_BLACK,
        white: TEXT_WHITE,
        error: TEXT_ERROR,
        green: TEXT_GREEN,
        charcoal: TEXT_CHARCOAL,
        dusky_olive: TEXT_DUSKY_OLIVE,
        text_lighter: TEXT_LIGHTER,
        text_disabled: TEXT_DISABLED,
        gray: TEXT_GRAY,
        gray_Base: TEXT_GRAY_BASE,
        primary: TEXT_PRIMARY,
        purple: TEXT_PURPLE,
        link: TEXT_LINK,
        darker: TEXT_DARKER,
        mainDarker: TEXT_MAIN_DARKER
    },
    input: {
        error_bg: INPUT_ERROR_BG,
        error_border: INPUT_ERROR_BORDER,
        app_input: INPUT,
        app_input_bg: INPUT_BG,
        input_placeholder_error: INPUT_ERROR_PLACEHOLDER,
        input_border: INPUT_BORDER,
        light_back_color: LIGHT_BACK_COLOR
    },
    button: {
        app_button_border: BUTTON_BORDER,
        app_button_lighter_background: BUTTON_LIGHTER_BACKGROUND,
        app_button_lighter_border: BUTTON_LIGHTER_BORDER,
        app_button_primary_border: BUTTON_PRIMARY_BORDER,
        app_button_disabled_bg: BUTTON_DISABLED_BG,
        app_button_disabled_border: BUTTON_DISABLED_BORDER,
        app_button_background: BUTTON_IMAGE_BACKGROUND,
        app_icon_button_background: BUTTON_ICON_BACKGROUND,
        app_button_red_background: BUTTON_RED_BACKGROUND,
        app_button_success_background: BUTTON_SUCCESS_BACKGROUND,
        app_button_green_background: BUTTON_GREEN_BACKGROUND,
        app_button_white_background: BUTTON_WHITE_BACKGROUND,
        app_btn_light_color: LIGHT_BACK_COLOR,
        app_button_dark_red_background: BUTTON_DARK_RED_BACKGROUND
    },
    icons: {
        eye: EYE_ICON,
        eyeGreen: EYE_ICON_GREEN,
        eye_error_border: EYE_ICON_ERROR_BORDER,
        green_check_mark: GREEN_CHECK_MARK,
        green_dark_check: GREEN_CHECK_DARK
    },
    modals: {
        backdrop: MODAL_BACKDROP,
        close_handle: MODAL_CLOSE_HANDLE,
        divider: MODAL_ITEM_DIVIDER
    },
    toast: {
        errorBackground: ERROR_BACKGROUND,
        successBackground: SUCCESS_BACKGROUND,
        infoBackground: INFO_BACKGROUND
    },
    progress: {
        fillWhite: TEXT_WHITE,
        fill: PROGRESS_BAR_FILL,
        fill_border: PROGRESS_BAR_FILL_BORDER,
        activity_indicator: PROGRESS_BAR_ACTIVITY_INDICATOR,
        fillGreen: PROGRESS_BAR_FILL_GREEN,
        fillDisable: PROGRESS_BAR_FILL_DISABLE,
        trackColor: PROGRESS_BAR_TRACK_GREEN,
        headerProgressColor: PROGRESS_CIRCLE_INNER_BALL_COLOR
    },
    slider: {
        bg: SLIDER_BG
    },
    extras: {
        success_lightest: SUCCESS_LIGHTEST,
        success_lighter: SUCCESS_LIGHTER,
        white: WHITE,
        black: BLACK,
        black_lighter: BLACK_LIGHTER,
        blue_background: JOURNEY_BACKGROUND,
        blue_secondary: JOURNEY_SECONDARY,
        block_in_progress: BLOCK_IN_PROGRESS,
        block_complete: BLOCK_IN_PROGRESS,
        error_lighter: ERROR_LIGHTER,
        error_lightest: ERROR_LIGHTEST,
        error_base: ERROR_BASE,
        black_shadow: BLACK_SHADOW,
        card_completed: CARD_COMPLETED,
        card_inProgress: CARD_INPROGRESS,
        page_bg: PAGE_BG,
        blackCards: BLACK_CARDS,
        headerShadow: HEADER_SHADOW,
        dark_charcoal: DARK_CHARCOAL,
        block_locked: INPUT_BORDER,
        gray_shadow: GRAY_SHADOW,
        border_color: BORDER_COLOR,
        transparent: TRANSPARENT_COLOR,
        badgeRed: BADGE_RED
    },
    pagination: {
        active_dot: ACTIVE_PAGINATION_DOT,
        inactive_dot: INACTIVE_PAGINATION_DOT
    },
    progressCircle: {
        color: PROGRESS_CIRCLE_COLOR,
        shadow_color: PROGRESS_CIRCLE_SHADOW_COLOR,
        bg_color: PROGRESS_CIRCLE_BG_COLOR,
        start_ball_color: PROGRESS_CIRCLE_START_BALL_COLOR,
        start_ball_disable_color: PROGRESS_CIRCLE_START_BALL_DISABLE_COLOR,
        inner_ball_color: PRIMARY,
        inner_ball_disable_color: PROGRESS_CIRCLE_INNER_BALL_DISABLE_COLOR
    },
    switch: {
        button: SWITCH_BUTTON,
        toggled: SWITCH_TOGGLED
    },
    statusBar: {
        white: WHITE
    }
};

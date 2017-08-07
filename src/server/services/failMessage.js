var user = {
    login: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        notFound: 'USER_NOT_FOUND',
        inCorrect: 'PASSWORD_INCORRECT'
    },
    signup: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        duplicateUser: 'DUPLICATE_USER'
    },
    register: {
        input: 'ERROR_INPUT'
    },
    changePassword: {
        systemErr: 'SYSTEM_ERROR',
        passwordOldNotCorrect: 'PASSWORD_OLD_NOT_CORRECT',
        input: 'ERROR_INPUT'
    }
};

var team = {
    create: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        duplicateTeam: 'DUPPLICATE_TEAM',
        teamNotFound: 'TEAM_NOT_FOUND',
        userNotFound: 'USER_NOT_FOUND',
        duplicateMember: 'DUPLICATE_MEMBER'
    },
    remove: {
        notFound: 'NOT_FOUND'
    },
    get: {
        notFound: 'NOT_FOUND'
    },
    update: {
        duplicateTeam: 'DUPLICATE_NAME'
    }
};

var pitch = {
    create: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        duplicatePitch: 'DUPLICATE_PITCH',
        duplicatePrice: 'DUPLICATE_PRICE',
        duplicateFeedback: 'DUPLICATE_FEEDBACK'
    },
    get: {
        notFound: 'PITCH_NOT_FOUND'
    },
    addFeedback: {
        notFound: 'FEEDBACK_NOT_FOUND'
    }
};

var match = {
    create: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        duplicateTeam: 'DUPLICATE_TEAM',
        notFound: 'NOT_FOUND',
        matchExist: 'MATCH_EXIST'
    }
};
module.exports = {
    user: user,
    team: team,
    pitch: pitch,
    match: match
};
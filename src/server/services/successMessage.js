var user = {
    login: 'LOGIN_SUCESS',
    register: 'REGISTER_SUCCESS',
    signup: 'CREATE_SUCCESS',
    changePassword: 'CHANGE_SUCCESS',
    sendEmail: 'SEND_SUCCESS'
};

var team = {
    create: 'CREATE_TEAM_SUCCESS',
    addMember: 'ADD_MEMBER_SUCCESS',
    removeMember: 'REMOVE_MEMBER_SUCCESS',
    removeTeam: 'REMOVE_TEAM_SUCCESS',
    getSuccess: 'GET_TEAM_SUCCESS',
    update: 'UPDATE_TEAM_SUCCESS'
};

var pitch = {
    create: 'CREATE_PITCH_SUCCESS',
    get: 'GET_PITCH_SUCCESS',
    update: 'UPDATE_PITCH_SUCCESS',
    delete: 'DELETE_PITCH_SUCCESS',
    addPrice: 'ADD_PRICE_SUCCESS',
    updatePrice: 'UPDATE_PRICE_SUCESS',
    removePrice: 'REMOVE_PRICE_SUCCESS',
    addFeedback: 'ADD_FEEDBACK_SUCCESS',
    updateFeedback: 'UPDATE_FEEDBACK_SUCCESS',
    removeFeedback: 'REMOVE_FEEDBACK_SUCCESS'
};

var match = {
    create: 'CREATE_MATCH_SUCCESS',
    get: 'GET_MATCH_SUCCESS',
    update: 'UPDATE_MATCH_SUCCESS',
    remove: 'REMOVE_MATCH_SUCCESS'
};
module.exports = {
    user: user,
    team: team,
    pitch: pitch,
    match: match
};
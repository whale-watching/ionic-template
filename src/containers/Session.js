import { connect } from 'react-redux';
import {
  searchSessionsByName,
  addFavoriteSession,
  removeFavoriteSession,
  addFavoriteFilter,
  removeFavoriteFilter
} from '../actions';

const getVisibleSessions = (sessions, trackFilters, searchText, favoriteSessions, filterFavorites) => {
  let filteredSessions = sessions;

  if (searchText) {
    filteredSessions = filteredSessions.filter(session => `${session.name} ${session.description}`.indexOf(searchText !== -1));
  }

  if (trackFilters.length > 0) {
    filteredSessions = filteredSessions.filter(session => (
      session.tracks.some(sessionTrackName => (
        trackFilters.some(trackName => trackName === sessionTrackName)
      ))
    ));
  }

  if (filterFavorites) {
    filteredSessions = filteredSessions.filter(session => favoriteSessions.contains(session.id));
  }

  return filteredSessions;
};

const mapStateToProps = (state) => {
  const visibleSessions = getVisibleSessions(
    state.sessions.sessions, state.sessions.trackFilters, state.sessions.searchText, state.sessions.favoriteSessions, state.sessions.filterFavorites
  );

  return {
    filteredSessions: visibleSessions,
    filterFavorites: state.sessions.filterFavorites,
    favoriteSessions: state.sessions.favoriteSessions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchSessionsByName: (text) => dispatch(searchSessionsByName(text)),
    addFavoriteSession: (sessionId) => dispatch(addFavoriteSession(sessionId)),
    removeFavoriteSession: (sessionId) => dispatch(removeFavoriteSession(sessionId)),
    updateFavoriteFilter: (shouldFilter) => (
      shouldFilter ? dispatch(addFavoriteFilter()) : dispatch(removeFavoriteFilter())
    )
  }
}

const VisibleSessionList = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({children, ...props}) => children(props)
);

export default VisibleSessionList

import { combineReducers } from 'redux'

import { appIsLoading } from './appIsLoading'
import { collapsed } from './collapsed'
import { currentFilters } from './currentFilters'
import { currentQuestion } from './currentQuestion'
import { filterOptions } from './filterOptions'
import { initialLoadComplete } from './initialLoadComplete'
import { problems } from './problems'
import { problemIds } from './problemIds'
import { questions } from './questions'
import { questionsById } from './questionsById'
import { questionFormData } from './questionFormData'
import { responseFormData } from './responseFormData'
import { responseFormPending } from './responseFormPending'
import { responseIdMap } from './responseIdMap'
import { responses } from './responses'
import { scores } from './scores'
import { votes } from './votes'

const queryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
};

const rootReducer = combineReducers({
  appIsLoading,
  collapsed,
  currentFilters,
  currentQuestion,
  filterOptions,
  initialLoadComplete,
  problemIds,
  problems,
  queryString,
  questions,
  questionsById,
  questionFormData,
  responseFormData,
  responseFormPending,
  responseIdMap,
  responses,
  scores,
  votes
})

export default rootReducer

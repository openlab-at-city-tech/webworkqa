import { combineReducers } from 'redux'

import { appIsLoading } from './appIsLoading'
import { collapsed } from './collapsed'
import { currentFilters } from './currentFilters'
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

const rootReducer = combineReducers({
  appIsLoading,
  collapsed,
  currentFilters,
  initialLoadComplete,
  problemIds,
  problems,
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

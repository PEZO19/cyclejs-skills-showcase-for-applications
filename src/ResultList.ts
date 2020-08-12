import {makeCollection, StateSource} from "@cycle/state";
import {MainDOMSource, ul} from "@cycle/dom";
import {ItemState, ResultItem} from "./ResultItem";

export const resultListStyle = {
  listStyle: 'none',
}
export type ListState = ItemState[]

export interface ListSources {
  DOM: MainDOMSource,
  state: StateSource<ListState>;
}

export type ListSinks = any

export function ResultList(sources: ListSources): ListSinks {
  
  const List = makeCollection({
    item: ResultItem,
    itemKey: (childState, index) => String(index),
    itemScope: key => key,
    collectSinks: instances => {
      return {
        state: instances.pickMerge('state'),
        DOM: instances.pickCombine('DOM').map(combinedItemsVNodes => ul('.result-list', resultListStyle, combinedItemsVNodes))
      }
    }
  })
  
  const resultItemsSinks = List(sources)
  const reducer$ = resultItemsSinks.state
  
  return {
    state: reducer$,
    DOM: resultItemsSinks.DOM
  }
}
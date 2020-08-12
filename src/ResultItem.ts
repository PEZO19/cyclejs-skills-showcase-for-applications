import {button, li, MainDOMSource} from "@cycle/dom";
import {StateSource} from "@cycle/state";
import {Stream} from "xstream";
import {
  DefinedObject,
  Result,
  resultItemDeleteButtonStyle,
  resultItemStyle
} from "./app";

export type ItemState = Result

export interface ItemSources {
  DOM: MainDOMSource,
  state: StateSource<ItemState>;
}

export type ItemSinks = any

export function ResultItem(sources: ItemSources): ItemSinks {
  const state$: Stream<ItemState> = sources.state.stream;
  
  const deleteClick$: Stream<Event> = sources.DOM.select('.result-item-delete-button').events('click')
  const itemActions = {deleteResultItem$: deleteClick$.map(ev => parseInt(((ev.target as HTMLInputElement).dataset as DefinedObject).index))}
  
  const deleteResultReducer$ = itemActions.deleteResultItem$
    .map((deletedResultItemId: number) => function deleteResultReducer(itemState: ItemState): ItemState | undefined {
      return itemState.id === deletedResultItemId ? undefined : itemState;
    })
  
  const $vtree = state$.map((result: Result) =>
    li('.result-item',
      {style: resultItemStyle},
      [result.selected,
        button('.result-item-delete-button',
          {
            style: resultItemDeleteButtonStyle,
            attrs: {'data-index': result.id}
          },
          "Delete")]
    ),
  )
  
  return {
    state: deleteResultReducer$,
    DOM: $vtree
  }
}
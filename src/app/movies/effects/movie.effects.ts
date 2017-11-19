import { SearchCompleteAction } from '../actions/movie.actions';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { MovieService } from '../services/movie.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as movieActions from '../actions/movie.actions';
import { Movie } from '../movie.model';

@Injectable()
export class MovieEffects {
    public constructor(private actions$: Actions,
        private movieService: MovieService) {}

    @Effect() search$: Observable<Action> = this.actions$
        .ofType<movieActions.SearchAction>(movieActions.SEARCH)
        .debounceTime(1000)
        .map(action => action.searchTerm)
        .switchMap(searchTerm => {
            if (searchTerm === '') {
                return Observable.of();
            }

            const nextSearch$ = this.actions$
                .ofType(movieActions.SEARCH)
                .skip(1);


            return this.movieService
                .search(searchTerm)
                .takeUntil(nextSearch$)
                .map((movies: Movie[]) => new movieActions.SearchCompleteAction(movies))
                .catch(() => Observable.of(new SearchCompleteAction([])));
        });
}

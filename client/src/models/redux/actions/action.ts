/*
 * File: /src/models/actions/action.ts
 * File Created: Wednesday, 11th December 2019 11:54:30 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Thursday, 12th December 2019 2:20:15 am
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

export interface Action {
    type: string;
    error?: string;
    payload: any;
}

export interface ThunkActionCreator {
    (dispatch: (action: Action) => any, getState: () => any): any;
}

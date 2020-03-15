/*
 * File: /src/models/redux/reducers/reducer.ts
 * File Created: Thursday, 12th December 2019 1:23:18 am
 * Author: Alex Chomiak
 *
 * Last Modified: Thursday, 12th December 2019 1:34:16 am
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */
import { Action } from '../actions/action'
export interface Reducer<T> {
    (state: T, action: Action): T
}

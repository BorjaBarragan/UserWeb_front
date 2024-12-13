import { createAction, props } from "@ngrx/store";
import { User } from "../models/user";

export const findAll = createAction('findAll', props<{ users: User[] }>());
export const setPaginator = createAction('setPaginator', props<{ paginator: any }>());
export const find = createAction('find', props<{ id: number }>());

export const add = createAction('add', props<{ userNew: User }>());
export const update = createAction('update', props<{ userUpdated: User }>());
export const remove = createAction('remove', props<{ id: number }>());



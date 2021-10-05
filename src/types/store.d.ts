// Infer the `RootState` and `AppDispatch` types from the store itself
import {store} from "@/index";
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
declare type AppDispatch = typeof store.dispatch
declare type RootState = ReturnType<typeof store.getState>
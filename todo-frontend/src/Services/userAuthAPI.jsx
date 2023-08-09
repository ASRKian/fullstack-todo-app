import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userAuthAPI = createApi({
    reducerPath: 'userAuthAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (user) => {
                return {
                    url: 'register/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            },
        }),
        loginUser: builder.mutation({
            query: (user) => {
                return {
                    url: 'login/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        refreshToken: builder.mutation({
            query: (refreshToken) => {
                return {
                    url: 'token/refresh/',
                    method: 'POST',
                    body: {
                        refresh: refreshToken
                    },
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        sendResetPasswordLink: builder.mutation({
            query: (email) => {
                return {
                    url: 'send-reset-password-email/',
                    method: 'POST',
                    body: email,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        resetPassword: builder.mutation({
            query: ({ body, uid, token }) => {
                return {
                    url: `reset-password/${uid}/${token}/`,
                    method: 'POST',
                    body,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        getTodos: builder.query({
            query: (access_token) => {
                return {
                    url: 'todos/',
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            }
        }),
        createTodo: builder.mutation({
            query: ({ body, access_token }) => {
                console.log(body, access_token);
                return {
                    url: 'todos/',
                    method: 'POST',
                    body,
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        patchTodo: builder.mutation({
            query: ({ body, id, access_token }) => {
                return {
                    url: `todos/${id}/`,
                    method: 'PATCH',
                    body,
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        getDetails: builder.query({
            query: (access_token) => {
                return {
                    url: 'profile/',
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            }
        }),
        deleteTodo: builder.mutation({
            query: ({ access_token, id }) => {
                return {
                    url: `todos/${id}/`,
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            }
        }),
    }),
})

export const { useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation, useSendResetPasswordLinkMutation, useResetPasswordMutation, useLazyGetTodosQuery, useCreateTodoMutation, usePatchTodoMutation, useLazyGetDetailsQuery, useDeleteTodoMutation } = userAuthAPI
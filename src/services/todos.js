import { API, graphqlOperation } from 'aws-amplify';

import { listTodos } from '../graphql/queries';
import { createTodo, updateTodo, deleteTodo } from '../graphql/mutations';

export default {
	getDataAsync: async ({ limit, nextToken }) => {
		try {
			const variables = { limit };
			if (nextToken) variables.nextToken = nextToken
			const todoData = await API.graphql(graphqlOperation(listTodos, variables));
			return {
				ok: true,
				data: todoData.data.listTodos
			}
		} catch (e) {
			return { ok: false, error: e.message }
		}
	},
	createTask: async ({ id, name, level }) => {
		try {
			const data = { id, name, level };
			const response = await API.graphql(graphqlOperation(createTodo, {
				input: data
			}))

			return {
				ok: true,
				data: response.data.createTodo
			}
		} catch (e) {
			return { ok: false, error: e.message }
		}
	},
	editTask: async ({ id, name, level }) => {
		try {
			const response = await API.graphql(graphqlOperation(updateTodo, {
				input: { id, name, level: parseInt(level) }
			}))
			return {
				ok: true,
				data: response.data.updateTodo
			}
		} catch (e) {
			if (e.errors && e.errors.length) {
				return { ok: false, error: e.errors.map(_e => _e.message).join('.') }
			}
			return { ok: false, error: e.message }
		}
	},
	deleteTask: async ({ id }) => {

		try {
			const response = await API.graphql(graphqlOperation(deleteTodo, {
				input: { id }
			}))
			return {
				ok: true,
				data: response.data.deleteTodo
			}
		} catch (e) {
			if (e.errors && e.errors.length) {
				return { ok: false, error: e.errors.map(_e => _e.message).join('.') }
			}
			return { ok: false, error: e.message }
		}
	}
}
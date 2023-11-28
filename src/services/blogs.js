import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
	token = `Bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = newObject => {
	const config = {
		headers: { Authorization: token },
	}

	const request = axios.post(baseUrl, newObject, config)
	return request.then(response => response.data)
}

const update = (id, updatedObject) => {

	const request = axios.put(`${baseUrl}/${id}`, updatedObject)
	return request.then(response => response.data)
}

const remove = id => {
	const config = {
		headers: { Authorization: token },
	}

	const request = axios.delete(`${baseUrl}/${id}`, config)
	return request.then(response => response.data)
}

export default { getAll, setToken, create, update, remove }

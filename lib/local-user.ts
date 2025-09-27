import { v4 as uuidv4 } from 'uuid';

export const createLocalUser = () => {
	const user = {
		id: uuidv4(),
		name: 'Anonymous',
	};
	localStorage.setItem('user', JSON.stringify(user));
	return user;
};

export const getLocalUser = () => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : createLocalUser();
};

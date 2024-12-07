import api from '../../utils/api';

export const importProduct = (formData) => {
	return api.post(`/Product/import-product-list`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const getListCategory = () => {
	return api.get(`/Category/list-categories`, {
		headers: {
			accept: '*/*',
		},
	});
};
export const getListBrandI = () => {
	return api.get(`/Brand/list-all`, {
		headers: {
			accept: '*/*',
		},
	});
};
export const getListSportId = () => {
	return api.get(`/sport/list-sports`, {
		headers: {
			accept: '*/*',
		},
	});
};

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import ManageUser from '../pages/Admin/ManageUser';
import Blog from '../components/Blog';
import ListOrder from '../pages/Staff/ListOrders';
import AdminDashboard from '../layouts/AdminDashboard';
import OrderDetail from '../pages/Staff/OrderDetail';
import PendingRentalList from '../pages/OnlineStaff/PendingRentalList';
import ManegerProduct from '../pages/Manager/ManegerProduct';
const AdminRoutes = () => {
	return (
		<Routes>
			<Route path='/dashboard' element={<Dashboard />} />
			<Route path='/manage-user' element={<ManageUser />} />
			<Route path='/orders' element={<AdminDashboard />} />
			<Route path='/orders/:orderId' element={<OrderDetail />} />
			<Route path='/rentals' element={<PendingRentalList />} />
			<Route path='/blog' element={<Blog />} />
			<Route path='/manage-product' element={<ManegerProduct />} />
		</Routes>
	);
};

export default AdminRoutes;

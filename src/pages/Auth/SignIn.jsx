import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { authenticateUser } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		console.log(data);
		// Handle login logic here
		try {
			const decoded = await authenticateUser(dispatch, data);
			console.log('User authenticated:', decoded);
			if (decoded.role === 'Admin') {
				navigate('/admin/dashboard');
			} else if (decoded.role === 'Order Coordinator') {
				navigate('/staff/orders');
			} else if (decoded.role === 'Staff') {
				navigate('/staff/orders');
			} else if (decoded.role === 'Content Staff') {
				navigate('/admin/blog');
			} else {
				console.error('Unknown role:', decoded.role);
				alert("You don't have permission to access this page.");
			}
		} catch (error) {
			console.error('Login failed', error);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className='flex items-center justify-center h-screen backdrop-blur-lg bg-gradient-to-r from-blue-200 to-blue-700 '>
			<form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-2 bg-white rounded shadow-md w-80'>
				<h2 className='mb-4 text-2xl font-bold text-center'>2 Sport Employees</h2>

				<div className='flex items-center '>
					<label className='block pr-2 text-gray-700' htmlFor='username'>
						<FontAwesomeIcon icon={faUser} />
					</label>
					<input
						id='username'
						type='text'
						{...register('userName', {
							required: true,
							maxLength: 20,
							pattern: /^[a-zA-Z0-9_]+$/,
						})}
						className={`mt-1 block w-full p-2 border ${
							errors.userName ? 'border-red-500' : 'border-gray-300'
						} rounded`}
					/>
				</div>
				{errors.userName && errors.userName.type === 'required' && (
					<p className='text-sm italic text-red-400'>Tên đăng nhập là bắt buộc!</p>
				)}
				{errors.userName && errors.userName.type === 'maxLength' && (
					<p>Tên đăng nhập không được vượt quá 20 chữ</p>
				)}
				{errors.userName && errors.userName.type === 'pattern' && (
					<p className='text-sm italic text-red-400'>
						Tên đăng nhập chỉ có thể chứa kí tự, số và gạch dưới _
					</p>
				)}

				<div className='flex items-center pb-4'>
					<label className='block pr-2 text-gray-700' htmlFor='password'>
						<FontAwesomeIcon icon={faKey} />
					</label>
					<div className='relative w-full'>
						<input
							id='password'
							type={showPassword ? 'text' : 'password'}
							{...register('password', { required: 'Password is required' })}
							className={`mt-1 block w-full p-2 border ${
								errors.password ? 'border-red-500' : 'border-gray-300'
							} rounded`}
						/>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3'>
							<FontAwesomeIcon
								icon={showPassword ? faEyeSlash : faEye}
								className='text-orange-400 cursor-pointer'
								onClick={togglePasswordVisibility}
							/>
						</div>
					</div>
				</div>
				{errors.password && <p className='pb-4 mt-1 text-xs text-red-500'>{errors.password.message}</p>}

				<button type='submit' className='w-2/5 p-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
					Đăng nhập
				</button>
			</form>
		</div>
	);
}

export default SignIn;

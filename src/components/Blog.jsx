import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';
import HeaderStaff from '../layouts/HeaderStaff';
import SidebarStaff from '../layouts/SidebarStaff';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import { createBlog, deleteBlog, getAllBlog, updateBlog } from '../api/Blog/apiBlog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const Blog = () => {
	const [title, setTitle] = useState('');
	const [subTitle, setSubTitle] = useState('');
	const [content, setContent] = useState('');
	const [coverImage, setCoverImage] = useState(null);
	const [blogId, setBlogId] = useState(null);
	const user = useSelector(selectUser);
	const queryClient = useQueryClient();

	const { data: blogData } = useQuery({
		queryKey: ['dataBlogs'],
		queryFn: getAllBlog,
	});

	const dataBlogs = blogData?.data?.data?.$values;
	console.log('dataBlogs', dataBlogs);

	const { mutate: mutateCreateBlog } = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('subTitle', subTitle);
			formData.append('content', content);

			if (coverImage) {
				formData.append('coverImage', coverImage);
			}

			await createBlog(formData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataBlogs'] });

			Swal.fire({
				title: 'Success!',
				text: 'Blog created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});

			setTitle('');
			setSubTitle('');
			setContent('');
			setCoverImage(null);
			setBlogId(null); // Reset blogId after successful creation
		},
		onError: (error) => {
			console.error('Error creating blog:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the blog.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const { mutate: mutateUpdateBlog } = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('subTitle', subTitle);
			formData.append('content', content);

			if (coverImage) {
				formData.append('coverImage', coverImage);
			}

			if (blogId) {
				await updateBlog(blogId, formData); // Use blogId here
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataBlogs'] });

			Swal.fire({
				title: 'Success!',
				text: 'Blog updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});

			setTitle('');
			setSubTitle('');
			setContent('');
			setCoverImage(null);
			setBlogId(null); // Reset blogId after successful update
		},
		onError: (error) => {
			console.error('Error updating blog:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating the blog.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const { mutate: mutateDeleteBlog } = useMutation({
		mutationFn: async (id) => {
			await deleteBlog(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataBlogs'] });
			Swal.fire({
				title: 'Deleted!',
				text: 'Blog deleted successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error deleting the blog.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleDeleteBlog = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'Cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				mutateDeleteBlog(id);
			}
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (title && content) {
			if (blogId) {
				mutateUpdateBlog(); // Update blog if blogId is present
			} else {
				mutateCreateBlog(); // Create new blog
			}
		} else {
			alert('Please fill in the title and content!');
		}
	};

	const isStaffOrAdmin = user && (user.role === 'Employee' || user.role === 'Admin');

	const handleEdit = (blogId) => {
		const blog = dataBlogs.find((blog) => blog.blogId === blogId);
		setBlogId(blogId);
		setTitle(blog.title);
		setSubTitle(blog.subTitle);
		setContent(blog.content);
		setCoverImage(null);
	};

	return (
		<>
			<HeaderStaff />
			<div className='flex h-full'>
				{isStaffOrAdmin && <SidebarStaff />}
				<div className='flex-grow border-l-2'>
					<div className='container p-4 mx-auto'>
						<h1 className='mb-4 text-2xl font-bold'>{blogId ? 'Edit Blog' : 'Create a New Blog'}</h1>
						<form onSubmit={handleSubmit} className='mb-6'>
							<input
								type='text'
								placeholder='Blog Title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className='w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
							<input
								type='text'
								placeholder='Subtitle'
								value={subTitle}
								onChange={(e) => setSubTitle(e.target.value)}
								className='w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
							<CKEditor
								editor={ClassicEditor}
								data={content}
								onChange={(event, editor) => setContent(editor.getData())}
								className='mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
							<input
								type='file'
								accept='image/*'
								onChange={(e) => setCoverImage(e.target.files[0])}
								className='form-file-input'
							/>
							<button
								type='submit'
								className='p-3 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600'
							>
								{blogId ? 'Update Blog' : 'Publish Blog'}
							</button>
						</form>

						<h2 className='mb-2 text-xl font-semibold'>My Blogs</h2>
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-lg table-auto'>
								<thead>
									<tr className='bg-gray-100'>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>
											Blog ID
										</th>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>
											Cover Image
										</th>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>Title</th>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>
											Subtitle
										</th>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>
											Content
										</th>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>
											Created At
										</th>
										<th className='px-6 py-3 text-sm font-medium text-left text-gray-500'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{dataBlogs?.map((blog) => (
										<tr key={blog.$id} className='border-b'>
											<td className='px-6 py-4 text-sm text-gray-700'>{blog.blogId}</td>
											<td className='px-6 py-4'>
												{blog.coverImgPath && (
													<img
														src={blog.coverImgPath}
														alt={blog.title}
														className='object-cover w-20 h-20 rounded-md'
													/>
												)}
											</td>
											<td className='px-6 py-4 text-sm text-gray-700'>{blog.title}</td>
											<td className='px-6 py-4 text-sm text-gray-700'>{blog.subTitle}</td>
											<td className='px-6 py-4 text-sm text-gray-700'>
												<div
													className='prose-sm prose'
													dangerouslySetInnerHTML={{ __html: blog.content }}
												/>
											</td>
											<td className='px-6 py-4 text-sm text-gray-700'>
												{new Date(blog.createAt).toLocaleString()}
											</td>
											<td className='px-6 py-4'>
												<div className='flex space-x-2'>
													<button
														onClick={() => handleEdit(blog.blogId)}
														className='px-4 py-2 text-white transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600'
													>
														Edit
													</button>
													<button
														onClick={() => handleDeleteBlog(blog.blogId)}
														className='px-4 py-2 text-white transition duration-200 bg-red-500 rounded-lg hover:bg-red-600'
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Blog;

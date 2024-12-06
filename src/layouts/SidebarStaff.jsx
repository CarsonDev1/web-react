import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { List, ListItem } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
export default function SidebarStaff() {
	const user = useSelector(selectUser);

	return (
		<div className='flex flex-col items-center w-1/6 px-5 py-5'>
			<List>
				{user.role === 'Admin' && (
					<Link to='/admin/dashboard'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' /> dashboard
						</ListItem>
					</Link>
				)}
				{/* <ListItem>
          
        <FontAwesomeIcon icon={faFileArrowDown} className="pr-3" /> {t("sidebar_staff.import")}
        </ListItem> */}
				{user.role === 'Admin' && (
					<Link to='/admin/manage-user'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' />
							customer account
						</ListItem>
					</Link>
				)}
				{user.role === 'Order Coordinator' && (
					<Link to='/admin/rentals'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' />
							list rental order
						</ListItem>
					</Link>
				)}
				{user.role === 'Order Coordinator' && (
					<Link to='/admin/orders'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' />
							List orders
						</ListItem>
					</Link>
				)}
				{user.role === 'Staff' && (
					<Link to='/admin/orders'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' />
							List orders
						</ListItem>
					</Link>
				)}
				{user.role === 'Content Staff' && (
					<Link to='/admin/blog'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' /> blog
						</ListItem>
					</Link>
				)}
				{user.role === 'Manager' && (
					<Link to='/admin/manager'>
						<ListItem>
							<FontAwesomeIcon icon={faGauge} className='pr-3' /> blog
						</ListItem>
					</Link>
				)}
			</List>
		</div>
	);
}

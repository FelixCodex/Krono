/* eslint-disable react/prop-types */
import { CHECK, DROPLET, EDIT_ICON, TRASH_ICON } from '../icons/icons.jsx';
import { openModalWithPreset, showMessage } from '../utils/utils.js';
import { useCard } from '../hooks/useCard.jsx';
import { useState } from 'react';
import { COLORS, DEFAULT_COLOR } from '../color.js';

export function ProjectCard({
	title,
	id: projectId,
	checked,
	className,
	color,
	setProjectsOpen,
}) {
	const [colorModalOpen, setColorModalOpen] = useState(false);
	const {
		currentProject,
		setCurrentProject,
		deleteProject,
		activated,
		updateProjectChecked,
		updateProjectColor,
	} = useCard();

	const handleProjectClick = async () => {
		if (activated == true || activated == null) {
			showMessage('Hay un cronometro activo!');
			return;
		}
		setCurrentProject(projectId);
		setProjectsOpen(false);
	};

	const handleEditClick = e => {
		e.stopPropagation();
		openModalWithPreset({ type: 'edit', input: title, id: projectId });
	};

	const handleDeleteClick = e => {
		e.stopPropagation();
		const confirmAsk = confirm('Quieres eliminar este projecto?');
		if (confirmAsk) {
			if (currentProject == projectId) setCurrentProject(null);
			deleteProject({ projectId });
		}
	};

	const handleChangeColor = color => {
		updateProjectColor({ projectId, color });
	};

	return (
		<div
			className={`p-1 rounded-xl border`}
			style={
				color
					? { background: color.bg, borderColor: color.border }
					: { background: DEFAULT_COLOR.bg, borderColor: DEFAULT_COLOR.border }
			}
		>
			<div
				className={`relative flex items-center justify-between w-full p-3 py-2 bg-white cursor-pointer border ${
					currentProject == projectId ? 'border-gray-400' : 'border-gray-300'
				} ${colorModalOpen ? 'z-50' : 'z-10'} rounded-lg ${className}`}
				style={
					color && currentProject != projectId
						? { borderColor: color.border }
						: {}
				}
				onClick={handleProjectClick}
				id={projectId}
			>
				<p className='text-xl truncate font-medium text-gray-800'>{title}</p>
				<div className='flex items-center gap-1 '>
					<button
						className='w-7 h-7 p-0 flex items-center justify-center'
						onClick={e => {
							e.stopPropagation();
							updateProjectChecked({ projectId });
						}}
					>
						<CHECK
							className={`w-5 h-5 ${
								checked ? 'text-gray-800' : 'text-gray-300'
							}`}
						></CHECK>
					</button>
					<div
						onClick={e => {
							e.stopPropagation();
						}}
						className='relative cursor-default'
					>
						<button
							className='w-7 h-7 p-0 flex items-center justify-center'
							onClick={() => {
								setColorModalOpen(!colorModalOpen);
							}}
							style={{
								background: color ? color.bg : '#fff',
							}}
						>
							<DROPLET className='w-5 h-5 p-0 flex items-center justify-center'></DROPLET>
						</button>
						<div
							className={`${
								colorModalOpen ? 'absolute' : 'hidden'
							} w-32 top-[103%] p-2 -left-8 gap-1 flex flex-col border rounded-lg border-gray-300 bg-gray-50`}
						>
							<p className='text-sm text-start font-medium'>Colors</p>
							<div className='flex flex-wrap gap-1'>
								{COLORS.map((c, i) => {
									return (
										<ColorButton
											key={i}
											onClick={e => {
												e.stopPropagation();
												handleChangeColor(c);
											}}
											color={c}
										/>
									);
								})}
							</div>
						</div>
					</div>
					<button
						className='w-7 h-7 p-0 flex items-center justify-center'
						onClick={handleEditClick}
					>
						<EDIT_ICON className='w-5 h-5'></EDIT_ICON>
					</button>
					<button
						className='w-7 h-7 p-0 flex items-center justify-center'
						onClick={handleDeleteClick}
					>
						<TRASH_ICON className='w-5 h-5'></TRASH_ICON>
					</button>
				</div>
			</div>
		</div>
	);
}

function ColorButton({ className, onClick, color }) {
	return (
		<button
			data-color={color}
			className={`w-6 h-6 p-0 flex items-center justify-center ${className}`}
			style={{ background: color ? color.bg : '' }}
			onClick={onClick}
		></button>
	);
}

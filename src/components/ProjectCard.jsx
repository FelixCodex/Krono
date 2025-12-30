/* eslint-disable react/prop-types */
import { useState } from 'react';
import { CHECK, EDIT_ICON, TRASH_ICON } from '../icons/icons.jsx';
import {
	formatMillisToAdjustedHMS,
	openModalWithPreset,
	showMessage,
} from '../utils/utils.js';
import { useCard } from '../hooks/useCard.jsx';

export function ProjectCard({
	title,
	id,
	totalTime,
	className,
	setProjectsOpen,
}) {
	const [projectId] = useState(id);
	const {
		currentProject,
		setCurrentProject,
		deleteProject,
		activated,
		hourFee,
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

	const feePerHour = (totalTime / 1000 / 60) * (hourFee / 60);

	return (
		<div
			className={`relative flex items-center justify-between w-full p-3 py-2 cursor-pointer border border-[#555555] rounded-lg ${className}`}
			onClick={handleProjectClick}
			id={id}
		>
			<p className='text-xl truncate'>{title}</p>
			<div className='flex items-center gap-1 '>
				<div className='flex items-center gap-1 xl:gap-0 2xl:gap-1 xl:flex-col 2xl:flex-row '>
					<p className='text-lg xl:text-sm 2xl:text-lg bg-[#242424]'>
						${feePerHour.toFixed(2)}
					</p>
					<div className='min-w-px border-l border-[#545454] h-8 mx-1 xl:hidden 2xl:flex'></div>
					<p className='text-lg xl:text-sm 2xl:text-lg bg-[#242424]'>
						{formatMillisToAdjustedHMS(totalTime)}
					</p>
				</div>
				<div className='min-w-px border-l border-[#545454] h-8 mx-1'></div>
				<button
					className='w-7 h-7 p-0 flex items-center justify-center'
					onClick={() => {}}
				>
					<CHECK className='w-5 h-5'></CHECK>
				</button>
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
	);
}

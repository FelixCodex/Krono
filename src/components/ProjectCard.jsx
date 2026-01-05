/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { CHECK, DROPLET, EDITICON, TRASHICON } from '../icons/icons.jsx';
import { openModalWithPreset, showMessage } from '../utils/utils.js';
import { useCard } from '../hooks/useCard.jsx';
import { useState } from 'react';
import { COLORS, DEFAULT_COLOR } from '../color.js';
import { ColorSelector } from './ColorSelector.jsx';

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
		updateProject,
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
		updateProject({ projectId, color });
	};

	return (
		<div
			className={`p-1 rounded-xl border cursor-pointer`}
			style={
				color && COLORS[color]
					? { background: COLORS[color].bg, borderColor: COLORS[color].border }
					: { background: DEFAULT_COLOR.bg, borderColor: DEFAULT_COLOR.border }
			}
			onClick={handleProjectClick}
		>
			<div
				className={`relative flex items-center justify-between w-full p-3 py-2 bg-white border ${
					currentProject == projectId ? 'border-gray-400' : 'border-gray-300'
				} ${colorModalOpen ? 'z-50' : 'z-10'} rounded-lg ${className}`}
				style={
					color && COLORS[color]
						? currentProject != projectId
							? { borderColor: COLORS[color].border }
							: { borderColor: COLORS[color].highlight }
						: { borderColor: DEFAULT_COLOR.border }
				}
				id={projectId}
			>
				<p className='text-xl truncate font-medium text-gray-800'>{title}</p>
				<div className='flex items-center gap-1 '>
					<button
						className='w-7 h-7 p-0 flex items-center justify-center'
						onClick={e => {
							e.stopPropagation();
							updateProject({ projectId, check: true });
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
								background: COLORS[color] ? COLORS[color].bg : '#fff',
								borderColor: COLORS[color]
									? COLORS[color].border
									: DEFAULT_COLOR.border,
							}}
						>
							<DROPLET className='w-5 h-5 p-0 flex items-center justify-center'></DROPLET>
						</button>
						<ColorSelector
							modalOpen={colorModalOpen}
							onClick={handleChangeColor}
						/>
					</div>
					<button
						className='w-7 h-7 p-0 flex items-center justify-center'
						onClick={handleEditClick}
					>
						<EDITICON className='w-5 h-5'></EDITICON>
					</button>
					<button
						className='w-7 h-7 p-0 flex items-center justify-center'
						onClick={handleDeleteClick}
					>
						<TRASHICON className='w-5 h-5'></TRASHICON>
					</button>
				</div>
			</div>
		</div>
	);
}

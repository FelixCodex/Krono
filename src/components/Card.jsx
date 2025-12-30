/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useCard } from '../hooks/useCard.jsx';
import {
	convertTimeInMillisToHMS,
	formatDateToTimePassed,
	openModalWithPreset,
	showMessage,
} from '../utils/utils.js';
import { EDIT_ICON, PLAY_ICON, TRASH_ICON } from '../icons/icons.jsx';
import { useTimer } from '../hooks/useTimer.jsx';
import { COLORS } from '../color.js';

// eslint-disable-next-line react/prop-types
export function Card({ title, dateinfo, id, projectColor }) {
	const {
		removeCardFromProject,
		currentProject,
		repositionCardFromProject,
		resumedId,
	} = useCard();
	const [cardId] = useState(id);
	const { resumeClick } = useTimer();
	const { activated } = useCard();

	const handleClick = () => {
		const confirmAsk = confirm('Quieres eliminar esta nota?');
		if (confirmAsk)
			removeCardFromProject({ projectId: currentProject, id: cardId });
	};

	const handleResume = () => {
		if (activated == true || activated == null) {
			showMessage('Hay un cronometro activo!');
			return;
		}
		resumeClick({ time: dateinfo, id, title });
	};

	const handleEdit = () => {
		openModalWithPreset({ type: 'update', input: title, id: cardId });
	};

	const handleDragStart = e => {
		const elemt = e.currentTarget;
		const dargPin = document.getElementById('drag-pin-' + id);
		const rect = elemt.getBoundingClientRect();
		const pinRect = dargPin.getBoundingClientRect();
		const mouseOffsetX = e.clientX - rect.left;
		const mouseOffsetY = e.clientY - rect.top;
		const pinRectX = pinRect.left - rect.left;
		const pinRecY = pinRect.top - rect.top;

		const compX =
			mouseOffsetX < pinRectX || mouseOffsetX > pinRectX + pinRect.width;
		const compY =
			mouseOffsetY < pinRecY || mouseOffsetY > pinRecY + pinRect.height;

		if (compX || compY) {
			e.preventDefault();
			return;
		}

		e.dataTransfer.setData('fromId', cardId);
	};

	const handleDrop = e => {
		const elem = e.currentTarget;
		const fromId = e.dataTransfer.getData('fromId');

		if (elem.classList.contains('card')) {
			elem.style = 'border: 1px solid #fff;';
		} else {
			elem.closest('.card').style = 'border: 1px solid #fff;';
		}
		repositionCardFromProject({
			projectId: currentProject,
			fromId,
			toId: elem.dataset.id,
		});
	};

	const handleDragOver = e => {
		e.preventDefault();
		const elemt = e.currentTarget;

		elemt.style = 'border: 1px solid #444;';
	};

	const handleDragLeave = e => {
		e.currentTarget.style = 'border: 1px solid #d1d5db;';
	};

	return (
		<div
			className={`w-full card min-h-[100px] p-3 h-32 flex items-center border bg-white ${
				resumedId == id ? 'border-[#007bff]' : 'border-gray-300'
			}  rounded-lg relative`}
			style={
				projectColor && projectColor.border != COLORS[0].border
					? {
							borderColor: projectColor.border,
					  }
					: {}
			}
			draggable={true}
			onDragStart={handleDragStart}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			data-id={cardId}
		>
			<button
				className='cursor-grab border w-7 h-full border-gray-300 p-0 bg-dotted'
				id={'drag-pin-' + id}
			></button>
			<div className='w-0 bg-transparent mx-3 border border-transparent border-r-gray-300 h-4/5'></div>
			<div className='w-full flex -mt-1 flex- items-center justify-start gap-2 xl:gap-5'>
				<h2 className='text-xl md:text-2xl xl:text-4xl w-fit '>{title}</h2>
				<div className='min-w-px border-l border-gray-300 h-10 mx-1'></div>
				<p className='w-fit text-xl md:text-2xl xl:text-3xl text-gray-700'>
					{formatDateToTimePassed(convertTimeInMillisToHMS(dateinfo))}
				</p>
			</div>
			<div className={`flex h-full gap-2`}>
				<button
					className={`w-full h-full flex items-center justify-center bg-[#007bff] text-white hover:text-white`}
					onClick={handleResume}
				>
					<PLAY_ICON className='size-6'></PLAY_ICON>
				</button>
				<div className={`flex flex-col items-center gap-2`}>
					<button
						className='w-full h-full'
						onClick={handleEdit}
					>
						<EDIT_ICON className='size-6'></EDIT_ICON>
					</button>
					<button
						className='w-full h-full hover:text-red-500 hover:border-red-500'
						onClick={handleClick}
					>
						<TRASH_ICON className='size-6'></TRASH_ICON>
					</button>
				</div>
			</div>
		</div>
	);
}

/* eslint-disable react/prop-types */
import { useCallback, useState } from 'react';
import { useCard } from '../hooks/useCard.jsx';
import {
	convertTimeInMillisToHMS,
	formatDateToTimePassed,
	openModalWithPreset,
	showMessage,
} from '../utils/utils.js';
import {
	CHECK,
	DROPLET,
	EDITICON,
	PLAYICON,
	TRASHICON,
} from '../icons/icons.jsx';
import { useTimer } from '../hooks/useTimer.jsx';
import { COLORS } from '../color.js';
import { ColorSelector } from './ColorSelector.jsx';

// eslint-disable-next-line react/prop-types
export function Card({ title, dateinfo, id, color, checked, showCardFee }) {
	const {
		removeCardFromProject,
		currentProject,
		repositionCardFromProject,
		resumedId,
		updateCardFromProject,
		hourFee,
	} = useCard();
	const [cardId] = useState(id);
	const { resumeClick } = useTimer();
	const { activated } = useCard();
	const [colorModalOpen, setColorModalOpen] = useState(false);

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

	const handleChangeColor = color => {
		updateCardFromProject({ projectId: currentProject, id, color });
	};

	const calculateFee = useCallback((totalTime, hourFee) => {
		return ((totalTime / 1000 / 60) * (hourFee / 60)).toFixed(2);
	}, []);

	return (
		<div
			className={`w-full card min-h-[6.25rem] p-3 h-32 flex items-center border bg-white ${
				resumedId == id ? 'border-[#007bff]' : 'border-gray-300'
			} ${colorModalOpen ? 'z-50' : 'z-10'} rounded-lg relative`}
			style={
				color && COLORS[color] && resumedId != id
					? {
							borderColor: COLORS[color].border,
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
				<h2 className='text-xl md:text-2xl xl:text-4xl w-fit font-medium text-gray-700'>
					{title}
				</h2>
				<div className='min-w-px border-l border-gray-300 h-10 mx-1'></div>
				<p className='w-fit text-xl md:text-2xl xl:text-3xl text-gray-600 font-medium'>
					{formatDateToTimePassed(convertTimeInMillisToHMS(dateinfo))}
				</p>
				{showCardFee && (
					<>
						<div className='min-w-px border-l border-gray-300 h-10 mx-1'></div>
						<p className='w-fit text-xl md:text-2xl xl:text-3xl text-gray-600 font-medium'>
							${calculateFee(dateinfo, hourFee)}
						</p>
					</>
				)}
			</div>
			<div className={`flex h-full gap-2`}>
				<button
					className={`w-full h-full flex items-center justify-center bg-[#007bff] text-white  hover:text-white`}
					onClick={handleResume}
				>
					<PLAYICON className='size-6'></PLAYICON>
				</button>
				<div className={`h-full flex-col flex items-center gap-2`}>
					<div className='h-full flex items-center gap-2'>
						<div
							onClick={e => {
								e.stopPropagation();
							}}
							className='relative cursor-default'
						>
							<button
								className='w-full px-3 h-full flex items-center justify-center'
								style={
									color && COLORS[color]
										? {
												background: COLORS[color].bg,
												borderColor: COLORS[color].border,
										  }
										: {}
								}
								onClick={() => {
									setColorModalOpen(!colorModalOpen);
								}}
							>
								<DROPLET className='size-6'></DROPLET>
							</button>
							<ColorSelector
								modalOpen={colorModalOpen}
								onClick={handleChangeColor}
							/>
						</div>
						<button
							className={`w-full px-3 h-full flex items-center justify-center ${
								checked ? 'border-blue-500 bg-blue-200' : ''
							}`}
							onClick={e => {
								e.stopPropagation();
								updateCardFromProject({
									projectId: currentProject,
									id,
									check: true,
								});
							}}
						>
							<CHECK
								className={`size-6 ${
									checked ? 'text-blue-500' : 'text-gray-300'
								}`}
							></CHECK>
						</button>
					</div>

					<div className='h-full flex items-center gap-2'>
						<button
							className='w-full px-3 h-full'
							onClick={handleEdit}
						>
							<EDITICON className='size-6'></EDITICON>
						</button>
						<button
							className='w-full px-3 h-full hover:text-red-500 hover:border-red-500'
							onClick={handleClick}
						>
							<TRASHICON className='size-6'></TRASHICON>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

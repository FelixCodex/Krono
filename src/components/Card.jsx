import { useEffect, useState } from 'react';
import { useCard } from '../hooks/useCard.jsx';
import {
	convertTimeInMillisToHMS,
	formatDateToTimePassed,
	openModalWithPreset,
	showMessage,
} from '../utils/utils.js';
import { EDIT_ICON, PLAY_ICON, TRASH_ICON } from '../icons/icons.jsx';
import { useTimer } from '../hooks/useTimer.jsx';

// eslint-disable-next-line react/prop-types
export function Card({ title, dateinfo, id }) {
	const {
		removeCardFromProject,
		currentProject,
		repositionCardFromProject,
		resumedId,
	} = useCard();
	const [cardId] = useState(id);
	const { resumeClick } = useTimer();
	const { activated } = useCard();
	const [buttonType, setButtonType] = useState(1);

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
		const dargPin = e.currentTarget.children[1];
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
			elem.style = 'border: 1px solid #444;';
		} else {
			elem.closest('.card').style = 'border: 1px solid #444;';
		}
		repositionCardFromProject({
			projectId: currentProject,
			fromId,
			toId: elem.dataset.id,
		});
	};

	const KeyDownEvent = e => {
		if (e.key == 'r') {
			if (buttonType == 2) {
				setButtonType(1);
			} else {
				setButtonType(buttonType + 1);
			}
			console.log(buttonType);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', KeyDownEvent);
		return () => {
			window.removeEventListener('keydown', KeyDownEvent);
		};
	});

	const handleDragOver = e => {
		e.preventDefault();
		const elemt = e.currentTarget;

		elemt.style = 'border: 1px solid #fff;';
	};

	const handleDragLeave = e => {
		e.currentTarget.style = 'border: 1px solid #444;';
	};

	return (
		<div
			className={`w-full min-h-[100px] p-3 h-32 flex items-center border bg-[#303030] ${
				resumedId == id ? 'border-[#646cff]' : 'border-[#444]'
			}  rounded-lg relative`}
			draggable={true}
			onDragStart={handleDragStart}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			data-id={cardId}
		>
			<button
				className='cursor-grab border w-7 h-full border-[#444] p-0 bg-dotted'
				id='drag-pin'
			></button>
			<div className='w-0 bg-transparent mx-3 border border-transparent border-r-[#444] h-4/5'></div>
			<div className='w-full flex -mt-1 flex-col items-start justify-center'>
				<h2 className='text-3xl w-fit text-gray-50'>{title}</h2>
				<p className='w-fit text-xl text-gray-400'>
					{formatDateToTimePassed(convertTimeInMillisToHMS(dateinfo))}
				</p>
			</div>
			<div className={`flex h-full gap-2`}>
				<button
					className={`w-full h-full bg-[#242424] flex items-center justify-center`}
					onClick={handleResume}
				>
					<PLAY_ICON className='size-6'></PLAY_ICON>
				</button>
				<div className={`flex flex-col items-center gap-2`}>
					<button
						className='w-full h-full bg-[#242424]'
						onClick={handleEdit}
					>
						<EDIT_ICON className='size-6'></EDIT_ICON>
					</button>
					<button
						className='w-full h-full bg-[#242424]'
						onClick={handleClick}
					>
						<TRASH_ICON className='size-6'></TRASH_ICON>
					</button>
				</div>
			</div>
		</div>
	);
}

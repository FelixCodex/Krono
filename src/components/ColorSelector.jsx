/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { COLORS } from '../color.js';

export function ColorSelector({ modalOpen, onClick }) {
	return (
		<div
			className={`${
				modalOpen ? 'absolute' : 'hidden'
			} w-32 top-[103%] p-2 -left-8 gap-1 flex flex-col border rounded-lg border-gray-300 bg-gray-50`}
		>
			<p className='text-sm text-start font-medium'>Colors</p>
			<div className='flex flex-wrap gap-1'>
				{Object.entries(COLORS).map(([c, _v], i) => {
					return (
						<ColorButton
							key={i}
							onClick={e => {
								e.stopPropagation();
								onClick(c);
							}}
							color={c}
						/>
					);
				})}
			</div>
		</div>
	);
}

function ColorButton({ className, onClick, color }) {
	return (
		<button
			data-color={color}
			className={`w-6 h-6 p-0 flex items-center justify-center ${className}`}
			style={{ background: COLORS[color] ? COLORS[color].bg : '' }}
			onClick={onClick}
		></button>
	);
}

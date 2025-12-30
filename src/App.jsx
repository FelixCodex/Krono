import './App.css';
import { useRef, useState } from 'react';
import { useCard } from './hooks/useCard.jsx';
import { useTimer } from './hooks/useTimer.jsx';
import { BARS_ICON, PLUS_ICON, X_ICON } from './icons/icons.jsx';
import { ProjectCard } from './components/ProjectCard.jsx';
import { Card } from './components/Card.jsx';
import { handleToggleModal, openModalWithPreset } from './utils/utils.js';

function App() {
	const cardId = useRef(0);

	const {
		cards,
		addNewProject,
		currentProject,
		updateProjectTitle,
		renameCardFromProject,
		hourFee,
		setHourFee,
	} = useCard();
	const { activated, timerClick } = useTimer();
	const [projectsOpen, setProjectsOpen] = useState(false);

	const addProjectInput = useRef();

	const handleModal = () => {
		openModalWithPreset({ type: 'add' });
	};

	const handleFeeModal = () => {
		openModalWithPreset({ type: 'fee' });
	};

	const handleClickProject = () => {
		if (addProjectInput.current.value == '') {
			return;
		}
		const button = document.getElementById('projectButton');

		switch (button.dataset.type) {
			case 'edit': {
				updateProjectTitle({
					projectId: button.dataset.id,
					title: addProjectInput.current.value,
				});
				addProjectInput.current.value = '';
				break;
			}
			case 'add': {
				const id = Math.floor(Math.random() * 10000);
				const title = addProjectInput.current.value;
				addNewProject({ id, title });
				addProjectInput.current.value = '';
				break;
			}
			case 'fee': {
				const fee = Number(addProjectInput.current.value);
				setHourFee(fee);
				addProjectInput.current.value = '';
				break;
			}
			case 'update': {
				renameCardFromProject({
					id: button.dataset.id,
					projectId: currentProject,
					title: addProjectInput.current.value,
				});
				addProjectInput.current.value = '';
				break;
			}
		}

		handleToggleModal();
	};

	const calculateTotalFee = () => {
		const card = cards.find(c => c.id == currentProject);
		if (!card) return '';
		const totalTime = card.projectCards.reduce(
			(sum, item) => sum + Number(item.dateinfo),
			0
		);
		const feePerTime = (totalTime / 1000 / 60) * (hourFee / 60);
		return feePerTime.toFixed(2);
	};

	return (
		<main className='bg-[--bg-f] w-full h-screen'>
			<section
				className='fixed left-0 top-0 z-[200] items-center justify-center w-full h-full bg-[#00000066]'
				id='modalContainer'
				style={{ display: 'none' }}
			>
				<div className='w-[400px] h-[230px] relative p-5 gap-6 rounded-xl flex flex-col items-center bg-gray-50 border border-gray-300 shadow shadow-[--shadow-1] overflow-hidden'>
					<h2
						className='font-medium text-xl text-gray-800'
						id='projectTitle'
					>
						Projecto
					</h2>
					<input
						ref={addProjectInput}
						type='text'
						placeholder='Nombre del projecto'
						className='w-11/12 -mt-1 rounded-lg p-2 px-3 cursor-pointer transition-colors bg-gray-100 border border-gray-300 text-lg font-medium'
						id='projectInput'
					/>
					<div className='flex items-center justify-center gap-3 mt-1'>
						<button
							className='w-28 h-16'
							onClick={handleToggleModal}
						>
							Back
						</button>
						<button
							className='w-28 h-16'
							id='projectButton'
							onClick={handleClickProject}
							data-type='add'
						>
							Add
						</button>
					</div>
				</div>
			</section>
			<button
				className='w-16 h-14 z-50 m-3 flex xl:hidden items-center justify-center border border-[#555555]'
				onClick={() => setProjectsOpen(true)}
			>
				<BARS_ICON></BARS_ICON>
			</button>
			<section className='flex flex-col-reverse xl:flex-row w-full gap-16 xl:gap-5 justify-center items-center relative xl:items-start pt-4 xl:pt-20 px-4 2xl:px-10 pb-8'>
				<aside
					className={`w-[calc(100%-16px)] xl:w-96 fixed xl:sticky xl:mt-3 top-3 xl:left-auto min-h-80 h-[70vh] z-[100] transition-[left] duration-300  bg-gray-50 border border-gray-300 rounded-lg text-xl p-3 flex flex-col ${
						projectsOpen ? 'left-2' : '-left-full'
					}`}
				>
					<div className='flex items-center justify-between mb-2'>
						<p className='my-3 text-start pl-2'>PROJECTS</p>
						<div className='flex items-center gap-1'>
							<button
								className='w-fit h-14 z-50 px-5 font-medium text-sm flex items-center justify-center'
								onClick={handleFeeModal}
							>
								${hourFee}/h
							</button>
							<button
								className='w-16 h-14 z-50 p-0 flex items-center justify-center'
								onClick={handleModal}
							>
								<PLUS_ICON className={'size-6'}></PLUS_ICON>
							</button>
							<button
								className='w-16 h-14 flex xl:hidden z-50 p-0 items-center justify-center'
								onClick={() => setProjectsOpen(false)}
							>
								<X_ICON className={'size-6'}></X_ICON>
							</button>
						</div>
					</div>
					<div className='w-full p-1 flex flex-col gap-3'>
						{cards.length > 0 ? (
							cards.map(({ title, id, projectCards, checked }) => {
								const totalTime = projectCards.reduce(
									(sum, item) => sum + Number(item.dateinfo),
									0
								);
								return (
									<ProjectCard
										key={`r-${(cardId.current += 1)}`}
										id={id}
										className={id == currentProject ? 'border-[#838383]' : ''}
										title={title}
										checked={checked}
										setProjectsOpen={setProjectsOpen}
										totalTime={totalTime}
									></ProjectCard>
								);
							})
						) : (
							<p>{`You don't have any projects`}</p>
						)}
					</div>
				</aside>
				<main className='w-full md:w-4/5 xl:max-w-[840px] flex gap-3 flex-col xl:mt-3 min-h-32 border border-gray-300 bg-gray-50 rounded-xl relative p-4 justify-start'>
					<div
						className='absolute flex justify-center left-0 right-0 -top-[50px]'
						style={currentProject ? { display: 'flex' } : { display: 'none' }}
					>
						<p className='relative inline my-1 text-3xl px-7 p-1 rounded-t-2xl bg-gray-50 border border-gray-300 border-b-transparent'>
							{currentProject ? (
								cards.map(item => {
									if (item.id == currentProject) {
										return item.title;
									}
								})
							) : (
								<></>
							)}
						</p>
					</div>
					<div
						className='absolute flex justify-center right-3 -top-[55px]'
						style={currentProject ? { display: 'flex' } : { display: 'none' }}
					>
						<p
							className={`relative inline my-1 text-2xl px-6 py-2 rounded-t-2xl font-bold ${
								cards.find(c => currentProject == c.id)?.checked
									? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
									: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
							} border border-purple-500/30 border-b-transparent shadow-lg`}
						>
							${calculateTotalFee()}
						</p>
					</div>
					{currentProject ? (
						cards.map(item => {
							if (item.id == currentProject) {
								return item.projectCards.length > 0 ? (
									item.projectCards.map(({ id, title, dateinfo }) => {
										return (
											<Card
												key={`r-${(cardId.current += 1)}`}
												id={id}
												title={title}
												dateinfo={dateinfo}
											></Card>
										);
									})
								) : (
									<div
										key='no-notes'
										style={{ fontSize: '24px' }}
									>
										There are no notes in this project
									</div>
								);
							}
						})
					) : (
						<div style={{ fontSize: '24px' }}>
							Select a project to see its notes
						</div>
					)}
				</main>
				<aside className='w-full md:w-4/5 xl:w-96 border border-gray-300 bg-gray-50 rounded-lg relative xl:sticky xl:top-3 xl:mt-3 text-xl p-3 py-7 gap-7 flex flex-col items-center '>
					<input
						type='text'
						placeholder='¿What are you working on?'
						className='w-11/12 mb-3  rounded-lg bg-gray-100 border border-gray-300 p-3 px-4 text-2xl font-medium cursor-pointer'
						id='counterInput'
					/>
					<p
						className='absolute top-24 '
						id='message-log'
					></p>
					<p
						className={`font-medium text-5xl text-gray-800 ${
							activated == true || activated == null ? 'animate-pulse' : ''
						}`}
						id='counterText'
					>
						00:00:00
					</p>
					<button
						onClick={timerClick}
						className='w-56 h-16 font-medium text-2xl p-3'
						style={
							activated == true || activated == null
								? { background: '#007bff', color: '#fff ' }
								: {}
						}
					>
						{activated == true || activated == null ? 'Stop' : 'Start'}
					</button>
				</aside>
			</section>
		</main>
	);
}

export default App;

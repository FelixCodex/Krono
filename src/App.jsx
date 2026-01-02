import './App.css';
import { useRef, useState } from 'react';
import { useCard } from './hooks/useCard.jsx';
import { useTimer } from './hooks/useTimer.jsx';
import {
	BARSICON,
	DOLLAR,
	ELLIPSIS,
	FILETEXT,
	MAIL,
	MAILCHECK,
	MAILLOADING,
	MAILPLUS,
	MAILX,
	PANELLEFT,
	PLUSICON,
	XICON,
} from './icons/icons.jsx';
import { ProjectCard } from './components/ProjectCard.jsx';
import { Card } from './components/Card.jsx';
import {
	formatMillisToAdjustedHM,
	formatMillisToAdjustedHMS,
	handleToggleModal,
	openModalWithPreset,
} from './utils/utils.js';
import { DEFAULT_COLOR } from './color.js';

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
		mail,
		setMail,
	} = useCard();
	const { activated, timerClick } = useTimer();
	const [projectsOpen, setProjectsOpen] = useState(false);
	const [moreOptionOpen, setMoreOptionOpen] = useState(false);
	const [inputWrong, setInputWrong] = useState(false);
	const [mailReq, setMailReq] = useState({ success: null, loading: false });

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
				if (isNaN(fee)) return;

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
			case 'mail': {
				if (!addProjectInput.current.value.endsWith('@gmail.com')) {
					setInputWrong(true);
					setTimeout(() => {
						setInputWrong(false);
					}, 500);
					return;
				}

				setMail(addProjectInput.current.value);
				addProjectInput.current.value = '';
				break;
			}
		}

		handleToggleModal();
	};

	const handleSendToEmail = async () => {
		if (!mail) {
			openModalWithPreset({ type: 'mail' });
			return;
		}
		if (mailReq.loading) {
			return;
		}
		const exportData = cards.map(c => {
			const projectCards = c.projectCards.map(card => {
				return `<p style="margin-left: 14px"> ${
					card.title
				} : ${formatMillisToAdjustedHMS(card.dateinfo)}</p>`;
			});

			return `<p>${c.title} (${c.id}):</p> ${projectCards.join(' ')}`;
		});

		setMailReq(p => ({ ...p, loading: true }));
		try {
			const res = await fetch(
				'https://portfolio-email-redirect-worker.josefelixlr05.workers.dev',
				{
					method: 'POST',
					body: JSON.stringify({
						from: 'Krono',
						to: mail,
						data: exportData.join(''),
						type: 'data',
					}),
				}
			);

			if (res.status == 200) {
				setMailReq(p => ({ ...p, success: true }));
				setTimeout(() => {
					setMailReq(p => ({ ...p, success: null }));
				}, 3000);
			} else {
				setMailReq(p => ({ ...p, success: false }));
			}
		} finally {
			setMailReq(p => ({ ...p, loading: false }));
		}
	};

	const handleExportDataToFile = async () => {
		const exportData = cards.map(c => {
			const projectCards = c.projectCards.map(card => {
				return `  ${card.title} : ${formatMillisToAdjustedHMS(
					card.dateinfo
				)}\n`;
			});

			return `${c.title} (${c.id}): \n ${projectCards.join(' ')}`;
		});

		const date = new Date();
		const filename = `Krono_report-${date.getFullYear()}.${
			date.getMonth() + 1
		}.${date.getDate()}.txt`;
		const blob = new Blob([exportData.join('\n')], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const currentProjectCard = cards.find(c => c.id == currentProject);

	const calculateTotalFee = () => {
		if (!currentProjectCard) return '';
		const totalTime = currentProjectCard.projectCards.reduce(
			(sum, item) => sum + Number(item.dateinfo),
			0
		);
		const feePerTime = (totalTime / 1000 / 60) * (hourFee / 60);
		return feePerTime.toFixed(2);
	};

	const calculateTotalTime = () => {
		if (!currentProjectCard) return '';
		const totalTime = currentProjectCard.projectCards.reduce(
			(sum, item) => sum + Number(item.dateinfo),
			0
		);
		return totalTime;
	};

	const cardStyleColor =
		currentProjectCard && currentProjectCard.color
			? {
					background: currentProjectCard.color.bg,
					borderColor: currentProjectCard.color.border,
			  }
			: {
					background: DEFAULT_COLOR.bg,
					borderColor: DEFAULT_COLOR.border,
			  };

	return (
		<main className='bg-dotted-back w-full h-screen'>
			<section
				className='fixed left-0 top-0 z-[200] items-center justify-center w-full h-full bg-[#00000066]'
				id='modalContainer'
				style={{ display: 'none' }}
			>
				<div className='w-[25rem] h-[14.375rem] relative p-5 gap-6 rounded-xl flex flex-col items-center bg-gray-50 border border-gray-300 shadow shadow-[--shadow-1] overflow-hidden'>
					<h2
						className='font-medium text-xl text-gray-800'
						id='projectTitle'
					>
						Projecto
					</h2>
					<input
						ref={addProjectInput}
						placeholder='Nombre del projecto'
						className={`w-11/12 -mt-1 ${
							inputWrong ? 'shake border-red-500' : 'border-gray-300 '
						} rounded-lg p-2 px-3 cursor-pointer transition-colors bg-gray-100 border text-lg font-medium`}
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
							data-type='add'
							onClick={handleClickProject}
						>
							Add
						</button>
					</div>
				</div>
			</section>
			<button
				className='w-16 h-14 z-50 m-3 flex xl:hidden items-center justify-center text-gray-800 border border-gray-300'
				onClick={() => setProjectsOpen(true)}
			>
				<BARSICON></BARSICON>
			</button>
			<section className='flex flex-col-reverse xl:flex-row w-full gap-16 xl:gap-5 justify-center items-center relative xl:items-start pt-4 xl:pt-20 px-4 2xl:px-10 pb-8'>
				<aside
					className={`w-[calc(100%-1rem)] xl:w-96 fixed xl:sticky xl:mt-3 top-3 xl:left-auto min-h-80 h-[70vh] z-[100] transition-[left] duration-300  bg-gray-50 border border-gray-300 rounded-xl text-xl p-3 flex flex-col ${
						projectsOpen ? 'left-2' : '-left-full'
					}`}
				>
					<div className='flex items-center justify-between mb-3'>
						<p className='text-start pl-1 font-medium text-gray-700'>
							PROJECTS
						</p>
						<div className='flex items-center gap-1'>
							<button
								className='w-11 h-11 z-50 p-0 flex items-center justify-center'
								onClick={handleSendToEmail}
								title={`Export Data to Mail${mail ? ` (${mail})` : ''}`}
							>
								{mailReq.loading ? (
									<MAILLOADING className={'size-5'}></MAILLOADING>
								) : mailReq.success == null ? (
									<MAIL className={'size-5'}></MAIL>
								) : mailReq.success == true ? (
									<MAILCHECK className={'size-5'}></MAILCHECK>
								) : (
									<MAILX className={'size-5'}></MAILX>
								)}
							</button>
							<button
								className='w-11 h-11 z-50 p-0 flex items-center justify-center'
								onClick={handleExportDataToFile}
								title='Export Data to File'
							>
								<FILETEXT className={'size-5'}></FILETEXT>
							</button>
							<button
								className='w-11 h-11 z-50 p-0 flex items-center justify-center'
								onClick={handleModal}
								title='Add Project'
							>
								<PLUSICON className={'size-6'}></PLUSICON>
							</button>
							<div className={`relative z-[150] flex justify-center`}>
								<button
									className='w-11 h-11 z-50 p-0 flex items-center justify-center'
									onClick={() => {
										setMoreOptionOpen(!moreOptionOpen);
									}}
									title='Add Project'
								>
									{moreOptionOpen ? (
										<XICON className={'size-6'}></XICON>
									) : (
										<ELLIPSIS className={'size-8'}></ELLIPSIS>
									)}
								</button>
								<div
									className={`p-1 gap-1 absolute top-[110%] right-0 flex flex-col items-center justify-start bg-gray-50 rounded-xl border border-gray-300 ${
										moreOptionOpen ? 'flex' : 'hidden'
									}`}
								>
									<button
										className=' w-full h-11 z-50 px-3 font-medium text-sm flex gap-1 items-center justify-center'
										onClick={() => {
											setMoreOptionOpen(!moreOptionOpen);
											handleFeeModal();
										}}
										title='Set Fee'
									>
										<DOLLAR className={'size-5'}></DOLLAR>
										<span className='text-nowrap font-medium'>Set Fee</span>
									</button>
									<button
										className=' w-full h-11 z-50 px-3 flex gap-1 text-sm items-center justify-center'
										onClick={() => {
											setMoreOptionOpen(!moreOptionOpen);
											openModalWithPreset({ type: 'mail' });
										}}
										title={`Set Mail to Export Data${mail ? ` (${mail})` : ''}`}
									>
										<MAILPLUS className={'size-5'}></MAILPLUS>
										<span className='text-nowrap font-medium'>Set Mail</span>
									</button>
								</div>
							</div>
							<button
								className='w-11 h-11 flex xl:hidden z-50 p-0 items-center justify-center'
								onClick={() => setProjectsOpen(false)}
								title='Close'
							>
								<PANELLEFT className={'size-6'}></PANELLEFT>
							</button>
						</div>
					</div>
					<div className='w-full p- flex flex-col gap-2'>
						{cards.length > 0 ? (
							cards.map(({ title, id, checked, color }) => {
								return (
									<ProjectCard
										key={`r-${(cardId.current += 1)}`}
										id={id}
										color={color}
										title={title}
										checked={checked}
										setProjectsOpen={setProjectsOpen}
									></ProjectCard>
								);
							})
						) : (
							<p>{`You don't have any projects`}</p>
						)}
					</div>
				</aside>
				<main className='w-full md:w-4/5 xl:max-w-[52.5rem] flex gap-3 flex-col xl:mt-3 min-h-32 relative'>
					<section
						className='w-full flex gap-3 flex-col border rounded-xl relative p-3 justify-start'
						style={cardStyleColor}
					>
						<div
							className='absolute flex justify-center left-3 -top-[3.0625rem]'
							style={currentProject ? { display: 'flex' } : { display: 'none' }}
						>
							<p
								className='relative inline my-1 text-3xl px-7 p-1 z-30 !border-b-transparent font-medium text-gray-800 rounded-t-2xl border'
								style={{ ...cardStyleColor }}
							>
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
							className='absolute flex justify-center gap-1 right-3 -top-[3.4375rem]'
							style={currentProject ? { display: 'flex' } : { display: 'none' }}
						>
							<p
								className={`relative inline my-1 text-2xl px-6 py-2 rounded-t-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 text-white border border-purple-500/30 border-b-transparent shadow-lg`}
							>
								Total: {formatMillisToAdjustedHM(calculateTotalTime())}
							</p>
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
										<Card
											key={`r-${(cardId.current += 1)}`}
											id={item.projectCards[0].id}
											projectColor={currentProjectCard.color}
											title={item.projectCards[0].title}
											dateinfo={item.projectCards[0].dateinfo}
										></Card>
									) : (
										<div
											key='no-notes'
											className='text-2xl my-8'
										>
											There are no notes in this project
										</div>
									);
								}
							})
						) : (
							<div className='text-2xl my-8'>
								Select a project to see its notes
							</div>
						)}
					</section>

					{currentProject && currentProjectCard.projectCards.length > 1 ? (
						<section
							className='w-full flex gap-3 flex-col border rounded-xl relative p-3 justify-start'
							style={cardStyleColor}
						>
							{cards.map(item => {
								if (item.id == currentProject) {
									return item.projectCards.length > 1
										? item.projectCards.map(({ id, title, dateinfo }, i) => {
												return i != 0 ? (
													<Card
														key={`r-${(cardId.current += 1)}`}
														id={id}
														projectColor={currentProjectCard.color}
														title={title}
														dateinfo={dateinfo}
													></Card>
												) : (
													<></>
												);
										  })
										: '';
								}
							})}
						</section>
					) : (
						<></>
					)}
				</main>
				<aside className='w-full md:w-4/5 xl:w-96 border border-gray-300 bg-gray-50 rounded-xl relative xl:sticky xl:top-3 xl:mt-3 text-xl p-3 py-7 gap-7 flex flex-col items-center '>
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
						className={`font-medium text-5xl  ${
							activated == true || activated == null
								? 'text-red-600'
								: 'text-gray-800'
						}`}
						id='counterText'
					>
						00:00:00
					</p>
					<button
						onClick={timerClick}
						className='w-56 h-16 font-medium text-2xl p-3 bg-[#007bff] text-white hover:text-white'
					>
						{activated == true || activated == null ? 'Stop' : 'Start'}
					</button>
				</aside>
			</section>
		</main>
	);
}

export default App;

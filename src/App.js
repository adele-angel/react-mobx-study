import React from 'react';
import { useLocalStore, useObserver } from 'mobx-react';
import logo from './logo.svg';
import './App.css';

// define context
const StoreContext = React.createContext();

// wraps around all the components inside of this app
// a function receives child components
const StoreProvider = ({ children }) => {
	// defining a store to store the state inside
	// the store contains:
	// 1. the state properties - the data we're tracking or observing
	// 2. function that will modify those state properties
	const store = useLocalStore(() => ({
		insects: ['Centipede', 'Spider', 'Scarab'],
		addInsect: (insect) => {
			// the state in MobX is mutable
			// MobX observes changes as the state is mutated and keeps track of the changes
			if (insect !== '') {
				store.insects.push(insect);
			}
		},
		removeInsect: (insect) => {
			let index = store.insects.indexOf(insect);
			store.insects.splice(index, 1);
		},
		// adding computed properties
		// read-only / getter functions that will compute values derived from the state
		get insectsCount() {
			return store.insects.length;
		},
	}));

	// the context value that's available in any level of the component hierarchy
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

const InsectHeader = () => {
	const store = React.useContext(StoreContext);
	return useObserver(() => (
		<h1 className='App-header'>
			<img src={logo} className='App-logo' alt='logo' />
			{store.insectsCount} Insects
		</h1>
	));
};

// access the store and display data
const InsectList = () => {
	// React.useContext() - a hook that allows accessing context
	const store = React.useContext(StoreContext);

	// render out components
	// useObserver to observe changes
	return useObserver(() => (
		<ul className='App-list'>
			{store.insects.map((insect) => (
				<li key={insect}>
					<span
						onClick={(e) => {
							store.removeInsect(insect);
						}}>
						X
					</span>
					{insect}
				</li>
			))}
		</ul>
	));
};

const InsectForm = () => {
	const store = React.useContext(StoreContext);
	const [insect, setInsect] = React.useState('');

	return (
		<form
			className='App-form'
			onSubmit={(e) => {
				// insect is added to store from:
				// const [insect, setInsect] = React.useState('');
				store.addInsect(insect);
				// reset local state back to empty string
				setInsect('');
				e.preventDefault();
			}}>
			<input
				type='text'
				value={insect}
				onChange={(e) => {
					setInsect(e.target.value);
				}}
			/>
			<button type='submit'>Add Insect</button>
		</form>
	);
};

function App() {
	return (
		<StoreProvider>
			<div className='App'>
				<InsectHeader />
				<InsectList />
				<InsectForm />
			</div>
		</StoreProvider>
	);
}

export default App;

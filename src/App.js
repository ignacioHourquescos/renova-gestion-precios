import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes instead of Switch
import LayoutCustom from "./layout/layout"; // Import your IndexPage component
import Index from "./pages";

function App() {
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<LayoutCustom>
						<Routes>
							<Route path="/" element={<Index />} />{" "}
						</Routes>
					</LayoutCustom>
				</header>
			</div>
		</Router>
	);
}

export default App;
